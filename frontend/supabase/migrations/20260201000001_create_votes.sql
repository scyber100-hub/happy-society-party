-- =====================================================
-- Phase 10: 투표 시스템
-- =====================================================

-- 1. 투표 유형 ENUM 생성
DO $$ BEGIN
  CREATE TYPE vote_type AS ENUM (
    'party_election',  -- 당 대표/최고위원 선출
    'nomination',      -- 공천 투표
    'policy',          -- 정책 결정
    'committee',       -- 위원회 내부 투표
    'regional'         -- 지역 투표
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. 투표 범위 ENUM 생성
DO $$ BEGIN
  CREATE TYPE vote_scope AS ENUM (
    'national',      -- 전국 (모든 당원)
    'regional',      -- 지역 (해당 지역 당원)
    'committee',     -- 위원회 (해당 위원회 당원)
    'international'  -- 국제 (국제연합 투표)
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. 투표 상태 ENUM 생성
DO $$ BEGIN
  CREATE TYPE vote_status AS ENUM (
    'draft',         -- 초안
    'deliberation',  -- 숙의 기간
    'voting',        -- 투표 진행중
    'counting',      -- 개표중
    'completed',     -- 완료
    'cancelled'      -- 취소됨
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 4. 투표 테이블 생성
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  vote_type vote_type NOT NULL,
  scope vote_scope NOT NULL DEFAULT 'national',
  scope_id UUID, -- region_id 또는 committee_id (범위 지정용)
  options JSONB NOT NULL DEFAULT '[]', -- [{id, label, description}]
  allow_multiple BOOLEAN DEFAULT false, -- 복수 선택 허용
  max_selections INTEGER DEFAULT 1, -- 최대 선택 가능 수
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  deliberation_start TIMESTAMPTZ, -- 숙의 기간 시작
  min_participation INTEGER DEFAULT 0, -- 최소 투표율 (%)
  status vote_status DEFAULT 'draft',
  result JSONB, -- 투표 결과 {option_id: count, ...}
  total_votes INTEGER DEFAULT 0,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_votes_status ON votes(status);
CREATE INDEX IF NOT EXISTS idx_votes_type ON votes(vote_type);
CREATE INDEX IF NOT EXISTS idx_votes_scope ON votes(scope, scope_id);
CREATE INDEX IF NOT EXISTS idx_votes_dates ON votes(start_date, end_date);

-- 5. 투표 기록 테이블 생성
CREATE TABLE IF NOT EXISTS vote_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  selected_options JSONB NOT NULL, -- [option_id, ...]
  voted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vote_id, user_id) -- 이중 투표 방지
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_vote_records_vote_id ON vote_records(vote_id);
CREATE INDEX IF NOT EXISTS idx_vote_records_user_id ON vote_records(user_id);

-- 6. 투표 토론 게시판 테이블 (숙의 기간용)
CREATE TABLE IF NOT EXISTS vote_discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES user_profiles(id),
  content TEXT NOT NULL,
  parent_id UUID REFERENCES vote_discussions(id), -- 대댓글용
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vote_discussions_vote_id ON vote_discussions(vote_id);

-- 7. RLS 정책
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_discussions ENABLE ROW LEVEL SECURITY;

-- 투표 조회: 당원 이상 또는 공개된 투표
CREATE POLICY "Party members can view votes"
  ON votes FOR SELECT
  USING (
    status != 'draft' OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- 투표 생성/수정: 관리자만
CREATE POLICY "Only admins can manage votes"
  ON votes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- 투표 기록 조회: 본인만 (투명성을 위해 관리자도 개별 투표 내용은 못봄)
CREATE POLICY "Users can view own vote records"
  ON vote_records FOR SELECT
  USING (user_id = auth.uid());

-- 투표 기록 삽입: 당원 이상만
CREATE POLICY "Party members can vote"
  ON vote_records FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('member', 'active_member', 'candidate', 'moderator', 'admin')
    )
  );

-- 토론 조회: 누구나
CREATE POLICY "Anyone can view discussions"
  ON vote_discussions FOR SELECT
  USING (true);

-- 토론 작성: 당원 이상
CREATE POLICY "Party members can discuss"
  ON vote_discussions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('member', 'active_member', 'candidate', 'moderator', 'admin')
    )
  );

-- 8. 투표 자격 확인 함수
CREATE OR REPLACE FUNCTION check_vote_eligibility(p_vote_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_vote votes%ROWTYPE;
  v_user user_profiles%ROWTYPE;
BEGIN
  -- 투표 정보 조회
  SELECT * INTO v_vote FROM votes WHERE id = p_vote_id;
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- 사용자 정보 조회
  SELECT * INTO v_user FROM user_profiles WHERE id = p_user_id;
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- 당원 이상인지 확인
  IF v_user.role NOT IN ('member', 'active_member', 'candidate', 'moderator', 'admin') THEN
    RETURN false;
  END IF;

  -- 투표 기간 확인
  IF v_vote.status != 'voting' THEN
    RETURN false;
  END IF;

  IF NOW() < v_vote.start_date OR NOW() > v_vote.end_date THEN
    RETURN false;
  END IF;

  -- 범위별 자격 확인
  IF v_vote.scope = 'regional' AND v_vote.scope_id IS NOT NULL THEN
    IF v_user.region_id != v_vote.scope_id THEN
      RETURN false;
    END IF;
  ELSIF v_vote.scope = 'committee' AND v_vote.scope_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM user_committees
      WHERE user_id = p_user_id AND committee_id = v_vote.scope_id
    ) THEN
      RETURN false;
    END IF;
  END IF;

  -- 이미 투표했는지 확인
  IF EXISTS (
    SELECT 1 FROM vote_records
    WHERE vote_id = p_vote_id AND user_id = p_user_id
  ) THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. 투표하기 함수
CREATE OR REPLACE FUNCTION cast_vote(
  p_vote_id UUID,
  p_user_id UUID,
  p_selected_options JSONB
)
RETURNS JSON AS $$
DECLARE
  v_vote votes%ROWTYPE;
  v_result JSON;
BEGIN
  -- 투표 자격 확인
  IF NOT check_vote_eligibility(p_vote_id, p_user_id) THEN
    RETURN json_build_object('success', false, 'message', '투표 자격이 없거나 이미 투표하셨습니다.');
  END IF;

  -- 투표 정보 조회
  SELECT * INTO v_vote FROM votes WHERE id = p_vote_id;

  -- 선택 개수 확인
  IF NOT v_vote.allow_multiple AND jsonb_array_length(p_selected_options) > 1 THEN
    RETURN json_build_object('success', false, 'message', '하나의 옵션만 선택할 수 있습니다.');
  END IF;

  IF jsonb_array_length(p_selected_options) > v_vote.max_selections THEN
    RETURN json_build_object('success', false, 'message', '최대 ' || v_vote.max_selections || '개까지 선택할 수 있습니다.');
  END IF;

  -- 투표 기록 삽입
  INSERT INTO vote_records (vote_id, user_id, selected_options)
  VALUES (p_vote_id, p_user_id, p_selected_options);

  -- 투표 수 업데이트
  UPDATE votes
  SET total_votes = total_votes + 1,
      updated_at = NOW()
  WHERE id = p_vote_id;

  -- 활동 기록 (투표 참여 +5점)
  PERFORM record_activity(
    p_user_id,
    'vote_participate',
    5,
    CASE v_vote.scope
      WHEN 'regional' THEN 'regional'::activity_scope
      WHEN 'committee' THEN 'committee'::activity_scope
      ELSE 'national'::activity_scope
    END,
    v_vote.scope_id,
    'vote',
    p_vote_id,
    '투표 참여: ' || LEFT(v_vote.title, 50)
  );

  RETURN json_build_object('success', true, 'message', '투표가 완료되었습니다.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. 개표 함수
CREATE OR REPLACE FUNCTION count_votes(p_vote_id UUID)
RETURNS JSON AS $$
DECLARE
  v_vote votes%ROWTYPE;
  v_result JSONB := '{}';
  v_record RECORD;
  v_option_id TEXT;
BEGIN
  -- 투표 정보 조회
  SELECT * INTO v_vote FROM votes WHERE id = p_vote_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', '투표를 찾을 수 없습니다.');
  END IF;

  -- 투표가 끝났는지 확인
  IF v_vote.status NOT IN ('voting', 'counting', 'completed') THEN
    RETURN json_build_object('success', false, 'message', '아직 개표할 수 없는 상태입니다.');
  END IF;

  -- 옵션별 집계
  FOR v_record IN
    SELECT jsonb_array_elements_text(selected_options) AS option_id
    FROM vote_records
    WHERE vote_id = p_vote_id
  LOOP
    v_option_id := v_record.option_id;
    IF v_result ? v_option_id THEN
      v_result := jsonb_set(v_result, ARRAY[v_option_id], to_jsonb((v_result->>v_option_id)::INTEGER + 1));
    ELSE
      v_result := v_result || jsonb_build_object(v_option_id, 1);
    END IF;
  END LOOP;

  -- 결과 저장 및 상태 변경
  UPDATE votes
  SET result = v_result,
      status = 'completed',
      updated_at = NOW()
  WHERE id = p_vote_id;

  RETURN json_build_object(
    'success', true,
    'result', v_result,
    'total_votes', v_vote.total_votes
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. 투표 상태 자동 업데이트 함수 (cron job용)
CREATE OR REPLACE FUNCTION update_vote_status()
RETURNS void AS $$
BEGIN
  -- 숙의 기간 시작
  UPDATE votes
  SET status = 'deliberation'
  WHERE status = 'draft'
    AND deliberation_start IS NOT NULL
    AND NOW() >= deliberation_start
    AND NOW() < start_date;

  -- 투표 시작
  UPDATE votes
  SET status = 'voting'
  WHERE status IN ('draft', 'deliberation')
    AND NOW() >= start_date
    AND NOW() < end_date;

  -- 투표 종료 (개표 대기)
  UPDATE votes
  SET status = 'counting'
  WHERE status = 'voting'
    AND NOW() >= end_date;
END;
$$ LANGUAGE plpgsql;

-- 12. 투표 목록 조회 함수 (자격별 필터링)
CREATE OR REPLACE FUNCTION get_available_votes(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  description TEXT,
  vote_type vote_type,
  scope vote_scope,
  status vote_status,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  total_votes INTEGER,
  has_voted BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id,
    v.title,
    v.description,
    v.vote_type,
    v.scope,
    v.status,
    v.start_date,
    v.end_date,
    v.total_votes,
    EXISTS (
      SELECT 1 FROM vote_records vr
      WHERE vr.vote_id = v.id AND vr.user_id = p_user_id
    ) AS has_voted
  FROM votes v
  WHERE v.status IN ('deliberation', 'voting', 'completed')
    AND (
      v.scope = 'national'
      OR (v.scope = 'regional' AND v.scope_id = (SELECT region_id FROM user_profiles WHERE id = p_user_id))
      OR (v.scope = 'committee' AND EXISTS (
        SELECT 1 FROM user_committees uc WHERE uc.user_id = p_user_id AND uc.committee_id = v.scope_id
      ))
    )
  ORDER BY
    CASE v.status
      WHEN 'voting' THEN 1
      WHEN 'deliberation' THEN 2
      WHEN 'completed' THEN 3
    END,
    v.end_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

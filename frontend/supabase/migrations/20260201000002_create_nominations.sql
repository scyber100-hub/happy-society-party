-- =====================================================
-- Phase 11: 공천 시스템
-- =====================================================

-- 1. 공천 상태 ENUM 생성
DO $$ BEGIN
  CREATE TYPE nomination_status AS ENUM (
    'pending',     -- 신청 대기
    'screening',   -- 자격 심사 중
    'evaluation',  -- 평가 중
    'review',      -- 심의 중
    'approved',    -- 승인
    'rejected'     -- 반려
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. 선거 유형 ENUM 생성
DO $$ BEGIN
  CREATE TYPE election_type AS ENUM (
    'national_assembly',    -- 국회의원
    'local_council',        -- 지방의회 의원
    'local_executive',      -- 지방자치단체장
    'party_representative', -- 당 대표
    'supreme_council'       -- 최고위원
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. 공천 테이블 생성
CREATE TABLE IF NOT EXISTS nominations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  election_type election_type NOT NULL,
  region_id UUID REFERENCES regions(id), -- 출마 지역
  constituency VARCHAR(255), -- 선거구명
  status nomination_status DEFAULT 'pending',

  -- 신청 정보
  application_text TEXT, -- 출마 소견서
  career_summary TEXT, -- 약력
  policy_pledges TEXT, -- 공약

  -- 3축 평가 점수 (0-100)
  regional_activity_score DECIMAL(5,2), -- 지역 활동 점수 (30%)
  committee_activity_score DECIMAL(5,2), -- 위원회 활동 점수 (30%)
  direct_vote_score DECIMAL(5,2), -- 직접 투표 점수 (40%)
  final_score DECIMAL(5,2), -- 최종 점수

  -- 관련 투표 ID
  nomination_vote_id UUID REFERENCES votes(id),

  -- 심사 정보
  screening_note TEXT, -- 자격 심사 메모
  review_note TEXT, -- 심의 메모
  reviewed_by UUID REFERENCES user_profiles(id),
  reviewed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_nominations_user_id ON nominations(user_id);
CREATE INDEX IF NOT EXISTS idx_nominations_status ON nominations(status);
CREATE INDEX IF NOT EXISTS idx_nominations_region ON nominations(region_id);
CREATE INDEX IF NOT EXISTS idx_nominations_election_type ON nominations(election_type);

-- 4. RLS 정책
ALTER TABLE nominations ENABLE ROW LEVEL SECURITY;

-- 공개된 공천 현황 조회 (평가 중 이후)
CREATE POLICY "Public can view approved nominations"
  ON nominations FOR SELECT
  USING (
    status IN ('evaluation', 'review', 'approved')
    OR user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- 본인 공천 신청
CREATE POLICY "Active members can apply for nomination"
  ON nominations FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('active_member', 'candidate', 'moderator', 'admin')
    )
  );

-- 본인 공천 수정 (신청 단계에서만)
CREATE POLICY "Users can update own pending nomination"
  ON nominations FOR UPDATE
  USING (
    (user_id = auth.uid() AND status = 'pending')
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- 5. 공천 자격 확인 함수
CREATE OR REPLACE FUNCTION check_nomination_eligibility(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_user user_profiles%ROWTYPE;
  v_activity_score INTEGER;
  v_member_days INTEGER;
  v_pending_count INTEGER;
BEGIN
  -- 사용자 정보 조회
  SELECT * INTO v_user FROM user_profiles WHERE id = p_user_id;
  IF NOT FOUND THEN
    RETURN json_build_object('eligible', false, 'reason', '사용자를 찾을 수 없습니다.');
  END IF;

  -- 등급 확인 (활동당원 이상)
  IF v_user.role NOT IN ('active_member', 'candidate', 'moderator', 'admin') THEN
    RETURN json_build_object('eligible', false, 'reason', '활동당원 이상만 공천 신청이 가능합니다.');
  END IF;

  -- 활동 점수 확인 (100점 이상)
  v_activity_score := COALESCE(v_user.activity_score, 0);
  IF v_activity_score < 100 THEN
    RETURN json_build_object(
      'eligible', false,
      'reason', '활동 점수 100점 이상이 필요합니다. (현재: ' || v_activity_score || '점)'
    );
  END IF;

  -- 당원 기간 확인 (6개월 이상)
  IF v_user.party_member_since IS NULL THEN
    RETURN json_build_object('eligible', false, 'reason', '당원 가입일 정보가 없습니다.');
  END IF;

  v_member_days := EXTRACT(DAY FROM NOW() - v_user.party_member_since::timestamp);
  IF v_member_days < 180 THEN
    RETURN json_build_object(
      'eligible', false,
      'reason', '당원 가입 후 6개월 이상이 필요합니다. (현재: ' || v_member_days || '일)'
    );
  END IF;

  -- 진행 중인 공천 신청 확인
  SELECT COUNT(*) INTO v_pending_count
  FROM nominations
  WHERE user_id = p_user_id
    AND status NOT IN ('approved', 'rejected');

  IF v_pending_count > 0 THEN
    RETURN json_build_object('eligible', false, 'reason', '이미 진행 중인 공천 신청이 있습니다.');
  END IF;

  RETURN json_build_object(
    'eligible', true,
    'activity_score', v_activity_score,
    'member_days', v_member_days
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 공천 신청 함수
CREATE OR REPLACE FUNCTION apply_nomination(
  p_user_id UUID,
  p_election_type election_type,
  p_region_id UUID,
  p_constituency VARCHAR,
  p_application_text TEXT,
  p_career_summary TEXT,
  p_policy_pledges TEXT
)
RETURNS JSON AS $$
DECLARE
  v_eligibility JSON;
  v_nomination_id UUID;
BEGIN
  -- 자격 확인
  v_eligibility := check_nomination_eligibility(p_user_id);
  IF NOT (v_eligibility->>'eligible')::boolean THEN
    RETURN v_eligibility;
  END IF;

  -- 공천 신청 삽입
  INSERT INTO nominations (
    user_id, election_type, region_id, constituency,
    application_text, career_summary, policy_pledges, status
  ) VALUES (
    p_user_id, p_election_type, p_region_id, p_constituency,
    p_application_text, p_career_summary, p_policy_pledges, 'pending'
  ) RETURNING id INTO v_nomination_id;

  -- 사용자 등급을 후보자로 변경
  UPDATE user_profiles
  SET role = 'candidate'
  WHERE id = p_user_id AND role = 'active_member';

  RETURN json_build_object(
    'success', true,
    'nomination_id', v_nomination_id,
    'message', '공천 신청이 완료되었습니다.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. 3축 평가 점수 계산 함수
CREATE OR REPLACE FUNCTION calculate_nomination_scores(p_nomination_id UUID)
RETURNS JSON AS $$
DECLARE
  v_nomination nominations%ROWTYPE;
  v_user user_profiles%ROWTYPE;
  v_regional_score DECIMAL(5,2);
  v_committee_score DECIMAL(5,2);
  v_vote_score DECIMAL(5,2);
  v_final_score DECIMAL(5,2);
  v_vote votes%ROWTYPE;
  v_total_votes INTEGER;
  v_user_votes INTEGER;
BEGIN
  -- 공천 정보 조회
  SELECT * INTO v_nomination FROM nominations WHERE id = p_nomination_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', '공천 정보를 찾을 수 없습니다.');
  END IF;

  -- 사용자 정보 조회
  SELECT * INTO v_user FROM user_profiles WHERE id = v_nomination.user_id;

  -- 1. 지역 활동 점수 계산 (30%)
  -- 해당 지역에서의 활동 점수를 100점 만점으로 환산
  SELECT LEAST(100, COALESCE(SUM(points), 0) * 0.5)::DECIMAL(5,2)
  INTO v_regional_score
  FROM activities
  WHERE user_id = v_nomination.user_id
    AND scope = 'regional'
    AND (scope_id = v_nomination.region_id OR scope_id IS NULL);

  -- 2. 위원회 활동 점수 계산 (30%)
  SELECT LEAST(100, COALESCE(SUM(points), 0) * 0.5)::DECIMAL(5,2)
  INTO v_committee_score
  FROM activities
  WHERE user_id = v_nomination.user_id
    AND scope = 'committee';

  -- 3. 직접 투표 점수 계산 (40%)
  IF v_nomination.nomination_vote_id IS NOT NULL THEN
    SELECT * INTO v_vote FROM votes WHERE id = v_nomination.nomination_vote_id;
    IF FOUND AND v_vote.status = 'completed' AND v_vote.result IS NOT NULL THEN
      -- 투표 결과에서 해당 후보의 득표율 계산
      v_total_votes := COALESCE(v_vote.total_votes, 0);
      v_user_votes := COALESCE((v_vote.result->>v_nomination.user_id::text)::INTEGER, 0);
      IF v_total_votes > 0 THEN
        v_vote_score := (v_user_votes::DECIMAL / v_total_votes * 100)::DECIMAL(5,2);
      ELSE
        v_vote_score := 0;
      END IF;
    ELSE
      v_vote_score := 0;
    END IF;
  ELSE
    v_vote_score := 0;
  END IF;

  -- 최종 점수 계산: 직접투표(40%) + 지역활동(30%) + 위원회활동(30%)
  v_final_score := (v_vote_score * 0.4 + v_regional_score * 0.3 + v_committee_score * 0.3)::DECIMAL(5,2);

  -- 점수 업데이트
  UPDATE nominations
  SET
    regional_activity_score = v_regional_score,
    committee_activity_score = v_committee_score,
    direct_vote_score = v_vote_score,
    final_score = v_final_score,
    updated_at = NOW()
  WHERE id = p_nomination_id;

  RETURN json_build_object(
    'success', true,
    'regional_score', v_regional_score,
    'committee_score', v_committee_score,
    'vote_score', v_vote_score,
    'final_score', v_final_score
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. 공천 상태 변경 함수 (관리자용)
CREATE OR REPLACE FUNCTION update_nomination_status(
  p_nomination_id UUID,
  p_new_status nomination_status,
  p_note TEXT DEFAULT NULL,
  p_reviewer_id UUID DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_nomination nominations%ROWTYPE;
BEGIN
  -- 공천 정보 조회
  SELECT * INTO v_nomination FROM nominations WHERE id = p_nomination_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', '공천 정보를 찾을 수 없습니다.');
  END IF;

  -- 상태 업데이트
  UPDATE nominations
  SET
    status = p_new_status,
    screening_note = CASE WHEN p_new_status = 'screening' THEN p_note ELSE screening_note END,
    review_note = CASE WHEN p_new_status = 'review' THEN p_note ELSE review_note END,
    reviewed_by = CASE WHEN p_new_status IN ('approved', 'rejected') THEN p_reviewer_id ELSE reviewed_by END,
    reviewed_at = CASE WHEN p_new_status IN ('approved', 'rejected') THEN NOW() ELSE reviewed_at END,
    updated_at = NOW()
  WHERE id = p_nomination_id;

  -- 승인된 경우 점수 계산
  IF p_new_status = 'evaluation' THEN
    PERFORM calculate_nomination_scores(p_nomination_id);
  END IF;

  RETURN json_build_object('success', true, 'message', '상태가 변경되었습니다.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. 공천 후보 목록 조회 함수
CREATE OR REPLACE FUNCTION get_nomination_candidates(
  p_election_type election_type DEFAULT NULL,
  p_region_id UUID DEFAULT NULL,
  p_status nomination_status DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  user_name VARCHAR,
  election_type election_type,
  region_name VARCHAR,
  constituency VARCHAR,
  status nomination_status,
  final_score DECIMAL,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    n.id,
    n.user_id,
    u.name AS user_name,
    n.election_type,
    r.name AS region_name,
    n.constituency,
    n.status,
    n.final_score,
    n.created_at
  FROM nominations n
  JOIN user_profiles u ON n.user_id = u.id
  LEFT JOIN regions r ON n.region_id = r.id
  WHERE
    (p_election_type IS NULL OR n.election_type = p_election_type)
    AND (p_region_id IS NULL OR n.region_id = p_region_id)
    AND (p_status IS NULL OR n.status = p_status)
  ORDER BY n.final_score DESC NULLS LAST, n.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

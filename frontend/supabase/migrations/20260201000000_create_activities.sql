-- =====================================================
-- Phase 9: 활동 추적 시스템
-- =====================================================

-- 1. 사용자 역할 확장 (활동당원, 후보자 추가)
-- 기존 ENUM 타입 수정 (PostgreSQL 14+)
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'active_member' AFTER 'member';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'candidate' AFTER 'active_member';

-- 2. 활동 유형 ENUM 생성
DO $$ BEGIN
  CREATE TYPE activity_type AS ENUM (
    'post_create',      -- 게시글 작성 (+5점)
    'comment_create',   -- 댓글 작성 (+2점)
    'event_attend',     -- 행사 참여 (+10점)
    'policy_propose',   -- 정책 제안 (+15점)
    'vote_participate', -- 투표 참여 (+5점)
    'donation'          -- 후원 (금액별 점수)
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. 활동 범위 ENUM 생성
DO $$ BEGIN
  CREATE TYPE activity_scope AS ENUM (
    'national',   -- 전국 단위
    'regional',   -- 지역 단위
    'committee'   -- 위원회 단위
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 4. activities 테이블 생성
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  scope activity_scope NOT NULL DEFAULT 'national',
  scope_id UUID, -- region_id 또는 committee_id
  reference_type VARCHAR(50), -- 'post', 'comment', 'event', 'vote', 'payment' 등
  reference_id UUID, -- 참조 대상 ID
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_scope ON activities(scope, scope_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(activity_type);

-- 5. user_profiles에 활동 점수 관련 컬럼 추가
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS activity_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS regional_activity_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS committee_activity_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ;

-- 6. RLS 정책
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- 본인 활동 조회 가능
CREATE POLICY "Users can view own activities"
  ON activities FOR SELECT
  USING (user_id = auth.uid());

-- 관리자는 모든 활동 조회 가능
CREATE POLICY "Admins can view all activities"
  ON activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- 시스템만 활동 기록 가능 (서비스 역할 키 사용)
CREATE POLICY "System can insert activities"
  ON activities FOR INSERT
  WITH CHECK (true);

-- 7. 활동 점수 집계 함수
CREATE OR REPLACE FUNCTION calculate_user_activity_score(p_user_id UUID)
RETURNS TABLE (
  total_score INTEGER,
  regional_score INTEGER,
  committee_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(points), 0)::INTEGER AS total_score,
    COALESCE(SUM(CASE WHEN scope = 'regional' THEN points ELSE 0 END), 0)::INTEGER AS regional_score,
    COALESCE(SUM(CASE WHEN scope = 'committee' THEN points ELSE 0 END), 0)::INTEGER AS committee_score
  FROM activities
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. 활동 기록 함수 (트리거용)
CREATE OR REPLACE FUNCTION record_activity(
  p_user_id UUID,
  p_activity_type activity_type,
  p_points INTEGER,
  p_scope activity_scope DEFAULT 'national',
  p_scope_id UUID DEFAULT NULL,
  p_reference_type VARCHAR DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_activity_id UUID;
BEGIN
  -- 활동 기록 삽입
  INSERT INTO activities (
    user_id, activity_type, points, scope, scope_id,
    reference_type, reference_id, description
  ) VALUES (
    p_user_id, p_activity_type, p_points, p_scope, p_scope_id,
    p_reference_type, p_reference_id, p_description
  ) RETURNING id INTO v_activity_id;

  -- 사용자 점수 업데이트
  UPDATE user_profiles
  SET
    activity_score = activity_score + p_points,
    regional_activity_score = CASE
      WHEN p_scope = 'regional' THEN regional_activity_score + p_points
      ELSE regional_activity_score
    END,
    committee_activity_score = CASE
      WHEN p_scope = 'committee' THEN committee_activity_score + p_points
      ELSE committee_activity_score
    END,
    last_activity_at = NOW()
  WHERE id = p_user_id;

  -- 활동당원 자동 승급 (100점 이상 & 현재 member인 경우)
  UPDATE user_profiles
  SET role = 'active_member'
  WHERE id = p_user_id
    AND role = 'member'
    AND activity_score >= 100;

  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. 게시글 작성 시 활동 기록 트리거
CREATE OR REPLACE FUNCTION trigger_post_activity()
RETURNS TRIGGER AS $$
DECLARE
  v_community communities%ROWTYPE;
  v_scope activity_scope;
  v_scope_id UUID;
BEGIN
  -- 커뮤니티 정보 조회
  SELECT * INTO v_community FROM communities WHERE id = NEW.community_id;

  -- 범위 결정
  IF v_community.type = 'region' THEN
    v_scope := 'regional';
    v_scope_id := v_community.region_id;
  ELSIF v_community.type = 'committee' THEN
    v_scope := 'committee';
    v_scope_id := v_community.committee_id;
  ELSE
    v_scope := 'national';
    v_scope_id := NULL;
  END IF;

  -- 활동 기록 (게시글 작성 +5점)
  PERFORM record_activity(
    NEW.author_id,
    'post_create',
    5,
    v_scope,
    v_scope_id,
    'post',
    NEW.id,
    '게시글 작성: ' || LEFT(NEW.title, 50)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_post_created ON posts;
CREATE TRIGGER on_post_created
  AFTER INSERT ON posts
  FOR EACH ROW
  WHEN (NEW.is_published = true)
  EXECUTE FUNCTION trigger_post_activity();

-- 10. 댓글 작성 시 활동 기록 트리거
CREATE OR REPLACE FUNCTION trigger_comment_activity()
RETURNS TRIGGER AS $$
DECLARE
  v_post posts%ROWTYPE;
  v_community communities%ROWTYPE;
  v_scope activity_scope;
  v_scope_id UUID;
BEGIN
  -- 게시글 정보 조회
  SELECT * INTO v_post FROM posts WHERE id = NEW.post_id;

  -- 커뮤니티 정보 조회
  SELECT * INTO v_community FROM communities WHERE id = v_post.community_id;

  -- 범위 결정
  IF v_community.type = 'region' THEN
    v_scope := 'regional';
    v_scope_id := v_community.region_id;
  ELSIF v_community.type = 'committee' THEN
    v_scope := 'committee';
    v_scope_id := v_community.committee_id;
  ELSE
    v_scope := 'national';
    v_scope_id := NULL;
  END IF;

  -- 활동 기록 (댓글 작성 +2점)
  PERFORM record_activity(
    NEW.author_id,
    'comment_create',
    2,
    v_scope,
    v_scope_id,
    'comment',
    NEW.id,
    '댓글 작성'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_comment_created ON comments;
CREATE TRIGGER on_comment_created
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_comment_activity();

-- 11. 활동 통계 조회 함수
CREATE OR REPLACE FUNCTION get_activity_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'total_score', COALESCE(SUM(points), 0),
    'regional_score', COALESCE(SUM(CASE WHEN scope = 'regional' THEN points ELSE 0 END), 0),
    'committee_score', COALESCE(SUM(CASE WHEN scope = 'committee' THEN points ELSE 0 END), 0),
    'post_count', COUNT(CASE WHEN activity_type = 'post_create' THEN 1 END),
    'comment_count', COUNT(CASE WHEN activity_type = 'comment_create' THEN 1 END),
    'event_count', COUNT(CASE WHEN activity_type = 'event_attend' THEN 1 END),
    'vote_count', COUNT(CASE WHEN activity_type = 'vote_participate' THEN 1 END),
    'this_month_score', COALESCE(SUM(CASE
      WHEN created_at >= date_trunc('month', CURRENT_DATE) THEN points ELSE 0
    END), 0),
    'last_month_score', COALESCE(SUM(CASE
      WHEN created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
         AND created_at < date_trunc('month', CURRENT_DATE) THEN points ELSE 0
    END), 0)
  ) INTO v_result
  FROM activities
  WHERE user_id = p_user_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. 월별 활동 내역 조회 함수
CREATE OR REPLACE FUNCTION get_monthly_activities(
  p_user_id UUID,
  p_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
  p_month INTEGER DEFAULT EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER
)
RETURNS TABLE (
  id UUID,
  activity_type activity_type,
  points INTEGER,
  scope activity_scope,
  description TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.activity_type,
    a.points,
    a.scope,
    a.description,
    a.created_at
  FROM activities a
  WHERE a.user_id = p_user_id
    AND EXTRACT(YEAR FROM a.created_at) = p_year
    AND EXTRACT(MONTH FROM a.created_at) = p_month
  ORDER BY a.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

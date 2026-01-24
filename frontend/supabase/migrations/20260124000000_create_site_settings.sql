-- site_settings 테이블 생성
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES user_profiles(id)
);

-- RLS 활성화
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기 가능
CREATE POLICY "Anyone can read site settings"
  ON site_settings FOR SELECT
  USING (true);

-- 관리자만 수정 가능
CREATE POLICY "Only admins can update site settings"
  ON site_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 관리자만 삽입 가능
CREATE POLICY "Only admins can insert site settings"
  ON site_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 기본 설정값 삽입
INSERT INTO site_settings (key, value, description) VALUES
  ('site', '{"name": "행복사회당", "description": "1등이 아니어도 행복한 나라, 부자가 아니어도 존엄한 나라", "contactEmail": "contact@happysociety.party", "contactPhone": "02-xxxx-xxxx"}', '사이트 기본 정보'),
  ('notifications', '{"emailNotifications": true, "newMemberAlert": true, "reportAlert": true}', '알림 설정'),
  ('security', '{"requireEmailVerification": true, "allowSocialLogin": true, "maxLoginAttempts": 5}', '보안 설정'),
  ('content', '{"autoApproveComments": true, "allowGuestComments": false, "maxPostLength": 50000}', '콘텐츠 설정'),
  ('maintenance', '{"isEnabled": false, "message": "사이트 점검 중입니다."}', '유지보수 모드 설정')
ON CONFLICT (key) DO NOTHING;

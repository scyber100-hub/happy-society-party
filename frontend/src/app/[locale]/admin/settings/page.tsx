'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  Globe,
  Bell,
  Shield,
  Database,
  Save,
  RefreshCw,
  AlertTriangle,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import type { Json } from '@/types/database';

interface SiteSettings {
  name: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  newMemberAlert: boolean;
  reportAlert: boolean;
}

interface SecuritySettings {
  requireEmailVerification: boolean;
  allowSocialLogin: boolean;
  maxLoginAttempts: number;
}

interface ContentSettings {
  autoApproveComments: boolean;
  allowGuestComments: boolean;
  maxPostLength: number;
}

interface MaintenanceSettings {
  isEnabled: boolean;
  message: string;
}

interface SettingRow {
  id: string;
  key: string;
  value: SiteSettings | NotificationSettings | SecuritySettings | ContentSettings | MaintenanceSettings;
  description: string | null;
  updated_at: string | null;
}

export default function AdminSettingsPage() {
  const { user } = useAuthContext();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    name: '행복사회당',
    description: '1등이 아니어도 행복한 나라, 부자가 아니어도 존엄한 나라',
    contactEmail: 'contact@happysociety.party',
    contactPhone: '02-xxxx-xxxx',
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    newMemberAlert: true,
    reportAlert: true,
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    requireEmailVerification: true,
    allowSocialLogin: true,
    maxLoginAttempts: 5,
  });

  const [contentSettings, setContentSettings] = useState<ContentSettings>({
    autoApproveComments: true,
    allowGuestComments: false,
    maxPostLength: 50000,
  });

  const [maintenanceSettings, setMaintenanceSettings] = useState<MaintenanceSettings>({
    isEnabled: false,
    message: '사이트 점검 중입니다.',
  });

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('site_settings')
      .select('*');

    if (fetchError) {
      // 테이블이 없는 경우 기본값 사용
      if (fetchError.code === '42P01') {
        setError('설정 테이블이 생성되지 않았습니다. 마이그레이션을 실행해 주세요.');
      } else {
        setError(`설정을 불러오는데 실패했습니다: ${fetchError.message}`);
      }
      setLoading(false);
      return;
    }

    if (data) {
      data.forEach((row) => {
        const settingRow = row as unknown as SettingRow;
        switch (settingRow.key) {
          case 'site':
            setSiteSettings(settingRow.value as SiteSettings);
            break;
          case 'notifications':
            setNotificationSettings(settingRow.value as NotificationSettings);
            break;
          case 'security':
            setSecuritySettings(settingRow.value as SecuritySettings);
            break;
          case 'content':
            setContentSettings(settingRow.value as ContentSettings);
            break;
          case 'maintenance':
            setMaintenanceSettings(settingRow.value as MaintenanceSettings);
            break;
        }
      });
    }

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    const updates = [
      { key: 'site', value: siteSettings },
      { key: 'notifications', value: notificationSettings },
      { key: 'security', value: securitySettings },
      { key: 'content', value: contentSettings },
      { key: 'maintenance', value: maintenanceSettings },
    ];

    let hasError = false;

    for (const update of updates) {
      const { error: updateError } = await supabase
        .from('site_settings')
        .update({
          value: update.value as unknown as Json,
          updated_at: new Date().toISOString(),
          updated_by: user?.id,
        })
        .eq('key', update.key);

      if (updateError) {
        hasError = true;
        setError(`설정 저장 실패: ${updateError.message}`);
        break;
      }
    }

    setSaving(false);

    if (!hasError) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleClearCache = async () => {
    // 캐시 초기화 로직 (실제 구현 시 서버 사이드에서 처리)
    alert('캐시가 초기화되었습니다.');
  };

  const handleToggleMaintenance = async () => {
    const newValue = !maintenanceSettings.isEnabled;
    setMaintenanceSettings({ ...maintenanceSettings, isEnabled: newValue });

    const { error: updateError } = await supabase
      .from('site_settings')
      .update({
        value: { ...maintenanceSettings, isEnabled: newValue } as unknown as Json,
        updated_at: new Date().toISOString(),
        updated_by: user?.id,
      })
      .eq('key', 'maintenance');

    if (updateError) {
      setError(`유지보수 모드 변경 실패: ${updateError.message}`);
      setMaintenanceSettings({ ...maintenanceSettings, isEnabled: !newValue });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)] mx-auto mb-4" />
          <p className="text-[var(--gray-500)]">설정을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--gray-900)]">설정</h1>
        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="flex items-center gap-1 text-[var(--success)] text-sm">
              <CheckCircle className="w-4 h-4" />
              저장됨
            </span>
          )}
          <Button variant="primary" onClick={handleSave} isLoading={saving}>
            <Save className="w-4 h-4 mr-1" />
            저장
          </Button>
        </div>
      </div>

      {error && (
        <Card variant="bordered" className="border-[var(--error)]/30 bg-[var(--error)]/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-[var(--error)]">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Site Settings */}
      <Card variant="default" className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[var(--primary)]" />
            사이트 기본 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
              사이트명
            </label>
            <Input
              value={siteSettings.name}
              onChange={(e) => setSiteSettings({ ...siteSettings, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
              사이트 설명
            </label>
            <textarea
              value={siteSettings.description}
              onChange={(e) => setSiteSettings({ ...siteSettings, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                대표 이메일
              </label>
              <Input
                type="email"
                value={siteSettings.contactEmail}
                onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                대표 전화번호
              </label>
              <Input
                type="tel"
                value={siteSettings.contactPhone}
                onChange={(e) => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card variant="default" className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[var(--primary)]" />
            알림 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-[var(--gray-200)] rounded-[var(--radius-md)]">
            <div>
              <h4 className="font-medium text-[var(--gray-900)]">이메일 알림</h4>
              <p className="text-sm text-[var(--gray-500)]">관리자에게 이메일 알림 발송</p>
            </div>
            <button
              onClick={() => setNotificationSettings({ ...notificationSettings, emailNotifications: !notificationSettings.emailNotifications })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.emailNotifications ? 'bg-[var(--primary)]' : 'bg-[var(--gray-300)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-[var(--gray-200)] rounded-[var(--radius-md)]">
            <div>
              <h4 className="font-medium text-[var(--gray-900)]">신규 회원 가입 알림</h4>
              <p className="text-sm text-[var(--gray-500)]">새 회원이 가입하면 알림</p>
            </div>
            <button
              onClick={() => setNotificationSettings({ ...notificationSettings, newMemberAlert: !notificationSettings.newMemberAlert })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.newMemberAlert ? 'bg-[var(--primary)]' : 'bg-[var(--gray-300)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.newMemberAlert ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-[var(--gray-200)] rounded-[var(--radius-md)]">
            <div>
              <h4 className="font-medium text-[var(--gray-900)]">신고 접수 알림</h4>
              <p className="text-sm text-[var(--gray-500)]">새 신고가 접수되면 알림</p>
            </div>
            <button
              onClick={() => setNotificationSettings({ ...notificationSettings, reportAlert: !notificationSettings.reportAlert })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.reportAlert ? 'bg-[var(--primary)]' : 'bg-[var(--gray-300)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.reportAlert ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card variant="default" className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--primary)]" />
            보안 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-[var(--gray-200)] rounded-[var(--radius-md)]">
            <div>
              <h4 className="font-medium text-[var(--gray-900)]">이메일 인증 필수</h4>
              <p className="text-sm text-[var(--gray-500)]">가입 시 이메일 인증 요구</p>
            </div>
            <button
              onClick={() => setSecuritySettings({ ...securitySettings, requireEmailVerification: !securitySettings.requireEmailVerification })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securitySettings.requireEmailVerification ? 'bg-[var(--primary)]' : 'bg-[var(--gray-300)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securitySettings.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-[var(--gray-200)] rounded-[var(--radius-md)]">
            <div>
              <h4 className="font-medium text-[var(--gray-900)]">소셜 로그인 허용</h4>
              <p className="text-sm text-[var(--gray-500)]">Google, Kakao 로그인 활성화</p>
            </div>
            <button
              onClick={() => setSecuritySettings({ ...securitySettings, allowSocialLogin: !securitySettings.allowSocialLogin })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securitySettings.allowSocialLogin ? 'bg-[var(--primary)]' : 'bg-[var(--gray-300)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securitySettings.allowSocialLogin ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
              최대 로그인 시도 횟수
            </label>
            <Input
              type="number"
              min={1}
              max={10}
              value={securitySettings.maxLoginAttempts}
              onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) || 5 })}
              className="w-32"
            />
            <p className="text-sm text-[var(--gray-500)] mt-1">초과 시 계정이 일시 잠금됩니다.</p>
          </div>
        </CardContent>
      </Card>

      {/* Content Settings */}
      <Card variant="default" className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[var(--primary)]" />
            콘텐츠 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-[var(--gray-200)] rounded-[var(--radius-md)]">
            <div>
              <h4 className="font-medium text-[var(--gray-900)]">댓글 자동 승인</h4>
              <p className="text-sm text-[var(--gray-500)]">댓글 작성 시 바로 게시</p>
            </div>
            <button
              onClick={() => setContentSettings({ ...contentSettings, autoApproveComments: !contentSettings.autoApproveComments })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                contentSettings.autoApproveComments ? 'bg-[var(--primary)]' : 'bg-[var(--gray-300)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  contentSettings.autoApproveComments ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-[var(--gray-200)] rounded-[var(--radius-md)]">
            <div>
              <h4 className="font-medium text-[var(--gray-900)]">비회원 댓글 허용</h4>
              <p className="text-sm text-[var(--gray-500)]">비로그인 사용자 댓글 허용</p>
            </div>
            <button
              onClick={() => setContentSettings({ ...contentSettings, allowGuestComments: !contentSettings.allowGuestComments })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                contentSettings.allowGuestComments ? 'bg-[var(--primary)]' : 'bg-[var(--gray-300)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  contentSettings.allowGuestComments ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
              게시글 최대 길이 (자)
            </label>
            <Input
              type="number"
              min={1000}
              max={100000}
              value={contentSettings.maxPostLength}
              onChange={(e) => setContentSettings({ ...contentSettings, maxPostLength: parseInt(e.target.value) || 50000 })}
              className="w-40"
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card variant="bordered" className="border-[var(--error)]/30 bg-[var(--error)]/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--error)]">
            <AlertTriangle className="w-5 h-5" />
            위험 구역
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-[var(--error)]/20 rounded-[var(--radius-md)] bg-white">
            <div>
              <h4 className="font-medium text-[var(--gray-900)]">캐시 초기화</h4>
              <p className="text-sm text-[var(--gray-500)]">모든 캐시 데이터를 삭제합니다.</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleClearCache}>
              <RefreshCw className="w-4 h-4 mr-1" />
              초기화
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-[var(--error)]/20 rounded-[var(--radius-md)] bg-white">
            <div>
              <h4 className="font-medium text-[var(--error)]">사이트 유지보수 모드</h4>
              <p className="text-sm text-[var(--gray-500)]">
                {maintenanceSettings.isEnabled
                  ? '현재 유지보수 모드가 활성화되어 있습니다.'
                  : '사이트 접속을 일시 차단합니다.'}
              </p>
            </div>
            <Button
              variant={maintenanceSettings.isEnabled ? 'outline' : 'danger'}
              size="sm"
              onClick={handleToggleMaintenance}
            >
              {maintenanceSettings.isEnabled ? '비활성화' : '활성화'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

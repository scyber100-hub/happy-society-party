'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Settings,
  Globe,
  Bell,
  Shield,
  Database,
  Mail,
  Save,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: '행복사회당',
    siteDescription: '1등이 아니어도 행복한 나라, 부자가 아니어도 존엄한 나라',
    contactEmail: 'contact@happysociety.party',
    contactPhone: '02-xxxx-xxxx',
    // Notification settings
    emailNotifications: true,
    newMemberAlert: true,
    reportAlert: true,
    // Security settings
    requireEmailVerification: true,
    allowSocialLogin: true,
    maxLoginAttempts: 5,
    // Content settings
    autoApproveComments: true,
    allowGuestComments: false,
    maxPostLength: 50000,
  });

  const handleSave = async () => {
    setSaving(true);
    // 실제로는 API 호출
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    alert('설정이 저장되었습니다.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--gray-900)]">설정</h1>
        <Button variant="primary" onClick={handleSave} isLoading={saving}>
          <Save className="w-4 h-4 mr-1" />
          저장
        </Button>
      </div>

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
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
              사이트 설명
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
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
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                대표 전화번호
              </label>
              <Input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
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
              onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.emailNotifications ? 'bg-[var(--primary)]' : 'bg-[var(--gray-300)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
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
              onClick={() => setSettings({ ...settings, newMemberAlert: !settings.newMemberAlert })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.newMemberAlert ? 'bg-[var(--primary)]' : 'bg-[var(--gray-300)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.newMemberAlert ? 'translate-x-6' : 'translate-x-1'
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
              onClick={() => setSettings({ ...settings, reportAlert: !settings.reportAlert })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.reportAlert ? 'bg-[var(--primary)]' : 'bg-[var(--gray-300)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.reportAlert ? 'translate-x-6' : 'translate-x-1'
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
              onClick={() => setSettings({ ...settings, requireEmailVerification: !settings.requireEmailVerification })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.requireEmailVerification ? 'bg-[var(--primary)]' : 'bg-[var(--gray-300)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'
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
              onClick={() => setSettings({ ...settings, allowSocialLogin: !settings.allowSocialLogin })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.allowSocialLogin ? 'bg-[var(--primary)]' : 'bg-[var(--gray-300)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.allowSocialLogin ? 'translate-x-6' : 'translate-x-1'
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
              value={settings.maxLoginAttempts}
              onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) || 5 })}
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
              onClick={() => setSettings({ ...settings, autoApproveComments: !settings.autoApproveComments })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoApproveComments ? 'bg-[var(--primary)]' : 'bg-[var(--gray-300)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoApproveComments ? 'translate-x-6' : 'translate-x-1'
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
              onClick={() => setSettings({ ...settings, allowGuestComments: !settings.allowGuestComments })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.allowGuestComments ? 'bg-[var(--primary)]' : 'bg-[var(--gray-300)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.allowGuestComments ? 'translate-x-6' : 'translate-x-1'
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
              value={settings.maxPostLength}
              onChange={(e) => setSettings({ ...settings, maxPostLength: parseInt(e.target.value) || 50000 })}
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
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-1" />
              초기화
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-[var(--error)]/20 rounded-[var(--radius-md)] bg-white">
            <div>
              <h4 className="font-medium text-[var(--error)]">사이트 유지보수 모드</h4>
              <p className="text-sm text-[var(--gray-500)]">사이트 접속을 일시 차단합니다.</p>
            </div>
            <Button variant="danger" size="sm">
              활성화
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

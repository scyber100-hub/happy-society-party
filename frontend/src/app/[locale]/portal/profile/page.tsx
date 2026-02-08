'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthContext } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Building2,
  Loader2,
  Check,
  X,
} from 'lucide-react';

interface Region {
  id: string;
  name: string;
  level: number;
  parent_id: string | null;
}

interface Committee {
  id: string;
  name: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, isAuthenticated, updateProfile } = useAuthContext();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    district: '',
    region_id: '',
  });
  const [regions, setRegions] = useState<Region[]>([]);
  const [userCommittees, setUserCommittees] = useState<Committee[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    if (!user || !profile) return;

    setLoading(true);

    // 지역 목록 가져오기 (시/도 레벨)
    const { data: regionsData } = await supabase
      .from('regions')
      .select('*')
      .eq('level', 1)
      .order('name');

    if (regionsData) {
      setRegions(regionsData);
    }

    // 사용자의 위원회 가져오기
    const { data: committeesData } = await supabase
      .from('user_committees')
      .select('committee_id, committees(id, name)')
      .eq('user_id', user.id);

    if (committeesData) {
      const committees = committeesData
        .map(uc => uc.committees as Committee | null)
        .filter((c): c is Committee => c !== null);
      setUserCommittees(committees);
    }

    // 폼 데이터 초기화
    setFormData({
      name: profile.name || '',
      phone: profile.phone || '',
      bio: profile.bio || '',
      district: profile.district || '',
      region_id: profile.region_id || '',
    });

    setLoading(false);
  }, [user, profile, supabase]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/portal/profile');
      return;
    }

    if (user && profile) {
      fetchData();
    }
  }, [authLoading, isAuthenticated, user, profile, router, fetchData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    const { error } = await updateProfile({
      name: formData.name,
      phone: formData.phone || null,
      bio: formData.bio || null,
      district: formData.district || null,
      region_id: formData.region_id || null,
    });

    if (error) {
      setMessage({ type: 'error', text: '프로필 저장에 실패했습니다.' });
    } else {
      setMessage({ type: 'success', text: '프로필이 저장되었습니다.' });
      setIsEditing(false);
    }

    setIsSaving(false);
  };

  const handleCancel = () => {
    // 원래 값으로 복원
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        district: profile.district || '',
        region_id: profile.region_id || '',
      });
    }
    setIsEditing(false);
    setMessage(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getRoleName = (role: string | null) => {
    switch (role) {
      case 'admin': return '관리자';
      case 'moderator': return '운영자';
      case 'member': return '당원';
      case 'user': return '회원';
      default: return '게스트';
    }
  };

  const getRegionName = (regionId: string | null) => {
    if (!regionId) return '-';
    const region = regions.find(r => r.id === regionId);
    return region?.name || '-';
  };

  // 로딩 상태
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)] mx-auto mb-4" />
          <p className="text-[var(--gray-500)]">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--gray-500)]">프로필 정보를 불러올 수 없습니다.</p>
          <Link href="/auth/login">
            <Button variant="primary" className="mt-4">로그인하기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <div className="bg-[var(--primary)] text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/portal"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            대시보드로 돌아가기
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">내 프로필</h1>
          <p className="text-white/80 mt-1">프로필 정보를 확인하고 수정할 수 있습니다.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 메시지 표시 */}
        {message && (
          <div className={`mb-6 p-4 rounded-[var(--radius-md)] flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
            {message.text}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Photo Section */}
          <Card variant="default" className="bg-white md:col-span-1">
            <CardContent className="text-center py-8">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-[var(--primary-light)] rounded-full flex items-center justify-center mx-auto relative overflow-hidden">
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-5xl text-[var(--primary)] font-bold">
                      {profile.name[0]}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-[var(--primary)] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[var(--primary-dark)] transition-colors">
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold text-[var(--gray-900)] mt-4">{profile.name}</h2>
              <p className="text-[var(--primary)]">{getRoleName(profile.role)}</p>
              <div className="text-sm text-[var(--gray-500)] mt-2">
                가입일: {formatDate(profile.created_at)}
              </div>
              {profile.is_party_member && profile.party_member_since && (
                <div className="text-sm text-[var(--gray-500)]">
                  입당일: {formatDate(profile.party_member_since)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Info Section */}
          <Card variant="default" className="bg-white md:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>기본 정보</CardTitle>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    수정
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCancel}>
                      취소
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSave}
                      isLoading={isSaving}
                    >
                      <Save className="w-4 h-4 mr-1" />
                      저장
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--gray-700)] mb-2">
                    <User className="w-4 h-4" />
                    이름
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  ) : (
                    <p className="text-[var(--gray-900)] py-2">{profile.name}</p>
                  )}
                </div>

                {/* Email (읽기 전용) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--gray-700)] mb-2">
                    <Mail className="w-4 h-4" />
                    이메일
                    <span className="text-xs text-[var(--gray-400)]">(변경 불가)</span>
                  </label>
                  <p className="text-[var(--gray-900)] py-2">{user?.email || '-'}</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--gray-700)] mb-2">
                    <Phone className="w-4 h-4" />
                    연락처
                  </label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="010-0000-0000"
                    />
                  ) : (
                    <p className="text-[var(--gray-900)] py-2">{profile.phone || '-'}</p>
                  )}
                </div>

                {/* Region */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--gray-700)] mb-2">
                      <MapPin className="w-4 h-4" />
                      지역 (시/도)
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.region_id}
                        onChange={(e) => handleInputChange('region_id', e.target.value)}
                        className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      >
                        <option value="">선택하세요</option>
                        {regions.map((region) => (
                          <option key={region.id} value={region.id}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-[var(--gray-900)] py-2">{getRegionName(profile.region_id)}</p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--gray-700)] mb-2">
                      <MapPin className="w-4 h-4" />
                      구/군
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        placeholder="예: 강남구"
                      />
                    ) : (
                      <p className="text-[var(--gray-900)] py-2">{profile.district || '-'}</p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--gray-700)] mb-2">
                    자기소개
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                      placeholder="간단한 자기소개를 작성해 주세요."
                      className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
                    />
                  ) : (
                    <p className="text-[var(--gray-900)] py-2">{profile.bio || '-'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Committee Membership */}
          <Card variant="default" className="bg-white md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                소속 위원회
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userCommittees.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {userCommittees.map((committee) => (
                    <span
                      key={committee.id}
                      className="px-4 py-2 bg-[var(--primary-light)] text-[var(--primary)] rounded-full font-medium"
                    >
                      {committee.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[var(--gray-500)]">소속된 위원회가 없습니다.</p>
              )}
              <p className="text-sm text-[var(--gray-500)] mt-4">
                위원회 가입/탈퇴는 각 위원회 페이지에서 신청할 수 있습니다.
              </p>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card variant="default" className="bg-white md:col-span-3">
            <CardHeader>
              <CardTitle>계정 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-[var(--gray-200)] rounded-[var(--radius-md)]">
                  <div>
                    <h4 className="font-medium text-[var(--gray-900)]">비밀번호 변경</h4>
                    <p className="text-sm text-[var(--gray-500)]">
                      계정 보안을 위해 정기적으로 비밀번호를 변경해 주세요.
                    </p>
                  </div>
                  <Link href="/auth/reset-password">
                    <Button variant="outline" size="sm">
                      변경하기
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between p-4 border border-[var(--gray-200)] rounded-[var(--radius-md)]">
                  <div>
                    <h4 className="font-medium text-[var(--gray-900)]">알림 설정</h4>
                    <p className="text-sm text-[var(--gray-500)]">
                      이메일 및 푸시 알림 설정을 관리합니다.
                    </p>
                  </div>
                  <Link href="/portal/notifications">
                    <Button variant="outline" size="sm">
                      설정하기
                    </Button>
                  </Link>
                </div>
                {profile.is_party_member && (
                  <div className="flex items-center justify-between p-4 border border-[var(--error)]/20 rounded-[var(--radius-md)] bg-[var(--error)]/5">
                    <div>
                      <h4 className="font-medium text-[var(--error)]">탈당 신청</h4>
                      <p className="text-sm text-[var(--gray-500)]">
                        탈당을 원하시면 신청해 주세요.
                      </p>
                    </div>
                    <Button variant="danger" size="sm">
                      탈당 신청
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Building2,
} from 'lucide-react';

// 더미 사용자 데이터
const initialUserData = {
  name: '홍길동',
  email: 'hong@example.com',
  phone: '010-1234-5678',
  avatar: null,
  bio: '행복한 사회를 만들기 위해 함께 노력하는 당원입니다.',
  region: '서울특별시',
  district: '강남구',
  memberSince: '2025-06-15',
  committees: ['정책위원회', '환경위원회'],
};

const regions = [
  '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시',
  '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원도',
  '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도',
];

export default function ProfilePage() {
  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // 실제로는 API 호출
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

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
        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Photo Section */}
          <Card variant="default" className="bg-white md:col-span-1">
            <CardContent className="text-center py-8">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-[var(--primary-light)] rounded-full flex items-center justify-center mx-auto relative overflow-hidden">
                  {userData.avatar ? (
                    <Image
                      src={userData.avatar}
                      alt={userData.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-5xl text-[var(--primary)] font-bold">
                      {userData.name[0]}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-[var(--primary)] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[var(--primary-dark)] transition-colors">
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold text-[var(--gray-900)] mt-4">{userData.name}</h2>
              <p className="text-[var(--primary)]">당원</p>
              <div className="text-sm text-[var(--gray-500)] mt-2">
                가입일: {userData.memberSince}
              </div>
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
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
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
                      value={userData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  ) : (
                    <p className="text-[var(--gray-900)] py-2">{userData.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--gray-700)] mb-2">
                    <Mail className="w-4 h-4" />
                    이메일
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  ) : (
                    <p className="text-[var(--gray-900)] py-2">{userData.email}</p>
                  )}
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
                      value={userData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  ) : (
                    <p className="text-[var(--gray-900)] py-2">{userData.phone}</p>
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
                        value={userData.region}
                        onChange={(e) => handleInputChange('region', e.target.value)}
                        className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      >
                        {regions.map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-[var(--gray-900)] py-2">{userData.region}</p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--gray-700)] mb-2">
                      <MapPin className="w-4 h-4" />
                      구/군
                    </label>
                    {isEditing ? (
                      <Input
                        value={userData.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                      />
                    ) : (
                      <p className="text-[var(--gray-900)] py-2">{userData.district}</p>
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
                      value={userData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
                    />
                  ) : (
                    <p className="text-[var(--gray-900)] py-2">{userData.bio || '-'}</p>
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
              {userData.committees.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {userData.committees.map((committee) => (
                    <span
                      key={committee}
                      className="px-4 py-2 bg-[var(--primary-light)] text-[var(--primary)] rounded-full font-medium"
                    >
                      {committee}
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
                  <Button variant="outline" size="sm">
                    변경하기
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-[var(--gray-200)] rounded-[var(--radius-md)]">
                  <div>
                    <h4 className="font-medium text-[var(--gray-900)]">알림 설정</h4>
                    <p className="text-sm text-[var(--gray-500)]">
                      이메일 및 푸시 알림 설정을 관리합니다.
                    </p>
                  </div>
                  <Link href="/portal/notifications/settings">
                    <Button variant="outline" size="sm">
                      설정하기
                    </Button>
                  </Link>
                </div>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

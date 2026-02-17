'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuthContext } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import type { Region, Committee } from '@/types/database';

type Step = 1 | 2 | 3 | 4;

export default function JoinPage() {
  const router = useRouter();
  const { signUp } = useAuthContext();
  const supabase = createClient();

  const [step, setStep] = useState<Step>(1);
  const [regions, setRegions] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    passwordConfirm: '',
    regionId: '',
    districtId: '',
    committees: [] as string[],
    paymentType: 'monthly' as 'monthly' | 'yearly',
    agreeTerms: false,
  });

  // 지역 및 상임위 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const [regionsRes, committeesRes] = await Promise.all([
        supabase.from('regions').select('*').eq('level', 1).order('name'),
        supabase.from('committees').select('*').eq('is_active', true).order('sort_order'),
      ]);

      if (regionsRes.data) setRegions(regionsRes.data);
      if (committeesRes.data) setCommittees(committeesRes.data);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 시군구 데이터 가져오기
  const fetchDistricts = useCallback(async (regionId: string) => {
    if (!regionId) {
      setDistricts([]);
      return;
    }

    const { data } = await supabase
      .from('regions')
      .select('*')
      .eq('parent_id', regionId)
      .eq('level', 2)
      .order('name');

    if (data) setDistricts(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 지역 변경 시 시군구 데이터 로드
  useEffect(() => {
    if (formData.regionId) {
      fetchDistricts(formData.regionId);
    } else {
      setDistricts([]);
    }
  }, [formData.regionId, fetchDistricts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    // 시도가 변경되면 시군구 초기화
    if (name === 'regionId') {
      setFormData((prev) => ({
        ...prev,
        regionId: value,
        districtId: '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
    setError(null);
  };

  const handleCommitteeToggle = (committeeId: string) => {
    setFormData((prev) => ({
      ...prev,
      committees: prev.committees.includes(committeeId)
        ? prev.committees.filter((id) => id !== committeeId)
        : [...prev.committees, committeeId],
    }));
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          setError('이름을 입력해주세요.');
          return false;
        }
        if (!formData.email.trim()) {
          setError('이메일을 입력해주세요.');
          return false;
        }
        if (formData.password.length < 8) {
          setError('비밀번호는 8자 이상이어야 합니다.');
          return false;
        }
        if (formData.password !== formData.passwordConfirm) {
          setError('비밀번호가 일치하지 않습니다.');
          return false;
        }
        return true;
      case 2:
        if (!formData.regionId) {
          setError('시/도를 선택해주세요.');
          return false;
        }
        return true;
      case 3:
        return true; // 상임위는 선택 사항
      case 4:
        if (!formData.agreeTerms) {
          setError('이용약관에 동의해주세요.');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep() && step < 4) {
      setStep((step + 1) as Step);
      setError(null);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsLoading(true);
    setError(null);

    // districtId가 있으면 그것을 region으로, 없으면 regionId를 사용
    const finalRegionId = formData.districtId || formData.regionId || undefined;

    const { error } = await signUp(formData.email, formData.password, {
      name: formData.name,
      phone: formData.phone,
      regionId: finalRegionId,
      committees: formData.committees,
    });

    if (error) {
      setError(
        error.message === 'User already registered'
          ? '이미 가입된 이메일입니다.'
          : error.message
      );
      setIsLoading(false);
      return;
    }

    // 결제 페이지로 이동
    router.push(`/payment?type=${formData.paymentType}`);
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)] py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--gray-900)] mb-2">입당 신청</h1>
          <p className="text-[var(--gray-600)]">행복사회당과 함께 새로운 정치를 만들어가세요.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  s === step
                    ? 'bg-[var(--primary)] text-white'
                    : s < step
                    ? 'bg-[var(--success)] text-white'
                    : 'bg-[var(--gray-200)] text-[var(--gray-500)]'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-[var(--gray-500)]">
            <span>기본 정보</span>
            <span>지역 선택</span>
            <span>상임위 선택</span>
            <span>당비 결제</span>
          </div>
          <div className="mt-2 h-2 bg-[var(--gray-200)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Card */}
        <Card variant="default" className="bg-white">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-[var(--radius-md)] text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">기본 정보 입력</h2>
              <Input
                label="이름"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="홍길동"
                required
              />
              <Input
                label="휴대폰 번호"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="010-0000-0000"
              />
              <Input
                label="이메일"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
                required
              />
              <Input
                label="비밀번호"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="8자 이상 입력"
                required
              />
              <Input
                label="비밀번호 확인"
                name="passwordConfirm"
                type="password"
                value={formData.passwordConfirm}
                onChange={handleInputChange}
                placeholder="비밀번호 재입력"
                required
              />
            </div>
          )}

          {/* Step 2: Region */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">지역 선택</h2>
              <p className="text-[var(--gray-600)] text-sm mb-4">
                거주지 또는 활동 희망 지역을 선택해 주세요. 해당 지역 커뮤니티에 자동으로 가입됩니다.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                    시/도 <span className="text-[var(--error)]">*</span>
                  </label>
                  <select
                    name="regionId"
                    value={formData.regionId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-[var(--gray-300)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    <option value="">시/도를 선택하세요</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>{region.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                    시/군/구
                  </label>
                  <select
                    name="districtId"
                    value={formData.districtId}
                    onChange={handleInputChange}
                    disabled={!formData.regionId || districts.length === 0}
                    className="w-full px-4 py-2.5 border border-[var(--gray-300)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:bg-[var(--gray-100)] disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {!formData.regionId
                        ? '먼저 시/도를 선택하세요'
                        : districts.length === 0
                          ? '시/군/구 정보가 없습니다'
                          : '시/군/구를 선택하세요'
                      }
                    </option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>{district.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Committee */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">상임위원회 선택</h2>
              <p className="text-[var(--gray-600)] text-sm mb-4">
                관심 있는 정책 분야의 상임위원회를 선택해 주세요. (복수 선택 가능)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {committees.map((committee) => (
                  <div
                    key={committee.id}
                    onClick={() => handleCommitteeToggle(committee.id)}
                    className={`p-4 border rounded-[var(--radius-md)] cursor-pointer transition-all ${
                      formData.committees.includes(committee.id)
                        ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                        : 'border-[var(--gray-200)] hover:border-[var(--gray-300)]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        formData.committees.includes(committee.id)
                          ? 'border-[var(--primary)] bg-[var(--primary)]'
                          : 'border-[var(--gray-300)]'
                      }`}>
                        {formData.committees.includes(committee.id) && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-[var(--gray-900)]">{committee.name}</div>
                        <div className="text-sm text-[var(--gray-500)]">{committee.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">당비 결제</h2>
              <p className="text-[var(--gray-600)] text-sm mb-4">
                당비 납부 방식을 선택해 주세요.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setFormData({ ...formData, paymentType: 'monthly' })}
                  className={`p-6 border rounded-[var(--radius-lg)] cursor-pointer text-center transition-all ${
                    formData.paymentType === 'monthly'
                      ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                      : 'border-[var(--gray-200)]'
                  }`}
                >
                  <div className="text-2xl font-bold text-[var(--primary)]">월 10,000원</div>
                  <div className="text-sm text-[var(--gray-500)] mt-1">매월 자동 결제</div>
                </div>
                <div
                  onClick={() => setFormData({ ...formData, paymentType: 'yearly' })}
                  className={`p-6 border rounded-[var(--radius-lg)] cursor-pointer text-center transition-all ${
                    formData.paymentType === 'yearly'
                      ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                      : 'border-[var(--gray-200)]'
                  }`}
                >
                  <div className="text-2xl font-bold text-[var(--primary)]">연 100,000원</div>
                  <div className="text-sm text-[var(--gray-500)] mt-1">연간 결제 (2개월 할인)</div>
                </div>
              </div>

              <div className="bg-[var(--gray-50)] p-4 rounded-[var(--radius-md)]">
                <h3 className="font-medium text-[var(--gray-900)] mb-2">입당 신청 요약</h3>
                <div className="text-sm text-[var(--gray-600)] space-y-1">
                  <p>이름: {formData.name || '-'}</p>
                  <p>지역: {regions.find(r => r.id === formData.regionId)?.name || '-'} {districts.find(d => d.id === formData.districtId)?.name || ''}</p>
                  <p>상임위: {formData.committees.length}개 선택</p>
                  <p>당비: {formData.paymentType === 'monthly' ? '월 10,000원' : '연 100,000원'}</p>
                </div>
              </div>

              <div className="text-sm text-[var(--gray-500)]">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  <span>
                    <Link href="/terms" className="text-[var(--primary)]">이용약관</Link> 및{' '}
                    <Link href="/privacy" className="text-[var(--primary)]">개인정보처리방침</Link>에 동의합니다.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-[var(--gray-200)]">
            {step > 1 ? (
              <Button variant="outline" onClick={prevStep}>이전</Button>
            ) : (
              <div></div>
            )}
            {step < 4 ? (
              <Button onClick={nextStep}>다음</Button>
            ) : (
              <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
                가입하고 입당하기
              </Button>
            )}
          </div>
        </Card>

        {/* Login Link */}
        <p className="text-center text-[var(--gray-600)] mt-6">
          이미 당원이신가요?{' '}
          <Link href="/auth/login" className="text-[var(--primary)] font-medium">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}

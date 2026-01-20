'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuthContext } from '@/contexts/AuthContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/portal';
  const { signIn, signInWithGoogle, signInWithKakao } = useAuthContext();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await signIn(formData.email, formData.password);

    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? '이메일 또는 비밀번호가 올바르지 않습니다.'
          : error.message
      );
      setIsLoading(false);
      return;
    }

    router.push(redirect);
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/images/logo.svg"
              alt="행복사회당 로고"
              width={64}
              height={64}
              className="w-16 h-16 mx-auto"
            />
          </Link>
          <h1 className="text-2xl font-bold text-[var(--gray-900)]">로그인</h1>
          <p className="text-[var(--gray-600)] mt-2">행복사회당 회원 포털에 오신 것을 환영합니다.</p>
        </div>

        {/* Login Form */}
        <Card variant="default" className="bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[var(--radius-md)] text-red-600 text-sm">
                {error}
              </div>
            )}

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
              placeholder="비밀번호 입력"
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[var(--primary)] border-[var(--gray-300)] rounded focus:ring-[var(--primary)]"
                />
                <span className="text-sm text-[var(--gray-600)]">로그인 상태 유지</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-[var(--primary)] hover:underline">
                비밀번호 찾기
              </Link>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              로그인
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--gray-200)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[var(--gray-500)]">또는</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[var(--gray-300)] rounded-[var(--radius-md)] hover:bg-[var(--gray-50)] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-[var(--gray-700)]">Google로 계속하기</span>
            </button>
            <button
              type="button"
              onClick={signInWithKakao}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#FEE500] rounded-[var(--radius-md)] hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#000000" d="M12 3c-5.1 0-9.2 3.3-9.2 7.4 0 2.6 1.7 4.9 4.3 6.2-.2.7-.7 2.5-.8 2.9 0 0 0 .1.1.1s.1 0 .2 0c.2-.1 2.6-1.7 3.7-2.5.6.1 1.1.1 1.7.1 5.1 0 9.2-3.3 9.2-7.4S17.1 3 12 3z"/>
              </svg>
              <span className="text-[#000000]">카카오로 계속하기</span>
            </button>
          </div>
        </Card>

        {/* Sign Up Link */}
        <p className="text-center text-[var(--gray-600)] mt-6">
          아직 당원이 아니신가요?{' '}
          <Link href="/join" className="text-[var(--primary)] font-medium hover:underline">
            입당 신청하기
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
        <div className="animate-pulse text-[var(--gray-500)]">로딩 중...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

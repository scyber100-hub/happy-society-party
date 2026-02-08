'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    // Supabase handles the token verification automatically
    // when the page is loaded with the correct hash parameters
    const checkSession = async () => {
      await supabase.auth.getSession();

      // If there's an error in the URL (e.g., expired link)
      const errorDescription = searchParams.get('error_description');
      if (errorDescription) {
        setIsValidLink(false);
        setError(errorDescription);
      }
    };

    checkSession();
  }, [searchParams, supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError('비밀번호 변경에 실패했습니다. 다시 시도해 주세요.');
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
    setIsLoading(false);

    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/auth/login');
    }, 3000);
  };

  if (!isValidLink) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card variant="default" className="bg-white text-center py-8">
            <div className="w-16 h-16 bg-[var(--error)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-[var(--error)]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--gray-900)] mb-2">
              유효하지 않은 링크
            </h2>
            <p className="text-[var(--gray-600)] mb-6">
              비밀번호 재설정 링크가 만료되었거나 유효하지 않습니다.<br />
              다시 비밀번호 찾기를 진행해 주세요.
            </p>
            <Link href="/auth/forgot-password">
              <Button variant="primary">
                비밀번호 찾기
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-[var(--gray-900)]">비밀번호 재설정</h1>
          <p className="text-[var(--gray-600)] mt-2">
            새로운 비밀번호를 입력해 주세요.
          </p>
        </div>

        {isSuccess ? (
          /* Success State */
          <Card variant="default" className="bg-white text-center py-8">
            <div className="w-16 h-16 bg-[var(--success)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[var(--success)]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--gray-900)] mb-2">
              비밀번호가 변경되었습니다
            </h2>
            <p className="text-[var(--gray-600)] mb-6">
              새로운 비밀번호로 로그인해 주세요.<br />
              잠시 후 로그인 페이지로 이동합니다.
            </p>
            <Link href="/auth/login">
              <Button variant="primary">
                로그인하기
              </Button>
            </Link>
          </Card>
        ) : (
          /* Form State */
          <Card variant="default" className="bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-[var(--radius-md)] text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div>
                <Input
                  label="새 비밀번호"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="새 비밀번호 입력"
                  required
                />
                <p className="mt-1 text-sm text-[var(--gray-500)]">
                  8자 이상 입력해 주세요.
                </p>
              </div>

              <Input
                label="비밀번호 확인"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError(null);
                }}
                placeholder="비밀번호 다시 입력"
                required
              />

              <Button type="submit" fullWidth isLoading={isLoading}>
                <Lock className="w-4 h-4 mr-2" />
                비밀번호 변경
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
        <div className="animate-pulse text-[var(--gray-500)]">로딩 중...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

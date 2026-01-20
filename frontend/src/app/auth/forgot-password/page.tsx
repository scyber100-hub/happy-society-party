'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError('비밀번호 재설정 이메일 발송에 실패했습니다. 이메일 주소를 확인해 주세요.');
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
    setIsLoading(false);
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
          <h1 className="text-2xl font-bold text-[var(--gray-900)]">비밀번호 찾기</h1>
          <p className="text-[var(--gray-600)] mt-2">
            가입 시 사용한 이메일 주소를 입력해 주세요.
          </p>
        </div>

        {isSuccess ? (
          /* Success State */
          <Card variant="default" className="bg-white text-center py-8">
            <div className="w-16 h-16 bg-[var(--success)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[var(--success)]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--gray-900)] mb-2">
              이메일을 발송했습니다
            </h2>
            <p className="text-[var(--gray-600)] mb-6">
              <strong>{email}</strong>으로 비밀번호 재설정 링크를 보냈습니다.<br />
              이메일을 확인해 주세요.
            </p>
            <div className="space-y-3">
              <p className="text-sm text-[var(--gray-500)]">
                이메일이 도착하지 않았나요?
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setIsSuccess(false);
                  setEmail('');
                }}
              >
                다시 시도하기
              </Button>
            </div>
            <div className="mt-8 pt-6 border-t border-[var(--gray-200)]">
              <Link
                href="/auth/login"
                className="text-[var(--primary)] font-medium hover:underline"
              >
                로그인 페이지로 돌아가기
              </Link>
            </div>
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
                  label="이메일"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="example@email.com"
                  required
                />
                <p className="mt-2 text-sm text-[var(--gray-500)]">
                  입력하신 이메일로 비밀번호 재설정 링크를 보내드립니다.
                </p>
              </div>

              <Button type="submit" fullWidth isLoading={isLoading}>
                <Mail className="w-4 h-4 mr-2" />
                재설정 링크 발송
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-sm text-[var(--gray-600)] hover:text-[var(--primary)]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  로그인으로 돌아가기
                </Link>
              </div>
            </form>
          </Card>
        )}

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--gray-500)]">
            문제가 계속되면{' '}
            <a href="mailto:contact@happysociety.party" className="text-[var(--primary)] hover:underline">
              고객센터
            </a>
            로 문의해 주세요.
          </p>
        </div>
      </div>
    </div>
  );
}

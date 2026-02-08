'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'resent'>('verifying');
  const [message, setMessage] = useState('이메일 인증을 확인하고 있습니다...');
  const [email, setEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const checkVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email || null);

        if (user.email_confirmed_at) {
          setStatus('success');
          setMessage('이메일 인증이 완료되었습니다!');

          // user_profiles 업데이트
          await supabase
            .from('user_profiles')
            .update({ email_verified: true })
            .eq('id', user.id);

          // 3초 후 리다이렉트
          setTimeout(() => {
            router.push('/portal');
          }, 3000);
        } else {
          setStatus('error');
          setMessage('이메일 인증이 아직 완료되지 않았습니다. 이메일을 확인해주세요.');
        }
      } else {
        setStatus('error');
        setMessage('로그인이 필요합니다.');
      }
    };

    // URL에서 토큰 확인 (Supabase가 자동으로 처리)
    const token = searchParams.get('token');
    const type = searchParams.get('type');

    if (type === 'email' || token) {
      // Supabase가 URL 파라미터로 인증을 처리함
      setTimeout(checkVerification, 1000);
    } else {
      checkVerification();
    }
  }, [searchParams, router, supabase]);

  const handleResendEmail = async () => {
    if (!email) return;

    setIsResending(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      setMessage('이메일 재발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } else {
      setStatus('resent');
      setMessage('인증 이메일이 재발송되었습니다. 이메일을 확인해주세요.');
    }
    setIsResending(false);
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center py-12 px-4">
      <Card variant="default" className="max-w-md w-full bg-white text-center">
        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            <h1 className="text-2xl font-bold text-[var(--gray-900)] mb-4">이메일 인증 확인 중</h1>
            <p className="text-[var(--gray-600)]">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-[var(--success)] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--gray-900)] mb-4">인증 완료!</h1>
            <p className="text-[var(--gray-600)] mb-6">{message}</p>
            <p className="text-sm text-[var(--gray-500)]">잠시 후 회원 포털로 이동합니다...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-[var(--error)] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--gray-900)] mb-4">인증 필요</h1>
            <p className="text-[var(--gray-600)] mb-6">{message}</p>
            {email && (
              <Button
                onClick={handleResendEmail}
                isLoading={isResending}
                className="mb-4"
              >
                인증 이메일 재발송
              </Button>
            )}
            <Link href="/auth/login" className="text-[var(--primary)] text-sm">
              로그인 페이지로 이동
            </Link>
          </>
        )}

        {status === 'resent' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-[var(--primary)] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--gray-900)] mb-4">이메일 발송 완료</h1>
            <p className="text-[var(--gray-600)] mb-6">{message}</p>
            <p className="text-sm text-[var(--gray-500)] mb-4">
              {email}로 발송된 이메일을 확인해주세요.
            </p>
            <Link href="/auth/login" className="text-[var(--primary)] text-sm">
              로그인 페이지로 이동
            </Link>
          </>
        )}
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('결제를 확인하고 있습니다...');
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');

      if (!paymentKey || !orderId || !amount) {
        setStatus('error');
        setMessage('결제 정보가 올바르지 않습니다.');
        return;
      }

      try {
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount),
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('결제가 성공적으로 완료되었습니다!');
          if (data.receipt?.url) {
            setReceiptUrl(data.receipt.url);
          }
        } else {
          setStatus('error');
          setMessage(data.error || '결제 승인에 실패했습니다.');
        }
      } catch {
        setStatus('error');
        setMessage('결제 처리 중 오류가 발생했습니다.');
      }
    };

    confirmPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center py-12 px-4">
      <Card variant="default" className="max-w-md w-full bg-white text-center">
        {status === 'processing' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            <h1 className="text-2xl font-bold text-[var(--gray-900)] mb-4">결제 확인 중</h1>
            <p className="text-[var(--gray-600)]">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-[var(--success)] rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--gray-900)] mb-4">결제 완료!</h1>
            <p className="text-[var(--gray-600)] mb-6">{message}</p>
            <p className="text-[var(--gray-600)] mb-6">
              행복사회당의 당원이 되신 것을 진심으로 환영합니다.
            </p>

            <div className="space-y-3">
              {receiptUrl && (
                <a
                  href={receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2 px-4 border border-[var(--gray-300)] rounded-[var(--radius-md)] text-[var(--gray-700)] hover:bg-[var(--gray-50)] transition-colors"
                >
                  영수증 확인
                </a>
              )}
              <Link href="/portal">
                <Button variant="primary" className="w-full">
                  회원 포털로 이동
                </Button>
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-[var(--error)] rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--gray-900)] mb-4">결제 실패</h1>
            <p className="text-[var(--gray-600)] mb-6">{message}</p>

            <div className="space-y-3">
              <Button variant="primary" onClick={() => router.back()} className="w-full">
                다시 시도
              </Button>
              <Link href="/portal" className="block text-[var(--primary)] text-sm">
                회원 포털로 이동
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

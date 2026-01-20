'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthContext } from '@/contexts/AuthContext';

declare global {
  interface Window {
    TossPayments: any;
  }
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tossPaymentsRef = useRef<any>(null);

  const paymentType = (searchParams.get('type') as 'monthly' | 'yearly') || 'monthly';
  const amount = paymentType === 'monthly' ? 10000 : 100000;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login?redirect=/payment');
      return;
    }

    // 토스페이먼츠 SDK 로드
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment';
    script.async = true;
    script.onload = () => {
      const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY;
      if (clientKey && window.TossPayments) {
        tossPaymentsRef.current = window.TossPayments(clientKey);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [loading, isAuthenticated, router]);

  const handlePayment = async () => {
    if (!tossPaymentsRef.current || !user) {
      setError('결제 준비가 되지 않았습니다. 페이지를 새로고침해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 결제 준비 API 호출
      const prepareRes = await fetch('/api/payments/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          paymentType,
          amount,
        }),
      });

      const prepareData = await prepareRes.json();

      if (!prepareRes.ok) {
        throw new Error(prepareData.error);
      }

      // 토스페이먼츠 결제창 호출
      await tossPaymentsRef.current.requestPayment('카드', {
        amount,
        orderId: prepareData.orderId,
        orderName: paymentType === 'monthly' ? '행복사회당 월 당비' : '행복사회당 연간 당비',
        customerName: user.user_metadata?.name || '회원',
        customerEmail: user.email,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err: any) {
      if (err.code === 'USER_CANCEL') {
        setError('결제가 취소되었습니다.');
      } else {
        setError(err.message || '결제 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gray-50)] py-12">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--gray-900)] mb-2">당비 결제</h1>
          <p className="text-[var(--gray-600)]">행복사회당의 활동을 후원해주세요.</p>
        </div>

        <Card variant="default" className="bg-white">
          <div className="space-y-6">
            {/* 결제 정보 */}
            <div className="bg-[var(--gray-50)] p-6 rounded-[var(--radius-lg)]">
              <h2 className="text-lg font-bold text-[var(--gray-900)] mb-4">결제 정보</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[var(--gray-600)]">상품명</span>
                  <span className="font-medium text-[var(--gray-900)]">
                    {paymentType === 'monthly' ? '월간 당비' : '연간 당비'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--gray-600)]">결제 주기</span>
                  <span className="font-medium text-[var(--gray-900)]">
                    {paymentType === 'monthly' ? '매월 자동 결제' : '연간 1회'}
                  </span>
                </div>
                <div className="border-t border-[var(--gray-200)] pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-[var(--gray-900)]">결제 금액</span>
                    <span className="text-2xl font-bold text-[var(--primary)]">
                      {amount.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 결제 수단 선택 */}
            <div>
              <h3 className="text-sm font-medium text-[var(--gray-700)] mb-3">결제 수단</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 border-2 border-[var(--primary)] rounded-[var(--radius-md)] bg-[var(--primary-light)] text-center">
                  <span className="font-medium text-[var(--primary)]">신용/체크카드</span>
                </div>
                <div className="p-4 border border-[var(--gray-200)] rounded-[var(--radius-md)] text-center text-[var(--gray-400)] cursor-not-allowed">
                  <span>계좌이체 (준비중)</span>
                </div>
              </div>
            </div>

            {/* 안내 사항 */}
            <div className="bg-blue-50 p-4 rounded-[var(--radius-md)]">
              <h4 className="font-medium text-blue-900 mb-2">안내 사항</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>- 당비 납부 후 정당원으로 등록됩니다.</li>
                <li>- 월간 결제는 매월 동일 일자에 자동 결제됩니다.</li>
                <li>- 결제 취소는 회원 포털에서 가능합니다.</li>
                <li>- 문의: support@happysociety.party</li>
              </ul>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[var(--radius-md)] text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handlePayment}
              isLoading={isLoading}
            >
              {amount.toLocaleString()}원 결제하기
            </Button>

            <p className="text-xs text-center text-[var(--gray-500)]">
              결제 버튼을 클릭하면 <a href="/terms" className="underline">이용약관</a> 및{' '}
              <a href="/privacy" className="underline">개인정보처리방침</a>에 동의하는 것으로 간주됩니다.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}

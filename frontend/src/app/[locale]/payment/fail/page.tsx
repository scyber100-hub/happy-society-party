'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  const getErrorDescription = (code: string | null) => {
    switch (code) {
      case 'PAY_PROCESS_CANCELED':
        return '결제가 취소되었습니다.';
      case 'PAY_PROCESS_ABORTED':
        return '결제가 중단되었습니다.';
      case 'REJECT_CARD_COMPANY':
        return '카드사에서 결제가 거절되었습니다.';
      default:
        return errorMessage || '결제 처리 중 오류가 발생했습니다.';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center py-12 px-4">
      <Card variant="default" className="max-w-md w-full bg-white text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-[var(--error)] rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-[var(--gray-900)] mb-4">결제 실패</h1>
        <p className="text-[var(--gray-600)] mb-2">{getErrorDescription(errorCode)}</p>
        {errorCode && (
          <p className="text-sm text-[var(--gray-500)] mb-6">오류 코드: {errorCode}</p>
        )}

        <div className="space-y-3">
          <Button variant="primary" onClick={() => router.back()} className="w-full">
            다시 시도
          </Button>
          <Link href="/" className="block text-[var(--primary)] text-sm">
            홈으로 이동
          </Link>
        </div>

        <div className="mt-8 p-4 bg-[var(--gray-50)] rounded-[var(--radius-md)]">
          <p className="text-sm text-[var(--gray-600)]">
            문제가 계속되면 고객센터로 문의해주세요.
          </p>
          <p className="text-sm text-[var(--primary)] font-medium mt-1">
            support@happysociety.party
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PaymentFailContent />
    </Suspense>
  );
}

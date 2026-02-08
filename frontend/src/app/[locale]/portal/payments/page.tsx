'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthContext } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import type { PaymentStatus } from '@/types/database';
import {
  ArrowLeft,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  ChevronRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  payment_type: 'monthly' | 'yearly';
  status: PaymentStatus | null;
  paid_at: string | null;
  period_start: string | null;
  period_end: string | null;
  pg_provider: string | null;
  receipt_url: string | null;
  created_at: string | null;
}

const statusConfig = {
  completed: {
    label: '납부완료',
    icon: CheckCircle,
    color: 'text-[var(--success)]',
    bgColor: 'bg-[var(--success)]/10',
  },
  pending: {
    label: '처리중',
    icon: Clock,
    color: 'text-[var(--secondary)]',
    bgColor: 'bg-[var(--secondary)]/10',
  },
  failed: {
    label: '실패',
    icon: XCircle,
    color: 'text-[var(--error)]',
    bgColor: 'bg-[var(--error)]/10',
  },
  cancelled: {
    label: '취소됨',
    icon: XCircle,
    color: 'text-[var(--gray-500)]',
    bgColor: 'bg-[var(--gray-100)]',
  },
  refunded: {
    label: '환불됨',
    icon: XCircle,
    color: 'text-[var(--gray-500)]',
    bgColor: 'bg-[var(--gray-100)]',
  },
};

export default function PaymentsPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, isAuthenticated } = useAuthContext();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  const supabase = createClient();

  const fetchPayments = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .order('paid_at', { ascending: false });

    if (!error && data) {
      setPayments(data);

      // 가용 연도 추출
      const years = new Set<string>();
      years.add(new Date().getFullYear().toString());
      data.forEach(p => {
        if (p.paid_at) {
          years.add(new Date(p.paid_at).getFullYear().toString());
        }
      });
      setAvailableYears(Array.from(years).sort((a, b) => parseInt(b) - parseInt(a)));
    }

    setLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/portal/payments');
      return;
    }

    if (user) {
      fetchPayments();
    }
  }, [authLoading, isAuthenticated, user, router, fetchPayments]);

  // 이번 달 납부 상태 확인
  const getCurrentMonthStatus = (): 'completed' | 'pending' | 'unpaid' => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const thisMonthPayment = payments.find(p => {
      if (!p.period_start) return false;
      const start = new Date(p.period_start);
      return start.getFullYear() === currentYear && start.getMonth() + 1 === currentMonth;
    });

    if (thisMonthPayment) {
      if (thisMonthPayment.status === 'completed') return 'completed';
      if (thisMonthPayment.status === 'pending') return 'pending';
    }
    return 'unpaid';
  };

  // 총 납부 금액 계산
  const getTotalPaid = () => {
    return payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  // 다음 결제일 계산
  const getNextPaymentDate = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.toISOString().split('T')[0];
  };

  // 연도별 필터링
  const filteredPayments = payments.filter((payment) => {
    if (!payment.paid_at) return false;
    return payment.paid_at.startsWith(selectedYear);
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getPaymentMethodLabel = (provider: string | null) => {
    if (!provider) return '-';
    switch (provider.toLowerCase()) {
      case 'kakaopay': return '카카오페이';
      case 'naverpay': return '네이버페이';
      case 'card': return '신용카드';
      case 'bank': return '계좌이체';
      default: return provider;
    }
  };

  const currentStatus = getCurrentMonthStatus();

  const currentStatusConfig = currentStatus === 'unpaid'
    ? { label: '미납', icon: XCircle, color: 'text-[var(--error)]', bgColor: 'bg-[var(--error)]/10' }
    : currentStatus === 'pending'
    ? statusConfig.pending
    : statusConfig.completed;

  const StatusIcon = currentStatusConfig.icon;

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
          <h1 className="text-2xl md:text-3xl font-bold">당비 납부 현황</h1>
          <p className="text-white/80 mt-1">당비 납부 내역과 영수증을 확인할 수 있습니다.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Current Status */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card variant="default" className="bg-white">
            <CardContent className="text-center py-6">
              <div className={`w-16 h-16 ${currentStatusConfig.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <StatusIcon className={`w-8 h-8 ${currentStatusConfig.color}`} />
              </div>
              <div className="text-sm text-[var(--gray-500)] mb-1">이번 달 당비</div>
              <div className={`text-xl font-bold ${currentStatusConfig.color}`}>
                {currentStatusConfig.label}
              </div>
            </CardContent>
          </Card>

          <Card variant="default" className="bg-white">
            <CardContent className="text-center py-6">
              <div className="w-16 h-16 bg-[var(--primary-light)] rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-[var(--primary)]" />
              </div>
              <div className="text-sm text-[var(--gray-500)] mb-1">다음 결제일</div>
              <div className="text-xl font-bold text-[var(--gray-900)]">
                {getNextPaymentDate()}
              </div>
            </CardContent>
          </Card>

          <Card variant="default" className="bg-white">
            <CardContent className="text-center py-6">
              <div className="w-16 h-16 bg-[var(--primary-light)] rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-8 h-8 text-[var(--primary)]" />
              </div>
              <div className="text-sm text-[var(--gray-500)] mb-1">총 납부 금액</div>
              <div className="text-xl font-bold text-[var(--gray-900)]">
                {getTotalPaid().toLocaleString()}원
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Info Card */}
        <Card variant="default" className="bg-white mb-6">
          <CardHeader>
            <CardTitle>정기 납부 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-[var(--gray-100)]">
                  <span className="text-[var(--gray-500)]">월 당비</span>
                  <span className="font-medium text-[var(--gray-900)]">
                    10,000원
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--gray-100)]">
                  <span className="text-[var(--gray-500)]">납부 횟수</span>
                  <span className="font-medium text-[var(--gray-900)]">
                    {payments.filter(p => p.status === 'completed').length}회
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--gray-100)]">
                  <span className="text-[var(--gray-500)]">정기 결제일</span>
                  <span className="font-medium text-[var(--gray-900)]">매월 1일</span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <Button variant="outline" className="mb-2">
                  결제 수단 변경
                </Button>
                <Button variant="ghost" className="text-[var(--gray-500)]">
                  정기 납부 해지
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Benefit Info */}
        <Card variant="bordered" className="bg-[var(--primary-light)] mb-6">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-[var(--primary)] mb-1">세액공제 안내</h4>
                <p className="text-sm text-[var(--primary-dark)]">
                  당비는 정치자금법에 따라 연말정산 시 세액공제를 받을 수 있습니다.
                  10만원까지 전액(100/110), 초과분은 15% 공제됩니다.
                  기부금 영수증은 국세청 홈택스에서 자동 조회 가능합니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card variant="default" className="bg-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>납부 내역</CardTitle>
              <div className="flex items-center gap-2">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-[var(--gray-300)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}년</option>
                  ))}
                </select>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  내역 다운로드
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredPayments.length > 0 ? (
              <div className="divide-y divide-[var(--gray-100)]">
                {filteredPayments.map((payment) => {
                  const config = payment.status ? statusConfig[payment.status] : statusConfig.pending;
                  const PaymentStatusIcon = config.icon;

                  return (
                    <div
                      key={payment.id}
                      className="py-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 ${config.bgColor} rounded-full flex items-center justify-center`}>
                          <PaymentStatusIcon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div>
                          <div className="font-medium text-[var(--gray-900)]">
                            {formatDate(payment.paid_at)}
                          </div>
                          <div className="text-sm text-[var(--gray-500)]">
                            {getPaymentMethodLabel(payment.pg_provider)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-[var(--gray-900)]">
                            {payment.amount.toLocaleString()}원
                          </div>
                          <div className={`text-sm ${config.color}`}>{config.label}</div>
                        </div>
                        {payment.receipt_url && (
                          <Link
                            href={payment.receipt_url}
                            className="text-[var(--gray-400)] hover:text-[var(--primary)]"
                            target="_blank"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-[var(--gray-300)] mx-auto mb-3" />
                <p className="text-[var(--gray-500)]">
                  {payments.length === 0
                    ? '아직 납부 내역이 없습니다.'
                    : '해당 연도의 납부 내역이 없습니다.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Payment */}
        <Card variant="default" className="bg-white mt-6">
          <CardHeader>
            <CardTitle>수동 납부</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--gray-600)] mb-4">
              미납된 당비가 있거나 추가 납부를 원하시면 아래 버튼을 눌러 결제해 주세요.
            </p>
            <div className="flex gap-3">
              <Link href="/payment">
                <Button variant="primary">
                  당비 납부하기
                </Button>
              </Link>
              <Link href="/donate">
                <Button variant="outline">
                  후원하기
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

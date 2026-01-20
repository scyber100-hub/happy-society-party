'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
} from 'lucide-react';

// 더미 결제 데이터
const paymentSummary = {
  currentStatus: 'paid', // paid, pending, overdue
  nextPaymentDate: '2026-02-01',
  monthlyAmount: 10000,
  paidMonths: 7,
  totalPaid: 70000,
};

const paymentHistory = [
  {
    id: 'pay-001',
    date: '2026-01-01',
    amount: 10000,
    status: 'completed',
    method: '신용카드',
    receiptUrl: '#',
  },
  {
    id: 'pay-002',
    date: '2025-12-01',
    amount: 10000,
    status: 'completed',
    method: '신용카드',
    receiptUrl: '#',
  },
  {
    id: 'pay-003',
    date: '2025-11-01',
    amount: 10000,
    status: 'completed',
    method: '계좌이체',
    receiptUrl: '#',
  },
  {
    id: 'pay-004',
    date: '2025-10-01',
    amount: 10000,
    status: 'completed',
    method: '신용카드',
    receiptUrl: '#',
  },
  {
    id: 'pay-005',
    date: '2025-09-01',
    amount: 10000,
    status: 'completed',
    method: '신용카드',
    receiptUrl: '#',
  },
  {
    id: 'pay-006',
    date: '2025-08-01',
    amount: 10000,
    status: 'completed',
    method: '카카오페이',
    receiptUrl: '#',
  },
  {
    id: 'pay-007',
    date: '2025-07-01',
    amount: 10000,
    status: 'completed',
    method: '신용카드',
    receiptUrl: '#',
  },
];

const statusConfig = {
  paid: {
    label: '납부완료',
    icon: CheckCircle,
    color: 'text-[var(--success)]',
    bgColor: 'bg-[var(--success)]/10',
  },
  pending: {
    label: '납부예정',
    icon: Clock,
    color: 'text-[var(--secondary)]',
    bgColor: 'bg-[var(--secondary)]/10',
  },
  overdue: {
    label: '미납',
    icon: XCircle,
    color: 'text-[var(--error)]',
    bgColor: 'bg-[var(--error)]/10',
  },
};

export default function PaymentsPage() {
  const [selectedYear, setSelectedYear] = useState('2026');
  const currentStatusConfig = statusConfig[paymentSummary.currentStatus as keyof typeof statusConfig];
  const StatusIcon = currentStatusConfig.icon;

  const filteredHistory = paymentHistory.filter((payment) =>
    payment.date.startsWith(selectedYear)
  );

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
                {paymentSummary.nextPaymentDate}
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
                {paymentSummary.totalPaid.toLocaleString()}원
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
                    {paymentSummary.monthlyAmount.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--gray-100)]">
                  <span className="text-[var(--gray-500)]">결제 방법</span>
                  <span className="font-medium text-[var(--gray-900)]">신용카드 (자동)</span>
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
                  <option value="2026">2026년</option>
                  <option value="2025">2025년</option>
                </select>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  내역 다운로드
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredHistory.length > 0 ? (
              <div className="divide-y divide-[var(--gray-100)]">
                {filteredHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[var(--success)]/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                      </div>
                      <div>
                        <div className="font-medium text-[var(--gray-900)]">
                          {payment.date}
                        </div>
                        <div className="text-sm text-[var(--gray-500)]">
                          {payment.method}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium text-[var(--gray-900)]">
                          {payment.amount.toLocaleString()}원
                        </div>
                        <div className="text-sm text-[var(--success)]">완료</div>
                      </div>
                      <Link href={payment.receiptUrl} className="text-[var(--gray-400)] hover:text-[var(--primary)]">
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-[var(--gray-300)] mx-auto mb-3" />
                <p className="text-[var(--gray-500)]">해당 연도의 납부 내역이 없습니다.</p>
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
              <Button variant="primary">
                당비 납부하기
              </Button>
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

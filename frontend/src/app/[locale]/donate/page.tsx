'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Heart,
  Gift,
  CreditCard,
  Building2,
  Smartphone,
  Receipt,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Calculator,
  Users,
  Target,
  Sparkles,
} from 'lucide-react';

// 후원 금액 옵션
const donationAmounts = [
  { value: 10000, label: '1만원' },
  { value: 30000, label: '3만원' },
  { value: 50000, label: '5만원' },
  { value: 100000, label: '10만원' },
  { value: 300000, label: '30만원' },
  { value: 0, label: '직접 입력' },
];

// 후원 방법
const donationMethods = [
  {
    id: 'card',
    icon: CreditCard,
    title: '신용카드',
    description: '신용카드로 간편하게 후원',
  },
  {
    id: 'bank',
    icon: Building2,
    title: '계좌이체',
    description: '무통장 입금으로 후원',
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: '간편결제',
    description: '카카오페이, 네이버페이 등',
  },
];

// FAQ 데이터
const faqData = [
  {
    question: '후원금은 어디에 사용되나요?',
    answer: '후원금은 정치자금법에 따라 당 운영, 정책 개발, 선거 활동, 당원 교육 등에 사용됩니다. 후원금 사용 내역은 중앙선거관리위원회에 보고되며, 당 홈페이지를 통해 투명하게 공개됩니다.',
  },
  {
    question: '세액공제 혜택은 어떻게 받나요?',
    answer: '정치자금 기부금은 10만원까지 전액(100/110) 세액공제를 받을 수 있고, 10만원 초과분에 대해서는 15%(3천만원 초과 시 25%) 세액공제를 받을 수 있습니다. 연말정산 시 자동으로 반영되며, 기부금 영수증은 국세청 홈택스에서 확인 가능합니다.',
  },
  {
    question: '후원 한도가 있나요?',
    answer: '정치자금법에 따라 개인은 연간 2천만원까지 후원할 수 있습니다. 법인 및 단체는 후원이 불가능하며, 외국인도 후원할 수 없습니다.',
  },
  {
    question: '정기후원을 변경하거나 해지하려면?',
    answer: '당원 포털에서 직접 변경 또는 해지할 수 있습니다. 고객센터(02-xxxx-xxxx)로 연락하셔도 됩니다.',
  },
  {
    question: '후원 영수증은 어떻게 받나요?',
    answer: '후원 완료 후 등록하신 이메일로 영수증이 발송됩니다. 또한 국세청 홈택스 연말정산간소화 서비스에서도 확인 가능합니다.',
  },
];

export default function DonatePage() {
  const [donationType, setDonationType] = useState<'once' | 'monthly'>('once');
  const [selectedAmount, setSelectedAmount] = useState<number>(30000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const actualAmount = selectedAmount === 0 ? parseInt(customAmount) || 0 : selectedAmount;

  // 세액공제 계산
  const calculateTaxCredit = (amount: number) => {
    if (amount <= 0) return 0;
    if (amount <= 100000) {
      return Math.floor(amount * 100 / 110);
    } else {
      const base = Math.floor(100000 * 100 / 110);
      const excess = amount - 100000;
      return base + Math.floor(excess * 0.15);
    }
  };

  const taxCredit = calculateTaxCredit(actualAmount);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">후원하기</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            여러분의 후원이 새로운 정치를 만듭니다.<br />
            행복사회당과 함께 모두가 행복한 사회를 만들어 주세요.
          </p>
        </div>
      </section>

      {/* Why Donate */}
      <section className="py-16 bg-[var(--gray-50)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">왜 후원해야 하나요?</h2>
            <p className="text-[var(--gray-600)] max-w-2xl mx-auto">
              행복사회당은 대기업이나 기득권의 후원 없이 시민의 힘으로 운영됩니다.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="bordered" className="text-center bg-white">
              <div className="w-14 h-14 bg-[var(--primary-light)] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-[var(--primary)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2">시민 중심 정치</h3>
              <CardContent>
                <p className="text-[var(--gray-600)] text-sm">
                  시민의 후원으로 운영되는 정당만이 시민을 위한 정치를 할 수 있습니다.
                </p>
              </CardContent>
            </Card>
            <Card variant="bordered" className="text-center bg-white">
              <div className="w-14 h-14 bg-[var(--primary-light)] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-[var(--primary)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2">정책 실현</h3>
              <CardContent>
                <p className="text-[var(--gray-600)] text-sm">
                  후원금은 협력사회, 불평등 해소 등 핵심 정책 연구와 실현에 사용됩니다.
                </p>
              </CardContent>
            </Card>
            <Card variant="bordered" className="text-center bg-white">
              <div className="w-14 h-14 bg-[var(--primary-light)] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-[var(--primary)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2">새로운 정치</h3>
              <CardContent>
                <p className="text-[var(--gray-600)] text-sm">
                  기존 정치를 바꾸는 새로운 진보정치의 출발점이 됩니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <Card variant="bordered" padding="lg">
                <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-6">후원 신청</h2>

                {/* Donation Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-3">
                    후원 유형
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDonationType('once')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        donationType === 'once'
                          ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                          : 'border-[var(--gray-200)] hover:border-[var(--gray-300)]'
                      }`}
                    >
                      <Gift className={`w-6 h-6 mx-auto mb-2 ${
                        donationType === 'once' ? 'text-[var(--primary)]' : 'text-[var(--gray-400)]'
                      }`} />
                      <div className={`font-medium ${
                        donationType === 'once' ? 'text-[var(--primary)]' : 'text-[var(--gray-700)]'
                      }`}>일시 후원</div>
                      <div className="text-xs text-[var(--gray-500)] mt-1">한 번 후원</div>
                    </button>
                    <button
                      onClick={() => setDonationType('monthly')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        donationType === 'monthly'
                          ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                          : 'border-[var(--gray-200)] hover:border-[var(--gray-300)]'
                      }`}
                    >
                      <Heart className={`w-6 h-6 mx-auto mb-2 ${
                        donationType === 'monthly' ? 'text-[var(--primary)]' : 'text-[var(--gray-400)]'
                      }`} />
                      <div className={`font-medium ${
                        donationType === 'monthly' ? 'text-[var(--primary)]' : 'text-[var(--gray-700)]'
                      }`}>정기 후원</div>
                      <div className="text-xs text-[var(--gray-500)] mt-1">매월 자동 후원</div>
                    </button>
                  </div>
                </div>

                {/* Amount Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-3">
                    후원 금액
                  </label>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {donationAmounts.map((amount) => (
                      <button
                        key={amount.value}
                        onClick={() => {
                          setSelectedAmount(amount.value);
                          if (amount.value !== 0) setCustomAmount('');
                        }}
                        className={`p-3 rounded-xl border-2 font-medium transition-all ${
                          selectedAmount === amount.value
                            ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                            : 'border-[var(--gray-200)] hover:border-[var(--gray-300)] text-[var(--gray-700)]'
                        }`}
                      >
                        {amount.label}
                      </button>
                    ))}
                  </div>
                  {selectedAmount === 0 && (
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="금액을 입력하세요"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="pr-12"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--gray-500)]">
                        원
                      </span>
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-[var(--gray-700)] mb-3">
                    결제 방법
                  </label>
                  <div className="space-y-3">
                    {donationMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <label
                          key={method.id}
                          className="flex items-center gap-4 p-4 rounded-xl border border-[var(--gray-200)] hover:border-[var(--primary)] cursor-pointer transition-colors"
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            defaultChecked={method.id === 'card'}
                            className="w-4 h-4 text-[var(--primary)]"
                          />
                          <Icon className="w-5 h-5 text-[var(--gray-500)]" />
                          <div>
                            <div className="font-medium text-[var(--gray-900)]">{method.title}</div>
                            <div className="text-sm text-[var(--gray-500)]">{method.description}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Button */}
                <Button variant="primary" size="lg" className="w-full">
                  {actualAmount > 0
                    ? `${actualAmount.toLocaleString()}원 ${donationType === 'monthly' ? '정기 ' : ''}후원하기`
                    : '후원하기'
                  }
                </Button>

                <p className="text-xs text-[var(--gray-500)] text-center mt-4">
                  후원 시 <Link href="/privacy" className="underline">개인정보처리방침</Link>에 동의하게 됩니다.
                </p>
              </Card>
            </div>

            {/* Summary */}
            <div className="lg:col-span-2">
              {/* Tax Credit Calculator */}
              <Card variant="bordered" className="mb-6 bg-[var(--primary-light)]">
                <div className="flex items-center gap-3 mb-4">
                  <Calculator className="w-5 h-5 text-[var(--primary)]" />
                  <h3 className="font-bold text-[var(--gray-900)]">세액공제 혜택</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[var(--gray-600)]">후원 금액</span>
                    <span className="font-medium text-[var(--gray-900)]">
                      {actualAmount.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--gray-600)]">예상 세액공제</span>
                    <span className="font-bold text-[var(--primary)]">
                      {taxCredit.toLocaleString()}원
                    </span>
                  </div>
                  <hr className="border-[var(--primary)]/20" />
                  <div className="flex justify-between">
                    <span className="text-[var(--gray-600)]">실질 부담금</span>
                    <span className="font-bold text-[var(--gray-900)]">
                      {(actualAmount - taxCredit).toLocaleString()}원
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[var(--gray-500)] mt-4">
                  * 10만원까지 전액(100/110), 초과분 15% 공제
                </p>
              </Card>

              {/* Benefits */}
              <Card variant="bordered">
                <div className="flex items-center gap-3 mb-4">
                  <Receipt className="w-5 h-5 text-[var(--primary)]" />
                  <h3 className="font-bold text-[var(--gray-900)]">후원 혜택</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--gray-600)]">
                      연말정산 시 세액공제 혜택
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--gray-600)]">
                      당 주요 행사 우선 초대
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--gray-600)]">
                      정기 뉴스레터 발송
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--gray-600)]">
                      후원자 전용 간담회 참여
                    </span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Bank Transfer Info */}
      <section className="py-12 bg-[var(--gray-50)]">
        <div className="max-w-4xl mx-auto px-4">
          <Card variant="bordered" className="bg-white">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-5 h-5 text-[var(--primary)]" />
              <h3 className="font-bold text-[var(--gray-900)]">무통장 입금 안내</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-[var(--gray-600)] mb-2">입금 계좌</p>
                <p className="font-medium text-[var(--gray-900)]">국민은행 000-000-00000</p>
                <p className="text-sm text-[var(--gray-500)]">예금주: 행복사회당</p>
              </div>
              <div>
                <p className="text-sm text-[var(--gray-600)] mb-2">입금자명</p>
                <p className="text-sm text-[var(--gray-700)]">
                  입금 시 <strong>성명</strong>을 입금자명으로 기재해 주세요.<br />
                  영수증 발급을 위해 연락처를 남겨주시면 감사하겠습니다.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-8 text-center">
            자주 묻는 질문
          </h2>
          <div className="space-y-3">
            {faqData.map((faq, index) => (
              <Card
                key={index}
                variant="bordered"
                padding="none"
                className="overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--gray-50)] transition-colors"
                >
                  <span className="font-medium text-[var(--gray-900)]">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-[var(--gray-400)]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[var(--gray-400)]" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-[var(--gray-600)] text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--primary)] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            함께 만들어가는 새로운 정치
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            후원뿐 아니라 당원이 되어 직접 정책 결정에 참여해 보세요.
          </p>
          <Link href="/join">
            <Button variant="secondary" size="lg">
              입당 신청하기
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

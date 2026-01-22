import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { UserPlus, Heart, Users, MessageSquare, Calendar, Megaphone } from 'lucide-react';

const participationOptions = [
  {
    title: '입당 안내',
    description: '행복사회당의 당원이 되어 함께 정치에 참여하세요. 당비 납부 방법과 당원의 권리와 의무를 안내합니다.',
    href: '/join',
    icon: UserPlus,
    color: 'bg-[var(--primary-light)] text-[var(--primary)]',
    cta: '입당 신청하기',
  },
  {
    title: '후원 안내',
    description: '정치 후원금으로 행복사회당의 활동을 지원해 주세요. 후원금은 세액공제 혜택을 받을 수 있습니다.',
    href: '/donate',
    icon: Heart,
    color: 'bg-red-100 text-red-600',
    cta: '후원하기',
  },
  {
    title: '커뮤니티',
    description: '지역별, 상임위원회별 커뮤니티에서 다른 당원들과 소통하고 정책을 함께 논의하세요.',
    href: '/community',
    icon: Users,
    color: 'bg-blue-100 text-blue-600',
    cta: '커뮤니티 참여',
  },
];

const activities = [
  {
    icon: MessageSquare,
    title: '정책 토론',
    description: '온라인 커뮤니티에서 정책 제안과 토론에 참여할 수 있습니다.',
  },
  {
    icon: Calendar,
    title: '당원 모임',
    description: '지역별 정기 모임과 전국 행사에 참여할 수 있습니다.',
  },
  {
    icon: Megaphone,
    title: '선거 캠페인',
    description: '선거 기간 자원봉사와 캠페인 활동에 참여할 수 있습니다.',
  },
];

export default function ParticipatePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--primary)] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">참여</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            행복사회당과 함께 더 나은 사회를 만들어 가세요.
            다양한 방법으로 참여하실 수 있습니다.
          </p>
        </div>
      </section>

      {/* Participation Options */}
      <section className="py-16 bg-[var(--gray-50)]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--gray-900)] text-center mb-10">
            참여 방법
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {participationOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card
                  key={option.href}
                  variant="bordered"
                  className="h-full bg-white hover:shadow-[var(--shadow-lg)] transition-all"
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${option.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--gray-900)] mb-3">
                    {option.title}
                  </h3>
                  <p className="text-[var(--gray-600)] mb-6 flex-grow">
                    {option.description}
                  </p>
                  <Link
                    href={option.href}
                    className="inline-block w-full text-center bg-[var(--primary)] text-white px-6 py-3 rounded-[var(--radius-md)] font-semibold hover:bg-[var(--primary-dark)] transition-colors"
                  >
                    {option.cta}
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--gray-900)] text-center mb-4">
            당원 활동
          </h2>
          <p className="text-[var(--gray-600)] text-center mb-10 max-w-2xl mx-auto">
            당원이 되시면 다양한 활동에 참여하실 수 있습니다.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.title} className="text-center">
                  <div className="w-16 h-16 bg-[var(--primary-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[var(--primary)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2">
                    {activity.title}
                  </h3>
                  <p className="text-[var(--gray-600)]">{activity.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-[var(--gray-50)]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--gray-900)] text-center mb-10">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            <Card variant="bordered" className="bg-white">
              <h3 className="font-bold text-[var(--gray-900)] mb-2">
                당원 가입 자격은 어떻게 되나요?
              </h3>
              <p className="text-[var(--gray-600)]">
                대한민국 국민이면 누구나 가입할 수 있습니다. 단, 다른 정당의 당원인 경우 중복 가입이 불가합니다.
              </p>
            </Card>
            <Card variant="bordered" className="bg-white">
              <h3 className="font-bold text-[var(--gray-900)] mb-2">
                당비는 얼마인가요?
              </h3>
              <p className="text-[var(--gray-600)]">
                월 당비는 10,000원이며, 연간 납부 시 100,000원입니다. 당비는 정치자금법에 따라 세액공제 혜택을 받을 수 있습니다.
              </p>
            </Card>
            <Card variant="bordered" className="bg-white">
              <h3 className="font-bold text-[var(--gray-900)] mb-2">
                후원금도 세액공제가 되나요?
              </h3>
              <p className="text-[var(--gray-600)]">
                네, 정당 후원금은 10만원까지 전액 세액공제되며, 10만원 초과분에 대해서는 15%(3천만원 초과분 25%) 세액공제됩니다.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[var(--primary)] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            지금 바로 참여하세요
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            여러분의 한 표, 한 목소리가 세상을 바꿉니다.
            행복사회당과 함께 더 나은 내일을 만들어 가요.
          </p>
          <Link
            href="/join"
            className="inline-block bg-white text-[var(--primary)] px-8 py-4 rounded-[var(--radius-md)] font-semibold hover:bg-[var(--gray-100)] transition-colors"
          >
            입당 신청하기
          </Link>
        </div>
      </section>
    </div>
  );
}

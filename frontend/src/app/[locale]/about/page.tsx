import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Eye, History, Building2, FileText, Target } from 'lucide-react';

const sections = [
  {
    title: '비전과 가치',
    description: '1등이 아니어도 행복한 나라, 부자가 아니어도 존엄한 나라를 향한 우리의 비전',
    href: '/about/vision',
    icon: Eye,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: '강령',
    description: '행복사회당이 추구하는 핵심 가치와 정책 방향',
    href: '/about/platform',
    icon: Target,
    color: 'bg-green-100 text-green-600',
  },
  {
    title: '역사',
    description: '행복사회당의 창당 배경과 걸어온 길',
    href: '/about/history',
    icon: History,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: '조직도',
    description: '당의 조직 구조와 주요 기관 안내',
    href: '/about/organization',
    icon: Building2,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    title: '당헌당규',
    description: '당의 운영 원칙과 규정',
    href: '/about/constitution',
    icon: FileText,
    color: 'bg-red-100 text-red-600',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--primary)] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">당 소개</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            행복사회당은 모든 시민이 존엄하게 살아갈 수 있는 사회를 만들기 위해
            함께 노력하는 정당입니다.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-[var(--gray-50)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link key={section.href} href={section.href}>
                  <Card
                    variant="bordered"
                    className="h-full bg-white hover:shadow-[var(--shadow-lg)] hover:border-[var(--primary)] transition-all cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${section.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">
                      {section.title}
                    </h3>
                    <p className="text-[var(--gray-600)]">{section.description}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">
            함께 행복한 사회를 만들어가요
          </h2>
          <p className="text-[var(--gray-600)] mb-8 max-w-2xl mx-auto">
            행복사회당은 시민 여러분의 참여로 더 강해집니다.
            지금 바로 함께해 주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/join"
              className="inline-block px-8 py-4 rounded-[var(--radius-md)] font-semibold hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#1F6F6B', color: '#ffffff' }}
            >
              입당 신청하기
            </Link>
            <Link
              href="/donate"
              className="inline-block border-2 px-8 py-4 rounded-[var(--radius-md)] font-semibold hover:opacity-90 transition-colors"
              style={{ borderColor: '#1F6F6B', color: '#1F6F6B' }}
            >
              후원하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

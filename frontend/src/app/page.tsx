import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Handshake,
  Scale,
  HardHat,
  HeartPulse,
  Vote,
  Bot,
} from 'lucide-react';

// 아이콘 매핑
const policyIcons: Record<number, React.ReactNode> = {
  1: <Handshake className="w-10 h-10 text-[var(--primary)]" />,
  2: <Scale className="w-10 h-10 text-[var(--primary)]" />,
  3: <HardHat className="w-10 h-10 text-[var(--primary)]" />,
  4: <HeartPulse className="w-10 h-10 text-[var(--primary)]" />,
  5: <Vote className="w-10 h-10 text-[var(--primary)]" />,
  6: <Bot className="w-10 h-10 text-[var(--primary)]" />,
};

// 최신 소식 더미 데이터
const latestNews = [
  {
    id: 1,
    category: '보도자료',
    title: '행복사회당, 창당 기자회견 개최',
    date: '2026-01-15',
    excerpt: '행복사회당은 "1등이 아니어도 행복한 나라, 부자가 아니어도 존엄한 나라"를 비전으로 창당을 선언하였습니다.',
  },
  {
    id: 2,
    category: '성명서',
    title: 'AI 시대, 모든 시민을 위한 기술 정책 발표',
    date: '2026-01-12',
    excerpt: '기술 발전의 혜택이 모든 시민에게 공평하게 돌아가도록 하는 정책 방향을 발표합니다.',
  },
  {
    id: 3,
    category: '보도자료',
    title: '전국 시도당 창당준비위원회 발족',
    date: '2026-01-10',
    excerpt: '전국 17개 시도에서 창당준비위원회가 발족하여 지역 조직 구축에 나섭니다.',
  },
];

// 주요 정책 - 7대 강령 기반
const policies = [
  {
    id: 1,
    title: '협력사회',
    description: '무한 경쟁 대신 협력과 연대의 가치가 존중받는 사회를 만듭니다.',
  },
  {
    id: 2,
    title: '불평등 해소',
    description: '자산과 소득의 불평등을 해소하고 누구나 존엄한 삶을 보장합니다.',
  },
  {
    id: 3,
    title: '노동 존중',
    description: '일하는 사람이 정당한 대우를 받고 안전하게 일할 수 있게 합니다.',
  },
  {
    id: 4,
    title: '공공성 강화',
    description: '의료, 교육, 주거, 돌봄의 공공성을 강화하여 기본권을 보장합니다.',
  },
  {
    id: 5,
    title: '민주주의 확장',
    description: '정치를 넘어 경제와 일상에서도 민주주의를 실현합니다.',
  },
  {
    id: 6,
    title: 'AI 시대 대응',
    description: 'AI와 기술 발전이 사람을 위해 작동하고 혜택이 공평하게 나눠지도록 합니다.',
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              1등이 아니어도 행복한 나라<br />
              <span className="text-[var(--secondary)]">부자가 아니어도 존엄한 나라</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-4">
              기술과 미래가 사람을 위해 작동하는 나라
            </p>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-10">
              행복사회당은 경쟁이 아닌 협력을, 성장이 아닌 행복을, 효율이 아닌 존엄을 앞세웁니다.
              새로운 진보정치의 길을 함께 열어주세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join">
                <Button variant="secondary" size="lg">
                  입당하기
                </Button>
              </Link>
              <Link href="/about/vision">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  창당선언문 보기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[var(--primary-light)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--primary)]">50,000+</div>
              <div className="text-[var(--gray-600)] mt-1">당원 수</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--primary)]">17</div>
              <div className="text-[var(--gray-600)] mt-1">시도당</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--primary)]">200+</div>
              <div className="text-[var(--gray-600)] mt-1">지역 커뮤니티</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--primary)]">15</div>
              <div className="text-[var(--gray-600)] mt-1">상임위원회</div>
            </div>
          </div>
        </div>
      </section>

      {/* Policies Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--gray-900)] mb-4">
              핵심 가치와 정책
            </h2>
            <p className="text-[var(--gray-600)] max-w-2xl mx-auto">
              행복사회당은 모든 시민의 행복과 존엄을 위한 7대 강령을 제시합니다.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy) => (
              <Card key={policy.id} variant="bordered" className="hover:shadow-[var(--shadow-lg)] transition-shadow">
                <div className="w-14 h-14 bg-[var(--primary-light)] rounded-xl flex items-center justify-center mb-4">
                  {policyIcons[policy.id]}
                </div>
                <h3 className="text-xl font-semibold text-[var(--gray-900)] mb-2">
                  {policy.title}
                </h3>
                <CardContent>
                  <p className="text-[var(--gray-600)]">{policy.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/about/platform">
              <Button variant="outline">강령 전문 보기</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="bg-[var(--gray-50)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--gray-900)] mb-4">
              최신 소식
            </h2>
            <p className="text-[var(--gray-600)] max-w-2xl mx-auto">
              행복사회당의 활동과 소식을 확인하세요.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {latestNews.map((news) => (
              <Card key={news.id} variant="default" className="bg-white hover:shadow-[var(--shadow-lg)] transition-shadow">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-sm font-medium text-[var(--primary)] bg-[var(--primary-light)] rounded-full">
                    {news.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-2 line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-[var(--gray-600)] text-sm mb-4 line-clamp-2">
                  {news.excerpt}
                </p>
                <div className="text-sm text-[var(--gray-400)]">{news.date}</div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/news/press">
              <Button variant="outline">모든 소식 보기</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[var(--primary)] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            새로운 진보정치의 길을 함께 열어주세요
          </h2>
          <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
            행복사회당은 시민과 함께 만들어갑니다.
            당원이 되시면 지역 및 정책 커뮤니티에서 직접 참여할 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join">
              <Button variant="secondary" size="lg">
                입당 신청하기
              </Button>
            </Link>
            <Link href="/donate">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                후원하기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  LayoutGrid,
  Briefcase,
  HeartPulse,
  GraduationCap,
  Leaf,
  Bot,
  Vote,
  Home,
  Handshake,
  Scale,
  HardHat,
  Hospital,
  Users,
  BookOpen,
  Globe,
  Zap,
  Cpu,
  ShieldCheck,
  Landmark,
  Building2,
  type LucideIcon,
} from 'lucide-react';

// 카테고리 아이콘 컴포넌트
const CategoryIcon = ({ icon: Icon, isActive }: { icon: LucideIcon; isActive: boolean }) => (
  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[var(--gray-500)]'}`} />
);

// 정책 카테고리
const categories = [
  { id: 'all', name: '전체', icon: LayoutGrid },
  { id: 'economy', name: '경제·노동', icon: Briefcase },
  { id: 'welfare', name: '복지·돌봄', icon: HeartPulse },
  { id: 'education', name: '교육', icon: GraduationCap },
  { id: 'environment', name: '환경·에너지', icon: Leaf },
  { id: 'technology', name: '기술·AI', icon: Bot },
  { id: 'democracy', name: '민주주의', icon: Vote },
  { id: 'housing', name: '주거', icon: Home },
];

// 정책별 아이콘 매핑
const policyIconMap: Record<string, LucideIcon> = {
  'cooperative-economy': Handshake,
  'inequality-reduction': Scale,
  'labor-respect': HardHat,
  'public-healthcare': Hospital,
  'care-society': Users,
  'equal-education': BookOpen,
  'climate-action': Globe,
  'green-energy': Zap,
  'ai-governance': Cpu,
  'digital-rights': ShieldCheck,
  'economic-democracy': Landmark,
  'participatory-democracy': Vote,
  'housing-stability': Building2,
};

// 정책 데이터 (향후 DB에서 가져올 예정)
const policiesData = [
  {
    id: 'cooperative-economy',
    category: 'economy',
    title: '협력경제 실현',
    summary: '무한 경쟁 대신 협력과 연대의 가치가 존중받는 경제 체제를 만듭니다.',
    keyPoints: [
      '협동조합 및 사회적경제 기업 육성',
      '상생협력 중심의 산업생태계 구축',
      '지역순환경제 활성화',
    ],
    status: 'active',
  },
  {
    id: 'inequality-reduction',
    category: 'economy',
    title: '불평등 해소',
    summary: '자산과 소득의 불평등을 해소하고 누구나 존엄한 삶을 보장합니다.',
    keyPoints: [
      '누진적 자산세 및 상속세 강화',
      '최저임금 현실화 및 생활임금 확대',
      '기본소득 단계적 도입',
    ],
    status: 'active',
  },
  {
    id: 'labor-respect',
    category: 'economy',
    title: '노동 존중',
    summary: '일하는 사람이 정당한 대우를 받고 안전하게 일할 수 있게 합니다.',
    keyPoints: [
      '노동시간 단축 및 워라밸 보장',
      '산업안전 강화 및 중대재해 근절',
      '플랫폼 노동자 권리 보장',
    ],
    status: 'active',
  },
  {
    id: 'public-healthcare',
    category: 'welfare',
    title: '공공의료 강화',
    summary: '의료의 공공성을 강화하여 모든 시민이 건강권을 누립니다.',
    keyPoints: [
      '공공병원 확충 및 의료 공공성 강화',
      '건강보험 보장성 확대',
      '지역의료 격차 해소',
    ],
    status: 'active',
  },
  {
    id: 'care-society',
    category: 'welfare',
    title: '돌봄사회 구현',
    summary: '아동, 노인, 장애인 돌봄의 사회적 책임을 강화합니다.',
    keyPoints: [
      '국공립 어린이집 확대',
      '노인돌봄 공공서비스 강화',
      '장애인 자립생활 지원 확대',
    ],
    status: 'active',
  },
  {
    id: 'equal-education',
    category: 'education',
    title: '평등한 교육',
    summary: '모든 아이에게 평등한 교육 기회를 보장합니다.',
    keyPoints: [
      '무상교육 확대 및 교육비 부담 해소',
      '공교육 정상화 및 사교육비 경감',
      '입시경쟁 완화 및 다양한 진로 보장',
    ],
    status: 'active',
  },
  {
    id: 'climate-action',
    category: 'environment',
    title: '기후위기 대응',
    summary: '탄소중립을 실현하고 지속가능한 미래를 만듭니다.',
    keyPoints: [
      '2035년 재생에너지 50% 목표',
      '정의로운 전환 지원',
      '그린뉴딜 일자리 100만개 창출',
    ],
    status: 'active',
  },
  {
    id: 'green-energy',
    category: 'environment',
    title: '에너지 전환',
    summary: '화석연료에서 벗어나 재생에너지 중심의 에너지 체계로 전환합니다.',
    keyPoints: [
      '탈석탄·탈핵 에너지 정책 추진',
      '재생에너지 발전 확대',
      '에너지 자립 마을 조성',
    ],
    status: 'active',
  },
  {
    id: 'ai-governance',
    category: 'technology',
    title: 'AI 시대 대응',
    summary: 'AI와 기술 발전이 사람을 위해 작동하고 혜택이 공평하게 나눠지도록 합니다.',
    keyPoints: [
      'AI 윤리 가이드라인 법제화',
      'AI 일자리 대체 대응 정책',
      '디지털 격차 해소',
    ],
    status: 'active',
  },
  {
    id: 'digital-rights',
    category: 'technology',
    title: '디지털 권리 보장',
    summary: '디지털 시대의 새로운 시민권을 확립합니다.',
    keyPoints: [
      '개인정보 자기결정권 강화',
      '플랫폼 기업 규제 및 공정경쟁',
      '디지털 리터러시 교육 확대',
    ],
    status: 'active',
  },
  {
    id: 'economic-democracy',
    category: 'democracy',
    title: '경제민주주의',
    summary: '기업과 경제에서도 민주주의를 실현합니다.',
    keyPoints: [
      '노동이사제 및 공동결정제 도입',
      '재벌개혁 및 경제력 집중 해소',
      '중소기업·소상공인 보호 강화',
    ],
    status: 'active',
  },
  {
    id: 'participatory-democracy',
    category: 'democracy',
    title: '참여민주주의',
    summary: '시민의 일상적인 정치 참여를 보장합니다.',
    keyPoints: [
      '국민발안·국민투표 제도 활성화',
      '참여예산제 확대',
      '지방분권 강화',
    ],
    status: 'active',
  },
  {
    id: 'housing-stability',
    category: 'housing',
    title: '주거안정 실현',
    summary: '모든 시민의 주거권을 보장하고 집값 안정을 실현합니다.',
    keyPoints: [
      '공공임대주택 100만호 확대',
      '투기억제 및 실수요자 보호',
      '전월세 상한제 강화',
    ],
    status: 'active',
  },
];

export default function PoliciesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPolicies = useMemo(() => {
    return policiesData.filter((policy) => {
      const matchesCategory = selectedCategory === 'all' || policy.category === selectedCategory;
      const matchesSearch = searchQuery === '' ||
        policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.keyPoints.some(point => point.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--primary)] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">정책</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            행복사회당은 모든 시민의 행복과 존엄을 위한 정책을 제시합니다.
            경쟁이 아닌 협력, 성장이 아닌 행복, 효율이 아닌 존엄을 위한 정책입니다.
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="bg-[var(--gray-50)] py-8 border-b border-[var(--gray-200)]">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <Input
              type="text"
              placeholder="정책 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedCategory === category.id
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-white text-[var(--gray-600)] hover:bg-[var(--gray-100)] border border-[var(--gray-200)]'
                  }
                `}
              >
                <CategoryIcon icon={category.icon} isActive={selectedCategory === category.id} />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Policies Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {filteredPolicies.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[var(--gray-500)] text-lg">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-[var(--gray-600)]">
                총 <span className="font-semibold text-[var(--primary)]">{filteredPolicies.length}</span>개의 정책
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPolicies.map((policy) => {
                  const PolicyIcon = policyIconMap[policy.id] || LayoutGrid;
                  return (
                    <Link key={policy.id} href={`/policies/${policy.id}`}>
                      <Card
                        variant="bordered"
                        className="h-full hover:shadow-[var(--shadow-lg)] hover:border-[var(--primary)] transition-all cursor-pointer"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-14 h-14 bg-[var(--primary-light)] rounded-xl flex items-center justify-center flex-shrink-0">
                            <PolicyIcon className="w-7 h-7 text-[var(--primary)]" />
                          </div>
                          <div className="flex-1">
                            <span className="inline-block px-2 py-1 text-xs font-medium text-[var(--primary)] bg-[var(--primary-light)] rounded-full mb-2">
                              {getCategoryName(policy.category)}
                            </span>
                            <h3 className="text-xl font-bold text-[var(--gray-900)]">
                              {policy.title}
                            </h3>
                          </div>
                        </div>
                        <CardContent>
                          <p className="text-[var(--gray-600)] mb-4">{policy.summary}</p>
                          <ul className="space-y-2">
                            {policy.keyPoints.slice(0, 3).map((point, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-[var(--gray-500)]">
                                <span className="text-[var(--primary)] mt-0.5">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <div className="mt-4 pt-4 border-t border-[var(--gray-100)]">
                          <span className="text-[var(--primary)] text-sm font-medium">
                            자세히 보기 →
                          </span>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[var(--primary-light)] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--gray-900)] mb-4">
            정책에 대한 의견을 나눠주세요
          </h2>
          <p className="text-[var(--gray-600)] mb-8 max-w-2xl mx-auto">
            행복사회당은 당원들의 의견을 바탕으로 정책을 발전시켜 나갑니다.
            커뮤니티에서 정책 토론에 참여해 주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/community">
              <Button variant="primary">정책 토론 참여하기</Button>
            </Link>
            <Link href="/join">
              <Button variant="outline">입당 신청하기</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

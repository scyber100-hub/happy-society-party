import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Home,
  Stethoscope,
  GraduationCap,
  Baby,
  Briefcase,
  Sprout,
  Vote,
  Bot,
  Shield,
  TrendingDown,
  Building,
  Users,
  Cpu,
  Leaf,
  AlertTriangle,
  Heart,
} from 'lucide-react';

// 현대 사회의 핵심 문제 인식
const problemRecognitions = [
  {
    number: 1,
    title: '무한경쟁 사회와 삶의 붕괴',
    items: [
      '교육, 노동, 주거, 인간관계 전반이 경쟁 중심 구조로 설계되어 있다.',
      '패배는 개인의 실패로 전가되고, 사회는 책임을 회피한다.',
      '청년·노동자·노년 모두가 만성적 불안과 소진 상태에 놓여 있다.',
    ],
    icon: AlertTriangle,
  },
  {
    number: 2,
    title: '불평등의 고착화와 세습 사회',
    items: [
      '자산 격차는 노력으로 극복할 수 없는 수준에 이르렀다.',
      '출발선의 차이가 삶의 경로를 고정시키고 있다.',
      '부는 세습되고, 가난도 대물림된다.',
    ],
    icon: TrendingDown,
  },
  {
    number: 3,
    title: '노동의 가치 하락과 불안정한 생계',
    items: [
      '일해도 가난한 사회, 정규직과 비정규직의 구조적 분리.',
      '플랫폼·프리랜서 노동은 보호받지 못한다.',
      '노동은 존엄이 아니라 소모품이 되고 있다.',
    ],
    icon: Briefcase,
  },
  {
    number: 4,
    title: '삶을 지탱하지 못하는 공공 시스템',
    items: [
      '주거, 의료, 돌봄, 교육이 시장에 과도하게 맡겨져 있다.',
      '개인의 위기는 곧 생존의 위기로 직결된다.',
      '국가는 위험을 예방하기보다 사후 대응에 머문다.',
    ],
    icon: Building,
  },
  {
    number: 5,
    title: '민주주의의 형식화와 시민의 소외',
    items: [
      '정치는 삶을 바꾸지 못한다는 냉소가 확산되고 있다.',
      '시민의 참여는 선거에만 한정되고, 일상적 민주주의는 실종되었다.',
    ],
    icon: Users,
  },
  {
    number: 6,
    title: 'AI 기술 발전이 초래하는 새로운 불평등',
    description:
      '인공지능과 자동화 기술은 인류의 삶을 풍요롭게 만들 잠재력을 지니고 있다. 그러나 현재의 AI 발전은 소수 기업과 자본에 집중되어 있으며, 그 이익은 공정하게 분배되지 않고 있다.',
    items: [
      'AI는 노동을 대체하지만, 그 책임은 노동자에게 전가된다.',
      '알고리즘은 중립적인 것처럼 보이나 차별과 편견을 재생산한다.',
      '시민은 데이터의 주체가 아니라 수집의 대상이 되고 있다.',
    ],
    conclusion: 'AI는 공공의 도구가 아니라, 새로운 불평등의 장치가 될 위험에 놓여 있다.',
    icon: Cpu,
  },
  {
    number: 7,
    title: '기후위기와 생존의 위기',
    description:
      '기후위기는 더 이상 미래의 문제가 아니다. 폭염, 홍수, 가뭄, 생태계 붕괴는 이미 우리의 일상이 되었다. 그러나 그 책임은 대기업과 산업 구조가 아니라 개인의 절약과 인내로 전가되고 있다.',
    items: [
      '환경 파괴는 반복되고, 토건 개발은 멈추지 않는다.',
      '기후위기의 피해는 가난한 사람과 지역에 집중된다.',
      '다음 세대는 선택권 없이 위기를 떠안고 있다.',
    ],
    conclusion: '기후위기는 환경 문제가 아니라 사회적 불평등과 정의의 문제다.',
    icon: Leaf,
  },
];

// 핵심 정책 방향
const policyDirections = [
  {
    number: 1,
    title: '경쟁 없는 기본 삶 보장',
    policies: [
      '보편적 기본소득 또는 기본생활보장제 단계적 도입',
      '생존을 경쟁에서 분리하여 실패해도 무너지지 않는 사회 구축',
      '실업·질병·노령 상태에서도 존엄한 삶 보장',
    ],
    icon: Shield,
  },
  {
    number: 2,
    title: '노동 존엄 사회로의 전환',
    policies: [
      '동일노동 동일임금 원칙 법제화',
      '비정규직 남용 제한 및 플랫폼 노동자 노동자성 인정',
      '주 4.5일제 → 주 4일제 단계적 추진',
      '노동시간 단축을 통한 삶의 회복',
    ],
    icon: Briefcase,
  },
  {
    number: 3,
    title: '부의 불평등 해소',
    policies: [
      '초고자산가·초과이윤 누진 과세 강화',
      '부동산 불로소득 환수',
      '상속·증여 과세 정상화',
      '공공자산을 통한 사회적 부 축적',
    ],
    icon: TrendingDown,
  },
  {
    number: 4,
    title: '주거·의료·돌봄의 국가 책임',
    policies: [
      '공공주택 대폭 확대: 집은 투자수단이 아닌 주거권',
      '건강보험 보장성 강화, 의료 민영화 반대',
      '국가책임 돌봄 시스템 구축(영유아·장애·노인)',
    ],
    icon: Home,
  },
  {
    number: 5,
    title: '교육 경쟁 완화와 삶 중심 교육',
    policies: [
      '대학서열 완화 및 지역 균형 교육',
      '입시 경쟁 완화와 공교육 정상화',
      '협력·시민성·노동 교육 강화',
    ],
    icon: GraduationCap,
  },
  {
    number: 6,
    title: '생활 민주주의 확대',
    policies: [
      '주민참여예산 및 숙의 민주주의 제도 확대',
      '지방정부 권한 강화',
      '정당–시민 상시 소통 구조 구축',
    ],
    icon: Vote,
  },
];

// AI 시대 정책
const aiPolicies = [
  {
    title: 'AI 공공 통제 원칙 확립',
    policies: [
      '공공 영역 AI 투명성·책임성 의무화',
      '알고리즘 차별 금지 법제화',
      '설명 가능한 AI 원칙 도입',
    ],
  },
  {
    title: 'AI 전환에 따른 노동 보호',
    policies: [
      '자동화로 대체되는 노동에 대한 국가 책임',
      '전환 교육·재훈련 국가 보장',
      '자동화 이익의 사회적 환수',
    ],
  },
  {
    title: '데이터 주권과 시민 권리',
    policies: [
      '개인정보는 기업의 자산이 아닌 시민의 권리',
      '공공 데이터의 민주적 관리',
      '감시 기술 남용 금지',
    ],
  },
  {
    title: 'AI 공공 활용 확대',
    policies: [
      '돌봄·의료·안전·환경 분야 공공 AI 활용',
      '효율이 아닌 삶의 질 개선 중심 활용',
    ],
  },
];

// 기후위기 정책
const climatePolicies = [
  {
    title: '기후위기 국가책임 선언',
    policies: ['탄소 감축 목표 법적 구속력 강화', '정부 감축 실패 책임 명문화'],
  },
  {
    title: '개발 중심 정책 전환',
    policies: [
      '대규모 토건·난개발 전면 재검토',
      '생태 보전 우선 원칙 확립',
      '주민 동의 없는 개발 제한',
    ],
  },
  {
    title: '에너지 전환의 공공성',
    policies: [
      '재생에너지 공공 투자 확대',
      '에너지 요금 공공 통제 강화',
      '에너지 빈곤층 보호',
    ],
  },
  {
    title: '정의로운 전환 보장',
    policies: [
      '전환으로 피해받는 노동자·지역 지원',
      '실업·소득 손실 국가 보장',
      '녹색 공공일자리 창출',
    ],
  },
];

// 정책 방향 개요
const policyOverview = [
  {
    icon: Home,
    title: '주거',
    description: '모든 사람이 안정된 집에서 살 권리',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: Stethoscope,
    title: '의료',
    description: '아플 때 돈 걱정 없이 치료받을 권리',
    color: 'bg-red-100 text-red-600',
  },
  {
    icon: GraduationCap,
    title: '교육',
    description: '가정형편에 관계없이 배울 권리',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Baby,
    title: '돌봄',
    description: '아이와 노인이 돌봄받을 권리',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    icon: Briefcase,
    title: '노동',
    description: '일하는 사람이 존중받을 권리',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: Sprout,
    title: '환경',
    description: '깨끗한 환경에서 살 권리',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Vote,
    title: '민주주의',
    description: '내 삶에 영향을 미치는 결정에 참여할 권리',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Bot,
    title: '기술',
    description: '기술 발전의 혜택을 누릴 권리',
    color: 'bg-cyan-100 text-cyan-600',
  },
];

// 우리가 만들 나라의 모습
const futureVisions = [
  '실패해도 다시 일어설 수 있는 사회',
  '일하지 못해도 인간으로 존중받는 사회',
  '부자가 아니어도 문화와 휴식을 누릴 수 있는 사회',
  '정치가 삶의 문제를 해결하는 사회',
];

export default function PlatformPage() {
  return (
    <div className="py-16">
      {/* Hero */}
      <section className="bg-[var(--primary)] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">강령</h1>
          <p className="text-xl text-white/90">
            새로운 진보정당이 추구하는 가치와 정책 방향
          </p>
        </div>
      </section>

      {/* 강령 선언 */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">Ⅰ. 강령 선언</h2>
          <div className="w-20 h-1 bg-[var(--primary)] mx-auto"></div>
        </div>
        <div className="prose prose-lg max-w-none text-[var(--gray-700)] space-y-6">
          <p className="text-xl font-semibold text-[var(--primary)] text-center">
            우리는 믿는다.
          </p>
          <p className="text-center">
            사람의 가치는 순위로 매겨질 수 없으며,<br />
            행복은 소수의 부와 경쟁의 승자에게만 주어져서는 안 된다.
          </p>
          <p>
            대한민국은 세계적인 경제 성과를 이뤄냈지만, 그 이면에서 과도한 경쟁, 불평등, 불안정한 삶은 일상이 되었다.
            1등이 아니면 실패자가 되고, 부자가 아니면 존엄한 삶을 누릴 수 없다는 사회는 정의롭지 않다.
          </p>
          <div className="bg-[var(--primary-light)] rounded-[var(--radius-xl)] p-8 text-center">
            <p className="text-xl font-semibold text-[var(--primary)]">
              우리는 &ldquo;1등이 아니어도 행복한 나라, 부자가 아니어도 존엄한 나라&rdquo;를 만들기 위해<br />
              사람의 삶을 중심에 두는 새로운 진보정치를 시작한다.
            </p>
          </div>
        </div>
      </section>

      {/* 현대 사회의 핵심 문제 인식 */}
      <section className="bg-[var(--gray-50)] py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">
              Ⅱ. 현대 사회의 핵심 문제 인식
            </h2>
            <div className="w-20 h-1 bg-[var(--primary)] mx-auto"></div>
          </div>
          <div className="space-y-6">
            {problemRecognitions.map((problem) => {
              const Icon = problem.icon;
              return (
                <Card key={problem.number} variant="default" className="bg-white overflow-hidden">
                  <div className="flex items-center gap-4 border-b border-[var(--gray-200)] p-6">
                    <div className="w-12 h-12 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                      {problem.number}
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-[var(--primary)]" />
                      <h3 className="text-xl font-bold text-[var(--gray-900)]">{problem.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    {problem.description && (
                      <p className="text-[var(--gray-700)] mb-4">{problem.description}</p>
                    )}
                    <ul className="space-y-2">
                      {problem.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[var(--gray-600)]">
                          <span className="text-[var(--primary)] mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    {problem.conclusion && (
                      <p className="mt-4 font-semibold text-[var(--primary)] bg-[var(--primary-light)] p-4 rounded-[var(--radius-md)]">
                        {problem.conclusion}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 해결을 위한 핵심 원칙 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">
              Ⅲ. 해결을 위한 핵심 원칙
            </h2>
            <div className="w-20 h-1 bg-[var(--primary)] mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { num: 1, title: '경쟁보다 존엄', desc: '모든 정책의 기준은 효율이 아니라 사람의 삶이다.' },
              { num: 2, title: '성장보다 분배', desc: '성장은 수단이며, 공정한 분배와 삶의 안정이 목적이다.' },
              { num: 3, title: '시장보다 공공', desc: '삶의 필수 영역은 국가와 공동체가 책임진다.' },
              { num: 4, title: '시혜가 아닌 권리', desc: '복지는 선택이 아닌 시민의 기본권이다.' },
              { num: 5, title: '참여하는 민주주의', desc: '시민은 소비자가 아니라 주권자다.' },
              { num: 6, title: '기술은 통제되어야 한다', desc: '기술은 중립이 아니며, 민주적 통제가 필요하다.' },
              {
                num: 7,
                title: '전환의 책임은 사회 전체에 있다',
                desc: 'AI 전환과 기후 전환의 비용을 개인에게 떠넘기지 않는다.',
              },
            ].map((principle) => (
              <div
                key={principle.num}
                className="bg-white border border-[var(--gray-200)] rounded-[var(--radius-lg)] p-6 hover:border-[var(--primary)] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {principle.num}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--gray-900)] mb-1">{principle.title}</h3>
                    <p className="text-[var(--gray-600)] text-sm">{principle.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Directions Overview */}
      <section className="bg-[var(--gray-50)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">
              Ⅳ. 핵심 정책 방향
            </h2>
            <div className="w-20 h-1 bg-[var(--primary)] mx-auto mb-8"></div>
            <p className="text-[var(--gray-600)] text-lg">
              행복사회당은 모든 시민의 기본권을 보장하기 위한 정책 방향을 제시합니다.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {policyOverview.map((direction) => {
              const Icon = direction.icon;
              return (
                <div
                  key={direction.title}
                  className="bg-white rounded-[var(--radius-lg)] p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 ${direction.color}`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-[var(--gray-900)] mb-2">{direction.title}</h3>
                  <p className="text-sm text-[var(--gray-600)]">{direction.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6대 핵심 정책 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-4">6대 핵심 정책</h2>
            <div className="w-20 h-1 bg-[var(--primary)] mx-auto"></div>
          </div>
          <div className="space-y-6">
            {policyDirections.map((section) => {
              const Icon = section.icon;
              return (
                <Card key={section.number} variant="default" className="bg-white overflow-hidden">
                  <div className="flex items-center gap-4 border-b border-[var(--gray-200)] p-6">
                    <div className="w-12 h-12 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                      {section.number}
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-[var(--primary)]" />
                      <h3 className="text-xl font-bold text-[var(--gray-900)]">{section.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <ul className="space-y-2">
                      {section.policies.map((policy, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[var(--gray-600)]">
                          <span className="text-[var(--primary)] mt-1">•</span>
                          {policy}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI 시대의 인간 존엄 보장 */}
      <section className="bg-[var(--primary)] text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bot className="w-10 h-10" />
              <h2 className="text-3xl font-bold">7. AI 시대의 인간 존엄 보장</h2>
            </div>
            <div className="w-20 h-1 bg-white mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {aiPolicies.map((section, index) => (
              <div
                key={index}
                className="bg-white/10 rounded-[var(--radius-lg)] p-6 backdrop-blur-sm"
              >
                <h3 className="font-bold text-lg mb-4">
                  {['①', '②', '③', '④'][index]} {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.policies.map((policy, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-white/90">
                      <span className="text-white mt-1">•</span>
                      {policy}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 기후위기 대응과 정의로운 전환 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Leaf className="w-10 h-10 text-green-600" />
              <h2 className="text-3xl font-bold text-[var(--gray-900)]">
                8. 기후위기 대응과 정의로운 전환
              </h2>
            </div>
            <div className="w-20 h-1 bg-green-600 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {climatePolicies.map((section, index) => (
              <div
                key={index}
                className="bg-green-50 border border-green-200 rounded-[var(--radius-lg)] p-6"
              >
                <h3 className="font-bold text-lg text-green-800 mb-4">
                  {['①', '②', '③', '④'][index]} {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.policies.map((policy, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-green-700">
                      <span className="text-green-600 mt-1">•</span>
                      {policy}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 우리가 만들 나라의 모습 */}
      <section className="bg-[var(--gray-50)] py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">
              Ⅴ. 우리가 만들 나라의 모습
            </h2>
            <div className="w-20 h-1 bg-[var(--primary)] mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {futureVisions.map((vision, index) => (
              <div
                key={index}
                className="bg-white border border-[var(--gray-200)] rounded-[var(--radius-lg)] p-6 flex items-center gap-4"
              >
                <Heart className="w-8 h-8 text-[var(--primary)] flex-shrink-0" />
                <p className="text-[var(--gray-700)]">{vision}</p>
              </div>
            ))}
          </div>
          <div className="bg-[var(--primary-light)] rounded-[var(--radius-xl)] p-8 space-y-4 text-center">
            <p className="text-[var(--gray-700)]">
              우리가 만들고자 하는 나라는 기술이 인간을 대체하는 나라가 아니라{' '}
              <strong className="text-[var(--primary)]">기술이 인간의 삶을 지지하는 나라</strong>다.
            </p>
            <p className="text-[var(--gray-700)]">
              기후위기를 방관하는 나라가 아니라{' '}
              <strong className="text-[var(--primary)]">다음 세대의 생존을 책임지는 나라</strong>다.
            </p>
            <p className="text-lg font-semibold text-[var(--primary)] pt-4">
              우리는 경쟁에서 이긴 소수가 아니라<br />
              함께 살아가는 다수의 삶을 위한 정치를 선택한다.
            </p>
          </div>
        </div>
      </section>

      {/* 맺음말 */}
      <section className="bg-[var(--primary)] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ⅵ. 맺음말</h2>
          <div className="space-y-6 text-lg">
            <p>우리는 더 이상 묻지 않는다.</p>
            <p className="text-xl">&ldquo;누가 1등인가?&rdquo;</p>
            <p>대신 묻는다.</p>
            <p className="text-2xl font-bold">&ldquo;모두가 괜찮은가?&rdquo;</p>
            <div className="pt-8">
              <p className="text-white/90">
                이 질문에 끝까지 책임지는 정당,<br />
                그것이 우리가 만들 새로운 진보정당이다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-6">함께 만들어가는 정책</h2>
          <p className="text-lg text-[var(--gray-600)] mb-8 leading-relaxed">
            행복사회당의 정책은 시민과 함께 만들어갑니다.<br />
            당원으로 참여하여 정책 논의에 직접 참여해 주세요.
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
              href="/policies"
              className="inline-block border-2 px-8 py-4 rounded-[var(--radius-md)] font-semibold hover:opacity-90 transition-colors"
              style={{ borderColor: '#1F6F6B', color: '#1F6F6B' }}
            >
              세부 정책 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

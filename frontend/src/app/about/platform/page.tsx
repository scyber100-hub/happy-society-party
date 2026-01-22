import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Home, Stethoscope, GraduationCap, Baby, Briefcase, Sprout, Vote, Bot } from 'lucide-react';

const platformSections = [
  {
    number: 1,
    title: '경쟁사회를 넘어 협력사회로',
    content: `대한민국은 치열한 경쟁 속에서 성장해왔습니다. 그러나 무한 경쟁은 승자독식의 사회를 만들었고,
    패자에게는 기회조차 주어지지 않습니다. 행복사회당은 경쟁이 아닌 협력의 가치를 앞세웁니다.
    서로 돕고 함께 성장하는 사회, 실패해도 다시 일어설 수 있는 사회를 만들겠습니다.`,
    policies: [
      '협동조합과 사회적기업 육성',
      '지역 공동체 활성화 지원',
      '상생형 경제 모델 구축',
    ],
  },
  {
    number: 2,
    title: '불평등 해소, 존엄한 삶의 보장',
    content: `자산과 소득의 불평등이 심화되면서 계층 이동의 사다리가 무너지고 있습니다.
    부의 대물림과 빈곤의 대물림이 고착화되고 있습니다. 행복사회당은 불평등을 해소하고,
    누구나 인간다운 삶을 살 수 있는 기본권을 보장하겠습니다.`,
    policies: [
      '기본소득 도입 검토',
      '자산불평등 해소를 위한 세제 개편',
      '최저임금 현실화',
      '상속세제 강화',
    ],
  },
  {
    number: 3,
    title: '노동이 존중받는 사회',
    content: `일하는 사람들이 정당한 대우를 받지 못하고 있습니다. 비정규직 차별, 산업재해,
    장시간 노동이 일상화되었습니다. 행복사회당은 노동자의 권리를 보장하고,
    안전하고 건강하게 일할 수 있는 환경을 만들겠습니다.`,
    policies: [
      '비정규직 차별 철폐',
      '중대재해 예방 강화',
      '주 4일제 단계적 도입',
      '플랫폼 노동자 권리 보장',
    ],
  },
  {
    number: 4,
    title: '공공성 강화: 의료, 교육, 주거, 돌봄',
    content: `의료, 교육, 주거, 돌봄은 시장에 맡겨서는 안 됩니다. 공공성이 약화되면서
    돈이 없으면 아프지도, 배우지도, 살지도 못하는 사회가 되었습니다.
    행복사회당은 이 네 가지 기본권의 공공성을 강화하여 모든 시민이 누릴 수 있도록 하겠습니다.`,
    policies: [
      '건강보험 보장성 90% 달성',
      '공교육 정상화 및 교육비 부담 경감',
      '공공임대주택 100만 호 확대',
      '국공립 어린이집 확충',
      '노인 돌봄 공공 인프라 확대',
    ],
  },
  {
    number: 5,
    title: '민주주의의 확장',
    content: `정치 민주주의만으로는 부족합니다. 경제 영역과 일상에서도 민주주의가 실현되어야 합니다.
    기업 내 민주주의, 지역 민주주의, 생활 민주주의를 통해 시민이 삶의 주인이 되는 사회를 만들겠습니다.`,
    policies: [
      '노동이사제 확대',
      '주민참여예산제 강화',
      '직접민주주의 확대 (국민발안제)',
      '지방분권 강화',
    ],
  },
  {
    number: 6,
    title: 'AI 시대, 사람을 위한 기술',
    content: `인공지능과 자동화가 빠르게 확산되고 있습니다. 기술 발전의 혜택이 모든 사람에게
    공평하게 돌아가야 합니다. 기술로 인한 일자리 감소에 대비하고, AI가 인간의 존엄성을
    해치지 않도록 규제와 지원 체계를 마련하겠습니다.`,
    policies: [
      'AI 윤리 가이드라인 법제화',
      '디지털 전환 피해 노동자 지원',
      '로봇세 도입 검토',
      'AI 공공 인프라 구축',
    ],
  },
  {
    number: 7,
    title: '기후위기 대응, 지속가능한 미래',
    content: `기후위기는 더 이상 미래의 문제가 아닙니다. 폭염, 홍수, 산불 등 기후재난이
    일상이 되고 있습니다. 행복사회당은 탄소중립 사회로의 전환을 주도하고,
    녹색 일자리 창출과 정의로운 전환을 실현하겠습니다.`,
    policies: [
      '2050 탄소중립 이행',
      '녹색 일자리 100만 개 창출',
      '재생에너지 비중 대폭 확대',
      '기후정의 기금 설치',
    ],
  },
];

const policyDirections = [
  { icon: Home, title: '주거', description: '모든 사람이 안정된 집에서 살 권리', color: 'bg-orange-100 text-orange-600' },
  { icon: Stethoscope, title: '의료', description: '아플 때 돈 걱정 없이 치료받을 권리', color: 'bg-red-100 text-red-600' },
  { icon: GraduationCap, title: '교육', description: '가정형편에 관계없이 배울 권리', color: 'bg-blue-100 text-blue-600' },
  { icon: Baby, title: '돌봄', description: '아이와 노인이 돌봄받을 권리', color: 'bg-pink-100 text-pink-600' },
  { icon: Briefcase, title: '노동', description: '일하는 사람이 존중받을 권리', color: 'bg-amber-100 text-amber-600' },
  { icon: Sprout, title: '환경', description: '깨끗한 환경에서 살 권리', color: 'bg-green-100 text-green-600' },
  { icon: Vote, title: '민주주의', description: '내 삶에 영향을 미치는 결정에 참여할 권리', color: 'bg-purple-100 text-purple-600' },
  { icon: Bot, title: '기술', description: '기술 발전의 혜택을 누릴 권리', color: 'bg-cyan-100 text-cyan-600' },
];

export default function PlatformPage() {
  return (
    <div className="py-16">
      {/* Hero */}
      <section className="bg-[var(--primary)] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">강령</h1>
          <p className="text-xl text-white/90">
            행복사회당이 추구하는 정책 방향과 가치를 담은 강령입니다.
          </p>
        </div>
      </section>

      {/* Policy Directions Overview */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">8대 정책 방향</h2>
          <div className="w-20 h-1 bg-[var(--primary)] mx-auto mb-8"></div>
          <p className="text-[var(--gray-600)] text-lg">
            행복사회당은 모든 시민의 기본권을 보장하기 위한 8가지 정책 방향을 제시합니다.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {policyDirections.map((direction) => {
            const Icon = direction.icon;
            return (
              <div
                key={direction.title}
                className="bg-white rounded-[var(--radius-lg)] p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 ${direction.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-[var(--gray-900)] mb-2">{direction.title}</h3>
                <p className="text-sm text-[var(--gray-600)]">{direction.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform Sections */}
      <section className="bg-[var(--gray-50)] py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">7대 강령</h2>
            <div className="w-20 h-1 bg-[var(--primary)] mx-auto"></div>
          </div>
          <div className="space-y-8">
            {platformSections.map((section) => (
              <Card key={section.number} variant="default" className="bg-white overflow-hidden">
                <div className="flex items-center gap-4 border-b border-[var(--gray-200)] p-6">
                  <div className="w-12 h-12 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                    {section.number}
                  </div>
                  <h3 className="text-xl font-bold text-[var(--gray-900)]">{section.title}</h3>
                </div>
                <CardContent className="p-6">
                  <p className="text-[var(--gray-700)] leading-relaxed mb-6">
                    {section.content}
                  </p>
                  <div className="bg-[var(--gray-50)] rounded-[var(--radius-md)] p-4">
                    <h4 className="font-semibold text-[var(--gray-900)] mb-3">주요 정책</h4>
                    <ul className="space-y-2">
                      {section.policies.map((policy, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[var(--gray-600)]">
                          <span className="text-[var(--primary)] mt-1">•</span>
                          {policy}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
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
              className="inline-block bg-[var(--primary)] text-white px-8 py-4 rounded-[var(--radius-md)] font-semibold hover:bg-[var(--primary-dark)] transition-colors"
            >
              입당 신청하기
            </Link>
            <Link
              href="/policies"
              className="inline-block border-2 border-[var(--primary)] text-[var(--primary)] px-8 py-4 rounded-[var(--radius-md)] font-semibold hover:bg-[var(--primary-light)] transition-colors"
            >
              세부 정책 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Card, CardContent } from '@/components/ui/Card';
import {
  Handshake,
  Scale,
  HardHat,
  HeartPulse,
  Vote,
  Bot,
  type LucideIcon,
} from 'lucide-react';

const corePromises: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: '경쟁사회를 넘어',
    description: '무한 경쟁 대신 협력과 연대의 가치가 존중받는 사회를 만듭니다.',
    icon: Handshake,
  },
  {
    title: '불평등 해소',
    description: '자산과 소득의 불평등을 해소하고 누구나 존엄한 삶을 살 수 있도록 합니다.',
    icon: Scale,
  },
  {
    title: '노동 존중',
    description: '일하는 사람이 정당한 대우를 받고, 안전하게 일할 수 있는 사회를 만듭니다.',
    icon: HardHat,
  },
  {
    title: '공공성 강화',
    description: '의료, 교육, 주거, 돌봄의 공공성을 강화하여 모든 시민이 기본권을 누립니다.',
    icon: HeartPulse,
  },
  {
    title: '민주주의 확장',
    description: '정치 민주주의를 넘어 경제 민주주의, 일상의 민주주의를 실현합니다.',
    icon: Vote,
  },
  {
    title: '기술과 미래',
    description: 'AI와 기술 발전이 사람을 위해 작동하고, 그 혜택이 공평하게 나눠지도록 합니다.',
    icon: Bot,
  },
];

export default function VisionPage() {
  return (
    <div className="py-16">
      {/* Hero */}
      <section className="bg-[var(--primary)] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">창당선언문</h1>
          <p className="text-xl text-white/90">
            행복사회당이 추구하는 비전과 가치를 소개합니다.
          </p>
        </div>
      </section>

      {/* Main Vision */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">우리의 비전</h2>
          <div className="w-20 h-1 bg-[var(--primary)] mx-auto mb-8"></div>
        </div>
        <div className="bg-[var(--primary-light)] rounded-[var(--radius-xl)] p-8 md:p-12 text-center">
          <p className="text-2xl md:text-3xl font-semibold text-[var(--primary)] leading-relaxed">
            &ldquo;1등이 아니어도 행복한 나라,<br />
            부자가 아니어도 존엄한 나라&rdquo;
          </p>
          <p className="text-lg text-[var(--primary-dark)] mt-4 opacity-80">
            기술과 미래가 사람을 위해 작동하는 나라
          </p>
        </div>
      </section>

      {/* Declaration */}
      <section className="bg-[var(--gray-50)] py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">창당선언</h2>
            <div className="w-20 h-1 bg-[var(--primary)] mx-auto"></div>
          </div>
          <div className="prose prose-lg max-w-none text-[var(--gray-700)] space-y-6">
            <p>
              우리는 오늘, 새로운 정치를 위해 모였습니다.
            </p>
            <p>
              대한민국은 눈부신 경제 성장을 이루었지만, 그 이면에는 깊은 그늘이 드리워져 있습니다.
              무한 경쟁 속에서 사람들은 지쳐가고, 불평등은 심화되고 있습니다.
              1등이 아니면 낙오자가 되고, 부자가 아니면 존엄을 지키기 어려운 사회가 되었습니다.
            </p>
            <p>
              기존 정치는 이 문제를 해결하지 못했습니다. 진보와 보수를 막론하고
              기득권의 이해에 매몰되어 시민의 삶을 외면했습니다.
              정치가 희망이 아닌 냉소의 대상이 된 것은 우연이 아닙니다.
            </p>
            <p>
              행복사회당은 이러한 현실에 맞서 새로운 진보정치를 시작합니다.
              우리는 경쟁이 아닌 협력을, 성장이 아닌 행복을, 효율이 아닌 존엄을 앞세웁니다.
            </p>
            <p className="font-semibold text-[var(--primary)]">
              모든 사람이 1등이 아니어도 행복하게 살 수 있는 나라,
              부자가 아니어도 존엄하게 살 수 있는 나라,
              그것이 우리가 만들어갈 대한민국입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Core Promises */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">핵심 약속</h2>
            <div className="w-20 h-1 bg-[var(--primary)] mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {corePromises.map((promise) => {
              const IconComponent = promise.icon;
              return (
                <Card key={promise.title} variant="default" className="bg-white text-center">
                  <div className="w-16 h-16 bg-[var(--primary-light)] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-[var(--primary)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--gray-900)] mb-3">{promise.title}</h3>
                  <CardContent>
                    <p className="text-[var(--gray-600)]">{promise.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[var(--primary)] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">함께 만들어갈 새로운 정치</h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            행복사회당은 시민과 함께 새로운 진보정치의 길을 열어갑니다.<br />
            더 나은 대한민국을 위한 여정에 함께해 주세요.
          </p>
          <a
            href="/join"
            className="inline-block bg-white text-[var(--primary)] px-8 py-4 rounded-[var(--radius-md)] font-semibold hover:bg-white/90 transition-colors"
          >
            입당 신청하기
          </a>
        </div>
      </section>
    </div>
  );
}

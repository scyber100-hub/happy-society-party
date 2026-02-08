import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Handshake,
  Scale,
  HardHat,
  HeartPulse,
  Vote,
  Bot,
  Leaf,
  type LucideIcon,
} from 'lucide-react';

const corePromises: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: '경쟁보다 존엄',
    description: '모든 정책의 기준은 효율이 아니라 사람의 삶입니다.',
    icon: Handshake,
  },
  {
    title: '성장보다 분배',
    description: '성장은 수단이며, 공정한 분배와 삶의 안정이 목적입니다.',
    icon: Scale,
  },
  {
    title: '시장보다 공공',
    description: '삶의 필수 영역은 국가와 공동체가 책임집니다.',
    icon: HeartPulse,
  },
  {
    title: '시혜가 아닌 권리',
    description: '복지는 선택이 아닌 시민의 기본권입니다.',
    icon: HardHat,
  },
  {
    title: '참여하는 민주주의',
    description: '시민은 소비자가 아니라 주권자입니다.',
    icon: Vote,
  },
  {
    title: '기술은 통제되어야 한다',
    description: '기술은 중립이 아니며, 민주적 통제가 필요합니다.',
    icon: Bot,
  },
  {
    title: '전환의 책임은 사회 전체에',
    description: 'AI 전환과 기후 전환의 비용을 개인에게 떠넘기지 않습니다.',
    icon: Leaf,
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
            1등이 아니어도 행복한 나라, 부자가 아니어도 존엄한 나라
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
            그리고 기술과 미래가 사람을 위해 작동하는 나라를 향하여
          </p>
        </div>
      </section>

      {/* Declaration - Introduction */}
      <section className="bg-[var(--gray-50)] py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">창당선언</h2>
            <div className="w-20 h-1 bg-[var(--primary)] mx-auto"></div>
          </div>
          <div className="prose prose-lg max-w-none text-[var(--gray-700)] space-y-6">
            <p className="text-xl font-semibold text-[var(--primary)] text-center">
              우리는 오늘, 새로운 선택을 선언한다.
            </p>
            <p>
              대한민국은 눈부신 성장을 이뤘지만, 그 성장의 속도만큼 사람들의 삶은 불안해졌다.
              경쟁은 일상이 되었고, 실패는 개인의 책임이 되었다.
              1등이 아니면 낙오자가 되고, 부자가 아니면 존엄한 삶을 상상하기 어려운 사회가 되었다.
            </p>
            <p className="font-semibold text-[var(--gray-900)]">
              우리는 묻는다. 이것이 과연 우리가 원했던 발전이었는가.
            </p>
          </div>
        </div>
      </section>

      {/* Declaration Sections */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-16">
          {/* Section 1 */}
          <div>
            <h3 className="text-2xl font-bold text-[var(--gray-900)] mb-6 pb-3 border-b-2 border-[var(--primary)]">
              경쟁 사회를 넘어 존엄 사회로
            </h3>
            <div className="prose prose-lg max-w-none text-[var(--gray-700)] space-y-4">
              <p>
                학교에서, 일터에서, 주거와 노후 앞에서 사람들은 끊임없이 비교되고 탈락을 두려워한다.
                아이들은 순위로 불리고, 청년은 미래를 저당 잡히며, 노동자는 언제든 대체 가능한 존재가 된다.
              </p>
              <p>
                정치는 이 현실을 바꾸기보다 &ldquo;어쩔 수 없다&rdquo;는 말로 정당화해 왔다.
              </p>
              <p className="font-semibold text-[var(--primary)]">
                우리는 이 체념의 정치를 끝내고자 한다.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="text-2xl font-bold text-[var(--gray-900)] mb-6 pb-3 border-b-2 border-[var(--primary)]">
              기술은 발전했지만, 삶은 나아졌는가
            </h3>
            <div className="prose prose-lg max-w-none text-[var(--gray-700)] space-y-4">
              <p>
                인공지능과 자동화 기술은 우리 사회에 새로운 가능성을 열고 있다.
                그러나 그 기술은 지금, 사람의 삶을 풍요롭게 하기보다 노동을 대체하고 불안을 키우는 방향으로 사용되고 있다.
              </p>
              <p>
                AI는 소수 기업의 이익이 되었고, 데이터는 시민의 권리가 아니라 수집의 대상이 되었다.
                기술 발전의 혜택은 집중되고, 그 비용과 위험은 개인에게 전가되고 있다.
              </p>
              <p className="font-semibold text-[var(--primary)]">
                우리는 선언한다. 기술은 중립적이지 않으며, 민주적 통제 없이 방치된 기술은 또 하나의 불평등이 될 뿐이다.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="text-2xl font-bold text-[var(--gray-900)] mb-6 pb-3 border-b-2 border-[var(--primary)]">
              기후위기, 더 이상 미룰 수 없는 생존의 문제
            </h3>
            <div className="prose prose-lg max-w-none text-[var(--gray-700)] space-y-4">
              <p>
                기후위기는 미래의 경고가 아니라 이미 시작된 현실이다.
                폭염과 홍수, 가뭄과 생태계 붕괴는 가장 약한 사람들과 지역부터 위협하고 있다.
              </p>
              <p>
                그럼에도 책임은 개인의 절약과 인내로 전가되고, 환경을 파괴하는 개발은 반복되고 있다.
                다음 세대는 선택권 없이 위기를 떠안고 있다.
              </p>
              <p className="font-semibold text-[var(--primary)]">
                기후위기는 환경 문제가 아니라 정의와 생존의 문제다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Declaration */}
      <section className="bg-[var(--primary)] text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">우리는 분명히 선언한다</h2>
            <div className="w-20 h-1 bg-white mx-auto"></div>
          </div>
          <div className="text-center space-y-6 text-lg">
            <p>사람의 가치는 성적표나 통장 잔고로 결정되지 않는다.</p>
            <p>행복은 경쟁에서 이긴 소수에게만 허락된 보상이 아니다.</p>
            <div className="bg-white/10 rounded-[var(--radius-xl)] p-8 mt-8">
              <p className="text-xl font-semibold leading-relaxed">
                1등이 아니어도 행복할 권리,<br />
                부자가 아니어도 존엄하게 살 권리,<br />
                기술과 환경으로부터 안전하게 살아갈 권리는<br />
                <span className="text-2xl">모든 시민의 기본권이다.</span>
              </p>
            </div>
            <p className="text-white/90 mt-6">
              우리는 경쟁에서 이긴 소수가 아니라, 함께 살아가는 다수의 삶을 위한 정치를 시작한다.
            </p>
          </div>
        </div>
      </section>

      {/* New Progressive Politics Promises */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">새로운 진보정치의 약속</h2>
            <div className="w-20 h-1 bg-[var(--primary)] mx-auto mb-8"></div>
            <p className="text-[var(--gray-600)] text-lg">우리는 다음을 분명히 약속한다.</p>
          </div>
          <div className="bg-[var(--gray-50)] rounded-[var(--radius-xl)] p-8">
            <ul className="space-y-4 text-lg text-[var(--gray-700)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] font-bold text-xl">•</span>
                <span>성장을 위해 삶을 희생시키지 않겠다.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] font-bold text-xl">•</span>
                <span>기술을 자본의 도구가 아닌 공공의 자산으로 만들겠다.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] font-bold text-xl">•</span>
                <span>기후위기의 책임을 개인에게 떠넘기지 않겠다.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] font-bold text-xl">•</span>
                <span>실패해도 다시 일어설 수 있는 사회를 만들겠다.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] font-bold text-xl">•</span>
                <span>정치가 삶의 문제를 해결하는 도구가 되게 하겠다.</span>
              </li>
            </ul>
          </div>
          <div className="mt-8 grid md:grid-cols-2 gap-4 text-center">
            <div className="bg-white border border-[var(--gray-200)] rounded-[var(--radius-lg)] p-6">
              <p className="text-[var(--gray-700)]"><strong className="text-[var(--primary)]">복지</strong>는 시혜가 아니라 <strong>권리</strong>이며,</p>
            </div>
            <div className="bg-white border border-[var(--gray-200)] rounded-[var(--radius-lg)] p-6">
              <p className="text-[var(--gray-700)]"><strong className="text-[var(--primary)]">노동</strong>은 비용이 아니라 <strong>존엄</strong>이고,</p>
            </div>
            <div className="bg-white border border-[var(--gray-200)] rounded-[var(--radius-lg)] p-6">
              <p className="text-[var(--gray-700)]"><strong className="text-[var(--primary)]">기술</strong>은 통제되어야 할 <strong>공공의 수단</strong>이며,</p>
            </div>
            <div className="bg-white border border-[var(--gray-200)] rounded-[var(--radius-lg)] p-6">
              <p className="text-[var(--gray-700)]"><strong className="text-[var(--primary)]">국가</strong>는 시장의 조력자가 아니라 <strong>삶의 안전망</strong>이어야 한다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="bg-[var(--gray-50)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">핵심 원칙</h2>
            <div className="w-20 h-1 bg-[var(--primary)] mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {corePromises.map((promise) => {
              const IconComponent = promise.icon;
              return (
                <Card key={promise.title} variant="default" className="bg-white text-center">
                  <div className="w-16 h-16 bg-[var(--primary-light)] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-[var(--primary)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--gray-900)] mb-3">{promise.title}</h3>
                  <CardContent>
                    <p className="text-[var(--gray-600)] text-sm">{promise.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Country We Want to Build */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">우리가 만들고자 하는 나라</h2>
            <div className="w-20 h-1 bg-[var(--primary)] mx-auto"></div>
          </div>
          <div className="space-y-6 text-lg text-[var(--gray-700)]">
            <p>
              우리가 만들고자 하는 나라는 기술이 사람을 밀어내는 나라가 아니라, <strong className="text-[var(--primary)]">사람을 돕는 나라</strong>다.
            </p>
            <p>
              기후위기를 방관하는 나라가 아니라, <strong className="text-[var(--primary)]">다음 세대의 생존을 책임지는 나라</strong>다.
            </p>
            <p>
              경쟁에서 밀려나도 삶이 무너지지 않고, 일하지 못하는 순간에도 인간으로 존중받으며,
              어디에 살아도 존엄한 삶이 가능한 나라다.
            </p>
          </div>
        </div>
      </section>

      {/* Final Declaration */}
      <section className="bg-[var(--primary)] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">오늘, 우리는 시작한다</h2>
          <div className="space-y-4 text-lg text-white/90 mb-8">
            <p>오늘 우리는</p>
            <p><strong>침묵보다 연대</strong>를,</p>
            <p><strong>체념보다 책임</strong>을,</p>
            <p><strong>경쟁보다 존엄</strong>을 선택한다.</p>
          </div>
          <div className="bg-white/10 rounded-[var(--radius-xl)] p-8 mb-8">
            <p className="text-xl leading-relaxed">
              1등이 아니어도 행복한 나라,<br />
              부자가 아니어도 존엄한 나라,<br />
              기술과 미래가 사람을 위해 작동하는 나라를 향해<br />
              우리는 이 자리에서<br />
              <span className="text-2xl font-bold">행복사회당의 창당을 선언한다.</span>
            </p>
          </div>
          <div className="space-y-4 text-white/90 mb-8">
            <p>이 정당은</p>
            <p>사람의 편에 서는 정치,</p>
            <p>삶을 지키는 정치,</p>
            <p>미래를 책임지는 정치를</p>
            <p className="font-semibold text-white">끝까지 포기하지 않을 것이다.</p>
          </div>
          <p className="text-2xl font-bold">오늘, 여기서부터 시작한다.</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-6">함께 만들어갈 새로운 정치</h2>
          <p className="text-xl text-[var(--gray-600)] mb-8 leading-relaxed">
            행복사회당은 시민과 함께 새로운 진보정치의 길을 열어갑니다.<br />
            더 나은 대한민국을 위한 여정에 함께해 주세요.
          </p>
          <Link
            href="/join"
            className="inline-block px-8 py-4 rounded-[var(--radius-md)] font-semibold hover:opacity-90 transition-colors"
            style={{ backgroundColor: '#1F6F6B', color: '#ffffff' }}
          >
            입당 신청하기
          </Link>
        </div>
      </section>
    </div>
  );
}

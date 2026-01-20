import { Card, CardContent } from '@/components/ui/Card';
import { BookOpen, Users, Building, Scale, FileText, type LucideIcon } from 'lucide-react';

const chapters: { title: string; icon: LucideIcon; articles: { title: string; content: string }[] }[] = [
  {
    title: '제1장 총칙',
    icon: BookOpen,
    articles: [
      {
        title: '제1조 (명칭)',
        content: '본 당의 명칭은 "행복사회당"이라 한다.',
      },
      {
        title: '제2조 (목적)',
        content: '본 당은 자유민주주의와 사회정의를 기반으로 모든 국민이 행복한 사회를 건설하는 것을 목적으로 한다.',
      },
      {
        title: '제3조 (소재지)',
        content: '본 당의 중앙당 소재지는 서울특별시에 둔다.',
      },
      {
        title: '제4조 (기본이념)',
        content: '본 당은 경쟁보다 협력을, 성장보다 행복을, 효율보다 존엄을 앞세우며, 모든 시민이 인간다운 삶을 영위할 수 있는 사회를 지향한다.',
      },
    ],
  },
  {
    title: '제2장 당원',
    icon: Users,
    articles: [
      {
        title: '제5조 (당원의 자격)',
        content: '대한민국 국민으로서 본 당의 강령과 정책에 동의하는 만 18세 이상의 사람은 당원이 될 수 있다.',
      },
      {
        title: '제6조 (입당)',
        content: '당원이 되고자 하는 사람은 소정의 입당원서를 제출하고 당비를 납부하여야 한다.',
      },
      {
        title: '제7조 (당원의 권리)',
        content: '당원은 당의 각종 회의에 참여하고, 의견을 개진하며, 당내 선거에서 선거권 및 피선거권을 가진다.',
      },
      {
        title: '제8조 (당원의 의무)',
        content: '당원은 당헌·당규를 준수하고, 당의 결정에 따르며, 소정의 당비를 납부하여야 한다.',
      },
    ],
  },
  {
    title: '제3장 조직',
    icon: Building,
    articles: [
      {
        title: '제9조 (조직체계)',
        content: '본 당은 중앙당과 시·도당, 지역위원회로 조직한다.',
      },
      {
        title: '제10조 (전국당원대회)',
        content: '전국당원대회는 본 당의 최고의결기관으로서 당헌·당규의 제정 및 개정, 당 대표의 선출 등 주요 사항을 의결한다.',
      },
      {
        title: '제11조 (최고위원회)',
        content: '최고위원회는 당 대표와 최고위원으로 구성하며, 당의 주요 정책과 운영에 관한 사항을 심의·의결한다.',
      },
      {
        title: '제12조 (상임위원회)',
        content: '본 당은 정책 분야별로 상임위원회를 두어 전문적인 정책 개발과 당 활동을 수행한다.',
      },
    ],
  },
  {
    title: '제4장 재정',
    icon: Scale,
    articles: [
      {
        title: '제13조 (재정)',
        content: '본 당의 재정은 당비, 후원금, 국고보조금 및 기타 수입으로 충당한다.',
      },
      {
        title: '제14조 (회계)',
        content: '본 당의 회계연도는 매년 1월 1일부터 12월 31일까지로 하며, 모든 재정은 관련 법령에 따라 투명하게 운영한다.',
      },
    ],
  },
  {
    title: '제5장 윤리',
    icon: FileText,
    articles: [
      {
        title: '제15조 (윤리위원회)',
        content: '당원의 윤리 문제를 심의하기 위하여 윤리위원회를 둔다.',
      },
      {
        title: '제16조 (징계)',
        content: '당헌·당규를 위반하거나 당의 명예를 훼손한 당원은 윤리위원회의 심의를 거쳐 징계할 수 있다.',
      },
    ],
  },
];

const regulations = [
  { title: '당원 및 입당규정', description: '당원의 자격, 입당 절차, 당비 납부 등에 관한 세부 규정' },
  { title: '조직운영규정', description: '중앙당 및 시도당의 조직 구성과 운영에 관한 규정' },
  { title: '선거관리규정', description: '당내 각급 선거의 관리와 운영에 관한 규정' },
  { title: '재정운영규정', description: '당 재정의 수입, 지출, 관리에 관한 세부 규정' },
  { title: '윤리규정', description: '당원 윤리와 징계에 관한 세부 규정' },
  { title: '정책위원회규정', description: '정책위원회 및 상임위원회의 구성과 운영에 관한 규정' },
];

export default function ConstitutionPage() {
  return (
    <div className="py-16">
      {/* Hero */}
      <section className="bg-[var(--primary)] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">당헌·당규</h1>
          <p className="text-xl text-white/90">
            행복사회당의 근본 규범과 운영 원칙을 안내합니다.
          </p>
        </div>
      </section>

      {/* Preamble */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">당헌 전문</h2>
          <div className="w-20 h-1 bg-[var(--primary)] mx-auto"></div>
        </div>
        <div className="bg-[var(--primary-light)] rounded-[var(--radius-xl)] p-8 md:p-12">
          <p className="text-lg text-[var(--gray-700)] leading-relaxed">
            우리 행복사회당은 대한민국 헌법이 지향하는 자유민주주의와 사회정의의 가치를 바탕으로,
            모든 국민이 존엄한 삶을 누릴 수 있는 행복한 사회를 건설하기 위하여 창당되었다.
          </p>
          <p className="text-lg text-[var(--gray-700)] leading-relaxed mt-4">
            우리는 경쟁과 분열이 아닌 협력과 연대의 정치, 성장 지상주의가 아닌 삶의 질 향상을 추구하며,
            시민의 참여와 소통을 통해 새로운 진보정치의 길을 열어갈 것을 다짐한다.
          </p>
          <p className="text-lg text-[var(--primary)] font-semibold mt-6">
            이에 우리는 본 당헌을 제정하여 당의 조직과 운영의 기본 원칙을 천명한다.
          </p>
        </div>
      </section>

      {/* Chapters */}
      <section className="bg-[var(--gray-50)] py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">당헌</h2>
            <div className="w-20 h-1 bg-[var(--primary)] mx-auto"></div>
          </div>
          <div className="space-y-8">
            {chapters.map((chapter) => {
              const IconComponent = chapter.icon;
              return (
                <Card key={chapter.title} variant="default" className="bg-white overflow-hidden">
                  <div className="bg-[var(--primary)] text-white px-6 py-4 flex items-center gap-3">
                    <IconComponent className="w-6 h-6" />
                    <h3 className="text-xl font-bold">{chapter.title}</h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {chapter.articles.map((article) => (
                        <div key={article.title}>
                          <h4 className="font-semibold text-[var(--gray-900)] mb-2">{article.title}</h4>
                          <p className="text-[var(--gray-600)] pl-4 border-l-2 border-[var(--gray-200)]">
                            {article.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Regulations */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">당규</h2>
          <div className="w-20 h-1 bg-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--gray-600)]">당헌의 시행을 위한 세부 규정입니다.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regulations.map((reg) => (
            <Card key={reg.title} variant="default" className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[var(--primary-light)] rounded-[var(--radius-md)] flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2">{reg.title}</h3>
                <p className="text-[var(--gray-600)] text-sm">{reg.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Download Section */}
      <section className="bg-[var(--primary)] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">전문 다운로드</h2>
          <p className="text-xl text-white/90 mb-8">
            당헌·당규 전문을 PDF로 다운로드하실 수 있습니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-[var(--primary)] px-8 py-4 rounded-[var(--radius-md)] font-semibold hover:bg-white/90 transition-colors">
              당헌 전문 다운로드
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-[var(--radius-md)] font-semibold hover:bg-white/10 transition-colors">
              당규 전문 다운로드
            </button>
          </div>
        </div>
      </section>

      {/* Supplementary */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-4">부칙</h2>
          <div className="w-20 h-1 bg-[var(--primary)] mx-auto"></div>
        </div>
        <div className="bg-[var(--gray-50)] rounded-[var(--radius-lg)] p-8">
          <div className="space-y-4 text-[var(--gray-700)]">
            <p><strong>제1조 (시행일)</strong> 본 당헌은 중앙선거관리위원회에 등록한 날부터 시행한다.</p>
            <p><strong>제2조 (경과조치)</strong> 본 당헌 시행 당시 종전의 규정에 의하여 행하여진 행위는 본 당헌에 의하여 행하여진 것으로 본다.</p>
            <p><strong>제3조 (당규에의 위임)</strong> 본 당헌의 시행에 필요한 세부사항은 당규로 정한다.</p>
          </div>
          <div className="mt-8 pt-6 border-t border-[var(--gray-200)] text-center text-[var(--gray-500)]">
            <p>2024년 3월 1일 제정</p>
            <p>2024년 6월 15일 1차 개정</p>
          </div>
        </div>
      </section>
    </div>
  );
}

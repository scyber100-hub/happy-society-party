export default function HistoryPage() {
  const timeline = [
    { year: '2020', month: '3월', event: '행복사회당 창당 준비위원회 결성' },
    { year: '2020', month: '6월', event: '창당 발기인 대회 개최 (1,000명 참여)' },
    { year: '2020', month: '9월', event: '행복사회당 공식 창당' },
    { year: '2021', month: '4월', event: '전국 17개 시도당 설립 완료' },
    { year: '2021', month: '10월', event: '제1차 전국 당원대회 개최' },
    { year: '2022', month: '3월', event: '제20대 대통령 선거 후보 출마' },
    { year: '2022', month: '6월', event: '제8회 지방선거 참여' },
    { year: '2023', month: '5월', event: '당원 3만명 돌파' },
    { year: '2024', month: '4월', event: '제22대 국회의원 선거 참여' },
    { year: '2025', month: '1월', event: '디지털 당원 플랫폼 오픈' },
    { year: '2025', month: '6월', event: '당원 5만명 돌파' },
  ];

  return (
    <div className="py-16">
      {/* Hero */}
      <section className="bg-[var(--primary)] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">당의 역사</h1>
          <p className="text-xl text-white/90">
            행복사회당의 발자취를 소개합니다.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">연혁</h2>
          <div className="w-20 h-1 bg-[var(--primary)] mx-auto"></div>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[var(--gray-200)] transform md:-translate-x-1/2"></div>

          {/* Timeline Items */}
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div
                key={index}
                className={`relative flex items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-[var(--primary)] rounded-full transform -translate-x-1/2 z-10"></div>

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="bg-white border border-[var(--gray-200)] rounded-[var(--radius-lg)] p-6">
                    <div className="text-[var(--primary)] font-bold mb-1">
                      {item.year}년 {item.month}
                    </div>
                    <p className="text-[var(--gray-700)]">{item.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="bg-[var(--gray-50)] py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">창당 정신</h2>
            <div className="w-20 h-1 bg-[var(--primary)] mx-auto"></div>
          </div>
          <div className="bg-white rounded-[var(--radius-xl)] p-8 md:p-12">
            <blockquote className="text-xl md:text-2xl text-[var(--gray-700)] italic text-center leading-relaxed">
              &ldquo;우리는 모든 국민이 행복할 권리가 있다고 믿습니다.<br />
              정치는 소수가 아닌 모두를 위한 것이어야 합니다.<br />
              행복사회당은 이 믿음을 실현하기 위해 창당되었습니다.&rdquo;
            </blockquote>
            <p className="text-center text-[var(--gray-500)] mt-6">- 창당 선언문 중에서</p>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Card, CardContent } from '@/components/ui/Card';
import { User } from 'lucide-react';

const leadership = [
  { position: '당대표', name: '김행복', description: '제2대 당대표 (2024~)' },
  { position: '최고위원', name: '이공정', description: '정책총괄' },
  { position: '최고위원', name: '박연대', description: '조직총괄' },
  { position: '최고위원', name: '정혁신', description: '홍보총괄' },
  { position: '최고위원', name: '최투명', description: '재정총괄' },
  { position: '사무총장', name: '한미래', description: '당무총괄' },
];

const committees = [
  '정책위원회',
  '기획재정위원회',
  '조직위원회',
  '홍보위원회',
  '국제위원회',
  '청년위원회',
  '여성위원회',
  '노동위원회',
  '환경위원회',
  '교육위원회',
  '문화위원회',
  '복지위원회',
  '과학기술위원회',
  '농어업위원회',
  '중소기업위원회',
];

export default function OrganizationPage() {
  return (
    <div className="py-16">
      {/* Hero */}
      <section className="bg-[var(--primary)] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">조직도</h1>
          <p className="text-xl text-white/90">
            행복사회당의 조직 구성을 소개합니다.
          </p>
        </div>
      </section>

      {/* Organization Chart */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">중앙당 조직</h2>
          <div className="w-20 h-1 bg-[var(--primary)] mx-auto"></div>
        </div>

        {/* Org Chart Visual */}
        <div className="mb-16">
          <div className="flex flex-col items-center">
            {/* Top Level */}
            <div className="bg-[var(--primary)] text-white px-8 py-4 rounded-[var(--radius-lg)] font-bold text-lg">
              전국 당원대회
            </div>
            <div className="w-0.5 h-8 bg-[var(--gray-300)]"></div>

            {/* Second Level */}
            <div className="bg-[var(--primary)] text-white px-8 py-4 rounded-[var(--radius-lg)] font-bold text-lg">
              최고위원회
            </div>
            <div className="w-0.5 h-8 bg-[var(--gray-300)]"></div>

            {/* Third Level */}
            <div className="flex gap-4 flex-wrap justify-center">
              <div className="bg-[var(--primary-light)] text-[var(--primary)] px-6 py-3 rounded-[var(--radius-md)] font-medium">
                정책위원회
              </div>
              <div className="bg-[var(--primary-light)] text-[var(--primary)] px-6 py-3 rounded-[var(--radius-md)] font-medium">
                사무처
              </div>
              <div className="bg-[var(--primary-light)] text-[var(--primary)] px-6 py-3 rounded-[var(--radius-md)] font-medium">
                윤리위원회
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-[var(--gray-50)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">당 지도부</h2>
            <div className="w-20 h-1 bg-[var(--primary)] mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadership.map((leader) => (
              <Card key={leader.name} variant="default" className="bg-white text-center">
                <div className="w-20 h-20 bg-[var(--gray-200)] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-10 h-10 text-[var(--gray-400)]" />
                </div>
                <div className="text-sm text-[var(--primary)] font-medium mb-1">{leader.position}</div>
                <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">{leader.name}</h3>
                <CardContent>
                  <p className="text-[var(--gray-500)] text-sm">{leader.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Standing Committees */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">상임위원회</h2>
          <div className="w-20 h-1 bg-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--gray-600)]">정책 분야별 전문 위원회입니다.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {committees.map((committee) => (
            <div
              key={committee}
              className="bg-white border border-[var(--gray-200)] rounded-[var(--radius-md)] p-4 text-center hover:border-[var(--primary)] hover:bg-[var(--primary-light)] transition-colors"
            >
              <span className="text-[var(--gray-700)] font-medium">{committee}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Regional */}
      <section className="bg-[var(--primary-light)] py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--gray-900)] mb-4">시도당</h2>
            <div className="w-20 h-1 bg-[var(--primary)] mx-auto mb-4"></div>
            <p className="text-[var(--gray-600)]">전국 17개 광역시도에 시도당이 설립되어 있습니다.</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-center">
            {['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'].map((region) => (
              <div key={region} className="bg-white rounded-[var(--radius-md)] px-4 py-3 text-[var(--gray-700)] font-medium">
                {region}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

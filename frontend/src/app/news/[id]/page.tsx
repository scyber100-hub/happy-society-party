import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Share2,
  ChevronRight,
} from 'lucide-react';

// 뉴스 상세 데이터
const newsDetailData: Record<string, {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
}> = {
  'news-001': {
    id: 'news-001',
    category: 'press',
    title: '행복사회당, 창당 기자회견 개최',
    excerpt: '행복사회당은 "1등이 아니어도 행복한 나라, 부자가 아니어도 존엄한 나라"를 비전으로 창당을 선언하였습니다.',
    content: `행복사회당은 2026년 1월 15일, 서울 프레스센터에서 창당 기자회견을 개최하고 공식 출범을 선언했습니다.

이날 기자회견에서 행복사회당은 "1등이 아니어도 행복한 나라, 부자가 아니어도 존엄한 나라"를 당의 비전으로 제시하며, 경쟁이 아닌 협력을, 성장이 아닌 행복을, 효율이 아닌 존엄을 앞세우는 새로운 진보정치를 시작하겠다고 밝혔습니다.

## 7대 강령 발표

행복사회당은 다음과 같은 7대 강령을 발표했습니다:

1. **협력사회**: 무한 경쟁 대신 협력과 연대의 가치가 존중받는 사회
2. **불평등 해소**: 자산과 소득의 불평등을 해소하고 누구나 존엄한 삶을 보장
3. **노동 존중**: 일하는 사람이 정당한 대우를 받고 안전하게 일할 수 있는 사회
4. **공공성 강화**: 의료, 교육, 주거, 돌봄의 공공성 강화
5. **민주주의 확장**: 정치를 넘어 경제와 일상에서도 민주주의 실현
6. **기후위기 대응**: 탄소중립 실현과 정의로운 전환
7. **AI 시대 대응**: 기술 발전의 혜택이 모든 시민에게 공평하게 돌아가는 사회

## 전국 조직 구축 계획

행복사회당은 전국 17개 시도에 시도당을 설립하고, 풀뿌리 민주주의에 기반한 당 운영을 하겠다고 밝혔습니다. 또한 온라인 플랫폼을 통해 당원들의 일상적인 정책 참여를 보장하겠다고 약속했습니다.

창당준비위원장은 "행복사회당은 기존 정치의 관행을 답습하지 않을 것"이라며, "시민과 함께 새로운 정치를 만들어가겠다"고 강조했습니다.

---

행복사회당은 앞으로 전국 순회 당원 간담회, 정책 토론회 등 다양한 활동을 통해 시민들의 목소리를 정책에 반영해 나갈 계획입니다.`,
    date: '2026-01-15',
    author: '홍보위원회',
  },
  'news-002': {
    id: 'news-002',
    category: 'statement',
    title: 'AI 시대, 모든 시민을 위한 기술 정책 발표',
    excerpt: '기술 발전의 혜택이 모든 시민에게 공평하게 돌아가도록 하는 정책 방향을 발표합니다.',
    content: `행복사회당 정책위원회는 AI 시대를 맞아 모든 시민을 위한 기술 정책을 발표합니다.

## 정책 배경

AI 기술의 급속한 발전은 우리 사회에 큰 변화를 가져오고 있습니다. 생산성 향상과 새로운 가능성을 열어주는 동시에, 일자리 대체, 알고리즘 차별, 프라이버시 침해 등 새로운 문제도 야기하고 있습니다.

기술 발전의 혜택이 소수에게 집중되고 피해는 다수에게 전가되는 상황을 방지해야 합니다.

## 핵심 정책 방향

### 1. AI 윤리 가이드라인 법제화

- 알고리즘 투명성 의무화
- AI 차별 금지 규정 마련
- 고위험 AI 활용 분야 규제

### 2. AI 일자리 대체 대응

- 직업 재교육 프로그램 대폭 확대
- 전환 지원금 지급 제도 신설
- 새로운 형태의 일자리 창출 지원

### 3. 디지털 격차 해소

- 전 국민 디지털 리터러시 교육
- 공공 디지털 인프라 확충
- 취약계층 디지털 접근성 보장

### 4. AI 이익 공유 제도

- AI 기업의 이익 일부를 사회에 환원하는 기금 조성
- 전 국민이 기술 발전의 혜택을 나누는 구조 마련

## 맺음말

행복사회당은 AI와 기술이 사람을 위해 작동하고, 그 혜택이 공평하게 나눠지는 사회를 만들어 가겠습니다.`,
    date: '2026-01-14',
    author: '정책위원회',
  },
  'news-003': {
    id: 'news-003',
    category: 'press',
    title: '전국 시도당 창당준비위원회 발족',
    excerpt: '전국 17개 시도에서 창당준비위원회가 발족하여 지역 조직 구축에 나섭니다.',
    content: `행복사회당은 전국 17개 시도에서 창당준비위원회를 발족하고 본격적인 지역 조직 구축에 나섰습니다.

## 지역 조직 구축 현황

각 시도 창당준비위원회는 지역 당원 모집, 지역 현안 발굴, 지역 정책 수립 등의 역할을 수행하게 됩니다.

### 수도권
- 서울특별시: 1월 25일 창당대회 예정
- 경기도: 2월 1일 창당대회 예정
- 인천광역시: 2월 8일 창당대회 예정

### 영남권
- 부산광역시: 2월 15일 창당대회 예정
- 대구광역시: 2월 22일 창당대회 예정
- 경상남도: 3월 1일 창당대회 예정
- 경상북도: 3월 8일 창당대회 예정
- 울산광역시: 3월 15일 창당대회 예정

### 호남권
- 광주광역시: 2월 15일 창당대회 예정
- 전라남도: 2월 22일 창당대회 예정
- 전라북도: 3월 1일 창당대회 예정

### 충청권
- 대전광역시: 3월 8일 창당대회 예정
- 충청남도: 3월 15일 창당대회 예정
- 충청북도: 3월 22일 창당대회 예정
- 세종특별자치시: 3월 22일 창당대회 예정

### 강원·제주
- 강원특별자치도: 3월 29일 창당대회 예정
- 제주특별자치도: 3월 29일 창당대회 예정

## 풀뿌리 민주주의 실현

행복사회당은 중앙당 중심이 아닌 지역당 중심의 정당 운영을 지향합니다. 지역 당원들이 직접 지역 정책을 수립하고 결정하는 구조를 만들어 나갈 계획입니다.

각 시도당은 지역 커뮤니티를 통해 당원들의 일상적인 참여를 보장하며, 지역 현안에 대한 정책을 지역 당원들이 직접 결정하게 됩니다.`,
    date: '2026-01-12',
    author: '조직위원회',
  },
  'news-004': {
    id: 'news-004',
    category: 'statement',
    title: '기후위기 대응을 위한 긴급 성명',
    excerpt: '기후위기는 더 이상 미래의 문제가 아닙니다. 행복사회당은 2035년 재생에너지 50% 달성을 위한 구체적인 로드맵을 제시합니다.',
    content: `기후위기는 더 이상 미래의 문제가 아닙니다.

## 현실 인식

최근 전 세계적으로 폭염, 홍수, 산불 등 이상기후 현상이 빈발하고 있습니다. 우리나라도 예외가 아닙니다. 기후위기로 인한 피해는 취약계층에게 집중되고 있으며, 이는 심각한 기후 불평등으로 이어지고 있습니다.

## 2035년 재생에너지 50% 로드맵

행복사회당은 다음과 같은 구체적인 로드맵을 제시합니다:

### 단기 목표 (2026-2028)
- 석탄발전 비중 30% 이하로 감축
- 재생에너지 발전 비중 25% 달성
- 그린뉴딜 일자리 30만개 창출

### 중기 목표 (2029-2032)
- 석탄발전 단계적 폐쇄 착수
- 재생에너지 발전 비중 40% 달성
- 그린뉴딜 일자리 60만개 창출

### 장기 목표 (2033-2035)
- 석탄발전 완전 폐쇄
- 재생에너지 발전 비중 50% 달성
- 그린뉴딜 일자리 100만개 달성

## 정의로운 전환

에너지 전환 과정에서 피해를 입는 노동자와 지역사회를 위한 정의로운 전환 프로그램을 마련하겠습니다.

- 석탄발전소 폐쇄 지역 특별지원
- 에너지 산업 노동자 재취업 지원
- 지역경제 다변화 지원

기후위기 대응은 더 이상 선택이 아닌 필수입니다. 행복사회당은 기후정의에 기반한 에너지 전환을 반드시 이루어내겠습니다.`,
    date: '2026-01-10',
    author: '환경위원회',
  },
  'news-005': {
    id: 'news-005',
    category: 'press',
    title: '청년위원회 출범 및 청년정책 발표',
    excerpt: '청년의 목소리를 정치에 담기 위한 청년위원회가 출범했습니다.',
    content: `행복사회당 청년위원회가 공식 출범하고 청년정책을 발표했습니다.

## 청년위원회 출범

청년위원회는 18세에서 39세까지의 청년 당원으로 구성되며, 청년 현안에 대한 정책 수립과 당내 청년 의견 대변 역할을 수행합니다.

## 청년정책 3대 분야

### 1. 주거

- 청년 공공임대주택 30만호 공급
- 청년 전세자금 대출 금리 1% 고정
- 청년 주거비 지원 확대

### 2. 일자리

- 청년 고용 할당제 도입
- 청년 창업 지원 확대
- 플랫폼 노동자 권리 보장

### 3. 교육

- 대학 등록금 반값 실현
- 학자금 대출 이자 면제
- 청년 직업 재교육 무상 지원

## 청년 참여 보장

청년위원회는 온라인 플랫폼을 통해 청년 당원들의 일상적인 참여를 보장합니다. 정기적인 온라인 모임, 정책 토론, 의견 수렴 등을 통해 청년들의 목소리를 정책에 반영하겠습니다.`,
    date: '2026-01-08',
    author: '청년위원회',
  },
  'news-006': {
    id: 'news-006',
    category: 'schedule',
    title: '2026년 1월 당원 교육 프로그램 안내',
    excerpt: '신규 당원을 위한 입문 교육과 기존 당원을 위한 심화 교육 프로그램을 안내드립니다.',
    content: `2026년 1월 당원 교육 프로그램을 안내드립니다.

## 신규 당원 입문 교육

새로 가입하신 당원분들을 위한 입문 교육입니다.

**일시**: 매주 목요일 19:00-21:00
**방식**: 온라인 (Zoom)
**내용**:
- 행복사회당의 비전과 7대 강령
- 당 조직 구조와 활동 방법
- 커뮤니티 참여 방법

## 정책 심화 교육

기존 당원분들을 위한 정책 심화 교육입니다.

**일시**: 매주 토요일 14:00-17:00
**방식**: 오프라인 (서울 당사) + 온라인 동시 진행
**1월 주제**:
- 1주차: 협력경제와 사회적경제
- 2주차: 기후위기와 에너지 전환
- 3주차: AI 시대의 노동정책
- 4주차: 주거정책과 부동산 문제

## 신청 방법

당원 포털에서 신청하실 수 있습니다. 교육 참여 시 활동 포인트가 적립됩니다.`,
    date: '2026-01-07',
    author: '교육위원회',
  },
  'news-007': {
    id: 'news-007',
    category: 'statement',
    title: '노동자 권리 보장을 위한 입장문',
    excerpt: '최근 노동 현장에서 발생한 사고에 대해 깊은 애도를 표합니다.',
    content: `최근 노동 현장에서 발생한 안타까운 사고에 대해 깊은 애도를 표합니다.

## 산업재해 현실

대한민국은 OECD 국가 중 산업재해 사망률 1위라는 불명예를 안고 있습니다. 매년 수백 명의 노동자가 일터에서 목숨을 잃고 있으며, 이는 결코 용납될 수 없는 현실입니다.

## 행복사회당의 입장

행복사회당은 다음과 같은 입장을 밝힙니다:

### 1. 중대재해처벌법 강화

- 처벌 수위 상향
- 적용 범위 확대
- 실효성 있는 집행 체계 구축

### 2. 산업안전 감독 강화

- 산업안전 감독관 대폭 증원
- 불시 점검 확대
- 위반 사업장 엄중 처벌

### 3. 노동자 안전 참여권 보장

- 작업 중지권 실질화
- 안전보건 대표 선임 의무화
- 위험작업 거부권 보장

## 다짐

행복사회당은 더 이상 일터에서 노동자가 죽지 않는 사회를 만들기 위해 최선을 다하겠습니다.

노동은 신성하며, 모든 노동자는 안전하게 일할 권리가 있습니다.`,
    date: '2026-01-05',
    author: '노동위원회',
  },
  'news-008': {
    id: 'news-008',
    category: 'schedule',
    title: '전국 순회 당원 간담회 일정',
    excerpt: '전국 17개 시도를 순회하며 당원 여러분의 목소리를 직접 듣는 간담회를 개최합니다.',
    content: `전국 순회 당원 간담회 일정을 안내드립니다.

## 간담회 목적

당 지도부가 전국을 순회하며 당원 여러분의 목소리를 직접 듣고자 합니다. 지역 현안, 정책 제안, 당 운영에 대한 의견 등 자유롭게 말씀해 주세요.

## 1월 일정

| 날짜 | 지역 | 장소 | 시간 |
|------|------|------|------|
| 1월 12일 | 부산 | 해운대구 문화회관 | 14:00 |
| 1월 19일 | 대전 | 중구 시민회관 | 14:00 |
| 1월 26일 | 광주 | 동구 문화센터 | 14:00 |

## 2월 일정

| 날짜 | 지역 | 장소 | 시간 |
|------|------|------|------|
| 2월 2일 | 대구 | 중구 시민회관 | 14:00 |
| 2월 9일 | 인천 | 남동구 문화센터 | 14:00 |
| 2월 16일 | 수원 | 팔달구 시민회관 | 14:00 |

## 참여 방법

- 사전 신청: 당원 포털에서 신청
- 현장 참석도 가능합니다
- 온라인 동시 중계 예정

많은 참여 부탁드립니다.`,
    date: '2026-01-03',
    author: '조직위원회',
  },
};

// 관련 뉴스 가져오기
function getRelatedNews(currentId: string, category: string) {
  return Object.values(newsDetailData)
    .filter(news => news.id !== currentId && news.category === category)
    .slice(0, 3);
}

const categoryLabels: Record<string, string> = {
  press: '보도자료',
  statement: '성명서',
  schedule: '일정',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { id } = await params;
  const news = newsDetailData[id];

  if (!news) {
    notFound();
  }

  const relatedNews = getRelatedNews(news.id, news.category);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-[var(--primary)] text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/news" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            소식으로 돌아가기
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-white/20 rounded-full">
              <FileText className="w-4 h-4" />
              {categoryLabels[news.category]}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{news.title}</h1>
          <div className="flex items-center gap-4 text-white/80">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {news.date}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {news.author}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            {news.content.split('\n\n').map((paragraph, index) => {
              // Handle headers
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-[var(--gray-900)] mt-8 mb-4">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-bold text-[var(--gray-900)] mt-6 mb-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              // Handle horizontal rule
              if (paragraph === '---') {
                return <hr key={index} className="my-8 border-[var(--gray-200)]" />;
              }
              // Handle lists
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                return (
                  <ul key={index} className="list-disc list-inside space-y-2 text-[var(--gray-700)] my-4">
                    {items.map((item, i) => (
                      <li key={i}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              // Handle numbered lists
              if (/^\d+\.\s/.test(paragraph)) {
                const items = paragraph.split('\n').filter(line => /^\d+\.\s/.test(line));
                return (
                  <ol key={index} className="list-decimal list-inside space-y-2 text-[var(--gray-700)] my-4">
                    {items.map((item, i) => (
                      <li key={i}>{item.replace(/^\d+\.\s/, '')}</li>
                    ))}
                  </ol>
                );
              }
              // Handle tables (simplified)
              if (paragraph.includes('|')) {
                const rows = paragraph.split('\n').filter(row => row.includes('|'));
                if (rows.length > 1) {
                  return (
                    <div key={index} className="overflow-x-auto my-6">
                      <table className="min-w-full border border-[var(--gray-200)]">
                        <thead>
                          <tr className="bg-[var(--gray-50)]">
                            {rows[0].split('|').filter(cell => cell.trim()).map((cell, i) => (
                              <th key={i} className="px-4 py-2 border-b border-[var(--gray-200)] text-left font-semibold text-[var(--gray-900)]">
                                {cell.trim()}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rows.slice(2).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.split('|').filter(cell => cell.trim()).map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-2 border-b border-[var(--gray-200)] text-[var(--gray-700)]">
                                  {cell.trim()}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
              }
              // Regular paragraph
              return (
                <p key={index} className="text-[var(--gray-700)] leading-relaxed my-4">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-[var(--gray-200)]">
            <div className="flex items-center justify-between">
              <span className="text-[var(--gray-600)]">이 글이 유용했나요?</span>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                공유하기
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="bg-[var(--gray-50)] py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-6">관련 소식</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedNews.map((item) => (
                <Link key={item.id} href={`/news/${item.id}`}>
                  <Card variant="bordered" className="h-full hover:shadow-[var(--shadow-md)] hover:border-[var(--primary)] transition-all cursor-pointer bg-white">
                    <span className="text-sm text-[var(--gray-400)] mb-2 block">{item.date}</span>
                    <h3 className="text-base font-bold text-[var(--gray-900)] line-clamp-2 mb-2">
                      {item.title}
                    </h3>
                    <span className="text-[var(--primary)] text-sm font-medium flex items-center">
                      읽기 <ChevronRight className="w-4 h-4" />
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[var(--gray-600)] mb-4">
            행복사회당의 소식을 더 빠르게 받아보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join">
              <Button variant="primary">입당 신청하기</Button>
            </Link>
            <Link href="/news">
              <Button variant="outline">다른 소식 보기</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// 정적 경로 생성
export function generateStaticParams() {
  return Object.keys(newsDetailData).map((id) => ({
    id,
  }));
}

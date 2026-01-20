'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  FileText,
  Search,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

// 성명서 데이터
const statementsData = [
  {
    id: 'news-002',
    title: 'AI 시대, 모든 시민을 위한 기술 정책 발표',
    excerpt: '기술 발전의 혜택이 모든 시민에게 공평하게 돌아가도록 하는 정책 방향을 발표합니다. AI 윤리 가이드라인과 디지털 격차 해소 방안을 담았습니다.',
    date: '2026-01-14',
    author: '정책위원회',
  },
  {
    id: 'news-004',
    title: '기후위기 대응을 위한 긴급 성명',
    excerpt: '기후위기는 더 이상 미래의 문제가 아닙니다. 행복사회당은 2035년 재생에너지 50% 달성을 위한 구체적인 로드맵을 제시합니다.',
    date: '2026-01-10',
    author: '환경위원회',
  },
  {
    id: 'news-007',
    title: '노동자 권리 보장을 위한 입장문',
    excerpt: '최근 노동 현장에서 발생한 사고에 대해 깊은 애도를 표하며, 노동자의 안전과 권리를 보장하기 위한 우리의 입장을 밝힙니다.',
    date: '2026-01-05',
    author: '노동위원회',
  },
  {
    id: 'statement-004',
    title: '주거권 보장을 위한 정책 제안',
    excerpt: '치솟는 집값과 전세난으로 고통받는 시민들을 위해 공공임대주택 확대와 투기 억제 방안을 제안합니다.',
    date: '2026-01-03',
    author: '주거위원회',
  },
  {
    id: 'statement-005',
    title: '교육 불평등 해소를 위한 입장',
    excerpt: '부모의 경제력이 자녀의 미래를 결정하는 현실을 바꾸기 위한 교육 정책 방향을 제시합니다.',
    date: '2026-01-01',
    author: '교육위원회',
  },
  {
    id: 'statement-006',
    title: '새해를 맞아 국민께 드리는 말씀',
    excerpt: '2026년 새해를 맞아 행복사회당의 비전과 다짐을 국민 여러분께 전합니다.',
    date: '2026-01-01',
    author: '당 대표',
  },
];

export default function StatementsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStatements = useMemo(() => {
    return statementsData.filter((news) => {
      return searchQuery === '' ||
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--primary)] text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/news" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            소식으로 돌아가기
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">성명서</h1>
              <p className="text-white/80 mt-2">주요 현안에 대한 당의 공식 입장입니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="border-b border-[var(--gray-200)] bg-white py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gray-400)]" />
            <Input
              type="text"
              placeholder="성명서 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
      </section>

      {/* Statements List */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {filteredStatements.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-[var(--gray-300)] mx-auto mb-4" />
              <p className="text-[var(--gray-500)] text-lg">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-[var(--gray-600)]">
                총 <span className="font-semibold text-[var(--primary)]">{filteredStatements.length}</span>개의 성명서
              </div>
              <div className="space-y-4">
                {filteredStatements.map((news) => (
                  <Link key={news.id} href={`/news/${news.id}`}>
                    <Card variant="bordered" className="hover:shadow-[var(--shadow-md)] hover:border-[var(--primary)] transition-all cursor-pointer">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-[var(--gray-400)]">{news.date}</span>
                            <span className="text-sm text-[var(--gray-300)]">|</span>
                            <span className="text-sm text-[var(--gray-500)]">{news.author}</span>
                          </div>
                          <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2">
                            {news.title}
                          </h3>
                          <p className="text-[var(--gray-600)] text-sm line-clamp-2">
                            {news.excerpt}
                          </p>
                        </div>
                        <div className="flex items-center text-[var(--primary)] text-sm font-medium md:ml-4">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

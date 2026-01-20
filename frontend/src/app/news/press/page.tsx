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

// 보도자료 데이터
const pressData = [
  {
    id: 'news-001',
    title: '행복사회당, 창당 기자회견 개최',
    excerpt: '행복사회당은 "1등이 아니어도 행복한 나라, 부자가 아니어도 존엄한 나라"를 비전으로 창당을 선언하였습니다. 새로운 진보정치의 시작을 알리는 역사적인 순간입니다.',
    date: '2026-01-15',
    author: '홍보위원회',
  },
  {
    id: 'news-003',
    title: '전국 시도당 창당준비위원회 발족',
    excerpt: '전국 17개 시도에서 창당준비위원회가 발족하여 지역 조직 구축에 나섭니다. 풀뿌리 민주주의의 실현을 위한 첫걸음입니다.',
    date: '2026-01-12',
    author: '조직위원회',
  },
  {
    id: 'news-005',
    title: '청년위원회 출범 및 청년정책 발표',
    excerpt: '청년의 목소리를 정치에 담기 위한 청년위원회가 출범했습니다. 주거, 일자리, 교육 등 청년 현안에 대한 정책을 발표합니다.',
    date: '2026-01-08',
    author: '청년위원회',
  },
  {
    id: 'press-004',
    title: '행복사회당, 첫 정책위원회 회의 개최',
    excerpt: '창당 이후 첫 정책위원회 전체회의가 개최되었습니다. 7대 강령에 기반한 구체적인 정책 수립 방향을 논의했습니다.',
    date: '2026-01-06',
    author: '정책위원회',
  },
  {
    id: 'press-005',
    title: '당 대표단, 시민사회 단체와 간담회',
    excerpt: '환경, 노동, 여성, 장애인 등 다양한 시민사회 단체와 간담회를 갖고 정책 협력 방안을 논의했습니다.',
    date: '2026-01-04',
    author: '홍보위원회',
  },
  {
    id: 'press-006',
    title: '온라인 당원 가입 시스템 오픈',
    excerpt: '홈페이지를 통한 온라인 입당 신청 시스템이 정식 오픈되었습니다. 더 많은 시민들의 참여를 기대합니다.',
    date: '2026-01-02',
    author: '홍보위원회',
  },
];

export default function PressPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPress = useMemo(() => {
    return pressData.filter((news) => {
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
              <h1 className="text-4xl md:text-5xl font-bold">보도자료</h1>
              <p className="text-white/80 mt-2">언론에 배포된 공식 보도자료입니다.</p>
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
              placeholder="보도자료 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
      </section>

      {/* Press List */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {filteredPress.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-[var(--gray-300)] mx-auto mb-4" />
              <p className="text-[var(--gray-500)] text-lg">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-[var(--gray-600)]">
                총 <span className="font-semibold text-[var(--primary)]">{filteredPress.length}</span>개의 보도자료
              </div>
              <div className="space-y-4">
                {filteredPress.map((news) => (
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

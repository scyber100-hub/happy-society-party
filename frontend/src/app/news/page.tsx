'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Newspaper,
  FileText,
  Calendar,
  Search,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';

// 카테고리 정의
const categories: { id: string; name: string; icon: LucideIcon; href: string }[] = [
  { id: 'all', name: '전체', icon: Newspaper, href: '/news' },
  { id: 'press', name: '보도자료', icon: FileText, href: '/news/press' },
  { id: 'statement', name: '성명서', icon: FileText, href: '/news/statements' },
  { id: 'schedule', name: '일정', icon: Calendar, href: '/news/schedule' },
];

// 뉴스 데이터 (향후 DB에서 가져올 예정)
export const newsData = [
  {
    id: 'news-001',
    category: 'press',
    title: '행복사회당, 창당 기자회견 개최',
    excerpt: '행복사회당은 "1등이 아니어도 행복한 나라, 부자가 아니어도 존엄한 나라"를 비전으로 창당을 선언하였습니다. 새로운 진보정치의 시작을 알리는 역사적인 순간입니다.',
    content: '',
    date: '2026-01-15',
    author: '홍보위원회',
    thumbnail: null,
    featured: true,
  },
  {
    id: 'news-002',
    category: 'statement',
    title: 'AI 시대, 모든 시민을 위한 기술 정책 발표',
    excerpt: '기술 발전의 혜택이 모든 시민에게 공평하게 돌아가도록 하는 정책 방향을 발표합니다. AI 윤리 가이드라인과 디지털 격차 해소 방안을 담았습니다.',
    content: '',
    date: '2026-01-14',
    author: '정책위원회',
    thumbnail: null,
    featured: true,
  },
  {
    id: 'news-003',
    category: 'press',
    title: '전국 시도당 창당준비위원회 발족',
    excerpt: '전국 17개 시도에서 창당준비위원회가 발족하여 지역 조직 구축에 나섭니다. 풀뿌리 민주주의의 실현을 위한 첫걸음입니다.',
    content: '',
    date: '2026-01-12',
    author: '조직위원회',
    thumbnail: null,
    featured: false,
  },
  {
    id: 'news-004',
    category: 'statement',
    title: '기후위기 대응을 위한 긴급 성명',
    excerpt: '기후위기는 더 이상 미래의 문제가 아닙니다. 행복사회당은 2035년 재생에너지 50% 달성을 위한 구체적인 로드맵을 제시합니다.',
    content: '',
    date: '2026-01-10',
    author: '환경위원회',
    thumbnail: null,
    featured: false,
  },
  {
    id: 'news-005',
    category: 'press',
    title: '청년위원회 출범 및 청년정책 발표',
    excerpt: '청년의 목소리를 정치에 담기 위한 청년위원회가 출범했습니다. 주거, 일자리, 교육 등 청년 현안에 대한 정책을 발표합니다.',
    content: '',
    date: '2026-01-08',
    author: '청년위원회',
    thumbnail: null,
    featured: false,
  },
  {
    id: 'news-006',
    category: 'schedule',
    title: '2026년 1월 당원 교육 프로그램 안내',
    excerpt: '신규 당원을 위한 입문 교육과 기존 당원을 위한 심화 교육 프로그램을 안내드립니다. 온라인과 오프라인 모두 참여 가능합니다.',
    content: '',
    date: '2026-01-07',
    author: '교육위원회',
    thumbnail: null,
    featured: false,
  },
  {
    id: 'news-007',
    category: 'statement',
    title: '노동자 권리 보장을 위한 입장문',
    excerpt: '최근 노동 현장에서 발생한 사고에 대해 깊은 애도를 표하며, 노동자의 안전과 권리를 보장하기 위한 우리의 입장을 밝힙니다.',
    content: '',
    date: '2026-01-05',
    author: '노동위원회',
    thumbnail: null,
    featured: false,
  },
  {
    id: 'news-008',
    category: 'schedule',
    title: '전국 순회 당원 간담회 일정',
    excerpt: '전국 17개 시도를 순회하며 당원 여러분의 목소리를 직접 듣는 간담회를 개최합니다. 많은 참여 부탁드립니다.',
    content: '',
    date: '2026-01-03',
    author: '조직위원회',
    thumbnail: null,
    featured: false,
  },
];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = useMemo(() => {
    return newsData.filter((news) => {
      const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
      const matchesSearch = searchQuery === '' ||
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredNews = newsData.filter(news => news.featured);

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat?.name || categoryId;
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'press': return <FileText className="w-4 h-4" />;
      case 'statement': return <FileText className="w-4 h-4" />;
      case 'schedule': return <Calendar className="w-4 h-4" />;
      default: return <Newspaper className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--primary)] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">소식</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            행복사회당의 활동과 소식을 전합니다.
            보도자료, 성명서, 일정 등 다양한 소식을 확인하세요.
          </p>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <section className="bg-[var(--gray-50)] py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-6">주요 소식</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredNews.map((news) => (
                <Link key={news.id} href={`/news/${news.id}`}>
                  <Card variant="bordered" className="h-full hover:shadow-[var(--shadow-lg)] hover:border-[var(--primary)] transition-all cursor-pointer bg-white">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-[var(--primary)] bg-[var(--primary-light)] rounded-full">
                        {getCategoryIcon(news.category)}
                        {getCategoryName(news.category)}
                      </span>
                      <span className="text-sm text-[var(--gray-400)]">{news.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--gray-900)] mb-3 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-[var(--gray-600)] line-clamp-3 mb-4">
                      {news.excerpt}
                    </p>
                    <div className="flex items-center text-[var(--primary)] text-sm font-medium">
                      자세히 보기 <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Tabs & Search */}
      <section className="border-b border-[var(--gray-200)] bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                      ${selectedCategory === category.id
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--gray-100)] text-[var(--gray-600)] hover:bg-[var(--gray-200)]'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gray-400)]" />
              <Input
                type="text"
                placeholder="소식 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* News List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {filteredNews.length === 0 ? (
            <div className="text-center py-16">
              <Newspaper className="w-12 h-12 text-[var(--gray-300)] mx-auto mb-4" />
              <p className="text-[var(--gray-500)] text-lg">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-[var(--gray-600)]">
                총 <span className="font-semibold text-[var(--primary)]">{filteredNews.length}</span>개의 소식
              </div>
              <div className="space-y-4">
                {filteredNews.map((news) => (
                  <Link key={news.id} href={`/news/${news.id}`}>
                    <Card variant="bordered" className="hover:shadow-[var(--shadow-md)] hover:border-[var(--primary)] transition-all cursor-pointer">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-[var(--primary)] bg-[var(--primary-light)] rounded-full">
                              {getCategoryIcon(news.category)}
                              {getCategoryName(news.category)}
                            </span>
                            <span className="text-sm text-[var(--gray-400)]">{news.date}</span>
                          </div>
                          <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2 line-clamp-1">
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

      {/* Quick Links */}
      <section className="bg-[var(--gray-50)] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-6 text-center">카테고리별 보기</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/news/press">
              <Card variant="bordered" className="text-center hover:shadow-[var(--shadow-lg)] hover:border-[var(--primary)] transition-all cursor-pointer bg-white">
                <div className="w-12 h-12 bg-[var(--primary-light)] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2">보도자료</h3>
                <p className="text-sm text-[var(--gray-600)]">언론에 배포된 공식 보도자료</p>
              </Card>
            </Link>
            <Link href="/news/statements">
              <Card variant="bordered" className="text-center hover:shadow-[var(--shadow-lg)] hover:border-[var(--primary)] transition-all cursor-pointer bg-white">
                <div className="w-12 h-12 bg-[var(--primary-light)] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2">성명서</h3>
                <p className="text-sm text-[var(--gray-600)]">주요 현안에 대한 당의 입장</p>
              </Card>
            </Link>
            <Link href="/news/schedule">
              <Card variant="bordered" className="text-center hover:shadow-[var(--shadow-lg)] hover:border-[var(--primary)] transition-all cursor-pointer bg-white">
                <div className="w-12 h-12 bg-[var(--primary-light)] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2">일정</h3>
                <p className="text-sm text-[var(--gray-600)]">행사 및 활동 일정 안내</p>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

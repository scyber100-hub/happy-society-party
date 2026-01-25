'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  Newspaper,
  FileText,
  Calendar,
  Search,
  ChevronRight,
  Loader2,
  type LucideIcon,
} from 'lucide-react';

// 카테고리 정의
const categories: { id: string; name: string; icon: LucideIcon; href: string }[] = [
  { id: 'all', name: '전체', icon: Newspaper, href: '/news' },
  { id: 'press', name: '보도자료', icon: FileText, href: '/news/press' },
  { id: 'statement', name: '성명서', icon: FileText, href: '/news/statements' },
  { id: 'schedule', name: '일정', icon: Calendar, href: '/news/schedule' },
];

interface NewsItem {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string | null;
  author: string | null;
  thumbnail_url: string | null;
  is_featured: boolean;
  published_at: string;
}

export default function NewsPage() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/news?is_published=eq.true&select=id,slug,category,title,excerpt,author,thumbnail_url,is_featured,published_at&order=published_at.desc`;
        const response = await fetch(url, {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setNewsData(data);
        }
      } catch (e) {
        console.error('Fetch error:', e);
      }
      setLoading(false);
    }

    fetchNews();
  }, []);

  const filteredNews = useMemo(() => {
    return newsData.filter((news) => {
      const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
      const matchesSearch = searchQuery === '' ||
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (news.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      return matchesCategory && matchesSearch;
    });
  }, [newsData, selectedCategory, searchQuery]);

  const featuredNews = useMemo(() => {
    return newsData.filter(news => news.is_featured);
  }, [newsData]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

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
                <Link key={news.id} href={`/news/${news.slug}`}>
                  <Card variant="bordered" className="h-full hover:shadow-[var(--shadow-lg)] hover:border-[var(--primary)] transition-all cursor-pointer bg-white">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-[var(--primary)] bg-[var(--primary-light)] rounded-full">
                        {getCategoryIcon(news.category)}
                        {getCategoryName(news.category)}
                      </span>
                      <span className="text-sm text-[var(--gray-400)]">{formatDate(news.published_at)}</span>
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
                  <Link key={news.id} href={`/news/${news.slug}`}>
                    <Card variant="bordered" className="hover:shadow-[var(--shadow-md)] hover:border-[var(--primary)] transition-all cursor-pointer">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-[var(--primary)] bg-[var(--primary-light)] rounded-full">
                              {getCategoryIcon(news.category)}
                              {getCategoryName(news.category)}
                            </span>
                            <span className="text-sm text-[var(--gray-400)]">{formatDate(news.published_at)}</span>
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

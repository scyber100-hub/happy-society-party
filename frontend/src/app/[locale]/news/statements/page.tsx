'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  FileText,
  Search,
  ChevronRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  author: string | null;
  published_at: string;
}

export default function StatementsPage() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/news?is_published=eq.true&category=eq.statement&select=id,slug,title,excerpt,author,published_at&order=published_at.desc`;
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

  const filteredStatements = useMemo(() => {
    return newsData.filter((news) => {
      return searchQuery === '' ||
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (news.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    });
  }, [newsData, searchQuery]);

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
                  <Link key={news.id} href={`/news/${news.slug}`}>
                    <Card variant="bordered" className="hover:shadow-[var(--shadow-md)] hover:border-[var(--primary)] transition-all cursor-pointer">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-[var(--gray-400)]">{formatDate(news.published_at)}</span>
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

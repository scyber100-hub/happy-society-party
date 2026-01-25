import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/server';
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Share2,
  ChevronRight,
} from 'lucide-react';

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
  const supabase = await createClient();

  // Fetch news by slug
  const { data: news, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', id)
    .eq('is_published', true)
    .single();

  if (error || !news) {
    notFound();
  }

  // Fetch related news
  const { data: relatedNews } = await supabase
    .from('news')
    .select('id, slug, title, published_at')
    .eq('category', news.category)
    .eq('is_published', true)
    .neq('id', news.id)
    .order('published_at', { ascending: false })
    .limit(3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
              {categoryLabels[news.category] || news.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{news.title}</h1>
          <div className="flex items-center gap-4 text-white/80">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(news.published_at)}
            </span>
            {news.author && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {news.author}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            {news.content ? (
              news.content.split('\n\n').map((paragraph: string, index: number) => {
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
              })
            ) : (
              <p className="text-[var(--gray-700)] leading-relaxed my-4">
                {news.excerpt}
              </p>
            )}
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
      {relatedNews && relatedNews.length > 0 && (
        <section className="bg-[var(--gray-50)] py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-6">관련 소식</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedNews.map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`}>
                  <Card variant="bordered" className="h-full hover:shadow-[var(--shadow-md)] hover:border-[var(--primary)] transition-all cursor-pointer bg-white">
                    <span className="text-sm text-[var(--gray-400)] mb-2 block">{formatDate(item.published_at)}</span>
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

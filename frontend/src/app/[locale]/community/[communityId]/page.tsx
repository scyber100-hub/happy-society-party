import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/server';
import { MapPin, ClipboardList } from 'lucide-react';

export const runtime = 'edge';
export const revalidate = 30;

interface Props {
  params: Promise<{ communityId: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getCommunity(communityId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('communities')
    .select('*, regions(*), committees(*)')
    .eq('id', communityId)
    .single();

  if (error || !data) return null;
  return data;
}

async function getPosts(communityId: string, page: number = 1, limit: number = 20) {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  const { data, count } = await supabase
    .from('posts')
    .select('*, author:user_profiles(id, name, avatar_url)', { count: 'exact' })
    .eq('community_id', communityId)
    .eq('is_published', true)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  return {
    posts: data || [],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return '방금 전';
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString('ko-KR');
}

export default async function CommunityDetailPage({ params, searchParams }: Props) {
  const { communityId } = await params;
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1', 10);

  const community = await getCommunity(communityId);

  if (!community) {
    notFound();
  }

  const { posts, totalCount, totalPages } = await getPosts(communityId, page);

  const isRegion = community.type === 'region';

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <div className="bg-[var(--primary)] text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 text-white/80 mb-4">
            <Link href="/community" className="hover:text-white">커뮤니티</Link>
            <span>/</span>
            <span>{isRegion ? '지역' : '상임위원회'}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              {isRegion ? (
                <MapPin className="w-8 h-8 text-white" />
              ) : (
                <ClipboardList className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{community.name}</h1>
              {community.description && (
                <p className="text-white/90 mt-1">{community.description}</p>
              )}
            </div>
          </div>
          <div className="flex gap-6 mt-6 text-white/80">
            <span>당원 {(community.member_count || 0).toLocaleString()}명</span>
            <span>게시글 {totalCount.toLocaleString()}개</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Write Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[var(--gray-900)]">게시글</h2>
          <Link href={`/community/${communityId}/write`}>
            <Button>글 작성</Button>
          </Link>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <Card variant="default" className="bg-white text-center py-12">
            <p className="text-[var(--gray-500)]">아직 작성된 게시글이 없습니다.</p>
            <p className="text-[var(--gray-400)] text-sm mt-1">첫 번째 글을 작성해보세요!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/community/${communityId}/posts/${post.id}`}>
                <Card variant="default" className="bg-white hover:shadow-[var(--shadow-md)] transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {post.is_pinned && (
                          <span className="px-2 py-0.5 bg-[var(--primary)] text-white text-xs rounded">
                            공지
                          </span>
                        )}
                        <h3 className="font-medium text-[var(--gray-900)] truncate">
                          {post.title}
                        </h3>
                        {(post.comment_count || 0) > 0 && (
                          <span className="text-[var(--primary)] text-sm">
                            [{post.comment_count}]
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[var(--gray-500)]">
                        <span>{post.author?.name || '알 수 없음'}</span>
                        <span>{formatDate(post.created_at!)}</span>
                        <span>조회 {post.view_count || 0}</span>
                        <span>좋아요 {post.like_count || 0}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {page > 1 && (
              <Link href={`/community/${communityId}?page=${page - 1}`}>
                <Button variant="outline" size="sm">이전</Button>
              </Link>
            )}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              if (pageNum > totalPages) return null;
              return (
                <Link key={pageNum} href={`/community/${communityId}?page=${pageNum}`}>
                  <Button
                    variant={pageNum === page ? 'primary' : 'outline'}
                    size="sm"
                  >
                    {pageNum}
                  </Button>
                </Link>
              );
            })}
            {page < totalPages && (
              <Link href={`/community/${communityId}?page=${page + 1}`}>
                <Button variant="outline" size="sm">다음</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

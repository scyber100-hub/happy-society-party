import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/server';
import PostActions from './PostActions';
import CommentSection from './CommentSection';

interface Props {
  params: Promise<{ communityId: string; postId: string }>;
}

async function getPost(postId: string) {
  const supabase = await createClient();

  // 조회수 증가
  try {
    await supabase.rpc('increment_view_count', { post_id: postId });
  } catch {
    // 조회수 증가 실패 시 무시
  }

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:user_profiles(id, name, avatar_url),
      community:communities(id, name, type)
    `)
    .eq('id', postId)
    .single();

  if (error || !data) return null;
  return data;
}

async function getComments(postId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('comments')
    .select('*, author:user_profiles(id, name, avatar_url)')
    .eq('post_id', postId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true });

  return data || [];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function PostDetailPage({ params }: Props) {
  const { communityId, postId } = await params;

  const [post, comments] = await Promise.all([
    getPost(postId),
    getComments(postId),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--gray-500)] mb-6">
          <Link href="/community" className="hover:text-[var(--primary)]">커뮤니티</Link>
          <span>/</span>
          <Link href={`/community/${communityId}`} className="hover:text-[var(--primary)]">
            {post.community?.name}
          </Link>
          <span>/</span>
          <span className="text-[var(--gray-700)]">게시글</span>
        </div>

        {/* Post */}
        <Card variant="default" className="bg-white mb-6">
          {/* Title */}
          <div className="border-b border-[var(--gray-200)] pb-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              {post.is_pinned && (
                <span className="px-2 py-0.5 bg-[var(--primary)] text-white text-xs rounded">
                  공지
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-[var(--gray-900)]">{post.title}</h1>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--gray-200)] flex items-center justify-center overflow-hidden">
                  {post.author?.avatar_url ? (
                    <img src={post.author.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[var(--gray-500)]">{post.author?.name?.[0] || '?'}</span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-[var(--gray-900)]">{post.author?.name || '알 수 없음'}</div>
                  <div className="text-sm text-[var(--gray-500)]">{formatDate(post.created_at!)}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-[var(--gray-500)]">
                <span>조회 {post.view_count || 0}</span>
                <span>좋아요 {post.like_count || 0}</span>
                <span>댓글 {post.comment_count || 0}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none text-[var(--gray-700)] whitespace-pre-wrap min-h-[200px]">
            {post.content}
          </div>

          {/* Actions */}
          <PostActions postId={post.id} communityId={communityId} authorId={post.author?.id} />
        </Card>

        {/* Comments */}
        <CommentSection postId={post.id} initialComments={comments} />

        {/* Back Button */}
        <div className="mt-6">
          <Link
            href={`/community/${communityId}`}
            className="text-[var(--primary)] hover:underline"
          >
            ← 목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}

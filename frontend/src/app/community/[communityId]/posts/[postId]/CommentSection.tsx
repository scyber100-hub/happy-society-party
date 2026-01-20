'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthContext } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import type { Comment, UserProfile } from '@/types/database';

interface CommentWithAuthor extends Comment {
  author: Pick<UserProfile, 'id' | 'name' | 'avatar_url'> | null;
}

interface Props {
  postId: string;
  initialComments: CommentWithAuthor[];
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diff / (1000 * 60));
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString('ko-KR');
}

export default function CommentSection({ postId, initialComments }: Props) {
  const router = useRouter();
  const { user, profile } = useAuthContext();
  const supabase = createClient();

  const [comments, setComments] = useState<CommentWithAuthor[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/auth/login');
      return;
    }
    if (!newComment.trim()) return;

    setIsLoading(true);

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_id: user.id,
        content: newComment.trim(),
      })
      .select('*, author:user_profiles(id, name, avatar_url)')
      .single();

    if (!error && data) {
      setComments([...comments, data as CommentWithAuthor]);
      setNewComment('');

      // 게시글 댓글 수 업데이트
      await supabase
        .from('posts')
        .update({ comment_count: comments.length + 1 })
        .eq('id', postId);
    }

    setIsLoading(false);
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/auth/login');
      return;
    }
    if (!replyContent.trim()) return;

    setIsLoading(true);

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_id: user.id,
        parent_id: parentId,
        content: replyContent.trim(),
      })
      .select('*, author:user_profiles(id, name, avatar_url)')
      .single();

    if (!error && data) {
      setComments([...comments, data as CommentWithAuthor]);
      setReplyTo(null);
      setReplyContent('');

      await supabase
        .from('posts')
        .update({ comment_count: comments.length + 1 })
        .eq('id', postId);
    }

    setIsLoading(false);
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    setIsLoading(true);

    const { error } = await supabase
      .from('comments')
      .update({ content: editContent.trim() })
      .eq('id', commentId);

    if (!error) {
      setComments(comments.map((c) =>
        c.id === commentId ? { ...c, content: editContent.trim() } : c
      ));
      setEditingId(null);
      setEditContent('');
    }

    setIsLoading(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    setIsLoading(true);

    const { error } = await supabase
      .from('comments')
      .update({ is_deleted: true })
      .eq('id', commentId);

    if (!error) {
      setComments(comments.filter((c) => c.id !== commentId));

      await supabase
        .from('posts')
        .update({ comment_count: comments.length - 1 })
        .eq('id', postId);
    }

    setIsLoading(false);
  };

  // 댓글을 트리 구조로 정리
  const rootComments = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parent_id === parentId);

  const renderComment = (comment: CommentWithAuthor, isReply = false) => (
    <div
      key={comment.id}
      className={`${isReply ? 'ml-8 border-l-2 border-[var(--gray-200)] pl-4' : ''}`}
    >
      <div className="flex items-start gap-3 py-4">
        <div className="w-8 h-8 rounded-full bg-[var(--gray-200)] flex items-center justify-center overflow-hidden flex-shrink-0">
          {comment.author?.avatar_url ? (
            <img src={comment.author.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm text-[var(--gray-500)]">
              {comment.author?.name?.[0] || '?'}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-[var(--gray-900)]">
              {comment.author?.name || '알 수 없음'}
            </span>
            <span className="text-sm text-[var(--gray-400)]">
              {formatDate(comment.created_at!)}
            </span>
          </div>

          {editingId === comment.id ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[var(--radius-md)] resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleEditComment(comment.id)} disabled={isLoading}>
                  저장
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-[var(--gray-700)] whitespace-pre-wrap">{comment.content}</p>
              <div className="flex items-center gap-3 mt-2">
                {!isReply && (
                  <button
                    onClick={() => {
                      setReplyTo(replyTo === comment.id ? null : comment.id);
                      setReplyContent('');
                    }}
                    className="text-sm text-[var(--gray-500)] hover:text-[var(--primary)]"
                  >
                    답글
                  </button>
                )}
                {user?.id === comment.author?.id && (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                      }}
                      className="text-sm text-[var(--gray-500)] hover:text-[var(--primary)]"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-sm text-[var(--gray-500)] hover:text-[var(--error)]"
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {/* Reply Form */}
          {replyTo === comment.id && (
            <div className="mt-3 space-y-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="답글을 입력하세요..."
                className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[var(--radius-md)] resize-none"
                rows={2}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleSubmitReply(comment.id)} disabled={isLoading}>
                  답글 등록
                </Button>
                <Button size="sm" variant="outline" onClick={() => setReplyTo(null)}>
                  취소
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {getReplies(comment.id).map((reply) => renderComment(reply, true))}
    </div>
  );

  return (
    <Card variant="default" className="bg-white">
      <h3 className="text-lg font-bold text-[var(--gray-900)] mb-4">
        댓글 {comments.length}개
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? '댓글을 입력하세요...' : '로그인 후 댓글을 작성할 수 있습니다.'}
          disabled={!user}
          className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-[var(--radius-md)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:bg-[var(--gray-100)]"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <Button type="submit" disabled={!user || !newComment.trim() || isLoading}>
            댓글 등록
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="divide-y divide-[var(--gray-100)]">
        {rootComments.length === 0 ? (
          <p className="text-center text-[var(--gray-500)] py-8">
            아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
          </p>
        ) : (
          rootComments.map((comment) => renderComment(comment))
        )}
      </div>
    </Card>
  );
}

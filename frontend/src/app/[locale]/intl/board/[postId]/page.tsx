'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  Globe,
  Eye,
  ThumbsUp,
  MessageSquare,
  Share2,
  Edit,
  Trash2,
  Send
} from 'lucide-react';
import {
  getIntlPost,
  getIntlPostComments,
  createIntlPostComment,
  updateIntlPostComment,
  deleteIntlPostComment,
  toggleIntlPostLike,
  hasLikedPost,
  deleteIntlPost,
  getIntlMemberByUserId
} from '@/lib/international';
import {
  countryFlags,
  postCategoryLabels,
  postCategoryColors,
  type IntlPost,
  type IntlPostComment,
  type IntlMember
} from '@/types/international';
import { useAuth } from '@/hooks/useAuth';

interface PageProps {
  params: Promise<{ postId: string }>;
}

export default function IntlPostPage({ params }: PageProps) {
  const { postId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<IntlPost | null>(null);
  const [comments, setComments] = useState<IntlPostComment[]>([]);
  const [currentMember, setCurrentMember] = useState<IntlMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPost = useCallback(async () => {
    try {
      setIsLoading(true);
      const [postData, commentsData] = await Promise.all([
        getIntlPost(postId),
        getIntlPostComments(postId),
      ]);
      setPost(postData);
      setComments(commentsData);
      if (postData) {
        setLikeCount(postData.like_count);
      }
    } catch (error) {
      console.error('Failed to load post:', error);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const loadMember = useCallback(async () => {
    if (!user?.id) return;
    try {
      const member = await getIntlMemberByUserId(user.id);
      setCurrentMember(member);
    } catch (error) {
      console.error('Failed to load member:', error);
    }
  }, [user?.id]);

  const checkLikeStatus = useCallback(async () => {
    if (!currentMember || !post) return;
    try {
      const liked = await hasLikedPost(post.id, currentMember.id);
      setHasLiked(liked);
    } catch (error) {
      console.error('Failed to check like status:', error);
    }
  }, [currentMember, post]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  useEffect(() => {
    if (user?.id) {
      loadMember();
    }
  }, [user?.id, loadMember]);

  useEffect(() => {
    if (currentMember && post) {
      checkLikeStatus();
    }
  }, [currentMember, post, checkLikeStatus]);

  async function handleLike() {
    if (!currentMember || !post) return;
    try {
      const isNowLiked = await toggleIntlPostLike(post.id, currentMember.id);
      setHasLiked(isNowLiked);
      setLikeCount(prev => isNowLiked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  }

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!currentMember || !commentText.trim()) return;

    try {
      setIsSubmitting(true);
      const newComment = await createIntlPostComment({
        post_id: postId,
        author_id: currentMember.id,
        content: commentText.trim(),
      });
      setComments(prev => [...prev, newComment]);
      setCommentText('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmitReply(parentId: string) {
    if (!currentMember || !replyText.trim()) return;

    try {
      setIsSubmitting(true);
      const newComment = await createIntlPostComment({
        post_id: postId,
        author_id: currentMember.id,
        content: replyText.trim(),
        parent_id: parentId,
      });
      // Add reply to the parent comment
      setComments(prev => prev.map(c => {
        if (c.id === parentId) {
          return { ...c, replies: [...(c.replies || []), newComment] };
        }
        return c;
      }));
      setReplyingTo(null);
      setReplyText('');
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEditComment(commentId: string) {
    if (!editText.trim()) return;
    try {
      await updateIntlPostComment(commentId, editText.trim());
      // Update comment in state
      const updateCommentInList = (list: IntlPostComment[]): IntlPostComment[] => {
        return list.map(c => {
          if (c.id === commentId) {
            return { ...c, content: editText.trim() };
          }
          if (c.replies) {
            return { ...c, replies: updateCommentInList(c.replies) };
          }
          return c;
        });
      };
      setComments(prev => updateCommentInList(prev));
      setEditingComment(null);
      setEditText('');
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteIntlPostComment(commentId);
      // Update comment to show deleted
      const updateCommentInList = (list: IntlPostComment[]): IntlPostComment[] => {
        return list.map(c => {
          if (c.id === commentId) {
            return { ...c, content: '[Deleted]', is_deleted: true };
          }
          if (c.replies) {
            return { ...c, replies: updateCommentInList(c.replies) };
          }
          return c;
        });
      };
      setComments(prev => updateCommentInList(prev));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  }

  async function handleDeletePost() {
    if (!post || !confirm('Are you sure you want to delete this post?')) return;
    try {
      await deleteIntlPost(post.id);
      router.push('/intl/board');
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({
        title: post?.title,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  }

  const getAuthorName = (author?: IntlMember | null) => {
    if (!author) return 'Anonymous';
    return `${author.first_name} ${author.last_name}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isAuthor = currentMember?.id === post?.author_id;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Post not found</h2>
          <p className="text-gray-500 mb-4">The post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/intl/board">
            <Button variant="primary">Back to Board</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/intl/board"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Board
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Post Content */}
        <Card className="bg-white mb-8">
          <CardContent className="p-8">
            {/* Category & Chapter */}
            <div className="flex items-center gap-2 mb-4">
              {post.is_pinned && (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                  Pinned
                </span>
              )}
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${postCategoryColors[post.category]}`}>
                {postCategoryLabels[post.category]?.en || post.category}
              </span>
              {post.chapter && (
                <span className="text-sm text-gray-500">
                  {countryFlags[post.chapter.country_code]} {post.chapter.country_name_en}
                </span>
              )}
              {post.is_global && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Global
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Author & Date */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
              <span className="flex items-center gap-1">
                {post.author && countryFlags[post.author.country_code]}
                {getAuthorName(post.author as IntlMember)}
              </span>
              <span>{formatDate(post.created_at)}</span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.view_count} views
              </span>
            </div>

            {/* Content */}
            <div className="prose max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  disabled={!currentMember}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    hasLiked
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  {likeCount}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              {isAuthor && (
                <div className="flex items-center gap-2">
                  <Link href={`/intl/board/${post.id}/edit`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleDeletePost}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="bg-white">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Comments ({post.comment_count})
            </h2>

            {/* Comment Form */}
            {currentMember ? (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!commentText.trim() || isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Post Comment
                  </Button>
                </div>
              </form>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center mb-8">
                <p className="text-gray-600 mb-3">Join to participate in the discussion</p>
                <Link href="/intl/join">
                  <Button variant="primary">Become a Member</Button>
                </Link>
              </div>
            )}

            {/* Comments List */}
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-6">
                {comments.map(comment => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentMember={currentMember}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    replyText={replyText}
                    setReplyText={setReplyText}
                    editingComment={editingComment}
                    setEditingComment={setEditingComment}
                    editText={editText}
                    setEditText={setEditText}
                    onSubmitReply={handleSubmitReply}
                    onEditComment={handleEditComment}
                    onDeleteComment={handleDeleteComment}
                    isSubmitting={isSubmitting}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface CommentItemProps {
  comment: IntlPostComment;
  currentMember: IntlMember | null;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  editingComment: string | null;
  setEditingComment: (id: string | null) => void;
  editText: string;
  setEditText: (text: string) => void;
  onSubmitReply: (parentId: string) => void;
  onEditComment: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  isSubmitting: boolean;
  depth?: number;
}

function CommentItem({
  comment,
  currentMember,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
  editingComment,
  setEditingComment,
  editText,
  setEditText,
  onSubmitReply,
  onEditComment,
  onDeleteComment,
  isSubmitting,
  depth = 0,
}: CommentItemProps) {
  const isAuthor = currentMember?.id === comment.author_id;

  const getAuthorName = (author?: IntlMember | null) => {
    if (!author) return 'Anonymous';
    return `${author.first_name} ${author.last_name}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes}m ago`;
      }
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 pl-4 border-l-2 border-gray-100' : ''}`}>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-900">
              {comment.author && countryFlags[comment.author.country_code]}{' '}
              {getAuthorName(comment.author as IntlMember)}
            </span>
            <span className="text-gray-500">{formatDate(comment.created_at)}</span>
          </div>
          {isAuthor && !comment.is_deleted && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingComment(comment.id);
                  setEditText(comment.content);
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteComment(comment.id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {editingComment === comment.id ? (
          <div>
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              rows={2}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingComment(null);
                  setEditText('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onEditComment(comment.id)}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className={`text-gray-700 ${comment.is_deleted ? 'italic text-gray-400' : ''}`}>
            {comment.content}
          </p>
        )}

        {!comment.is_deleted && currentMember && depth === 0 && (
          <button
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            className="text-sm text-[var(--primary)] mt-2 hover:underline"
          >
            Reply
          </button>
        )}
      </div>

      {/* Reply Form */}
      {replyingTo === comment.id && (
        <div className="ml-8 mt-2">
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            rows={2}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setReplyingTo(null);
                setReplyText('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onSubmitReply(comment.id)}
              disabled={!replyText.trim() || isSubmitting}
            >
              Reply
            </Button>
          </div>
        </div>
      )}

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentMember={currentMember}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              editingComment={editingComment}
              setEditingComment={setEditingComment}
              editText={editText}
              setEditText={setEditText}
              onSubmitReply={onSubmitReply}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
              isSubmitting={isSubmitting}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthContext } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft,
  Bell,
  MessageSquare,
  Heart,
  FileText,
  Settings,
  Filter,
  Loader2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Notification {
  id: string;
  type: 'post' | 'comment' | 'like' | 'payment' | 'system';
  icon: LucideIcon;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  link?: string;
}

const filterOptions = [
  { id: 'all', label: '전체' },
  { id: 'post', label: '게시글' },
  { id: 'comment', label: '댓글' },
  { id: 'like', label: '좋아요' },
];

export default function NotificationsPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, isAuthenticated } = useAuthContext();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const supabase = createClient();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    const notificationsList: Notification[] = [];

    // 내 게시글에 달린 댓글 가져오기
    const { data: myPosts } = await supabase
      .from('posts')
      .select('id, title, community_id')
      .eq('author_id', user.id);

    if (myPosts && myPosts.length > 0) {
      const postIds = myPosts.map(p => p.id);

      // 내 게시글에 달린 다른 사람의 댓글
      const { data: comments } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          post_id,
          author_id,
          author:user_profiles!comments_author_id_fkey(name)
        `)
        .in('post_id', postIds)
        .neq('author_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (comments) {
        comments.forEach((comment: {
          id: string;
          content: string;
          created_at: string | null;
          post_id: string | null;
          author_id: string | null;
          author: { name: string } | null;
        }) => {
          const post = myPosts.find(p => p.id === comment.post_id);
          if (post) {
            notificationsList.push({
              id: `comment-${comment.id}`,
              type: 'comment',
              icon: MessageSquare,
              title: '새 댓글이 달렸습니다',
              message: `${comment.author?.name || '누군가'}님이 "${post.title}"에 댓글을 남겼습니다.`,
              date: comment.created_at || '',
              isRead: false, // 실제로는 읽음 상태를 DB에서 관리해야 함
              link: `/community/${post.community_id}/posts/${post.id}`,
            });
          }
        });
      }

      // 내 게시글에 달린 좋아요
      const { data: likes } = await supabase
        .from('likes')
        .select(`
          id,
          created_at,
          post_id,
          user_id,
          user:user_profiles!likes_user_id_fkey(name)
        `)
        .in('post_id', postIds)
        .neq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (likes) {
        likes.forEach((like: {
          id: string;
          created_at: string | null;
          post_id: string | null;
          user_id: string | null;
          user: { name: string } | null;
        }) => {
          const post = myPosts.find(p => p.id === like.post_id);
          if (post) {
            notificationsList.push({
              id: `like-${like.id}`,
              type: 'like',
              icon: Heart,
              title: '게시글 좋아요',
              message: `${like.user?.name || '누군가'}님이 "${post.title}"을(를) 좋아합니다.`,
              date: like.created_at || '',
              isRead: false,
              link: `/community/${post.community_id}/posts/${post.id}`,
            });
          }
        });
      }
    }

    // 내 댓글에 달린 대댓글
    const { data: myComments } = await supabase
      .from('comments')
      .select('id, post_id')
      .eq('author_id', user.id);

    if (myComments && myComments.length > 0) {
      const commentIds = myComments.map(c => c.id);

      const { data: replies } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          parent_id,
          post_id,
          author_id,
          author:user_profiles!comments_author_id_fkey(name),
          posts(title, community_id)
        `)
        .in('parent_id', commentIds)
        .neq('author_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (replies) {
        replies.forEach((reply: {
          id: string;
          content: string;
          created_at: string | null;
          parent_id: string | null;
          post_id: string | null;
          author_id: string | null;
          author: { name: string } | null;
          posts: { title: string; community_id: string | null } | null;
        }) => {
          notificationsList.push({
            id: `reply-${reply.id}`,
            type: 'comment',
            icon: MessageSquare,
            title: '새 답글이 달렸습니다',
            message: `${reply.author?.name || '누군가'}님이 댓글에 답글을 남겼습니다.`,
            date: reply.created_at || '',
            isRead: false,
            link: reply.posts
              ? `/community/${reply.posts.community_id}/posts/${reply.post_id}`
              : undefined,
          });
        });
      }
    }

    // 최근 결제 알림
    const { data: payments } = await supabase
      .from('payments')
      .select('id, amount, status, paid_at')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('paid_at', { ascending: false })
      .limit(3);

    if (payments) {
      payments.forEach(payment => {
        notificationsList.push({
          id: `payment-${payment.id}`,
          type: 'payment',
          icon: Bell,
          title: '당비 납부 완료',
          message: `${payment.amount.toLocaleString()}원 당비 납부가 완료되었습니다.`,
          date: payment.paid_at || '',
          isRead: true,
          link: '/portal/payments',
        });
      });
    }

    // 날짜순 정렬
    notificationsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setNotifications(notificationsList);
    setLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/portal/notifications');
      return;
    }

    if (user) {
      fetchNotifications();
    }
  }, [authLoading, isAuthenticated, user, router, fetchNotifications]);

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === 'all') return true;
    return notification.type === activeFilter;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes <= 1 ? '방금 전' : `${minutes}분 전`;
      }
      return `${hours}시간 전`;
    }
    if (days === 1) return '어제';
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'post':
        return 'bg-[var(--primary-light)] text-[var(--primary)]';
      case 'comment':
        return 'bg-green-100 text-green-600';
      case 'like':
        return 'bg-red-100 text-red-500';
      case 'payment':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-[var(--gray-100)] text-[var(--gray-600)]';
    }
  };

  // 로딩 상태
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)] mx-auto mb-4" />
          <p className="text-[var(--gray-500)]">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--gray-500)]">프로필 정보를 불러올 수 없습니다.</p>
          <Link href="/auth/login">
            <Button variant="primary" className="mt-4">로그인하기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <div className="bg-[var(--primary)] text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/portal"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            대시보드로 돌아가기
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">알림</h1>
              <p className="text-white/80 mt-1">
                {notifications.length > 0
                  ? `총 ${notifications.length}개의 알림`
                  : '새로운 알림이 없습니다.'}
              </p>
            </div>
            <Button variant="secondary" size="sm">
              <Settings className="w-4 h-4 mr-1" />
              알림 설정
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          <Filter className="w-4 h-4 text-[var(--gray-500)] flex-shrink-0" />
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setActiveFilter(option.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === option.id
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-white text-[var(--gray-600)] hover:bg-[var(--gray-100)] border border-[var(--gray-200)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <Card variant="default" className="bg-white">
          <CardContent className="p-0">
            {filteredNotifications.length > 0 ? (
              <div className="divide-y divide-[var(--gray-100)]">
                {filteredNotifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-[var(--gray-50)] transition-colors ${
                        !notification.isRead ? 'bg-[var(--primary-light)]/30' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(
                            notification.type
                          )}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {notification.link ? (
                            <Link href={notification.link} className="block">
                              <div className="flex items-start justify-between gap-2">
                                <h4
                                  className={`font-medium ${
                                    !notification.isRead
                                      ? 'text-[var(--gray-900)]'
                                      : 'text-[var(--gray-700)]'
                                  }`}
                                >
                                  {!notification.isRead && (
                                    <span className="inline-block w-2 h-2 bg-[var(--primary)] rounded-full mr-2"></span>
                                  )}
                                  {notification.title}
                                </h4>
                                <span className="text-xs text-[var(--gray-400)] whitespace-nowrap">
                                  {formatDate(notification.date)}
                                </span>
                              </div>
                              <p className="text-sm text-[var(--gray-600)] mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                            </Link>
                          ) : (
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h4
                                  className={`font-medium ${
                                    !notification.isRead
                                      ? 'text-[var(--gray-900)]'
                                      : 'text-[var(--gray-700)]'
                                  }`}
                                >
                                  {!notification.isRead && (
                                    <span className="inline-block w-2 h-2 bg-[var(--primary)] rounded-full mr-2"></span>
                                  )}
                                  {notification.title}
                                </h4>
                                <span className="text-xs text-[var(--gray-400)] whitespace-nowrap">
                                  {formatDate(notification.date)}
                                </span>
                              </div>
                              <p className="text-sm text-[var(--gray-600)] mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-[var(--gray-300)] mx-auto mb-3" />
                <p className="text-[var(--gray-500)]">
                  {activeFilter === 'all'
                    ? '아직 알림이 없습니다. 커뮤니티에서 활동을 시작해 보세요!'
                    : '해당 유형의 알림이 없습니다.'}
                </p>
                <Link href="/community">
                  <Button variant="outline" className="mt-4">
                    커뮤니티 둘러보기
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

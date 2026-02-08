'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthContext } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { User, CreditCard, Bell, Settings, MapPin, ClipboardList, FileText, MessageSquare, Heart, Loader2, TrendingUp } from 'lucide-react';
import { getActivityLevel, userRoleLabels } from '@/hooks/useActivities';
import { ContentRecommendations } from '@/components/ai';

interface RecentActivity {
  type: 'post' | 'comment' | 'like';
  content: string;
  date: string;
  link?: string;
}

interface UserCommunity {
  id: string;
  name: string;
  type: 'region' | 'committee';
  newPosts: number;
}

export default function PortalPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, isAuthenticated } = useAuthContext();
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [userCommunities, setUserCommunities] = useState<UserCommunity[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid' | 'pending'>('unpaid');
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchUserData = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    // 사용자의 최근 활동 가져오기 (게시글, 댓글, 좋아요)
    const activities: RecentActivity[] = [];

    // 최근 작성 게시글
    const { data: posts } = await supabase
      .from('posts')
      .select('id, title, created_at, community_id')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);

    if (posts) {
      posts.forEach(post => {
        activities.push({
          type: 'post',
          content: `"${post.title}" 게시글을 작성했습니다.`,
          date: post.created_at || '',
          link: `/community/${post.community_id}/posts/${post.id}`,
        });
      });
    }

    // 최근 댓글
    const { data: comments } = await supabase
      .from('comments')
      .select('id, content, created_at, post_id, posts(title, community_id)')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);

    if (comments) {
      comments.forEach((comment: { id: string; content: string; created_at: string | null; post_id: string | null; posts: { title: string; community_id: string | null } | null }) => {
        activities.push({
          type: 'comment',
          content: `"${comment.posts?.title || '게시글'}"에 댓글을 달았습니다.`,
          date: comment.created_at || '',
          link: comment.posts ? `/community/${comment.posts.community_id}/posts/${comment.post_id}` : undefined,
        });
      });
    }

    // 최근 좋아요
    const { data: likes } = await supabase
      .from('likes')
      .select('id, created_at, post_id, posts(title, community_id)')
      .eq('user_id', user.id)
      .not('post_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(3);

    if (likes) {
      likes.forEach((like: { id: string; created_at: string | null; post_id: string | null; posts: { title: string; community_id: string | null } | null }) => {
        activities.push({
          type: 'like',
          content: `"${like.posts?.title || '게시글'}"에 좋아요를 눌렀습니다.`,
          date: like.created_at || '',
          link: like.posts ? `/community/${like.posts.community_id}/posts/${like.post_id}` : undefined,
        });
      });
    }

    // 날짜순 정렬
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRecentActivities(activities.slice(0, 5));

    // 사용자 커뮤니티 가져오기
    const communities: UserCommunity[] = [];

    // 지역 커뮤니티 (profile.region_id 기반)
    if (profile?.region_id) {
      const { data: regionCommunity } = await supabase
        .from('communities')
        .select('id, name, type')
        .eq('region_id', profile.region_id)
        .eq('type', 'region')
        .single();

      if (regionCommunity) {
        // 새 게시글 수 계산 (최근 7일)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const { count } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('community_id', regionCommunity.id)
          .gte('created_at', weekAgo.toISOString());

        communities.push({
          id: regionCommunity.id,
          name: regionCommunity.name,
          type: 'region',
          newPosts: count || 0,
        });
      }
    }

    // 위원회 커뮤니티
    const { data: userCommittees } = await supabase
      .from('user_committees')
      .select('committee_id, committees(id, name)')
      .eq('user_id', user.id);

    if (userCommittees) {
      for (const uc of userCommittees) {
        const committee = uc.committees as { id: string; name: string } | null;
        if (committee) {
          // 해당 위원회의 커뮤니티 찾기
          const { data: committeeCommunity } = await supabase
            .from('communities')
            .select('id, name, type')
            .eq('committee_id', committee.id)
            .eq('type', 'committee')
            .single();

          if (committeeCommunity) {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);

            const { count } = await supabase
              .from('posts')
              .select('*', { count: 'exact', head: true })
              .eq('community_id', committeeCommunity.id)
              .gte('created_at', weekAgo.toISOString());

            communities.push({
              id: committeeCommunity.id,
              name: committeeCommunity.name,
              type: 'committee',
              newPosts: count || 0,
            });
          }
        }
      }
    }

    setUserCommunities(communities);

    // 당비 납부 상태 확인
    const currentYear = new Date().getFullYear();

    const { data: payment } = await supabase
      .from('payments')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .gte('period_start', `${currentYear}-01-01`)
      .order('period_end', { ascending: false })
      .limit(1)
      .single();

    if (payment) {
      setPaymentStatus('paid');
    } else {
      // pending 상태 확인
      const { data: pendingPayment } = await supabase
        .from('payments')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .limit(1)
        .single();

      setPaymentStatus(pendingPayment ? 'pending' : 'unpaid');
    }

    setLoading(false);
  }, [user, profile, supabase]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/portal');
      return;
    }

    if (user && profile) {
      fetchUserData();
    }
  }, [authLoading, isAuthenticated, user, profile, router, fetchUserData]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getPaymentStatusText = () => {
    switch (paymentStatus) {
      case 'paid': return '납부완료';
      case 'pending': return '처리중';
      case 'unpaid': return '미납';
    }
  };

  const getPaymentStatusColor = () => {
    switch (paymentStatus) {
      case 'paid': return 'text-[var(--success)]';
      case 'pending': return 'text-[var(--warning)]';
      case 'unpaid': return 'text-[var(--error)]';
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

  const getRoleName = (role: string | null) => {
    return userRoleLabels[role || 'guest'] || '게스트';
  };

  const activityLevel = getActivityLevel(profile.activity_score || 0);

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header Banner */}
      <div className="bg-[var(--primary)] text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">안녕하세요, {profile.name}님!</h1>
          <p className="text-white/80 mt-1">행복사회당 회원 포털에 오신 것을 환영합니다.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Quick Links */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card variant="default" className="bg-white">
              <CardHeader>
                <CardTitle>내 프로필</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-[var(--primary-light)] rounded-full flex items-center justify-center overflow-hidden relative">
                    {profile.avatar_url ? (
                      <Image src={profile.avatar_url} alt={profile.name} fill className="object-cover" />
                    ) : (
                      <span className="text-2xl text-[var(--primary)] font-bold">{profile.name[0]}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-[var(--gray-900)]">{profile.name}</div>
                    <div className="text-sm text-[var(--primary)]">{getRoleName(profile.role)}</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {profile.district && (
                    <div className="flex justify-between">
                      <span className="text-[var(--gray-500)]">지역</span>
                      <span className="text-[var(--gray-700)]">{profile.district}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[var(--gray-500)]">가입일</span>
                    <span className="text-[var(--gray-700)]">
                      {profile.created_at ? formatDate(profile.created_at) : '-'}
                    </span>
                  </div>
                  {profile.is_party_member && (
                    <div className="flex justify-between">
                      <span className="text-[var(--gray-500)]">당비</span>
                      <span className={getPaymentStatusColor()}>{getPaymentStatusText()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[var(--gray-500)]">활동 점수</span>
                    <span className="text-[var(--primary)] font-medium">{profile.activity_score || 0}점</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--gray-500)]">활동 레벨</span>
                    <span className="text-[var(--gray-700)]">Lv.{activityLevel.level} {activityLevel.name}</span>
                  </div>
                </div>
                <Link href="/portal/profile">
                  <Button variant="outline" fullWidth className="mt-4">
                    프로필 수정
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card variant="default" className="bg-white">
              <CardHeader>
                <CardTitle>바로가기</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Link href="/portal/profile" className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] hover:bg-[var(--gray-50)] transition-colors">
                    <div className="w-8 h-8 bg-[var(--primary-light)] rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-[var(--primary)]" />
                    </div>
                    <span className="text-[var(--gray-700)]">내 프로필</span>
                  </Link>
                  <Link href="/portal/activities" className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] hover:bg-[var(--gray-50)] transition-colors">
                    <div className="w-8 h-8 bg-[var(--primary-light)] rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
                    </div>
                    <span className="text-[var(--gray-700)]">활동 내역</span>
                  </Link>
                  <Link href="/portal/payments" className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] hover:bg-[var(--gray-50)] transition-colors">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-[var(--gray-700)]">당비 납부 현황</span>
                  </Link>
                  <Link href="/portal/notifications" className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] hover:bg-[var(--gray-50)] transition-colors">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Bell className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-[var(--gray-700)]">알림</span>
                  </Link>
                  <Link href="/portal/settings" className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] hover:bg-[var(--gray-50)] transition-colors">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-[var(--gray-700)]">설정</span>
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Communities & Activities */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Communities */}
            <Card variant="default" className="bg-white">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>내 커뮤니티</CardTitle>
                  <Link href="/community" className="text-sm text-[var(--primary)]">전체 보기</Link>
                </div>
              </CardHeader>
              <CardContent>
                {userCommunities.length === 0 ? (
                  <div className="text-center py-8 text-[var(--gray-500)]">
                    <p>가입한 커뮤니티가 없습니다.</p>
                    <Link href="/community">
                      <Button variant="outline" size="sm" className="mt-2">커뮤니티 둘러보기</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {userCommunities.map((community) => (
                      <Link
                        key={community.id}
                        href={`/community/${community.id}`}
                        className="block p-4 border border-[var(--gray-200)] rounded-[var(--radius-md)] hover:border-[var(--primary)] transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            community.type === 'region'
                              ? 'bg-[var(--primary-light)]'
                              : 'bg-blue-100'
                          }`}>
                            {community.type === 'region' ? (
                              <MapPin className="w-5 h-5 text-[var(--primary)]" />
                            ) : (
                              <ClipboardList className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-[var(--gray-900)]">{community.name}</div>
                            <div className="text-sm text-[var(--gray-500)]">
                              {community.type === 'region' ? '지역 커뮤니티' : '상임위원회'}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-[var(--gray-600)]">
                          {community.newPosts > 0 ? `새 게시글 ${community.newPosts}개` : '새 게시글 없음'}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card variant="default" className="bg-white">
              <CardHeader>
                <CardTitle>최근 활동</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivities.length === 0 ? (
                  <div className="text-center py-8 text-[var(--gray-500)]">
                    <p>아직 활동 내역이 없습니다.</p>
                    <Link href="/community">
                      <Button variant="outline" size="sm" className="mt-2">커뮤니티에서 활동하기</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[var(--gray-100)] rounded-full flex items-center justify-center">
                          {activity.type === 'post' && <FileText className="w-4 h-4 text-[var(--gray-600)]" />}
                          {activity.type === 'comment' && <MessageSquare className="w-4 h-4 text-[var(--gray-600)]" />}
                          {activity.type === 'like' && <Heart className="w-4 h-4 text-red-500" />}
                        </div>
                        <div className="flex-1">
                          {activity.link ? (
                            <Link href={activity.link} className="text-sm text-[var(--gray-700)] hover:text-[var(--primary)]">
                              {activity.content}
                            </Link>
                          ) : (
                            <p className="text-sm text-[var(--gray-700)]">{activity.content}</p>
                          )}
                          <p className="text-xs text-[var(--gray-400)] mt-1">{formatDate(activity.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Content Recommendations */}
            {user && (
              <ContentRecommendations userId={user.id} maxItems={5} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/server';
import {
  TrendingUp,
  Users,
  FileText,
  MessageSquare,
  Vote,
  Calendar,
  MapPin,
  Activity,
} from 'lucide-react';

export const runtime = 'edge';

interface ActivityStats {
  total_posts: number;
  total_comments: number;
  total_votes: number;
  total_events: number;
  active_members: number;
}

interface RegionalStats {
  region_name: string;
  member_count: number;
  post_count: number;
  activity_score: number;
}

interface MonthlyTrend {
  month: string;
  posts: number;
  comments: number;
  new_members: number;
}

interface TopContributor {
  name: string;
  post_count: number;
  comment_count: number;
  total_score: number;
}

async function getActivityStats(): Promise<ActivityStats> {
  const supabase = await createClient();

  const [postsRes, commentsRes, votesRes, eventsRes, activeMembersRes] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('comments').select('*', { count: 'exact', head: true }),
    supabase.from('vote_records').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('user_profiles').select('*', { count: 'exact', head: true })
      .in('membership_type', ['active', 'special']),
  ]);

  return {
    total_posts: postsRes.count || 0,
    total_comments: commentsRes.count || 0,
    total_votes: votesRes.count || 0,
    total_events: eventsRes.count || 0,
    active_members: activeMembersRes.count || 0,
  };
}

async function getRegionalStats(): Promise<RegionalStats[]> {
  const supabase = await createClient();

  // Get member counts by region
  const { data: regionData } = await supabase
    .from('regions')
    .select(`
      id,
      name,
      user_profiles(count)
    `)
    .order('name');

  if (!regionData) return [];

  // Get post counts by region community
  const { data: postData } = await supabase
    .from('communities')
    .select(`
      region_id,
      posts(count)
    `)
    .eq('type', 'region');

  const postCountByRegion: Record<string, number> = {};
  if (postData) {
    for (const community of postData) {
      if (community.region_id) {
        const posts = community.posts as unknown as { count: number }[];
        postCountByRegion[community.region_id] = (postCountByRegion[community.region_id] || 0) +
          (posts?.[0]?.count || 0);
      }
    }
  }

  return regionData.map((region) => {
    const memberCount = (region.user_profiles as unknown as { count: number }[])?.[0]?.count || 0;
    const postCount = postCountByRegion[region.id] || 0;
    return {
      region_name: region.name,
      member_count: memberCount,
      post_count: postCount,
      activity_score: memberCount * 10 + postCount * 5,
    };
  }).filter(r => r.member_count > 0)
    .sort((a, b) => b.activity_score - a.activity_score)
    .slice(0, 10);
}

async function getMonthlyTrends(): Promise<MonthlyTrend[]> {
  const supabase = await createClient();
  const trends: MonthlyTrend[] = [];

  // Get last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const [postsRes, commentsRes, membersRes] = await Promise.all([
      supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate)
        .lte('created_at', endDate + 'T23:59:59'),
      supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate)
        .lte('created_at', endDate + 'T23:59:59'),
      supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate)
        .lte('created_at', endDate + 'T23:59:59'),
    ]);

    trends.push({
      month: `${year}.${month.toString().padStart(2, '0')}`,
      posts: postsRes.count || 0,
      comments: commentsRes.count || 0,
      new_members: membersRes.count || 0,
    });
  }

  return trends;
}

async function getTopContributors(): Promise<TopContributor[]> {
  const supabase = await createClient();

  // Get top contributors by activity
  const { data: activities } = await supabase
    .from('activities')
    .select(`
      user_id,
      activity_type,
      points,
      user_profiles!activities_user_id_fkey(name)
    `)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })
    .limit(500);

  if (!activities) return [];

  // Aggregate by user
  const userStats: Record<string, { name: string; posts: number; comments: number; score: number }> = {};

  for (const activity of activities) {
    const userId = activity.user_id;
    const userName = (activity.user_profiles as { name: string } | null)?.name || 'Unknown';

    if (!userStats[userId]) {
      userStats[userId] = { name: userName, posts: 0, comments: 0, score: 0 };
    }

    if (activity.activity_type === 'post_create') {
      userStats[userId].posts++;
    } else if (activity.activity_type === 'comment_create') {
      userStats[userId].comments++;
    }
    userStats[userId].score += activity.points || 0;
  }

  return Object.values(userStats)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(u => ({
      name: u.name,
      post_count: u.posts,
      comment_count: u.comments,
      total_score: u.score,
    }));
}

async function getEngagementMetrics() {
  const supabase = await createClient();

  // Get total likes
  const { count: likesCount } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true });

  // Get average posts per active member
  const { count: memberCount } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true });

  const { count: postCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true });

  // Get event participation rate
  const { count: eventParticipants } = await supabase
    .from('event_participants')
    .select('*', { count: 'exact', head: true });

  const { count: eventCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true });

  return {
    totalLikes: likesCount || 0,
    avgPostsPerMember: memberCount ? ((postCount || 0) / memberCount).toFixed(1) : '0',
    eventParticipationRate: eventCount
      ? Math.round(((eventParticipants || 0) / (eventCount * 10)) * 100)
      : 0,
    activeRatio: memberCount
      ? Math.round(((postCount || 0) > 0 ? 1 : 0) * 100)
      : 0,
  };
}

function StatCard({
  icon: Icon,
  title,
  value,
  trend,
  color = 'primary',
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  trend?: string;
  color?: 'primary' | 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colors = {
    primary: 'bg-[var(--primary-light)] text-[var(--primary)]',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              {trend}
            </span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm text-[var(--gray-500)]">{title}</p>
          <p className="text-2xl font-bold text-[var(--gray-900)] mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function BarChart({ data, maxValue }: { data: { label: string; value: number }[]; maxValue: number }) {
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="w-20 text-sm text-[var(--gray-600)] truncate">{item.label}</div>
          <div className="flex-1 h-6 bg-[var(--gray-100)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] rounded-full transition-all"
              style={{ width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
            />
          </div>
          <div className="w-12 text-sm text-[var(--gray-700)] text-right">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export default async function AnalyticsPage() {
  const [activityStats, regionalStats, monthlyTrends, topContributors, engagement] = await Promise.all([
    getActivityStats(),
    getRegionalStats(),
    getMonthlyTrends(),
    getTopContributors(),
    getEngagementMetrics(),
  ]);

  const maxTrendValue = Math.max(
    ...monthlyTrends.map(t => Math.max(t.posts, t.comments, t.new_members))
  );

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--gray-900)]">분석 대시보드</h1>
        <p className="text-[var(--gray-500)] mt-1">당 활동 현황을 한눈에 파악하세요</p>
      </div>

      {/* Activity Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={FileText}
          title="총 게시글"
          value={activityStats.total_posts}
          color="primary"
        />
        <StatCard
          icon={MessageSquare}
          title="총 댓글"
          value={activityStats.total_comments}
          color="blue"
        />
        <StatCard
          icon={Vote}
          title="투표 참여"
          value={activityStats.total_votes}
          color="green"
        />
        <StatCard
          icon={Calendar}
          title="등록 행사"
          value={activityStats.total_events}
          color="purple"
        />
        <StatCard
          icon={Users}
          title="활동 당원"
          value={activityStats.active_members}
          color="orange"
        />
      </div>

      {/* Engagement Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white">
          <CardContent className="p-6">
            <p className="text-white/80 text-sm">총 좋아요</p>
            <p className="text-3xl font-bold mt-2">{engagement.totalLikes.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <p className="text-white/80 text-sm">회원당 평균 게시글</p>
            <p className="text-3xl font-bold mt-2">{engagement.avgPostsPerMember}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <p className="text-white/80 text-sm">행사 참여율</p>
            <p className="text-3xl font-bold mt-2">{engagement.eventParticipationRate}%</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <p className="text-white/80 text-sm">활동 회원 비율</p>
            <p className="text-3xl font-bold mt-2">{engagement.activeRatio}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[var(--primary)]" />
              월별 활동 추이
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[var(--primary)]" />
                  게시글
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  댓글
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  신규 회원
                </span>
              </div>
              <div className="h-64 flex items-end gap-2">
                {monthlyTrends.map((trend, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-0.5 items-end h-48">
                      <div
                        className="flex-1 bg-[var(--primary)] rounded-t"
                        style={{
                          height: `${maxTrendValue > 0 ? (trend.posts / maxTrendValue) * 100 : 0}%`,
                          minHeight: trend.posts > 0 ? '4px' : '0',
                        }}
                      />
                      <div
                        className="flex-1 bg-blue-500 rounded-t"
                        style={{
                          height: `${maxTrendValue > 0 ? (trend.comments / maxTrendValue) * 100 : 0}%`,
                          minHeight: trend.comments > 0 ? '4px' : '0',
                        }}
                      />
                      <div
                        className="flex-1 bg-green-500 rounded-t"
                        style={{
                          height: `${maxTrendValue > 0 ? (trend.new_members / maxTrendValue) * 100 : 0}%`,
                          minHeight: trend.new_members > 0 ? '4px' : '0',
                        }}
                      />
                    </div>
                    <span className="text-xs text-[var(--gray-500)]">{trend.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regional Stats */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[var(--primary)]" />
              지역별 활동 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            {regionalStats.length === 0 ? (
              <p className="text-center text-[var(--gray-500)] py-8">
                지역별 데이터가 없습니다.
              </p>
            ) : (
              <BarChart
                data={regionalStats.map(r => ({
                  label: r.region_name,
                  value: r.activity_score,
                }))}
                maxValue={Math.max(...regionalStats.map(r => r.activity_score))}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Contributors */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
            이달의 활동 당원 TOP 10
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topContributors.length === 0 ? (
            <p className="text-center text-[var(--gray-500)] py-8">
              이번 달 활동 데이터가 없습니다.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--gray-200)]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--gray-500)]">순위</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--gray-500)]">이름</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-[var(--gray-500)]">게시글</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-[var(--gray-500)]">댓글</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-[var(--gray-500)]">총점</th>
                  </tr>
                </thead>
                <tbody>
                  {topContributors.map((contributor, index) => (
                    <tr key={index} className="border-b border-[var(--gray-100)] hover:bg-[var(--gray-50)]">
                      <td className="py-3 px-4">
                        <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-sm font-medium ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-gray-200 text-gray-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-[var(--gray-100)] text-[var(--gray-600)]'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-[var(--gray-900)]">{contributor.name}</td>
                      <td className="py-3 px-4 text-center text-[var(--gray-600)]">{contributor.post_count}</td>
                      <td className="py-3 px-4 text-center text-[var(--gray-600)]">{contributor.comment_count}</td>
                      <td className="py-3 px-4 text-center font-semibold text-[var(--primary)]">
                        {contributor.total_score.toLocaleString()}점
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

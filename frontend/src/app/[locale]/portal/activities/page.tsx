'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  useActivities,
  activityTypeLabels,
  activityScopeLabels,
  getActivityLevel,
  userRoleLabels
} from '@/hooks/useActivities';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  Activity,
  TrendingUp,
  FileText,
  MessageSquare,
  Calendar,
  Lightbulb,
  Vote,
  Heart,
  Award,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { ActivityType } from '@/types/database';

// 활동 유형별 아이콘 컴포넌트
const ActivityIcon = ({ type }: { type: ActivityType }) => {
  const iconProps = { className: 'w-5 h-5' };
  switch (type) {
    case 'post_create': return <FileText {...iconProps} />;
    case 'comment_create': return <MessageSquare {...iconProps} />;
    case 'event_attend': return <Calendar {...iconProps} />;
    case 'policy_propose': return <Lightbulb {...iconProps} />;
    case 'vote_participate': return <Vote {...iconProps} />;
    case 'donation': return <Heart {...iconProps} />;
    default: return <Activity {...iconProps} />;
  }
};

export default function ActivitiesPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuthContext();
  const { stats, loading, error, fetchMonthlyActivities } = useActivities(user?.id);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [monthlyActivities, setMonthlyActivities] = useState<{
    id: string;
    activity_type: ActivityType;
    points: number;
    scope: string;
    description: string | null;
    created_at: string;
  }[]>([]);

  // 인증 체크
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/portal/activities');
    }
  }, [user, authLoading, router]);

  // 월별 활동 로드
  useEffect(() => {
    if (user?.id) {
      fetchMonthlyActivities(selectedYear, selectedMonth).then(setMonthlyActivities);
    }
  }, [user?.id, selectedYear, selectedMonth, fetchMonthlyActivities]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const activityLevel = getActivityLevel(profile.activity_score || 0);
  const progressPercent = activityLevel.nextLevel > 0
    ? Math.min(100, ((profile.activity_score || 0) / activityLevel.nextLevel) * 100)
    : 100;

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    const now = new Date();
    if (selectedYear === now.getFullYear() && selectedMonth === now.getMonth() + 1) {
      return; // 현재 월 이후로는 이동 불가
    }
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <div className="bg-[var(--primary)] text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
            <Link href="/portal">마이페이지</Link>
            <span>/</span>
            <span className="text-white">활동 내역</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">활동 내역</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 활동 점수 요약 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* 총 활동 점수 */}
          <Card variant="default" className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[var(--primary-light)] rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--gray-500)]">총 활동 점수</p>
                  <p className="text-3xl font-bold text-[var(--gray-900)]">
                    {profile.activity_score || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 지역 활동 점수 */}
          <Card variant="default" className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-[var(--gray-500)]">지역 활동 점수</p>
                  <p className="text-3xl font-bold text-[var(--gray-900)]">
                    {profile.regional_activity_score || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 위원회 활동 점수 */}
          <Card variant="default" className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-[var(--gray-500)]">위원회 활동 점수</p>
                  <p className="text-3xl font-bold text-[var(--gray-900)]">
                    {profile.committee_activity_score || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 활동 레벨 & 등급 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 활동 레벨 */}
          <Card variant="default" className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-[var(--secondary)]" />
                  <h3 className="text-lg font-semibold text-[var(--gray-900)]">활동 레벨</h3>
                </div>
                <span className="text-2xl font-bold text-[var(--primary)]">Lv.{activityLevel.level}</span>
              </div>
              <p className="text-[var(--gray-600)] mb-4">{activityLevel.name}</p>
              <div className="w-full bg-[var(--gray-200)] rounded-full h-3 mb-2">
                <div
                  className="bg-[var(--primary)] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {activityLevel.nextLevel > 0 && (
                <p className="text-sm text-[var(--gray-500)]">
                  다음 레벨까지 {activityLevel.nextLevel - (profile.activity_score || 0)}점
                </p>
              )}
            </CardContent>
          </Card>

          {/* 당원 등급 */}
          <Card variant="default" className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--gray-900)]">당원 등급</h3>
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: profile.role === 'active_member' || profile.role === 'admin'
                      ? '#E6F2F1'
                      : '#F3F4F6',
                    color: profile.role === 'active_member' || profile.role === 'admin'
                      ? '#1F6F6B'
                      : '#6B7280'
                  }}
                >
                  {userRoleLabels[profile.role || 'guest']}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--gray-500)]">활동당원 조건</span>
                  <span className={profile.activity_score && profile.activity_score >= 100 ? 'text-green-600' : 'text-[var(--gray-400)]'}>
                    {profile.activity_score || 0} / 100점
                  </span>
                </div>
                {profile.role === 'member' && (profile.activity_score || 0) < 100 && (
                  <p className="text-[var(--gray-500)] mt-2">
                    활동 점수 100점 달성 시 자동으로 활동당원으로 승급됩니다.
                  </p>
                )}
                {profile.role === 'active_member' && (
                  <p className="text-[var(--primary)] mt-2">
                    활동당원 자격으로 공천 신청이 가능합니다.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 활동 통계 */}
        {stats && (
          <Card variant="default" className="bg-white mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-4">활동 통계</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-[var(--gray-50)] rounded-lg">
                  <FileText className="w-6 h-6 mx-auto mb-2 text-[var(--primary)]" />
                  <p className="text-2xl font-bold text-[var(--gray-900)]">{stats.post_count}</p>
                  <p className="text-sm text-[var(--gray-500)]">게시글</p>
                </div>
                <div className="text-center p-4 bg-[var(--gray-50)] rounded-lg">
                  <MessageSquare className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold text-[var(--gray-900)]">{stats.comment_count}</p>
                  <p className="text-sm text-[var(--gray-500)]">댓글</p>
                </div>
                <div className="text-center p-4 bg-[var(--gray-50)] rounded-lg">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold text-[var(--gray-900)]">{stats.event_count}</p>
                  <p className="text-sm text-[var(--gray-500)]">행사 참여</p>
                </div>
                <div className="text-center p-4 bg-[var(--gray-50)] rounded-lg">
                  <Vote className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold text-[var(--gray-900)]">{stats.vote_count}</p>
                  <p className="text-sm text-[var(--gray-500)]">투표 참여</p>
                </div>
              </div>

              {/* 월별 비교 */}
              <div className="mt-6 pt-6 border-t border-[var(--gray-200)]">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-[var(--primary-light)] rounded-lg">
                    <span className="text-[var(--gray-600)]">이번 달 활동 점수</span>
                    <span className="text-xl font-bold text-[var(--primary)]">+{stats.this_month_score}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[var(--gray-50)] rounded-lg">
                    <span className="text-[var(--gray-600)]">지난 달 활동 점수</span>
                    <span className="text-xl font-bold text-[var(--gray-700)]">+{stats.last_month_score}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 월별 활동 내역 */}
        <Card variant="default" className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--gray-900)]">월별 활동 내역</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-[var(--gray-100)] rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-[var(--gray-600)]" />
                </button>
                <span className="text-[var(--gray-700)] font-medium min-w-[100px] text-center">
                  {selectedYear}년 {selectedMonth}월
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-[var(--gray-100)] rounded-lg transition-colors"
                  disabled={selectedYear === new Date().getFullYear() && selectedMonth === new Date().getMonth() + 1}
                >
                  <ChevronRight className="w-5 h-5 text-[var(--gray-600)]" />
                </button>
              </div>
            </div>

            {monthlyActivities.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 mx-auto mb-4 text-[var(--gray-300)]" />
                <p className="text-[var(--gray-500)]">해당 월에 활동 내역이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {monthlyActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4 bg-[var(--gray-50)] rounded-lg"
                  >
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <ActivityIcon type={activity.activity_type} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[var(--gray-900)]">
                          {activityTypeLabels[activity.activity_type as ActivityType]}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-[var(--gray-200)] rounded text-[var(--gray-600)]">
                          {activityScopeLabels[activity.scope as 'national' | 'regional' | 'committee']}
                        </span>
                      </div>
                      {activity.description && (
                        <p className="text-sm text-[var(--gray-500)] mt-1 line-clamp-1">
                          {activity.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-[var(--primary)]">+{activity.points}</span>
                      <p className="text-xs text-[var(--gray-400)]">
                        {new Date(activity.created_at).toLocaleDateString('ko-KR', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 돌아가기 버튼 */}
        <div className="mt-8 text-center">
          <Link href="/portal">
            <Button variant="outline">마이페이지로 돌아가기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

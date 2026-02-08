'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Activity, ActivityType, ActivityScope } from '@/types/database';

export interface ActivityStats {
  total_score: number;
  regional_score: number;
  committee_score: number;
  post_count: number;
  comment_count: number;
  event_count: number;
  vote_count: number;
  this_month_score: number;
  last_month_score: number;
}

export interface MonthlyActivity {
  id: string;
  activity_type: ActivityType;
  points: number;
  scope: ActivityScope;
  description: string | null;
  created_at: string;
}

export function useActivities(userId?: string) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // 활동 목록 조회
  const fetchActivities = useCallback(async (limit = 20, offset = 0) => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (fetchError) throw fetchError;
      setActivities(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '활동 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [userId, supabase]);

  // 활동 통계 조회
  const fetchStats = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error: fetchError } = await supabase
        .rpc('get_activity_stats', { p_user_id: userId });

      if (fetchError) throw fetchError;
      setStats(data as unknown as ActivityStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : '활동 통계를 불러오는데 실패했습니다.');
    }
  }, [userId, supabase]);

  // 월별 활동 조회
  const fetchMonthlyActivities = useCallback(async (year?: number, month?: number) => {
    if (!userId) return [];

    try {
      const { data, error: fetchError } = await supabase
        .rpc('get_monthly_activities', {
          p_user_id: userId,
          p_year: year,
          p_month: month,
        });

      if (fetchError) throw fetchError;
      return data as MonthlyActivity[];
    } catch (err) {
      setError(err instanceof Error ? err.message : '월별 활동을 불러오는데 실패했습니다.');
      return [];
    }
  }, [userId, supabase]);

  // 초기 데이터 로드
  useEffect(() => {
    if (userId) {
      fetchActivities();
      fetchStats();
    }
  }, [userId, fetchActivities, fetchStats]);

  return {
    activities,
    stats,
    loading,
    error,
    fetchActivities,
    fetchStats,
    fetchMonthlyActivities,
  };
}

// 활동 유형별 한글 라벨
export const activityTypeLabels: Record<ActivityType, string> = {
  post_create: '게시글 작성',
  comment_create: '댓글 작성',
  event_attend: '행사 참여',
  policy_propose: '정책 제안',
  vote_participate: '투표 참여',
  donation: '후원',
};

// 활동 유형별 아이콘 (lucide-react)
export const activityTypeIcons: Record<ActivityType, string> = {
  post_create: 'FileText',
  comment_create: 'MessageSquare',
  event_attend: 'Calendar',
  policy_propose: 'Lightbulb',
  vote_participate: 'Vote',
  donation: 'Heart',
};

// 활동 범위별 한글 라벨
export const activityScopeLabels: Record<ActivityScope, string> = {
  national: '전국',
  regional: '지역',
  committee: '위원회',
};

// 사용자 등급별 한글 라벨
export const userRoleLabels: Record<string, string> = {
  guest: '게스트',
  user: '회원',
  member: '당원',
  active_member: '활동당원',
  candidate: '후보자',
  moderator: '운영자',
  admin: '관리자',
};

// 활동 레벨 계산
export function getActivityLevel(score: number): { level: number; name: string; nextLevel: number } {
  if (score >= 500) return { level: 5, name: '최고 활동가', nextLevel: -1 };
  if (score >= 300) return { level: 4, name: '열정 활동가', nextLevel: 500 };
  if (score >= 150) return { level: 3, name: '성실 활동가', nextLevel: 300 };
  if (score >= 50) return { level: 2, name: '신진 활동가', nextLevel: 150 };
  return { level: 1, name: '새내기', nextLevel: 50 };
}

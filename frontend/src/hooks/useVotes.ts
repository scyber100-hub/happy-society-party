'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Vote, VoteType, VoteScope, VoteStatus, Json } from '@/types/database';

export interface VoteOption {
  id: string;
  label: string;
  description?: string;
}

export interface AvailableVote {
  id: string;
  title: string;
  description: string | null;
  vote_type: VoteType;
  scope: VoteScope;
  status: VoteStatus;
  start_date: string;
  end_date: string;
  total_votes: number;
  has_voted: boolean;
}

export interface VoteResult {
  [optionId: string]: number;
}

export function useVotes(userId?: string) {
  const [votes, setVotes] = useState<AvailableVote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // 참여 가능한 투표 목록 조회
  const fetchAvailableVotes = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .rpc('get_available_votes', { p_user_id: userId });

      if (fetchError) throw fetchError;
      setVotes(data as unknown as AvailableVote[] || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '투표 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [userId, supabase]);

  // 특정 투표 상세 조회
  const fetchVoteDetail = useCallback(async (voteId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('votes')
        .select('*')
        .eq('id', voteId)
        .single();

      if (fetchError) throw fetchError;
      return data as Vote;
    } catch (err) {
      setError(err instanceof Error ? err.message : '투표 정보를 불러오는데 실패했습니다.');
      return null;
    }
  }, [supabase]);

  // 투표 자격 확인
  const checkEligibility = useCallback(async (voteId: string) => {
    if (!userId) return false;

    try {
      const { data, error: checkError } = await supabase
        .rpc('check_vote_eligibility', {
          p_vote_id: voteId,
          p_user_id: userId,
        });

      if (checkError) throw checkError;
      return data as boolean;
    } catch {
      return false;
    }
  }, [userId, supabase]);

  // 투표하기
  const castVote = useCallback(async (voteId: string, selectedOptions: string[]) => {
    if (!userId) {
      return { success: false, message: '로그인이 필요합니다.' };
    }

    try {
      const { data, error: voteError } = await supabase
        .rpc('cast_vote', {
          p_vote_id: voteId,
          p_user_id: userId,
          p_selected_options: selectedOptions as unknown as Json,
        });

      if (voteError) throw voteError;

      // 투표 목록 갱신
      await fetchAvailableVotes();

      return data as { success: boolean; message: string };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : '투표 처리 중 오류가 발생했습니다.',
      };
    }
  }, [userId, supabase, fetchAvailableVotes]);

  // 투표 결과 조회
  const getVoteResult = useCallback(async (voteId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('votes')
        .select('result, total_votes, options, status')
        .eq('id', voteId)
        .single();

      if (fetchError) throw fetchError;

      return {
        result: data.result as unknown as VoteResult | null,
        totalVotes: data.total_votes || 0,
        options: data.options as unknown as VoteOption[],
        status: data.status as VoteStatus,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : '투표 결과를 불러오는데 실패했습니다.');
      return null;
    }
  }, [supabase]);

  // 내 투표 기록 확인
  const getMyVoteRecord = useCallback(async (voteId: string) => {
    if (!userId) return null;

    try {
      const { data, error: fetchError } = await supabase
        .from('vote_records')
        .select('selected_options, voted_at')
        .eq('vote_id', voteId)
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      return data;
    } catch {
      return null;
    }
  }, [userId, supabase]);

  // 초기 데이터 로드
  useEffect(() => {
    if (userId) {
      fetchAvailableVotes();
    }
  }, [userId, fetchAvailableVotes]);

  return {
    votes,
    loading,
    error,
    fetchAvailableVotes,
    fetchVoteDetail,
    checkEligibility,
    castVote,
    getVoteResult,
    getMyVoteRecord,
  };
}

// 투표 유형별 한글 라벨
export const voteTypeLabels: Record<VoteType, string> = {
  party_election: '당 대표 선출',
  nomination: '공천 투표',
  policy: '정책 결정',
  committee: '위원회 투표',
  regional: '지역 투표',
};

// 투표 범위별 한글 라벨
export const voteScopeLabels: Record<VoteScope, string> = {
  national: '전국',
  regional: '지역',
  committee: '위원회',
  international: '국제',
};

// 투표 상태별 한글 라벨
export const voteStatusLabels: Record<VoteStatus, string> = {
  draft: '준비중',
  deliberation: '숙의 중',
  voting: '투표 중',
  counting: '개표 중',
  completed: '완료',
  cancelled: '취소됨',
};

// 투표 상태별 색상
export const voteStatusColors: Record<VoteStatus, { bg: string; text: string }> = {
  draft: { bg: '#F3F4F6', text: '#6B7280' },
  deliberation: { bg: '#FEF3C7', text: '#D97706' },
  voting: { bg: '#DCFCE7', text: '#16A34A' },
  counting: { bg: '#E0E7FF', text: '#4F46E5' },
  completed: { bg: '#E5E7EB', text: '#374151' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626' },
};

// 남은 시간 계산
export function getRemainingTime(endDate: string): string {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return '종료됨';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}일 ${hours}시간 남음`;
  if (hours > 0) return `${hours}시간 ${minutes}분 남음`;
  return `${minutes}분 남음`;
}

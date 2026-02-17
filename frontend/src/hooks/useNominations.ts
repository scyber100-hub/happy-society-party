'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { NominationStatus, ElectionType } from '@/types/database';

export interface NominationEligibility {
  eligible: boolean;
  reason?: string;
  activity_score?: number;
  member_days?: number;
}

export interface Nomination {
  id: string;
  user_id: string;
  election_type: ElectionType;
  region_id: string | null;
  constituency: string | null;
  status: NominationStatus;
  application_text: string | null;
  career_summary: string | null;
  policy_pledges: string | null;
  regional_activity_score: number | null;
  committee_activity_score: number | null;
  direct_vote_score: number | null;
  final_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface NominationCandidate {
  id: string;
  user_id: string;
  user_name: string;
  election_type: ElectionType;
  region_name: string | null;
  constituency: string | null;
  status: NominationStatus;
  final_score: number | null;
  created_at: string;
}

export function useNominations(userId?: string) {
  const [myNominations, setMyNominations] = useState<Nomination[]>([]);
  const [eligibility, setEligibility] = useState<NominationEligibility | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // 공천 자격 확인
  const checkEligibility = useCallback(async () => {
    if (!userId) return null;

    try {
      const { data, error: checkError } = await supabase
        .rpc('check_nomination_eligibility', { p_user_id: userId });

      if (checkError) throw checkError;
      const result = data as unknown as NominationEligibility;
      setEligibility(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : '자격 확인 중 오류가 발생했습니다.');
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // 내 공천 신청 목록 조회
  const fetchMyNominations = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('nominations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setMyNominations(data as Nomination[] || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '공천 신청 내역을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // 공천 신청
  const applyNomination = useCallback(async (params: {
    election_type: ElectionType;
    region_id?: string;
    constituency?: string;
    application_text: string;
    career_summary: string;
    policy_pledges: string;
  }) => {
    if (!userId) {
      return { success: false, message: '로그인이 필요합니다.' };
    }

    try {
      const { data, error: applyError } = await supabase
        .rpc('apply_nomination', {
          p_user_id: userId,
          p_election_type: params.election_type,
          p_region_id: params.region_id || null,
          p_constituency: params.constituency || null,
          p_application_text: params.application_text,
          p_career_summary: params.career_summary,
          p_policy_pledges: params.policy_pledges,
        });

      if (applyError) throw applyError;

      // 목록 갱신
      await fetchMyNominations();

      return data as { success: boolean; message: string; nomination_id?: string };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : '공천 신청 중 오류가 발생했습니다.',
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, fetchMyNominations]);

  // 공천 후보 목록 조회 (공개)
  const getCandidates = useCallback(async (params?: {
    election_type?: ElectionType;
    region_id?: string;
    status?: NominationStatus;
  }) => {
    try {
      const { data, error: fetchError } = await supabase
        .rpc('get_nomination_candidates', {
          p_election_type: params?.election_type || null,
          p_region_id: params?.region_id || null,
          p_status: params?.status || null,
        });

      if (fetchError) throw fetchError;
      return data as unknown as NominationCandidate[];
    } catch (err) {
      setError(err instanceof Error ? err.message : '후보 목록을 불러오는데 실패했습니다.');
      return [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 공천 상세 조회
  const getNominationDetail = useCallback(async (nominationId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('nominations')
        .select(`
          *,
          user:user_profiles(name, avatar_url),
          region:regions(name)
        `)
        .eq('id', nominationId)
        .single();

      if (fetchError) throw fetchError;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : '공천 정보를 불러오는데 실패했습니다.');
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    if (userId) {
      checkEligibility();
      fetchMyNominations();
    }
  }, [userId, checkEligibility, fetchMyNominations]);

  return {
    myNominations,
    eligibility,
    loading,
    error,
    checkEligibility,
    fetchMyNominations,
    applyNomination,
    getCandidates,
    getNominationDetail,
  };
}

// 선거 유형별 한글 라벨
export const electionTypeLabels: Record<ElectionType, string> = {
  national_assembly: '국회의원',
  local_council: '지방의회 의원',
  local_executive: '지방자치단체장',
  party_representative: '당 대표',
  supreme_council: '최고위원',
};

// 공천 상태별 한글 라벨
export const nominationStatusLabels: Record<NominationStatus, string> = {
  pending: '신청 대기',
  screening: '자격 심사 중',
  evaluation: '평가 중',
  review: '심의 중',
  approved: '승인',
  rejected: '반려',
};

// 공천 상태별 색상
export const nominationStatusColors: Record<NominationStatus, { bg: string; text: string }> = {
  pending: { bg: '#F3F4F6', text: '#6B7280' },
  screening: { bg: '#FEF3C7', text: '#D97706' },
  evaluation: { bg: '#DBEAFE', text: '#2563EB' },
  review: { bg: '#E0E7FF', text: '#4F46E5' },
  approved: { bg: '#DCFCE7', text: '#16A34A' },
  rejected: { bg: '#FEE2E2', text: '#DC2626' },
};

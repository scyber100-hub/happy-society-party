'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  electionTypeLabels,
  nominationStatusLabels,
  nominationStatusColors
} from '@/hooks/useNominations';
import type { NominationStatus, ElectionType } from '@/types/database';
import {
  Users,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RefreshCw
} from 'lucide-react';

interface NominationWithUser {
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
  screening_note: string | null;
  review_note: string | null;
  created_at: string;
  user: {
    name: string;
    avatar_url: string | null;
  };
  region: {
    name: string;
  } | null;
}

export default function AdminNominationsPage() {
  const router = useRouter();
  const [nominations, setNominations] = useState<NominationWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<NominationStatus | ''>('');
  const [electionFilter, setElectionFilter] = useState<ElectionType | ''>('');
  const [selectedNomination, setSelectedNomination] = useState<NominationWithUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionNote, setActionNote] = useState('');
  const [processing, setProcessing] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || !['admin', 'moderator'].includes(profile.role || '')) {
        router.push('/portal');
        return;
      }

      setUserId(user.id);
    };
    checkAdmin();
  }, [supabase, router]);

  const fetchNominations = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('nominations')
      .select(`
        *,
        user:user_profiles(name, avatar_url),
        region:regions(name)
      `)
      .order('created_at', { ascending: false });

    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }
    if (electionFilter) {
      query = query.eq('election_type', electionFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch nominations:', error);
    } else {
      setNominations(data as unknown as NominationWithUser[] || []);
    }
    setLoading(false);
  }, [supabase, statusFilter, electionFilter]);

  useEffect(() => {
    if (userId) {
      fetchNominations();
    }
  }, [userId, fetchNominations]);

  const updateStatus = async (nominationId: string, newStatus: NominationStatus) => {
    setProcessing(true);
    const { error } = await supabase
      .rpc('update_nomination_status', {
        p_nomination_id: nominationId,
        p_new_status: newStatus,
        p_note: actionNote || null,
        p_reviewer_id: userId,
      });

    if (error) {
      alert('상태 변경에 실패했습니다: ' + error.message);
    } else {
      alert('상태가 변경되었습니다.');
      setShowModal(false);
      setSelectedNomination(null);
      setActionNote('');
      fetchNominations();
    }
    setProcessing(false);
  };

  const getNextStatusOptions = (currentStatus: NominationStatus): NominationStatus[] => {
    const statusFlow: Record<NominationStatus, NominationStatus[]> = {
      pending: ['screening', 'rejected'],
      screening: ['evaluation', 'rejected'],
      evaluation: ['review', 'rejected'],
      review: ['approved', 'rejected'],
      approved: [],
      rejected: ['pending'],
    };
    return statusFlow[currentStatus] || [];
  };

  const statusCounts = nominations.reduce((acc, n) => {
    acc[n.status] = (acc[n.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading && !userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-yellow-500" />
            공천 관리
          </h1>
          <button
            onClick={fetchNominations}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            새로고침
          </button>
        </div>

        {/* 상태별 요약 */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          {(['pending', 'screening', 'evaluation', 'review', 'approved', 'rejected'] as NominationStatus[]).map((status) => {
            const colors = nominationStatusColors[status];
            return (
              <div
                key={status}
                className={`bg-white rounded-lg p-4 border cursor-pointer transition-colors ${
                  statusFilter === status ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-gray-200'
                }`}
                onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
              >
                <p className="text-2xl font-bold" style={{ color: colors.text }}>
                  {statusCounts[status] || 0}
                </p>
                <p className="text-sm text-gray-500">{nominationStatusLabels[status]}</p>
              </div>
            );
          })}
        </div>

        {/* 필터 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">필터:</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as NominationStatus | '')}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">모든 상태</option>
              {Object.entries(nominationStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <select
              value={electionFilter}
              onChange={(e) => setElectionFilter(e.target.value as ElectionType | '')}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">모든 선거</option>
              {Object.entries(electionTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 공천 목록 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">신청자</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">선거 유형</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">지역</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">상태</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">최종 점수</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">신청일</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500 mx-auto" />
                  </td>
                </tr>
              ) : nominations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    공천 신청 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                nominations.map((nomination) => {
                  const statusColor = nominationStatusColors[nomination.status];
                  return (
                    <tr key={nomination.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
                            {nomination.user?.name?.[0] || '?'}
                          </div>
                          <span className="font-medium text-gray-900">
                            {nomination.user?.name || '알 수 없음'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {electionTypeLabels[nomination.election_type]}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {nomination.region?.name || '-'}
                        {nomination.constituency && ` (${nomination.constituency})`}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                        >
                          {nominationStatusLabels[nomination.status]}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {nomination.final_score !== null ? (
                          <span className="font-bold text-yellow-600">
                            {nomination.final_score.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm">
                        {new Date(nomination.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedNomination(nomination);
                              setShowModal(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                            title="상세 보기"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 상세/관리 모달 */}
      {showModal && selectedNomination && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">공천 신청 상세</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedNomination(null);
                    setActionNote('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">신청자</label>
                  <p className="font-medium">{selectedNomination.user?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">선거 유형</label>
                  <p className="font-medium">{electionTypeLabels[selectedNomination.election_type]}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">지역</label>
                  <p className="font-medium">{selectedNomination.region?.name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">선거구</label>
                  <p className="font-medium">{selectedNomination.constituency || '-'}</p>
                </div>
              </div>

              {/* 점수 */}
              {selectedNomination.final_score !== null && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">3축 평가 점수</h3>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedNomination.regional_activity_score?.toFixed(1) || '0'}
                      </p>
                      <p className="text-xs text-gray-500">지역활동 (30%)</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">
                        {selectedNomination.committee_activity_score?.toFixed(1) || '0'}
                      </p>
                      <p className="text-xs text-gray-500">위원회활동 (30%)</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedNomination.direct_vote_score?.toFixed(1) || '0'}
                      </p>
                      <p className="text-xs text-gray-500">직접투표 (40%)</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">
                        {selectedNomination.final_score?.toFixed(1) || '0'}
                      </p>
                      <p className="text-xs text-gray-500">최종점수</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 소견서 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">출마 소견서</h3>
                <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 text-sm">
                  {selectedNomination.application_text || '없음'}
                </p>
              </div>

              {/* 약력 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">약력</h3>
                <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 text-sm">
                  {selectedNomination.career_summary || '없음'}
                </p>
              </div>

              {/* 공약 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">핵심 공약</h3>
                <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 text-sm">
                  {selectedNomination.policy_pledges || '없음'}
                </p>
              </div>

              {/* 상태 변경 */}
              {getNextStatusOptions(selectedNomination.status).length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-900 mb-3">상태 변경</h3>

                  <div className="mb-4">
                    <label className="text-sm text-gray-500 mb-1 block">심사 메모</label>
                    <textarea
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                      rows={3}
                      placeholder="상태 변경 사유를 입력하세요."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>

                  <div className="flex gap-3">
                    {getNextStatusOptions(selectedNomination.status).map((status) => {
                      const isApprove = status === 'approved' || ['screening', 'evaluation', 'review'].includes(status);
                      return (
                        <button
                          key={status}
                          onClick={() => updateStatus(selectedNomination.id, status)}
                          disabled={processing}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                            isApprove && status !== 'rejected'
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                        >
                          {status === 'rejected' ? (
                            <XCircle className="w-4 h-4" />
                          ) : status === 'approved' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                          {nominationStatusLabels[status]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

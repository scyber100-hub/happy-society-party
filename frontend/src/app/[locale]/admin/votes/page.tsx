'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  voteTypeLabels,
  voteScopeLabels,
  voteStatusLabels,
  voteStatusColors
} from '@/hooks/useVotes';
import type { VoteType, VoteScope, VoteStatus, Json } from '@/types/database';
import {
  Vote as VoteIcon,
  Plus,
  Filter,
  RefreshCw,
  Eye,
  Play,
  Pause,
  BarChart3,
  Trash2
} from 'lucide-react';

interface VoteOption {
  id: string;
  label: string;
  description?: string;
}

interface VoteRecord {
  id: string;
  title: string;
  description: string | null;
  vote_type: VoteType;
  scope: VoteScope;
  scope_id: string | null;
  options: VoteOption[];
  allow_multiple: boolean;
  max_selections: number;
  start_date: string;
  end_date: string;
  deliberation_start: string | null;
  min_participation: number;
  status: VoteStatus;
  result: Record<string, number> | null;
  total_votes: number;
  created_by: string | null;
  created_at: string;
}

export default function AdminVotesPage() {
  const router = useRouter();
  const [votes, setVotes] = useState<VoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<VoteStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<VoteType | ''>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Create form state
  const [newVote, setNewVote] = useState({
    title: '',
    description: '',
    vote_type: 'policy' as VoteType,
    scope: 'national' as VoteScope,
    allow_multiple: false,
    max_selections: 1,
    start_date: '',
    end_date: '',
    deliberation_start: '',
    min_participation: 0,
    options: [{ id: '1', label: '', description: '' }] as VoteOption[],
  });

  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
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

  const fetchVotes = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('votes')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }
    if (typeFilter) {
      query = query.eq('vote_type', typeFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch votes:', error);
    } else {
      setVotes(data as unknown as VoteRecord[] || []);
    }
    setLoading(false);
  }, [supabase, statusFilter, typeFilter]);

  useEffect(() => {
    if (userId) {
      fetchVotes();
    }
  }, [userId, fetchVotes]);

  const addOption = () => {
    setNewVote({
      ...newVote,
      options: [...newVote.options, { id: String(newVote.options.length + 1), label: '', description: '' }]
    });
  };

  const removeOption = (index: number) => {
    if (newVote.options.length > 1) {
      setNewVote({
        ...newVote,
        options: newVote.options.filter((_, i) => i !== index)
      });
    }
  };

  const updateOption = (index: number, field: 'label' | 'description', value: string) => {
    const updatedOptions = [...newVote.options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setNewVote({ ...newVote, options: updatedOptions });
  };

  const createVote = async () => {
    if (!newVote.title || !newVote.start_date || !newVote.end_date) {
      alert('필수 항목을 입력해주세요.');
      return;
    }

    if (newVote.options.some(o => !o.label)) {
      alert('모든 선택지에 라벨을 입력해주세요.');
      return;
    }

    setProcessing(true);
    const { error } = await supabase
      .from('votes')
      .insert({
        title: newVote.title,
        description: newVote.description || null,
        vote_type: newVote.vote_type,
        scope: newVote.scope,
        options: newVote.options as unknown as Json,
        allow_multiple: newVote.allow_multiple,
        max_selections: newVote.max_selections,
        start_date: newVote.start_date,
        end_date: newVote.end_date,
        deliberation_start: newVote.deliberation_start || null,
        min_participation: newVote.min_participation,
        status: 'draft',
        created_by: userId,
      });

    if (error) {
      alert('투표 생성에 실패했습니다: ' + error.message);
    } else {
      alert('투표가 생성되었습니다.');
      setShowCreateModal(false);
      setNewVote({
        title: '',
        description: '',
        vote_type: 'policy',
        scope: 'national',
        allow_multiple: false,
        max_selections: 1,
        start_date: '',
        end_date: '',
        deliberation_start: '',
        min_participation: 0,
        options: [{ id: '1', label: '', description: '' }],
      });
      fetchVotes();
    }
    setProcessing(false);
  };

  const updateVoteStatus = async (voteId: string, newStatus: VoteStatus) => {
    setProcessing(true);
    const { error } = await supabase
      .rpc('update_vote_status', {
        p_vote_id: voteId,
        p_new_status: newStatus,
      });

    if (error) {
      alert('상태 변경에 실패했습니다: ' + error.message);
    } else {
      fetchVotes();
    }
    setProcessing(false);
  };

  const deleteVote = async (voteId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('id', voteId);

    if (error) {
      alert('삭제에 실패했습니다: ' + error.message);
    } else {
      fetchVotes();
    }
  };

  const statusCounts = votes.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1;
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
            <VoteIcon className="w-6 h-6 text-yellow-500" />
            투표 관리
          </h1>
          <div className="flex gap-3">
            <button
              onClick={fetchVotes}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
              새로고침
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg"
            >
              <Plus className="w-4 h-4" />
              새 투표 만들기
            </button>
          </div>
        </div>

        {/* 상태별 요약 */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          {(['draft', 'deliberation', 'voting', 'counting', 'completed', 'cancelled'] as VoteStatus[]).map((status) => {
            const colors = voteStatusColors[status];
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
                <p className="text-sm text-gray-500">{voteStatusLabels[status]}</p>
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
              onChange={(e) => setStatusFilter(e.target.value as VoteStatus | '')}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">모든 상태</option>
              {Object.entries(voteStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as VoteType | '')}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">모든 유형</option>
              {Object.entries(voteTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 투표 목록 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">제목</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">유형</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">범위</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">상태</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">참여</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">기간</th>
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
              ) : votes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    투표가 없습니다.
                  </td>
                </tr>
              ) : (
                votes.map((vote) => {
                  const statusColor = voteStatusColors[vote.status];
                  return (
                    <tr key={vote.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{vote.title}</p>
                        {vote.description && (
                          <p className="text-sm text-gray-500 truncate max-w-xs">{vote.description}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {voteTypeLabels[vote.vote_type]}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {voteScopeLabels[vote.scope]}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                        >
                          {voteStatusLabels[vote.status]}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-gray-900">{vote.total_votes}</span>
                        <span className="text-gray-400 text-sm">명</span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm">
                        <p>{new Date(vote.start_date).toLocaleDateString('ko-KR')}</p>
                        <p className="text-xs">~ {new Date(vote.end_date).toLocaleDateString('ko-KR')}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => router.push(`/votes/${vote.id}`)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                            title="상세 보기"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {vote.status === 'draft' && (
                            <>
                              <button
                                onClick={() => updateVoteStatus(vote.id, vote.deliberation_start ? 'deliberation' : 'voting')}
                                className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 rounded"
                                title="시작"
                                disabled={processing}
                              >
                                <Play className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteVote(vote.id)}
                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                                title="삭제"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {vote.status === 'deliberation' && (
                            <button
                              onClick={() => updateVoteStatus(vote.id, 'voting')}
                              className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                              title="투표 시작"
                              disabled={processing}
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}

                          {vote.status === 'voting' && (
                            <button
                              onClick={() => updateVoteStatus(vote.id, 'counting')}
                              className="p-1.5 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded"
                              title="개표 시작"
                              disabled={processing}
                            >
                              <BarChart3 className="w-4 h-4" />
                            </button>
                          )}

                          {vote.status === 'counting' && (
                            <button
                              onClick={() => updateVoteStatus(vote.id, 'completed')}
                              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                              title="완료 처리"
                              disabled={processing}
                            >
                              <Pause className="w-4 h-4" />
                            </button>
                          )}

                          {['draft', 'deliberation', 'voting'].includes(vote.status) && (
                            <button
                              onClick={() => updateVoteStatus(vote.id, 'cancelled')}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="취소"
                              disabled={processing}
                            >
                              <Pause className="w-4 h-4" />
                            </button>
                          )}
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

      {/* 투표 생성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">새 투표 만들기</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제목 *</label>
                <input
                  type="text"
                  value={newVote.title}
                  onChange={(e) => setNewVote({ ...newVote, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="투표 제목을 입력하세요"
                />
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                <textarea
                  value={newVote.description}
                  onChange={(e) => setNewVote({ ...newVote, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="투표에 대한 설명을 입력하세요"
                />
              </div>

              {/* 유형 & 범위 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">투표 유형 *</label>
                  <select
                    value={newVote.vote_type}
                    onChange={(e) => setNewVote({ ...newVote, vote_type: e.target.value as VoteType })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    {Object.entries(voteTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">투표 범위 *</label>
                  <select
                    value={newVote.scope}
                    onChange={(e) => setNewVote({ ...newVote, scope: e.target.value as VoteScope })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    {Object.entries(voteScopeLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 선택지 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">선택지 *</label>
                <div className="space-y-3">
                  {newVote.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={option.label}
                        onChange={(e) => updateOption(index, 'label', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        placeholder={`선택지 ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                        disabled={newVote.options.length <= 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addOption}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-yellow-400 hover:text-yellow-600"
                  >
                    + 선택지 추가
                  </button>
                </div>
              </div>

              {/* 복수 선택 */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newVote.allow_multiple}
                    onChange={(e) => setNewVote({ ...newVote, allow_multiple: e.target.checked })}
                    className="w-4 h-4 text-yellow-500 focus:ring-yellow-400 rounded"
                  />
                  <span className="text-sm text-gray-700">복수 선택 허용</span>
                </label>
                {newVote.allow_multiple && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">최대 선택:</span>
                    <input
                      type="number"
                      value={newVote.max_selections}
                      onChange={(e) => setNewVote({ ...newVote, max_selections: parseInt(e.target.value) || 1 })}
                      min={1}
                      max={newVote.options.length}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                    />
                  </div>
                )}
              </div>

              {/* 기간 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">시작일시 *</label>
                  <input
                    type="datetime-local"
                    value={newVote.start_date}
                    onChange={(e) => setNewVote({ ...newVote, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">종료일시 *</label>
                  <input
                    type="datetime-local"
                    value={newVote.end_date}
                    onChange={(e) => setNewVote({ ...newVote, end_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 숙의 기간 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">숙의 시작일시 (선택)</label>
                <input
                  type="datetime-local"
                  value={newVote.deliberation_start}
                  onChange={(e) => setNewVote({ ...newVote, deliberation_start: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">숙의 기간을 설정하면 투표 전 토론 기간이 진행됩니다.</p>
              </div>

              {/* 최소 참여 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">최소 참여 인원</label>
                <input
                  type="number"
                  value={newVote.min_participation}
                  onChange={(e) => setNewVote({ ...newVote, min_participation: parseInt(e.target.value) || 0 })}
                  min={0}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>

              {/* 버튼 */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg"
                >
                  취소
                </button>
                <button
                  onClick={createVote}
                  disabled={processing}
                  className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg disabled:opacity-50"
                >
                  {processing ? '생성 중...' : '투표 만들기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

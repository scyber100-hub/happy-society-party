'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Lightbulb,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Send
} from 'lucide-react';

interface PolicyProposal {
  id: string;
  title: string;
  content: string;
  category: string | null;
  status: string;
  admin_note: string | null;
  created_at: string | null;
}

const statusLabels: Record<string, string> = {
  submitted: '제출됨',
  reviewing: '검토중',
  adopted: '채택됨',
  rejected: '반려됨',
};

const statusColors: Record<string, { bg: string; text: string }> = {
  submitted: { bg: '#F3F4F6', text: '#6B7280' },
  reviewing: { bg: '#FEF3C7', text: '#D97706' },
  adopted: { bg: '#DCFCE7', text: '#16A34A' },
  rejected: { bg: '#FEE2E2', text: '#DC2626' },
};

const categories = [
  { value: 'economy', label: '경제' },
  { value: 'welfare', label: '복지' },
  { value: 'environment', label: '환경' },
  { value: 'education', label: '교육' },
  { value: 'labor', label: '노동' },
  { value: 'housing', label: '주거' },
  { value: 'healthcare', label: '의료' },
  { value: 'culture', label: '문화' },
  { value: 'other', label: '기타' },
];

export default function PolicyProposalsPage() {
  const router = useRouter();
  const [proposals, setProposals] = useState<PolicyProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<PolicyProposal | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  const fetchProposals = useCallback(async (uid: string) => {
    const supabase = createClient();
    setLoading(true);
    const { data } = await supabase
      .from('policy_proposals')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

    setProposals(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login?redirect=/portal/proposals');
        return;
      }
      setUserId(user.id);
      fetchProposals(user.id);
    };
    init();
  }, [router, fetchProposals]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('policy_proposals')
      .insert({
        user_id: userId,
        title,
        content,
        category: category || null,
      });

    if (error) {
      alert('제출 실패: ' + error.message);
    } else {
      alert('정책 제안이 제출되었습니다. (+15점)');
      setShowForm(false);
      setTitle('');
      setContent('');
      setCategory('');
      fetchProposals(userId);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            정책 제안
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            새 제안하기
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>정책 제안 안내:</strong> 당원이라면 누구나 정책을 제안할 수 있습니다.
            채택된 정책은 당 정책위원회에서 검토 후 공식 정책으로 발전될 수 있습니다.
            정책 제안 시 <strong>15점</strong>의 활동 점수가 부여됩니다.
          </p>
        </div>

        {/* 제안 작성 폼 */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">새 정책 제안</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">분야</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                >
                  <option value="">선택하세요</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="정책 제안 제목"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용 *</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder="정책의 배경, 목표, 구체적인 내용을 작성해 주세요."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? '제출 중...' : '제출하기'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 내 제안 목록 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">내 정책 제안</h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
            </div>
          ) : proposals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>제출한 정책 제안이 없습니다.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-yellow-600 hover:text-yellow-700 font-medium"
              >
                첫 번째 정책을 제안해 보세요
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.map((proposal) => {
                const statusColor = statusColors[proposal.status] || statusColors.submitted;
                return (
                  <div
                    key={proposal.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-yellow-300 transition-colors cursor-pointer"
                    onClick={() => setSelectedProposal(proposal)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {proposal.category && (
                            <span className="text-xs text-gray-500">
                              {categories.find(c => c.value === proposal.category)?.label}
                            </span>
                          )}
                          <span
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                          >
                            {statusLabels[proposal.status]}
                          </span>
                        </div>
                        <h3 className="font-medium text-gray-900">{proposal.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {proposal.created_at && new Date(proposal.created_at).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <Eye className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 상세 모달 */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">정책 제안 상세</h2>
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                {selectedProposal.category && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                    {categories.find(c => c.value === selectedProposal.category)?.label}
                  </span>
                )}
                <span
                  className="px-2 py-1 rounded text-sm font-medium flex items-center gap-1"
                  style={{
                    backgroundColor: statusColors[selectedProposal.status]?.bg,
                    color: statusColors[selectedProposal.status]?.text
                  }}
                >
                  {selectedProposal.status === 'adopted' && <CheckCircle className="w-3 h-3" />}
                  {selectedProposal.status === 'rejected' && <XCircle className="w-3 h-3" />}
                  {selectedProposal.status === 'reviewing' && <Clock className="w-3 h-3" />}
                  {statusLabels[selectedProposal.status]}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900">{selectedProposal.title}</h3>

              <p className="text-gray-600 whitespace-pre-wrap">{selectedProposal.content}</p>

              {selectedProposal.admin_note && (
                <div className={`rounded-lg p-4 ${
                  selectedProposal.status === 'adopted' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <p className="text-sm font-medium text-gray-700 mb-1">검토 의견</p>
                  <p className={`text-sm ${
                    selectedProposal.status === 'adopted' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {selectedProposal.admin_note}
                  </p>
                </div>
              )}

              <p className="text-sm text-gray-400">
                제출일: {selectedProposal.created_at && new Date(selectedProposal.created_at).toLocaleString('ko-KR')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

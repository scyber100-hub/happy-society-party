'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  useNominations,
  electionTypeLabels,
  nominationStatusLabels,
  nominationStatusColors
} from '@/hooks/useNominations';
import type { ElectionType } from '@/types/database';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Award,
  TrendingUp
} from 'lucide-react';

interface Region {
  id: string;
  name: string;
  level: number;
  parent_id: string | null;
}

export default function NominationsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | undefined>();
  const [regions, setRegions] = useState<Region[]>([]);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [electionType, setElectionType] = useState<ElectionType>('national_assembly');
  const [regionId, setRegionId] = useState<string>('');
  const [constituency, setConstituency] = useState('');
  const [applicationText, setApplicationText] = useState('');
  const [careerSummary, setCareerSummary] = useState('');
  const [policyPledges, setPolicyPledges] = useState('');

  const supabase = createClient();
  const {
    myNominations,
    eligibility,
    loading,
    error,
    applyNomination,
    checkEligibility
  } = useNominations(userId);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        router.push('/auth/login?redirect=/portal/nominations');
      }
    };
    getUser();
  }, [supabase, router]);

  useEffect(() => {
    const fetchRegions = async () => {
      const { data } = await supabase
        .from('regions')
        .select('*')
        .eq('level', 1)
        .order('name');
      if (data) setRegions(data);
    };
    fetchRegions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await applyNomination({
      election_type: electionType,
      region_id: regionId || undefined,
      constituency: constituency || undefined,
      application_text: applicationText,
      career_summary: careerSummary,
      policy_pledges: policyPledges,
    });

    setSubmitting(false);

    if (result.success) {
      alert('공천 신청이 완료되었습니다.');
      setShowApplyForm(false);
      // Reset form
      setElectionType('national_assembly');
      setRegionId('');
      setConstituency('');
      setApplicationText('');
      setCareerSummary('');
      setPolicyPledges('');
    } else {
      alert(result.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">공천 신청</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* 자격 현황 카드 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            공천 자격 현황
          </h2>

          {eligibility ? (
            <div className="space-y-4">
              <div className={`flex items-center gap-3 p-4 rounded-lg ${
                eligibility.eligible ? 'bg-green-50' : 'bg-yellow-50'
              }`}>
                {eligibility.eligible ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">공천 신청 자격이 있습니다</p>
                      <p className="text-sm text-green-600">
                        활동 점수: {eligibility.activity_score}점 | 당원 기간: {eligibility.member_days}일
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">공천 신청 자격 미달</p>
                      <p className="text-sm text-yellow-600">{eligibility.reason}</p>
                    </div>
                  </>
                )}
              </div>

              {eligibility.eligible && !showApplyForm && (
                <button
                  onClick={() => setShowApplyForm(true)}
                  className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors"
                >
                  공천 신청하기
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={checkEligibility}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              자격 확인하기
            </button>
          )}
        </div>

        {/* 공천 신청 폼 */}
        {showApplyForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-yellow-500" />
              공천 신청서 작성
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 선거 유형 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  선거 유형 *
                </label>
                <select
                  value={electionType}
                  onChange={(e) => setElectionType(e.target.value as ElectionType)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                >
                  {Object.entries(electionTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* 지역 선택 */}
              {['national_assembly', 'local_council', 'local_executive'].includes(electionType) && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      출마 지역 *
                    </label>
                    <select
                      value={regionId}
                      onChange={(e) => setRegionId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      required
                    >
                      <option value="">지역 선택</option>
                      {regions.map((region) => (
                        <option key={region.id} value={region.id}>{region.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      선거구명
                    </label>
                    <input
                      type="text"
                      value={constituency}
                      onChange={(e) => setConstituency(e.target.value)}
                      placeholder="예: 종로구 갑"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* 출마 소견서 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  출마 소견서 *
                </label>
                <textarea
                  value={applicationText}
                  onChange={(e) => setApplicationText(e.target.value)}
                  rows={6}
                  placeholder="출마 동기와 포부를 작성해 주세요."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              {/* 약력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  약력 *
                </label>
                <textarea
                  value={careerSummary}
                  onChange={(e) => setCareerSummary(e.target.value)}
                  rows={4}
                  placeholder="주요 경력과 활동 내역을 작성해 주세요."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              {/* 공약 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  핵심 공약 *
                </label>
                <textarea
                  value={policyPledges}
                  onChange={(e) => setPolicyPledges(e.target.value)}
                  rows={6}
                  placeholder="당선 시 추진할 핵심 공약을 작성해 주세요."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowApplyForm(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? '신청 중...' : '신청하기'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 내 공천 신청 내역 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-500" />
            내 공천 신청 내역
          </h2>

          {myNominations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>공천 신청 내역이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myNominations.map((nomination) => {
                const statusColor = nominationStatusColors[nomination.status];
                return (
                  <div
                    key={nomination.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-yellow-300 transition-colors cursor-pointer"
                    onClick={() => router.push(`/portal/nominations/${nomination.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {electionTypeLabels[nomination.election_type]}
                        </p>
                        {nomination.constituency && (
                          <p className="text-sm text-gray-500">{nomination.constituency}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(nomination.created_at).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: statusColor.bg,
                            color: statusColor.text
                          }}
                        >
                          {nominationStatusLabels[nomination.status]}
                        </span>
                        {nomination.final_score !== null && (
                          <span className="text-lg font-bold text-yellow-600">
                            {nomination.final_score.toFixed(1)}점
                          </span>
                        )}
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

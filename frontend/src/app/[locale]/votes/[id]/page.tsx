'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  useVotes,
  voteTypeLabels,
  voteStatusLabels,
  getRemainingTime,
  VoteOption,
  VoteResult,
} from '@/hooks/useVotes';
import {
  Vote,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Calendar,
  BarChart3,
  Flag,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Vote as VoteType, VoteStatus } from '@/types/database';

interface Props {
  params: Promise<{ id: string }>;
}

export default function VoteDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuthContext();
  const { fetchVoteDetail, checkEligibility, castVote, getVoteResult, getMyVoteRecord } = useVotes(user?.id);

  const [vote, setVote] = useState<VoteType | null>(null);
  const [options, setOptions] = useState<VoteOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isEligible, setIsEligible] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [myVote, setMyVote] = useState<string[] | null>(null);
  const [result, setResult] = useState<VoteResult | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showObjectionForm, setShowObjectionForm] = useState(false);
  const [objectionReason, setObjectionReason] = useState('');
  const [objectionEvidence, setObjectionEvidence] = useState('');
  const [hasObjection, setHasObjection] = useState(false);
  const [submittingObjection, setSubmittingObjection] = useState(false);

  const supabase = createClient();

  // 데이터 로드
  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;

      setLoading(true);
      try {
        // 투표 상세 정보
        const voteData = await fetchVoteDetail(id);
        if (!voteData) {
          setError('투표를 찾을 수 없습니다.');
          return;
        }
        setVote(voteData);
        setOptions((voteData.options as unknown as VoteOption[]) || []);

        // 투표 자격 확인
        const eligible = await checkEligibility(id);
        setIsEligible(eligible);

        // 내 투표 기록 확인
        const myRecord = await getMyVoteRecord(id);
        if (myRecord) {
          setHasVoted(true);
          setMyVote(myRecord.selected_options as string[]);
        }

        // 완료된 투표면 결과 조회
        if (voteData.status === 'completed' || voteData.status === 'counting') {
          const resultData = await getVoteResult(id);
          if (resultData) {
            setResult(resultData.result);
            setTotalVotes(resultData.totalVotes);
          }

          // 이의 신청 여부 확인
          const { data: objectionData } = await supabase
            .from('vote_objections')
            .select('id')
            .eq('vote_id', id)
            .eq('user_id', user.id)
            .single();

          if (objectionData) {
            setHasObjection(true);
          }
        }
      } catch {
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && isAuthenticated) {
      loadData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.id, authLoading, isAuthenticated, fetchVoteDetail, checkEligibility, getMyVoteRecord, getVoteResult]);

  // 인증 체크
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/auth/login?redirect=/votes/${id}`);
    }
  }, [authLoading, isAuthenticated, router, id]);

  // 옵션 선택 핸들러
  const handleOptionSelect = (optionId: string) => {
    if (hasVoted || vote?.status !== 'voting') return;

    if (vote?.allow_multiple) {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId));
      } else if (selectedOptions.length < (vote?.max_selections || 1)) {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    } else {
      setSelectedOptions([optionId]);
    }
  };

  // 투표 제출
  const handleSubmit = async () => {
    if (selectedOptions.length === 0) {
      setError('최소 하나의 옵션을 선택해주세요.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const response = await castVote(id, selectedOptions);

    if (response.success) {
      setSuccess('투표가 완료되었습니다.');
      setHasVoted(true);
      setMyVote(selectedOptions);
    } else {
      setError(response.message);
    }

    setSubmitting(false);
  };

  // 결과 퍼센트 계산
  const getPercentage = (optionId: string): number => {
    if (!result || totalVotes === 0) return 0;
    const count = result[optionId] || 0;
    return Math.round((count / totalVotes) * 100);
  };

  // 이의 신청 제출
  const handleObjectionSubmit = async () => {
    if (!objectionReason.trim()) {
      setError('이의 신청 사유를 입력해주세요.');
      return;
    }

    if (!user?.id) {
      setError('로그인이 필요합니다.');
      return;
    }

    setSubmittingObjection(true);
    setError(null);

    const { data, error: objError } = await supabase.rpc('submit_vote_objection', {
      p_vote_id: id,
      p_user_id: user.id,
      p_reason: objectionReason,
      p_evidence: objectionEvidence || null,
    });

    const result = data as unknown as { success: boolean; message: string } | null;

    if (objError) {
      setError('이의 신청 실패: ' + objError.message);
    } else if (result && !result.success) {
      setError(result.message);
    } else {
      setSuccess('이의 신청이 접수되었습니다. 검토 후 결과를 안내드리겠습니다.');
      setHasObjection(true);
      setShowObjectionForm(false);
      setObjectionReason('');
      setObjectionEvidence('');
    }

    setSubmittingObjection(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (!isAuthenticated || !vote) {
    return null;
  }

  const isVotingPeriod = vote.status === 'voting';
  const showResult = vote.status === 'completed' || (hasVoted && vote.status === 'voting');

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <div className="bg-[var(--primary)] text-white py-8">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/votes" className="inline-flex items-center gap-1 text-white/70 hover:text-white mb-4">
            <ChevronLeft className="w-4 h-4" />
            투표 목록으로
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="px-2 py-1 rounded text-xs font-medium"
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
              }}
            >
              {voteStatusLabels[vote.status as VoteStatus]}
            </span>
            <span className="text-sm text-white/70">
              {voteTypeLabels[vote.vote_type as 'party_election' | 'nomination' | 'policy' | 'committee' | 'regional']}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">{vote.title}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 에러/성공 메시지 */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {success}
          </div>
        )}

        {/* 투표 정보 */}
        <Card variant="default" className="bg-white mb-6">
          <CardContent className="p-6">
            {vote.description && (
              <p className="text-[var(--gray-700)] mb-6 whitespace-pre-wrap">
                {vote.description}
              </p>
            )}
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-[var(--gray-600)]">
                <Calendar className="w-4 h-4" />
                <span>시작: {new Date(vote.start_date).toLocaleString('ko-KR')}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--gray-600)]">
                <Clock className="w-4 h-4" />
                <span>종료: {new Date(vote.end_date).toLocaleString('ko-KR')}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--gray-600)]">
                <Users className="w-4 h-4" />
                <span>{vote.total_votes || 0}명 참여</span>
              </div>
            </div>
            {isVotingPeriod && (
              <div className="mt-4 p-3 bg-[var(--primary-light)] rounded-lg">
                <span className="text-[var(--primary)] font-medium">
                  {getRemainingTime(vote.end_date)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 투표 옵션 */}
        <Card variant="default" className="bg-white">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-[var(--gray-900)] mb-4 flex items-center gap-2">
              {showResult ? (
                <>
                  <BarChart3 className="w-5 h-5" />
                  투표 결과
                </>
              ) : (
                <>
                  <Vote className="w-5 h-5" />
                  투표 항목
                  {vote.allow_multiple && (
                    <span className="text-sm font-normal text-[var(--gray-500)]">
                      (최대 {vote.max_selections}개 선택)
                    </span>
                  )}
                </>
              )}
            </h2>

            <div className="space-y-3">
              {options.map((option) => {
                const isSelected = selectedOptions.includes(option.id);
                const isMyVote = myVote?.includes(option.id);
                const percentage = getPercentage(option.id);
                const voteCount = result?.[option.id] || 0;

                return (
                  <div
                    key={option.id}
                    onClick={() => !showResult && handleOptionSelect(option.id)}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      showResult
                        ? 'cursor-default'
                        : isVotingPeriod && isEligible && !hasVoted
                        ? 'cursor-pointer hover:border-[var(--primary)]'
                        : 'cursor-not-allowed opacity-60'
                    } ${
                      isSelected || isMyVote
                        ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                        : 'border-[var(--gray-200)] bg-white'
                    }`}
                  >
                    {/* 결과 바 */}
                    {showResult && (
                      <div
                        className="absolute inset-0 bg-[var(--primary)] opacity-10 rounded-lg transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    )}

                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {!showResult && (
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-[var(--primary)] bg-[var(--primary)]'
                                : 'border-[var(--gray-300)]'
                            }`}
                          >
                            {isSelected && (
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            )}
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-[var(--gray-900)]">
                            {option.label}
                          </span>
                          {option.description && (
                            <p className="text-sm text-[var(--gray-500)] mt-1">
                              {option.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {showResult && (
                        <div className="text-right">
                          <span className="text-lg font-bold text-[var(--primary)]">
                            {percentage}%
                          </span>
                          <p className="text-xs text-[var(--gray-500)]">{voteCount}표</p>
                        </div>
                      )}
                      {isMyVote && (
                        <span className="ml-2 text-xs text-[var(--primary)] font-medium">
                          내 선택
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 투표 버튼 */}
            {isVotingPeriod && !hasVoted && (
              <div className="mt-6">
                {!isEligible ? (
                  <div className="p-4 bg-amber-50 rounded-lg text-amber-700 text-sm">
                    <AlertCircle className="w-5 h-5 inline mr-2" />
                    이 투표에 참여할 자격이 없습니다. (당원 자격 또는 해당 지역/위원회 소속이 필요합니다)
                  </div>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={selectedOptions.length === 0 || submitting}
                    fullWidth
                  >
                    {submitting ? '처리 중...' : '투표하기'}
                  </Button>
                )}
              </div>
            )}

            {/* 투표 완료 안내 */}
            {hasVoted && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg text-green-700 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                투표에 참여하셨습니다. 감사합니다!
              </div>
            )}
          </CardContent>
        </Card>

        {/* 이의 신청 섹션 (완료된 투표만) */}
        {vote.status === 'completed' && hasVoted && (
          <Card variant="default" className="bg-white mt-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-[var(--gray-900)] mb-4 flex items-center gap-2">
                <Flag className="w-5 h-5" />
                이의 신청
              </h2>

              {hasObjection ? (
                <div className="p-4 bg-blue-50 rounded-lg text-blue-700 text-sm">
                  <CheckCircle2 className="w-5 h-5 inline mr-2" />
                  이의 신청이 접수되었습니다. 검토 결과는 알림으로 안내드리겠습니다.
                </div>
              ) : showObjectionForm ? (
                <div className="space-y-4">
                  <p className="text-sm text-[var(--gray-600)]">
                    투표 과정이나 결과에 이의가 있으시면 아래 양식을 통해 신청해 주세요.
                    공정한 검토 후 결과를 안내드리겠습니다.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">
                      이의 사유 *
                    </label>
                    <textarea
                      value={objectionReason}
                      onChange={(e) => setObjectionReason(e.target.value)}
                      rows={4}
                      placeholder="이의 사유를 상세히 작성해 주세요."
                      className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">
                      증거 자료 (선택)
                    </label>
                    <textarea
                      value={objectionEvidence}
                      onChange={(e) => setObjectionEvidence(e.target.value)}
                      rows={2}
                      placeholder="관련 증거나 참고 자료가 있다면 작성해 주세요."
                      className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowObjectionForm(false)}
                      className="flex-1"
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleObjectionSubmit}
                      disabled={submittingObjection}
                      className="flex-1"
                    >
                      {submittingObjection ? '제출 중...' : '이의 신청'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-[var(--gray-600)] mb-4">
                    투표 과정이나 결과에 이의가 있으신가요? 이의 신청을 통해 재검토를 요청할 수 있습니다.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowObjectionForm(true)}
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    이의 신청하기
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 하단 버튼 */}
        <div className="mt-8 text-center">
          <Link href="/votes">
            <Button variant="outline">투표 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

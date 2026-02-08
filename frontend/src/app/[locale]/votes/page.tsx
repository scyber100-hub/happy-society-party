'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  useVotes,
  voteTypeLabels,
  voteScopeLabels,
  voteStatusLabels,
  voteStatusColors,
  getRemainingTime,
} from '@/hooks/useVotes';
import {
  Vote,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import type { VoteStatus, VoteType } from '@/types/database';

export default function VotesPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, isAuthenticated } = useAuthContext();
  const { votes, loading, error } = useVotes(user?.id);

  // 인증 체크
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/votes');
    }
  }, [authLoading, isAuthenticated, router]);

  // 당원 자격 체크
  const isPartyMember = profile?.role && ['member', 'active_member', 'candidate', 'moderator', 'admin'].includes(profile.role);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // 진행 중인 투표와 완료된 투표 분리
  const activeVotes = votes.filter(v => v.status === 'voting' || v.status === 'deliberation');
  const completedVotes = votes.filter(v => v.status === 'completed');

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <div className="bg-[var(--primary)] text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Vote className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">당내 투표</h1>
              <p className="text-white/80">당원의 의사를 반영하는 민주적 의사결정</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 당원 자격 안내 */}
        {!isPartyMember && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 font-medium">투표 참여 자격 안내</p>
              <p className="text-amber-700 text-sm mt-1">
                투표는 당원 이상의 자격을 가진 분만 참여하실 수 있습니다.
                입당하시면 모든 투표에 참여하실 수 있습니다.
              </p>
              <Link href="/join">
                <Button size="sm" className="mt-3">입당 신청하기</Button>
              </Link>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 진행 중인 투표 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--primary)]" />
            진행 중인 투표
          </h2>

          {activeVotes.length === 0 ? (
            <Card variant="default" className="bg-white">
              <CardContent className="py-12 text-center">
                <Vote className="w-12 h-12 mx-auto mb-4 text-[var(--gray-300)]" />
                <p className="text-[var(--gray-500)]">현재 진행 중인 투표가 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeVotes.map((vote) => (
                <Link key={vote.id} href={`/votes/${vote.id}`}>
                  <Card variant="default" className="bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: voteStatusColors[vote.status as VoteStatus].bg,
                                color: voteStatusColors[vote.status as VoteStatus].text,
                              }}
                            >
                              {voteStatusLabels[vote.status as VoteStatus]}
                            </span>
                            <span className="text-xs text-[var(--gray-500)]">
                              {voteTypeLabels[vote.vote_type as VoteType]}
                            </span>
                            <span className="text-xs text-[var(--gray-400)]">•</span>
                            <span className="text-xs text-[var(--gray-500)]">
                              {voteScopeLabels[vote.scope as 'national' | 'regional' | 'committee' | 'international']}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-2">
                            {vote.title}
                          </h3>
                          {vote.description && (
                            <p className="text-sm text-[var(--gray-600)] line-clamp-2 mb-3">
                              {vote.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-[var(--gray-500)]">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {vote.total_votes}명 참여
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {getRemainingTime(vote.end_date)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {vote.has_voted ? (
                            <span className="flex items-center gap-1 text-[var(--primary)] text-sm">
                              <CheckCircle2 className="w-5 h-5" />
                              투표 완료
                            </span>
                          ) : (
                            <span className="text-[var(--primary)] text-sm font-medium">
                              투표하기
                            </span>
                          )}
                          <ChevronRight className="w-5 h-5 text-[var(--gray-400)]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 완료된 투표 */}
        {completedVotes.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[var(--gray-500)]" />
              완료된 투표
            </h2>
            <div className="space-y-4">
              {completedVotes.map((vote) => (
                <Link key={vote.id} href={`/votes/${vote.id}`}>
                  <Card variant="default" className="bg-white hover:shadow-md transition-shadow opacity-80">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: voteStatusColors.completed.bg,
                                color: voteStatusColors.completed.text,
                              }}
                            >
                              완료
                            </span>
                            <span className="text-xs text-[var(--gray-500)]">
                              {voteTypeLabels[vote.vote_type as VoteType]}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-2">
                            {vote.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-[var(--gray-500)]">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              총 {vote.total_votes}명 참여
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className="text-[var(--gray-500)] text-sm">
                            결과 보기
                          </span>
                          <ChevronRight className="w-5 h-5 text-[var(--gray-400)]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

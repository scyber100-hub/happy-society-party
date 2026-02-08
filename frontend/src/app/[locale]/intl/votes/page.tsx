'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Vote,
  Globe,
  Calendar,
  Users,
  ChevronRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { getIntlVotes, getIntlMemberByUserId } from '@/lib/international';
import {
  countryFlags,
  voteTypeLabels,
  voteStatusLabels,
  voteStatusColors,
  type IntlVote,
  type IntlMember
} from '@/types/international';
import { useAuth } from '@/hooks/useAuth';

const VOTES_PER_PAGE = 10;

export default function IntlVotesPage() {
  const { user } = useAuth();
  const [votes, setVotes] = useState<IntlVote[]>([]);
  const [currentMember, setCurrentMember] = useState<IntlMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalVotes, setTotalVotes] = useState(0);

  const statusFilters = [
    { value: null, label: 'All' },
    { value: 'voting', label: 'Active' },
    { value: 'deliberation', label: 'Deliberation' },
    { value: 'completed', label: 'Completed' },
  ];

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getIntlVotes({
        status: selectedStatus || ['deliberation', 'voting', 'completed'],
        limit: VOTES_PER_PAGE,
        offset: (currentPage - 1) * VOTES_PER_PAGE,
      });
      setVotes(result.votes);
      setTotalVotes(result.total);
    } catch (error) {
      console.error('Failed to load votes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, currentPage]);

  const loadMember = useCallback(async () => {
    if (!user?.id) return;
    try {
      const member = await getIntlMemberByUserId(user.id);
      setCurrentMember(member);
    } catch (error) {
      console.error('Failed to load member:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (user?.id) {
      loadMember();
    }
  }, [user?.id, loadMember]);

  const totalPages = Math.ceil(totalVotes / VOTES_PER_PAGE);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const isVotingOpen = (vote: IntlVote) => {
    const now = new Date();
    return (
      vote.status === 'voting' &&
      new Date(vote.start_date) <= now &&
      new Date(vote.end_date) >= now
    );
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Vote className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">International Voting</h1>
          </div>
          <p className="text-white/90 max-w-2xl mx-auto">
            Participate in democratic decision-making across our global chapters
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {statusFilters.map(filter => (
            <button
              key={filter.value || 'all'}
              onClick={() => { setSelectedStatus(filter.value); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedStatus === filter.value
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-white text-[var(--gray-600)] hover:bg-[var(--gray-100)]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Votes List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : votes.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <Vote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No votes found</h3>
            <p className="text-gray-500">
              {selectedStatus
                ? 'No votes match the selected filter'
                : 'There are no active votes at the moment'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {votes.map(vote => (
              <Link key={vote.id} href={`/intl/votes/${vote.id}`}>
                <Card className="bg-white hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${voteStatusColors[vote.status]}`}>
                            {voteStatusLabels[vote.status]?.en || vote.status}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                            {voteTypeLabels[vote.vote_type]?.en || vote.vote_type}
                          </span>
                          {vote.scope === 'global' ? (
                            <span className="flex items-center gap-1 text-xs text-blue-600">
                              <Globe className="w-3 h-3" />
                              Global
                            </span>
                          ) : vote.chapter && (
                            <span className="text-xs text-gray-500">
                              {countryFlags[vote.chapter.country_code]} {vote.chapter.country_name_en}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {vote.title}
                        </h3>

                        {vote.description && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {vote.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(vote.start_date)} - {formatDate(vote.end_date)}
                          </span>
                          {isVotingOpen(vote) && (
                            <span className="flex items-center gap-1 text-green-600">
                              <Clock className="w-4 h-4" />
                              {getTimeRemaining(vote.end_date)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {vote.total_votes} votes
                          </span>
                          {vote.status === 'completed' && (
                            <span className="flex items-center gap-1 text-purple-600">
                              <CheckCircle2 className="w-4 h-4" />
                              Results available
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium ${
                      currentPage === pageNum
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Join Banner */}
        {!currentMember && (
          <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white mt-8">
            <CardContent className="p-8 text-center">
              <Vote className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-xl font-semibold mb-2">Your Vote Matters</h3>
              <p className="text-white/80 mb-4">
                Become a member to participate in democratic decisions and shape our global movement.
              </p>
              <Link href="/intl/join">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Join Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

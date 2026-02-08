'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  Vote,
  Globe,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  MessageSquare,
  Send,
  Check
} from 'lucide-react';
import {
  getIntlVote,
  getIntlVoteDiscussions,
  createIntlVoteDiscussion,
  castIntlVote,
  hasVotedIntl,
  getIntlVoteRecord,
  getIntlMemberByUserId
} from '@/lib/international';
import {
  countryFlags,
  voteTypeLabels,
  voteStatusLabels,
  voteStatusColors,
  type IntlVote,
  type IntlVoteDiscussion,
  type IntlMember,
  type VoteOption
} from '@/types/international';
import { useAuth } from '@/hooks/useAuth';

interface PageProps {
  params: Promise<{ voteId: string }>;
}

export default function IntlVoteDetailPage({ params }: PageProps) {
  const { voteId } = use(params);
  const { user } = useAuth();
  const [vote, setVote] = useState<IntlVote | null>(null);
  const [discussions, setDiscussions] = useState<IntlVoteDiscussion[]>([]);
  const [currentMember, setCurrentMember] = useState<IntlMember | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [myVote, setMyVote] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discussionText, setDiscussionText] = useState('');
  const [showResults, setShowResults] = useState(false);

  const loadVote = useCallback(async () => {
    try {
      setIsLoading(true);
      const [voteData, discussionsData] = await Promise.all([
        getIntlVote(voteId),
        getIntlVoteDiscussions(voteId),
      ]);
      setVote(voteData);
      setDiscussions(discussionsData);
      if (voteData?.status === 'completed') {
        setShowResults(true);
      }
    } catch (error) {
      console.error('Failed to load vote:', error);
    } finally {
      setIsLoading(false);
    }
  }, [voteId]);

  const loadMember = useCallback(async () => {
    if (!user?.id) return;
    try {
      const member = await getIntlMemberByUserId(user.id);
      setCurrentMember(member);
    } catch (error) {
      console.error('Failed to load member:', error);
    }
  }, [user?.id]);

  const checkVoteStatus = useCallback(async () => {
    if (!currentMember || !vote) return;
    try {
      const voted = await hasVotedIntl(vote.id, currentMember.id);
      setHasVoted(voted);
      if (voted) {
        const record = await getIntlVoteRecord(vote.id, currentMember.id);
        setMyVote(record);
      }
    } catch (error) {
      console.error('Failed to check vote status:', error);
    }
  }, [currentMember, vote]);

  useEffect(() => {
    loadVote();
  }, [loadVote]);

  useEffect(() => {
    if (user?.id) {
      loadMember();
    }
  }, [user?.id, loadMember]);

  useEffect(() => {
    if (currentMember && vote) {
      checkVoteStatus();
    }
  }, [currentMember, vote, checkVoteStatus]);

  const isVotingOpen = () => {
    if (!vote) return false;
    const now = new Date();
    return (
      vote.status === 'voting' &&
      new Date(vote.start_date) <= now &&
      new Date(vote.end_date) >= now
    );
  };

  const handleOptionSelect = (optionId: string) => {
    if (!vote) return;

    if (vote.allow_multiple) {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(prev => prev.filter(id => id !== optionId));
      } else if (selectedOptions.length < vote.max_selections) {
        setSelectedOptions(prev => [...prev, optionId]);
      }
    } else {
      setSelectedOptions([optionId]);
    }
  };

  async function handleCastVote() {
    if (!currentMember || !vote || selectedOptions.length === 0) return;

    try {
      setIsSubmitting(true);
      await castIntlVote(vote.id, currentMember.id, selectedOptions);
      setHasVoted(true);
      setMyVote(selectedOptions);
      // Refresh vote data
      const updatedVote = await getIntlVote(voteId);
      setVote(updatedVote);
    } catch (error) {
      console.error('Failed to cast vote:', error);
      alert('Failed to cast vote. You may have already voted or voting is closed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmitDiscussion(e: React.FormEvent) {
    e.preventDefault();
    if (!currentMember || !discussionText.trim()) return;

    try {
      setIsSubmitting(true);
      const newDiscussion = await createIntlVoteDiscussion({
        vote_id: voteId,
        author_id: currentMember.id,
        content: discussionText.trim(),
      });
      setDiscussions(prev => [...prev, newDiscussion]);
      setDiscussionText('');
    } catch (error) {
      console.error('Failed to submit discussion:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} days, ${hours} hours remaining`;
    return `${hours} hours remaining`;
  };

  const getVotePercentage = (optionId: string) => {
    if (!vote?.result || !vote.total_votes) return 0;
    const count = vote.result[optionId] || 0;
    return Math.round((count / vote.total_votes) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-3">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vote) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Vote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Vote not found</h2>
          <p className="text-gray-500 mb-4">The vote you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/intl/votes">
            <Button variant="primary">Back to Votes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/intl/votes"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Votes
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Vote Info */}
        <Card className="bg-white mb-8">
          <CardContent className="p-8">
            {/* Status & Type */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className={`px-3 py-1 text-sm font-medium rounded ${voteStatusColors[vote.status]}`}>
                {voteStatusLabels[vote.status]?.en || vote.status}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded">
                {voteTypeLabels[vote.vote_type]?.en || vote.vote_type}
              </span>
              {vote.scope === 'global' ? (
                <span className="flex items-center gap-1 text-sm text-blue-600">
                  <Globe className="w-4 h-4" />
                  Global Vote
                </span>
              ) : vote.chapter && (
                <span className="text-sm text-gray-500">
                  {countryFlags[vote.chapter.country_code]} {vote.chapter.country_name_en}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {vote.title}
            </h1>

            {/* Description */}
            {vote.description && (
              <p className="text-gray-600 mb-6">{vote.description}</p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pb-6 border-b">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(vote.start_date)} - {formatDate(vote.end_date)}
              </span>
              {isVotingOpen() && (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <Clock className="w-4 h-4" />
                  {getTimeRemaining(vote.end_date)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {vote.total_votes} votes cast
              </span>
            </div>

            {/* Voting Section */}
            {isVotingOpen() && !hasVoted && currentMember && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Cast Your Vote
                  {vote.allow_multiple && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      (Select up to {vote.max_selections})
                    </span>
                  )}
                </h2>
                <div className="space-y-3">
                  {vote.options.map((option: VoteOption) => (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedOptions.includes(option.id)
                          ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedOptions.includes(option.id)
                            ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                            : 'border-gray-300'
                        }`}>
                          {selectedOptions.includes(option.id) && <Check className="w-4 h-4" />}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{option.label}</span>
                          {option.description && (
                            <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={handleCastVote}
                    disabled={selectedOptions.length === 0 || isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <Vote className="w-4 h-4" />
                    {isSubmitting ? 'Submitting...' : 'Cast Vote'}
                  </Button>
                </div>
              </div>
            )}

            {/* Already Voted Message */}
            {hasVoted && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">You have voted!</span>
                </div>
                {myVote && (
                  <p className="text-sm text-green-600 mt-1">
                    Your selection: {myVote.map(id =>
                      vote.options.find((o: VoteOption) => o.id === id)?.label
                    ).join(', ')}
                  </p>
                )}
              </div>
            )}

            {/* Not a Member */}
            {!currentMember && isVotingOpen() && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600 mb-3">Join to participate in this vote</p>
                <Link href="/intl/join">
                  <Button variant="primary">Become a Member</Button>
                </Link>
              </div>
            )}

            {/* Results Section */}
            {(showResults || vote.status === 'completed') && vote.result && (
              <div className="mt-8 pt-6 border-t">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  Results
                </h2>
                <div className="space-y-4">
                  {vote.options.map((option: VoteOption) => {
                    const percentage = getVotePercentage(option.id);
                    const count = vote.result?.[option.id] || 0;
                    return (
                      <div key={option.id}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-gray-900">{option.label}</span>
                          <span className="text-gray-600">{count} votes ({percentage}%)</span>
                        </div>
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--primary)] transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Total: {vote.total_votes} votes
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Discussion Section */}
        {(vote.status === 'deliberation' || vote.status === 'voting') && (
          <Card className="bg-white">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Discussion
              </h2>

              {/* Discussion Form */}
              {currentMember ? (
                <form onSubmit={handleSubmitDiscussion} className="mb-8">
                  <textarea
                    value={discussionText}
                    onChange={e => setDiscussionText(e.target.value)}
                    placeholder="Share your thoughts on this vote..."
                    className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!discussionText.trim() || isSubmitting}
                      className="flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Post
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center mb-8">
                  <p className="text-gray-600 mb-3">Join to participate in the discussion</p>
                  <Link href="/intl/join">
                    <Button variant="primary">Become a Member</Button>
                  </Link>
                </div>
              )}

              {/* Discussion List */}
              {discussions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No discussions yet. Be the first to share your thoughts!
                </p>
              ) : (
                <div className="space-y-6">
                  {discussions.map(discussion => (
                    <div key={discussion.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <span className="font-medium text-gray-900">
                          {discussion.author && countryFlags[discussion.author.country_code]}{' '}
                          {discussion.author
                            ? `${discussion.author.first_name} ${discussion.author.last_name}`
                            : 'Anonymous'}
                        </span>
                        <span className="text-gray-500">
                          {new Date(discussion.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{discussion.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Globe,
  MessageSquare,
  Eye,
  ThumbsUp,
  ChevronRight,
  PenLine,
  MapPin
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  getGlobalPosts,
  getActiveChapters,
  getIntlMemberByUserId
} from '@/lib/international';
import {
  countryFlags,
  postCategoryLabels,
  postCategoryColors,
  type IntlPost,
  type IntlChapter,
  type IntlMember
} from '@/types/international';
import { useAuth } from '@/hooks/useAuth';

const POSTS_PER_PAGE = 10;

export default function IntlBoardPage() {
  const t = useTranslations('intl.board');
  const { user } = useAuth();
  const [posts, setPosts] = useState<IntlPost[]>([]);
  const [chapters, setChapters] = useState<IntlChapter[]>([]);
  const [currentMember, setCurrentMember] = useState<IntlMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const categories = ['general', 'announcement', 'discussion', 'event', 'resource'];

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [postsResult, chaptersResult] = await Promise.all([
        getGlobalPosts({
          category: selectedCategory || undefined,
          limit: POSTS_PER_PAGE,
          offset: (currentPage - 1) * POSTS_PER_PAGE,
        }),
        getActiveChapters(),
      ]);
      setPosts(postsResult.posts);
      setTotalPosts(postsResult.total);
      setChapters(chaptersResult);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, currentPage]);

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

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes}m ago`;
      }
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getAuthorName = (post: IntlPost) => {
    if (!post.author) return 'Anonymous';
    return `${post.author.first_name} ${post.author.last_name}`;
  };

  const getAuthorFlag = (post: IntlPost) => {
    if (!post.author?.country_code) return '';
    return countryFlags[post.author.country_code] || '';
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">
              {t('title') || 'International Board'}
            </h1>
          </div>
          <p className="text-white/90 max-w-2xl mx-auto">
            {t('description') || 'Connect with members worldwide and share ideas for a happier society'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    !selectedCategory
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-white text-[var(--gray-600)] hover:bg-[var(--gray-100)]'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-white text-[var(--gray-600)] hover:bg-[var(--gray-100)]'
                    }`}
                  >
                    {postCategoryLabels[cat]?.en || cat}
                  </button>
                ))}
              </div>

              {/* Write Button */}
              {currentMember && (
                <Link href="/intl/board/write">
                  <Button variant="primary" className="flex items-center gap-2">
                    <PenLine className="w-4 h-4" />
                    Write Post
                  </Button>
                </Link>
              )}
            </div>

            {/* Posts List */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex gap-4">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-4">
                  Be the first to share your thoughts with the global community!
                </p>
                {currentMember && (
                  <Link href="/intl/board/write">
                    <Button variant="primary">Write First Post</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <Link key={post.id} href={`/intl/board/${post.id}`}>
                    <Card className="bg-white hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              {post.is_pinned && (
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                  Pinned
                                </span>
                              )}
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${postCategoryColors[post.category]}`}>
                                {postCategoryLabels[post.category]?.en || post.category}
                              </span>
                              {post.chapter && (
                                <span className="text-sm text-gray-500">
                                  {countryFlags[post.chapter.country_code]} {post.chapter.country_name_en}
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                              {post.content.replace(/<[^>]*>/g, '').slice(0, 200)}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                {getAuthorFlag(post)} {getAuthorName(post)}
                              </span>
                              <span>{formatDate(post.created_at)}</span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {post.view_count}
                              </span>
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-4 h-4" />
                                {post.like_count}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                {post.comment_count}
                              </span>
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
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Chapters */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[var(--primary)]" />
                  Chapters
                </h3>
                <div className="space-y-2">
                  {chapters.slice(0, 10).map(chapter => (
                    <Link
                      key={chapter.id}
                      href={`/intl/board/chapter/${chapter.country_code}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-xl">{countryFlags[chapter.country_code]}</span>
                        <span className="text-gray-900">{chapter.country_name_en}</span>
                      </span>
                      <span className="text-sm text-gray-500">
                        {chapter.member_count} members
                      </span>
                    </Link>
                  ))}
                </div>
                {chapters.length > 10 && (
                  <Link
                    href="/intl/chapters"
                    className="block text-center text-[var(--primary)] font-medium mt-4 hover:underline"
                  >
                    View all chapters →
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Join Banner */}
            {!currentMember && (
              <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white">
                <CardContent className="p-6 text-center">
                  <Globe className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  <h3 className="text-lg font-semibold mb-2">Join the Movement</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Become a member to participate in discussions and connect with activists worldwide.
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
      </div>
    </div>
  );
}

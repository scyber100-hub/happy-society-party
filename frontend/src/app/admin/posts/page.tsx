'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';
import {
  Search,
  Eye,
  Trash2,
  Pin,
  PinOff,
  MessageSquare,
  Heart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string | null;
  community_id: string | null;
  like_count: number | null;
  comment_count: number | null;
  view_count: number | null;
  is_pinned: boolean | null;
  is_published: boolean | null;
  created_at: string | null;
  author?: { name: string } | null;
  community?: { name: string } | null;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  const supabase = createClient();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('posts')
      .select(`
        *,
        author:user_profiles!posts_author_id_fkey(name),
        community:communities(name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }

    const { data, count, error } = await query;

    if (!error && data) {
      setPosts(data);
      setTotalCount(count || 0);
    }
    setLoading(false);
  }, [supabase, currentPage, pageSize, searchQuery]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleTogglePin = async (postId: string, currentPinned: boolean | null) => {
    const newPinned = !(currentPinned ?? false);
    const { error } = await supabase
      .from('posts')
      .update({ is_pinned: newPinned })
      .eq('id', postId);

    if (!error) {
      setPosts(posts.map(p =>
        p.id === postId ? { ...p, is_pinned: newPinned } : p
      ));
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (!error) {
      setPosts(posts.filter(p => p.id !== postId));
      setTotalCount(prev => prev - 1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--gray-900)]">게시글 관리</h1>
        <div className="text-sm text-[var(--gray-500)]">
          총 <span className="font-medium text-[var(--primary)]">{totalCount}</span>개
        </div>
      </div>

      {/* Search & Filter */}
      <Card variant="default" className="bg-white">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gray-400)]" />
              <Input
                type="text"
                placeholder="게시글 제목 또는 내용 검색..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card variant="default" className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--gray-50)] border-b border-[var(--gray-200)]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--gray-600)]">제목</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--gray-600)]">작성자</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--gray-600)]">커뮤니티</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-[var(--gray-600)]">조회</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-[var(--gray-600)]">좋아요</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-[var(--gray-600)]">댓글</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-[var(--gray-600)]">작성일</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-[var(--gray-600)]">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-100)]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[var(--gray-500)]">
                    로딩 중...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[var(--gray-500)]">
                    게시글이 없습니다.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-[var(--gray-50)]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {post.is_pinned === true && (
                          <Pin className="w-4 h-4 text-[var(--primary)]" />
                        )}
                        <span className="font-medium text-[var(--gray-900)] truncate max-w-[300px]">
                          {post.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--gray-600)]">
                      {post.author?.name || '알 수 없음'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 bg-[var(--primary-light)] text-[var(--primary)] rounded-full">
                        {post.community?.name || '삭제된 커뮤니티'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-[var(--gray-600)]">
                      <span className="flex items-center justify-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.view_count ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-[var(--gray-600)]">
                      <span className="flex items-center justify-center gap-1">
                        <Heart className="w-4 h-4" />
                        {post.like_count ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-[var(--gray-600)]">
                      <span className="flex items-center justify-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {post.comment_count ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-[var(--gray-500)]">
                      {post.created_at ? formatDate(post.created_at) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleTogglePin(post.id, post.is_pinned)}
                          className={`p-2 rounded hover:bg-[var(--gray-100)] ${
                            post.is_pinned === true ? 'text-[var(--primary)]' : 'text-[var(--gray-400)]'
                          }`}
                          title={post.is_pinned === true ? '고정 해제' : '고정'}
                        >
                          {post.is_pinned === true ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                        </button>
                        <Link
                          href={`/community/${post.community_id}/posts/${post.id}`}
                          className="p-2 rounded hover:bg-[var(--gray-100)] text-[var(--gray-400)]"
                          title="보기"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 rounded hover:bg-[var(--error)]/10 text-[var(--gray-400)] hover:text-[var(--error)]"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--gray-200)]">
            <div className="text-sm text-[var(--gray-500)]">
              {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount)} / {totalCount}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-[var(--gray-600)]">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

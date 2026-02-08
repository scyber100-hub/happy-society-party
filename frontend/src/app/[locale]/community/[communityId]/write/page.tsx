'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuthContext } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import type { Community } from '@/types/database';

export default function WritePostPage() {
  const router = useRouter();
  const params = useParams();
  const communityId = params.communityId as string;

  const { user, loading: authLoading } = useAuthContext();
  const supabase = createClient();

  const [community, setCommunity] = useState<Community | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      const { data } = await supabase
        .from('communities')
        .select('*')
        .eq('id', communityId)
        .single();

      setCommunity(data);
    };

    fetchCommunity();
  }, [communityId, supabase]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/auth/login?redirect=/community/${communityId}/write`);
    }
  }, [user, authLoading, router, communityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from('posts')
      .insert({
        community_id: communityId,
        author_id: user.id,
        title: title.trim(),
        content: content.trim(),
      })
      .select()
      .single();

    if (insertError) {
      setError('게시글 작성에 실패했습니다.');
      setIsLoading(false);
      return;
    }

    // 커뮤니티 게시글 수 업데이트
    await supabase
      .from('communities')
      .update({ post_count: (community?.post_count || 0) + 1 })
      .eq('id', communityId);

    router.push(`/community/${communityId}/posts/${data.id}`);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
        <div className="animate-pulse text-[var(--gray-500)]">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--gray-500)] mb-6">
          <Link href="/community" className="hover:text-[var(--primary)]">커뮤니티</Link>
          <span>/</span>
          <Link href={`/community/${communityId}`} className="hover:text-[var(--primary)]">
            {community?.name || '...'}
          </Link>
          <span>/</span>
          <span className="text-[var(--gray-700)]">글 작성</span>
        </div>

        <Card variant="default" className="bg-white">
          <h1 className="text-2xl font-bold text-[var(--gray-900)] mb-6">글 작성</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[var(--radius-md)] text-red-600 text-sm">
                {error}
              </div>
            )}

            <Input
              label="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              required
            />

            <div>
              <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                내용 <span className="text-[var(--error)]">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                rows={15}
                className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-[var(--radius-md)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--gray-200)]">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/community/${communityId}`)}
              >
                취소
              </Button>
              <Button type="submit" isLoading={isLoading}>
                게시하기
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuthContext } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const communityId = params.communityId as string;
  const postId = params.postId as string;

  const { user, loading: authLoading } = useAuthContext();
  const supabase = createClient();

  const [communityName, setCommunityName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const { data: post, error } = await supabase
        .from('posts')
        .select('*, community:communities(name)')
        .eq('id', postId)
        .single();

      if (error || !post) {
        router.push(`/community/${communityId}`);
        return;
      }

      // 작성자 확인
      if (user && post.author_id !== user.id) {
        alert('수정 권한이 없습니다.');
        router.push(`/community/${communityId}/posts/${postId}`);
        return;
      }

      setTitle(post.title);
      setContent(post.content);
      setCommunityName(post.community?.name || '');
      setIsLoading(false);
    };

    if (!authLoading) {
      if (!user) {
        router.push(`/auth/login?redirect=/community/${communityId}/posts/${postId}/edit`);
      } else {
        fetchPost();
      }
    }
  }, [user, authLoading, postId, communityId, router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    setIsSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from('posts')
      .update({
        title: title.trim(),
        content: content.trim(),
      })
      .eq('id', postId);

    if (updateError) {
      setError('게시글 수정에 실패했습니다.');
      setIsSaving(false);
      return;
    }

    router.push(`/community/${communityId}/posts/${postId}`);
  };

  if (authLoading || isLoading) {
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
            {communityName}
          </Link>
          <span>/</span>
          <span className="text-[var(--gray-700)]">글 수정</span>
        </div>

        <Card variant="default" className="bg-white">
          <h1 className="text-2xl font-bold text-[var(--gray-900)] mb-6">글 수정</h1>

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
                onClick={() => router.push(`/community/${communityId}/posts/${postId}`)}
              >
                취소
              </Button>
              <Button type="submit" isLoading={isSaving}>
                수정하기
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

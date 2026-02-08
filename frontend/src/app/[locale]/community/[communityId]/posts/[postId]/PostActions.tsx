'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuthContext } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Heart } from 'lucide-react';

interface Props {
  postId: string;
  communityId: string;
  authorId?: string;
}

const REPORT_REASONS = [
  { value: 'spam', label: '스팸/광고' },
  { value: 'hate', label: '혐오 발언' },
  { value: 'inappropriate', label: '부적절한 콘텐츠' },
  { value: 'misinformation', label: '허위 정보' },
  { value: 'personal_attack', label: '개인 공격' },
  { value: 'other', label: '기타' },
];

export default function PostActions({ postId, communityId, authorId }: Props) {
  const router = useRouter();
  const { user } = useAuthContext();
  const supabase = createClient();

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  const isAuthor = user?.id === authorId;

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      setIsLiked(!!data);
    };

    const getLikeCount = async () => {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      setLikeCount(count || 0);
    };

    checkLikeStatus();
    getLikeCount();
  }, [user, postId, supabase]);

  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase.rpc('toggle_like', {
      p_user_id: user.id,
      p_post_id: postId,
    });

    if (!error && data) {
      const result = data as { liked: boolean };
      setIsLiked(result.liked);
      setLikeCount((prev) => result.liked ? prev + 1 : prev - 1);
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    setIsLoading(true);
    await supabase.from('posts').delete().eq('id', postId);
    router.push(`/community/${communityId}`);
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/auth/login');
      return;
    }

    if (!reportReason) {
      alert('신고 사유를 선택해주세요.');
      return;
    }

    setIsReporting(true);

    const { error } = await supabase.from('reports').insert({
      reporter_id: user.id,
      target_type: 'post',
      target_post_id: postId,
      reason: reportReason,
      description: reportDescription.trim() || null,
    });

    if (error) {
      alert('신고 접수에 실패했습니다.');
    } else {
      alert('신고가 접수되었습니다. 운영진이 검토 후 조치하겠습니다.');
      setShowReportModal(false);
      setReportReason('');
      setReportDescription('');
    }

    setIsReporting(false);
  };

  return (
    <>
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-[var(--gray-200)]">
        <div className="flex items-center gap-2">
          <Button
            variant={isLiked ? 'primary' : 'outline'}
            size="sm"
            onClick={handleLike}
            disabled={isLoading}
            className="flex items-center gap-1.5"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            좋아요 {likeCount}
          </Button>
          {!isAuthor && user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReportModal(true)}
            >
              신고
            </Button>
          )}
        </div>

        {isAuthor && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/community/${communityId}/posts/${postId}/edit`)}
            >
              수정
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isLoading}
              className="text-[var(--error)] border-[var(--error)] hover:bg-red-50"
            >
              삭제
            </Button>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-[var(--gray-900)] mb-4">게시글 신고</h3>
            <form onSubmit={handleReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                  신고 사유 <span className="text-[var(--error)]">*</span>
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[var(--radius-md)]"
                  required
                >
                  <option value="">선택해주세요</option>
                  {REPORT_REASONS.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                  상세 설명 (선택)
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="추가적인 설명이 있다면 작성해주세요."
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[var(--radius-md)] resize-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReportModal(false)}
                >
                  취소
                </Button>
                <Button type="submit" isLoading={isReporting}>
                  신고하기
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

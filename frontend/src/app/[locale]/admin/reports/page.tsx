'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import type { Report, UserProfile, Post, Comment, ReportStatus } from '@/types/database';

interface ReportWithDetails extends Report {
  reporter: Pick<UserProfile, 'id' | 'name'> | null;
  target_post: Pick<Post, 'id' | 'title' | 'community_id'> | null;
  target_comment: Pick<Comment, 'id' | 'content' | 'post_id'> | null;
  target_user: Pick<UserProfile, 'id' | 'name'> | null;
}

const ITEMS_PER_PAGE = 10;

const STATUS_OPTIONS: { value: ReportStatus; label: string; color: string }[] = [
  { value: 'pending', label: '대기', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'reviewing', label: '검토중', color: 'bg-blue-100 text-blue-700' },
  { value: 'resolved', label: '처리완료', color: 'bg-green-100 text-green-700' },
  { value: 'dismissed', label: '기각', color: 'bg-gray-100 text-gray-700' },
];

const REASON_LABELS: Record<string, string> = {
  spam: '스팸/광고',
  hate: '혐오 발언',
  inappropriate: '부적절한 콘텐츠',
  misinformation: '허위 정보',
  personal_attack: '개인 공격',
  other: '기타',
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminReportsPage() {
  const supabase = createClient();

  const [reports, setReports] = useState<ReportWithDetails[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | ''>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportWithDetails | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);

    let query = supabase
      .from('reports')
      .select(`
        *,
        reporter:user_profiles!reports_reporter_id_fkey(id, name),
        target_post:posts(id, title, community_id),
        target_comment:comments(id, content, post_id),
        target_user:user_profiles!reports_target_user_id_fkey(id, name)
      `, { count: 'exact' });

    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (!error) {
      setReports(data as ReportWithDetails[] || []);
      setTotalCount(count || 0);
    }

    setIsLoading(false);
  }, [supabase, statusFilter, currentPage]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    setIsUpdating(true);

    const { error } = await supabase
      .from('reports')
      .update({
        status: newStatus,
        resolved_at: newStatus === 'resolved' || newStatus === 'dismissed' ? new Date().toISOString() : null,
        admin_note: adminNote || null,
      })
      .eq('id', reportId);

    if (!error) {
      setReports(reports.map(r =>
        r.id === reportId
          ? { ...r, status: newStatus, admin_note: adminNote }
          : r
      ));
      setSelectedReport(null);
      setAdminNote('');
    } else {
      alert('상태 변경에 실패했습니다.');
    }

    setIsUpdating(false);
  };

  const handleDeleteContent = async (report: ReportWithDetails) => {
    if (!confirm('해당 콘텐츠를 삭제하시겠습니까?')) return;

    if (report.target_type === 'post' && report.target_post) {
      await supabase.from('posts').delete().eq('id', report.target_post.id);
    } else if (report.target_type === 'comment' && report.target_comment) {
      await supabase.from('comments').update({ is_deleted: true }).eq('id', report.target_comment.id);
    }

    await handleStatusChange(report.id, 'resolved');
    alert('콘텐츠가 삭제되었습니다.');
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--gray-900)]">신고 관리</h1>
        <span className="text-[var(--gray-500)]">총 {totalCount.toLocaleString()}건</span>
      </div>

      {/* Filters */}
      <Card variant="default" className="bg-white">
        <div className="flex gap-2">
          <Button
            variant={statusFilter === '' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => { setStatusFilter(''); setCurrentPage(1); }}
          >
            전체
          </Button>
          {STATUS_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={statusFilter === option.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => { setStatusFilter(option.value); setCurrentPage(1); }}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Reports List */}
      <Card variant="default" className="bg-white">
        {isLoading ? (
          <div className="text-center py-8 text-[var(--gray-500)]">로딩 중...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8 text-[var(--gray-500)]">신고 내역이 없습니다.</div>
        ) : (
          <div className="divide-y divide-[var(--gray-100)]">
            {reports.map((report) => (
              <div key={report.id} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        report.target_type === 'post' ? 'bg-blue-100 text-blue-700' :
                        report.target_type === 'comment' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {report.target_type === 'post' ? '게시글' :
                         report.target_type === 'comment' ? '댓글' : '사용자'}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        STATUS_OPTIONS.find(s => s.value === report.status)?.color
                      }`}>
                        {STATUS_OPTIONS.find(s => s.value === report.status)?.label}
                      </span>
                      <span className="text-sm text-[var(--gray-500)]">
                        {formatDate(report.created_at!)}
                      </span>
                    </div>

                    <div className="mb-2">
                      <span className="font-medium text-[var(--gray-900)]">
                        {REASON_LABELS[report.reason] || report.reason}
                      </span>
                      {report.description && (
                        <p className="text-sm text-[var(--gray-600)] mt-1">{report.description}</p>
                      )}
                    </div>

                    <div className="text-sm text-[var(--gray-500)] mb-2">
                      신고자: {report.reporter?.name || '알 수 없음'}
                    </div>

                    {/* Target Content Preview */}
                    <div className="bg-[var(--gray-50)] p-3 rounded-[var(--radius-md)]">
                      {report.target_type === 'post' && report.target_post && (
                        <div>
                          <Link
                            href={`/community/${report.target_post.community_id}/posts/${report.target_post.id}`}
                            className="font-medium text-[var(--primary)] hover:underline"
                          >
                            {report.target_post.title}
                          </Link>
                        </div>
                      )}
                      {report.target_type === 'comment' && report.target_comment && (
                        <div>
                          <p className="text-[var(--gray-700)] line-clamp-2">
                            {report.target_comment.content}
                          </p>
                        </div>
                      )}
                      {report.target_type === 'user' && report.target_user && (
                        <div>
                          <span className="text-[var(--gray-700)]">
                            사용자: {report.target_user.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {report.admin_note && (
                      <div className="mt-2 text-sm text-[var(--gray-600)]">
                        <span className="font-medium">관리자 메모:</span> {report.admin_note}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {report.status === 'pending' || report.status === 'reviewing' ? (
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedReport(report);
                          setAdminNote(report.admin_note || '');
                        }}
                      >
                        처리
                      </Button>
                      {(report.target_type === 'post' || report.target_type === 'comment') && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[var(--error)]"
                          onClick={() => handleDeleteContent(report)}
                        >
                          삭제
                        </Button>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-4 border-t border-[var(--gray-200)]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              이전
            </Button>
            <span className="text-sm text-[var(--gray-600)]">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              다음
            </Button>
          </div>
        )}
      </Card>

      {/* Status Change Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-[var(--gray-900)] mb-4">신고 처리</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                  관리자 메모
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="처리 내용을 기록하세요."
                  className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-[var(--radius-md)] resize-none"
                  rows={3}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(selectedReport.id, 'reviewing')}
                  disabled={isUpdating}
                >
                  검토중으로 변경
                </Button>
                <Button
                  onClick={() => handleStatusChange(selectedReport.id, 'resolved')}
                  disabled={isUpdating}
                >
                  처리 완료
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(selectedReport.id, 'dismissed')}
                  disabled={isUpdating}
                >
                  기각
                </Button>
              </div>
              <div className="flex justify-end pt-2 border-t border-[var(--gray-200)]">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedReport(null);
                    setAdminNote('');
                  }}
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

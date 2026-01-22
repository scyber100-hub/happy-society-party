import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

async function getStats() {
  const supabase = await createClient();

  const [membersRes, postsRes, reportsRes] = await Promise.all([
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  return {
    totalMembers: membersRes.count || 0,
    totalPosts: postsRes.count || 0,
    pendingReports: reportsRes.count || 0,
  };
}

async function getRecentMembers() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('user_profiles')
    .select('*, regions(name)')
    .order('created_at', { ascending: false })
    .limit(5);

  return data || [];
}

async function getRecentReports() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('reports')
    .select(`
      *,
      reporter:user_profiles!reports_reporter_id_fkey(name),
      target_post:posts(title),
      target_comment:comments(content)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  return data || [];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ko-KR');
}

export default async function AdminDashboard() {
  const [stats, recentMembers, recentReports] = await Promise.all([
    getStats(),
    getRecentMembers(),
    getRecentReports(),
  ]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-[var(--gray-900)]">대시보드</h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card variant="default" className="bg-white">
          <div className="text-sm text-[var(--gray-500)] mb-1">전체 회원</div>
          <div className="text-3xl font-bold text-[var(--gray-900)]">
            {stats.totalMembers.toLocaleString()}
          </div>
          <Link href="/admin/members" className="text-sm text-[var(--primary)] mt-2 inline-block">
            회원 관리 →
          </Link>
        </Card>
        <Card variant="default" className="bg-white">
          <div className="text-sm text-[var(--gray-500)] mb-1">전체 게시글</div>
          <div className="text-3xl font-bold text-[var(--gray-900)]">
            {stats.totalPosts.toLocaleString()}
          </div>
          <Link href="/admin/posts" className="text-sm text-[var(--primary)] mt-2 inline-block">
            게시글 관리 →
          </Link>
        </Card>
        <Card variant="default" className="bg-white">
          <div className="text-sm text-[var(--gray-500)] mb-1">대기중 신고</div>
          <div className={`text-3xl font-bold ${stats.pendingReports > 0 ? 'text-[var(--error)]' : 'text-[var(--gray-900)]'}`}>
            {stats.pendingReports}
          </div>
          <Link href="/admin/reports" className="text-sm text-[var(--primary)] mt-2 inline-block">
            신고 처리 →
          </Link>
        </Card>
      </div>

      {/* Recent Members & Reports */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <Card variant="default" className="bg-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>최근 가입 회원</CardTitle>
              <Link href="/admin/members" className="text-sm text-[var(--primary)]">
                전체 보기
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentMembers.length === 0 ? (
              <p className="text-center text-[var(--gray-500)] py-4">가입된 회원이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {recentMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between py-2 border-b border-[var(--gray-100)] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[var(--primary-light)] rounded-full flex items-center justify-center overflow-hidden relative">
                        {member.avatar_url ? (
                          <Image src={member.avatar_url} alt="" fill className="object-cover" />
                        ) : (
                          <span className="text-[var(--primary)] font-medium">{member.name[0]}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-[var(--gray-900)]">{member.name}</div>
                        <div className="text-sm text-[var(--gray-500)]">
                          {member.regions?.name || '지역 미설정'}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-[var(--gray-400)]">
                      {formatDate(member.created_at!)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card variant="default" className="bg-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>최근 신고</CardTitle>
              <Link href="/admin/reports" className="text-sm text-[var(--primary)]">
                전체 보기
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentReports.length === 0 ? (
              <p className="text-center text-[var(--gray-500)] py-4">신고 내역이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between py-2 border-b border-[var(--gray-100)] last:border-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          report.target_type === 'post' ? 'bg-blue-100 text-blue-700' :
                          report.target_type === 'comment' ? 'bg-purple-100 text-purple-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {report.target_type === 'post' ? '게시글' :
                           report.target_type === 'comment' ? '댓글' : '사용자'}
                        </span>
                        <span className="font-medium text-[var(--gray-900)] truncate max-w-[200px]">
                          {report.reason}
                        </span>
                      </div>
                      <div className="text-sm text-[var(--gray-500)] mt-1">
                        신고자: {report.reporter?.name || '알 수 없음'} | {formatDate(report.created_at!)}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      report.status === 'reviewing' ? 'bg-blue-100 text-blue-700' :
                      report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {report.status === 'pending' ? '대기' :
                       report.status === 'reviewing' ? '검토중' :
                       report.status === 'resolved' ? '처리완료' : '기각'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

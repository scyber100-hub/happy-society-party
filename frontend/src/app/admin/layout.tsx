import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LayoutDashboard, Users, FileText, AlertTriangle, Building2, Settings } from 'lucide-react';

export const runtime = 'edge';

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/admin');
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, name')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'moderator')) {
    redirect('/portal?error=unauthorized');
  }

  return profile;
}

async function getPendingReportsCount() {
  const supabase = await createClient();
  const { count } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  return count || 0;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await checkAdmin();
  const pendingReports = await getPendingReportsCount();

  return (
    <div className="min-h-screen bg-[var(--gray-100)]">
      {/* Admin Header */}
      <div className="bg-[var(--gray-900)] text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.svg"
                alt="행복사회당 로고"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="font-bold">행복사회당</span>
            </Link>
            <span className="text-[var(--gray-400)]">|</span>
            <span className="text-[var(--gray-300)]">관리자</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--gray-400)]">{profile.name}님</span>
            <Link href="/portal" className="text-sm text-[var(--gray-400)] hover:text-white">
              포털로 이동
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-[var(--radius-lg)] p-4 space-y-1">
              <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] hover:bg-[var(--primary-light)] text-[var(--gray-700)]">
                <LayoutDashboard className="w-5 h-5" /> 대시보드
              </Link>
              <Link href="/admin/members" className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] hover:bg-[var(--gray-50)] text-[var(--gray-700)]">
                <Users className="w-5 h-5" /> 회원 관리
              </Link>
              <Link href="/admin/posts" className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] hover:bg-[var(--gray-50)] text-[var(--gray-700)]">
                <FileText className="w-5 h-5" /> 게시글 관리
              </Link>
              <Link href="/admin/reports" className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] hover:bg-[var(--gray-50)] text-[var(--gray-700)]">
                <AlertTriangle className="w-5 h-5" /> 신고 관리
                {pendingReports > 0 && (
                  <span className="ml-auto bg-[var(--error)] text-white text-xs px-2 py-0.5 rounded-full">
                    {pendingReports}
                  </span>
                )}
              </Link>
              <Link href="/admin/communities" className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] hover:bg-[var(--gray-50)] text-[var(--gray-700)]">
                <Building2 className="w-5 h-5" /> 커뮤니티 관리
              </Link>
              <hr className="my-2 border-[var(--gray-200)]" />
              <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] hover:bg-[var(--gray-50)] text-[var(--gray-700)]">
                <Settings className="w-5 h-5" /> 설정
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

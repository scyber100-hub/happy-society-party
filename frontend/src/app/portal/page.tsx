import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// 더미 사용자 데이터
const user = {
  name: '홍길동',
  role: '당원',
  region: '서울특별시 강남구',
  committees: ['정책위원회', '환경위원회'],
  memberSince: '2025-06-15',
  duesStatus: '납부완료',
};

// 더미 활동 데이터
const recentActivities = [
  { type: 'post', content: '환경위원회에 새 글을 작성했습니다.', date: '2026-01-13' },
  { type: 'comment', content: '정책위원회 게시글에 댓글을 달았습니다.', date: '2026-01-12' },
  { type: 'like', content: '서울 강남구 게시글에 좋아요를 눌렀습니다.', date: '2026-01-10' },
];

// 더미 알림 데이터
const notifications = [
  { id: 1, message: '새로운 정책 토론이 시작되었습니다.', isRead: false, date: '2026-01-14' },
  { id: 2, message: '서울시당 정기 모임 안내', isRead: false, date: '2026-01-13' },
  { id: 3, message: '당비 납부가 완료되었습니다.', isRead: true, date: '2026-01-10' },
];

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header Banner */}
      <div className="bg-[var(--primary)] text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">안녕하세요, {user.name}님!</h1>
          <p className="text-white/80 mt-1">행복사회당 회원 포털에 오신 것을 환영합니다.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Quick Links */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card variant="default" className="bg-white">
              <CardHeader>
                <CardTitle>내 프로필</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-[var(--primary-light)] rounded-full flex items-center justify-center">
                    <span className="text-2xl text-[var(--primary)] font-bold">{user.name[0]}</span>
                  </div>
                  <div>
                    <div className="font-bold text-[var(--gray-900)]">{user.name}</div>
                    <div className="text-sm text-[var(--primary)]">{user.role}</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--gray-500)]">지역</span>
                    <span className="text-[var(--gray-700)]">{user.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--gray-500)]">가입일</span>
                    <span className="text-[var(--gray-700)]">{user.memberSince}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--gray-500)]">당비</span>
                    <span className="text-[var(--success)]">{user.duesStatus}</span>
                  </div>
                </div>
                <Link href="/portal/profile">
                  <Button variant="outline" fullWidth className="mt-4">
                    프로필 수정
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card variant="default" className="bg-white">
              <CardHeader>
                <CardTitle>바로가기</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Link href="/portal/profile" className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] hover:bg-[var(--gray-50)] transition-colors">
                    <span className="text-xl">👤</span>
                    <span className="text-[var(--gray-700)]">내 프로필</span>
                  </Link>
                  <Link href="/portal/payments" className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] hover:bg-[var(--gray-50)] transition-colors">
                    <span className="text-xl">💳</span>
                    <span className="text-[var(--gray-700)]">당비 납부 현황</span>
                  </Link>
                  <Link href="/portal/notifications" className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] hover:bg-[var(--gray-50)] transition-colors">
                    <span className="text-xl">🔔</span>
                    <span className="text-[var(--gray-700)]">알림</span>
                  </Link>
                  <Link href="/portal/settings" className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] hover:bg-[var(--gray-50)] transition-colors">
                    <span className="text-xl">⚙️</span>
                    <span className="text-[var(--gray-700)]">설정</span>
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Communities & Activities */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Communities */}
            <Card variant="default" className="bg-white">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>내 커뮤니티</CardTitle>
                  <Link href="/community" className="text-sm text-[var(--primary)]">전체 보기</Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Region Community */}
                  <Link href="/community/regions/seoul-gangnam" className="block p-4 border border-[var(--gray-200)] rounded-[var(--radius-md)] hover:border-[var(--primary)] transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📍</span>
                      <div>
                        <div className="font-medium text-[var(--gray-900)]">{user.region}</div>
                        <div className="text-sm text-[var(--gray-500)]">지역 커뮤니티</div>
                      </div>
                    </div>
                    <div className="text-sm text-[var(--gray-600)]">새 게시글 5개</div>
                  </Link>

                  {/* Committee Communities */}
                  {user.committees.map((committee) => (
                    <Link
                      key={committee}
                      href={`/community/committees/${committee}`}
                      className="block p-4 border border-[var(--gray-200)] rounded-[var(--radius-md)] hover:border-[var(--primary)] transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">📋</span>
                        <div>
                          <div className="font-medium text-[var(--gray-900)]">{committee}</div>
                          <div className="text-sm text-[var(--gray-500)]">상임위원회</div>
                        </div>
                      </div>
                      <div className="text-sm text-[var(--gray-600)]">새 게시글 3개</div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card variant="default" className="bg-white">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>알림</CardTitle>
                  <Link href="/portal/notifications" className="text-sm text-[var(--primary)]">전체 보기</Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-[var(--radius-md)] ${
                        notification.isRead ? 'bg-white' : 'bg-[var(--primary-light)]'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p className={`text-sm ${notification.isRead ? 'text-[var(--gray-600)]' : 'text-[var(--gray-900)]'}`}>
                          {!notification.isRead && <span className="inline-block w-2 h-2 bg-[var(--primary)] rounded-full mr-2"></span>}
                          {notification.message}
                        </p>
                        <span className="text-xs text-[var(--gray-400)]">{notification.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card variant="default" className="bg-white">
              <CardHeader>
                <CardTitle>최근 활동</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[var(--gray-100)] rounded-full flex items-center justify-center text-sm">
                        {activity.type === 'post' && '📝'}
                        {activity.type === 'comment' && '💬'}
                        {activity.type === 'like' && '❤️'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[var(--gray-700)]">{activity.content}</p>
                        <p className="text-xs text-[var(--gray-400)] mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

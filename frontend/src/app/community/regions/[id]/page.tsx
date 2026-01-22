import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { MapPin } from 'lucide-react';

// 더미 게시글 데이터
const posts = [
  {
    id: 1,
    title: '서울시 대중교통 정책 개선 제안',
    author: '김서울',
    date: '2026-01-14',
    views: 156,
    comments: 23,
    likes: 45,
    excerpt: '서울시 대중교통 이용률을 높이기 위한 몇 가지 제안을 드립니다...',
  },
  {
    id: 2,
    title: '강남구 주민 모임 안내',
    author: '이강남',
    date: '2026-01-13',
    views: 89,
    comments: 12,
    likes: 28,
    excerpt: '이번 주 토요일 강남구 당원 모임을 진행합니다. 많은 참여 부탁드립니다...',
  },
  {
    id: 3,
    title: '청년 주거 문제 해결을 위한 토론',
    author: '박청년',
    date: '2026-01-12',
    views: 234,
    comments: 45,
    likes: 89,
    excerpt: '청년들의 주거 문제가 심각합니다. 함께 해결 방안을 논의해보아요...',
  },
  {
    id: 4,
    title: '환경 정책 관련 의견 수렴',
    author: '정환경',
    date: '2026-01-11',
    views: 178,
    comments: 34,
    likes: 56,
    excerpt: '서울시 환경 정책에 대한 당원 여러분의 의견을 듣고자 합니다...',
  },
  {
    id: 5,
    title: '신규 당원 환영합니다!',
    author: '운영자',
    date: '2026-01-10',
    views: 312,
    comments: 67,
    likes: 120,
    excerpt: '서울시당에 새로 가입하신 당원 여러분을 환영합니다...',
  },
];

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RegionCommunityPage({ params }: Props) {
  const { id } = await params;
  const regionName = id === 'seoul' ? '서울특별시' : id;

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <div className="bg-[var(--primary)] text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
            <Link href="/community">커뮤니티</Link>
            <span>/</span>
            <Link href="/community/regions">지역</Link>
            <span>/</span>
            <span className="text-white">{regionName}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{regionName}</h1>
              <p className="text-white/80">지역 커뮤니티</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex gap-6 text-sm text-[var(--gray-600)]">
            <span>당원 8,500명</span>
            <span>게시글 1,250개</span>
          </div>
          <Link href={`/community/regions/${id}/write`}>
            <Button>글쓰기</Button>
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-[var(--radius-md)] p-4 mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="게시글 검색..."
            className="flex-1 px-4 py-2 border border-[var(--gray-300)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          <select className="px-4 py-2 border border-[var(--gray-300)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
            <option>최신순</option>
            <option>인기순</option>
            <option>댓글순</option>
          </select>
        </div>

        {/* Post List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Link key={post.id} href={`/community/regions/${id}/posts/${post.id}`}>
              <Card variant="default" className="bg-white hover:shadow-[var(--shadow-md)] transition-shadow">
                <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-2 hover:text-[var(--primary)]">
                  {post.title}
                </h3>
                <p className="text-[var(--gray-600)] text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--gray-500)]">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                    <span>조회 {post.views}</span>
                    <span>댓글 {post.comments}</span>
                    <span>좋아요 {post.likes}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          <button className="px-4 py-2 rounded-[var(--radius-md)] bg-[var(--primary)] text-white">1</button>
          <button className="px-4 py-2 rounded-[var(--radius-md)] border border-[var(--gray-300)] hover:bg-[var(--gray-50)]">2</button>
          <button className="px-4 py-2 rounded-[var(--radius-md)] border border-[var(--gray-300)] hover:bg-[var(--gray-50)]">3</button>
          <button className="px-4 py-2 rounded-[var(--radius-md)] border border-[var(--gray-300)] hover:bg-[var(--gray-50)]">다음</button>
        </div>
      </div>
    </div>
  );
}

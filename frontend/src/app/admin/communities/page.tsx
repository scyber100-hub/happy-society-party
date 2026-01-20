'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';
import {
  Search,
  Users,
  FileText,
  Settings,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Building2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface Community {
  id: string;
  name: string;
  type: 'region' | 'committee';
  description: string | null;
  member_count: number | null;
  post_count: number | null;
  is_active: boolean | null;
  created_at: string | null;
  region?: { name: string } | null;
  committee?: { name: string } | null;
}

export default function AdminCommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'region' | 'committee'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchCommunities();
  }, [searchQuery, filterType]);

  const fetchCommunities = async () => {
    setLoading(true);
    let query = supabase
      .from('communities')
      .select(`
        *,
        region:regions(name),
        committee:committees(name)
      `)
      .order('type', { ascending: true })
      .order('name', { ascending: true });

    if (filterType !== 'all') {
      query = query.eq('type', filterType);
    }

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (!error && data) {
      setCommunities(data);
    }
    setLoading(false);
  };

  const handleToggleActive = async (communityId: string, currentActive: boolean | null) => {
    const newActive = !(currentActive ?? false);
    const { error } = await supabase
      .from('communities')
      .update({ is_active: newActive })
      .eq('id', communityId);

    if (!error) {
      setCommunities(communities.map(c =>
        c.id === communityId ? { ...c, is_active: newActive } : c
      ));
    }
  };

  const handleDelete = async (communityId: string) => {
    if (!confirm('정말 이 커뮤니티를 삭제하시겠습니까? 관련된 모든 게시글과 댓글이 함께 삭제됩니다.')) return;

    const { error } = await supabase
      .from('communities')
      .delete()
      .eq('id', communityId);

    if (!error) {
      setCommunities(communities.filter(c => c.id !== communityId));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const regionCommunities = communities.filter(c => c.type === 'region');
  const committeeCommunities = communities.filter(c => c.type === 'committee');

  const stats = {
    total: communities.length,
    regions: regionCommunities.length,
    committees: committeeCommunities.length,
    active: communities.filter(c => c.is_active === true).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--gray-900)]">커뮤니티 관리</h1>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-1" />
          커뮤니티 추가
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="default" className="bg-white">
          <div className="text-sm text-[var(--gray-500)] mb-1">전체 커뮤니티</div>
          <div className="text-2xl font-bold text-[var(--gray-900)]">{stats.total}</div>
        </Card>
        <Card variant="default" className="bg-white">
          <div className="text-sm text-[var(--gray-500)] mb-1">지역 커뮤니티</div>
          <div className="text-2xl font-bold text-[var(--primary)]">{stats.regions}</div>
        </Card>
        <Card variant="default" className="bg-white">
          <div className="text-sm text-[var(--gray-500)] mb-1">위원회 커뮤니티</div>
          <div className="text-2xl font-bold text-[var(--secondary)]">{stats.committees}</div>
        </Card>
        <Card variant="default" className="bg-white">
          <div className="text-sm text-[var(--gray-500)] mb-1">활성화</div>
          <div className="text-2xl font-bold text-[var(--success)]">{stats.active}</div>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card variant="default" className="bg-white">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gray-400)]" />
              <Input
                type="text"
                placeholder="커뮤니티명 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors ${
                  filterType === 'all'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--gray-100)] text-[var(--gray-600)] hover:bg-[var(--gray-200)]'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setFilterType('region')}
                className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors ${
                  filterType === 'region'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--gray-100)] text-[var(--gray-600)] hover:bg-[var(--gray-200)]'
                }`}
              >
                지역
              </button>
              <button
                onClick={() => setFilterType('committee')}
                className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors ${
                  filterType === 'committee'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--gray-100)] text-[var(--gray-600)] hover:bg-[var(--gray-200)]'
                }`}
              >
                위원회
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communities List */}
      <Card variant="default" className="bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--gray-50)] border-b border-[var(--gray-200)]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--gray-600)]">커뮤니티</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--gray-600)]">유형</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-[var(--gray-600)]">회원</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-[var(--gray-600)]">게시글</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-[var(--gray-600)]">상태</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-[var(--gray-600)]">생성일</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-[var(--gray-600)]">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-100)]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[var(--gray-500)]">
                    로딩 중...
                  </td>
                </tr>
              ) : communities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[var(--gray-500)]">
                    커뮤니티가 없습니다.
                  </td>
                </tr>
              ) : (
                communities.map((community) => (
                  <tr key={community.id} className="hover:bg-[var(--gray-50)]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          community.type === 'region'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-purple-100 text-purple-600'
                        }`}>
                          {community.type === 'region' ? (
                            <MapPin className="w-5 h-5" />
                          ) : (
                            <Building2 className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-[var(--gray-900)]">{community.name}</div>
                          {community.description && (
                            <div className="text-sm text-[var(--gray-500)] truncate max-w-[200px]">
                              {community.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        community.type === 'region'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {community.type === 'region' ? '지역' : '위원회'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="flex items-center justify-center gap-1 text-sm text-[var(--gray-600)]">
                        <Users className="w-4 h-4" />
                        {community.member_count ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="flex items-center justify-center gap-1 text-sm text-[var(--gray-600)]">
                        <FileText className="w-4 h-4" />
                        {community.post_count ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleActive(community.id, community.is_active)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          community.is_active === true
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {community.is_active === true ? (
                          <>
                            <ToggleRight className="w-4 h-4" />
                            활성
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4" />
                            비활성
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-[var(--gray-500)]">
                      {community.created_at ? formatDate(community.created_at) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="p-2 rounded hover:bg-[var(--gray-100)] text-[var(--gray-400)]"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(community.id)}
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
      </Card>
    </div>
  );
}

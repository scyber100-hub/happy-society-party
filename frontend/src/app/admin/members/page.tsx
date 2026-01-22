'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';
import type { UserProfile, Region, UserRole } from '@/types/database';

interface MemberWithRegion extends UserProfile {
  regions: Pick<Region, 'name'> | null;
}

const ITEMS_PER_PAGE = 10;

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'member', label: '일반회원' },
  { value: 'moderator', label: '운영자' },
  { value: 'admin', label: '관리자' },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ko-KR');
}

export default function AdminMembersPage() {
  const supabase = createClient();

  const [members, setMembers] = useState<MemberWithRegion[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<UserRole | ''>('');

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);

    let query = supabase
      .from('user_profiles')
      .select('*, regions(name)', { count: 'exact' });

    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`);
    }

    if (roleFilter) {
      query = query.eq('role', roleFilter);
    }

    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (!error) {
      setMembers(data as MemberWithRegion[] || []);
      setTotalCount(count || 0);
    }

    setIsLoading(false);
  }, [supabase, searchQuery, roleFilter, currentPage]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMembers();
  };

  const handleRoleChange = async (memberId: string) => {
    if (!newRole) return;

    const { error } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', memberId);

    if (!error) {
      setMembers(members.map(m =>
        m.id === memberId ? { ...m, role: newRole as UserRole } : m
      ));
      setEditingMember(null);
      setNewRole('');
    } else {
      alert('권한 변경에 실패했습니다.');
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--gray-900)]">회원 관리</h1>
        <span className="text-[var(--gray-500)]">총 {totalCount.toLocaleString()}명</span>
      </div>

      {/* Filters */}
      <Card variant="default" className="bg-white">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이름, 전화번호로 검색"
              className="flex-1"
            />
            <Button type="submit">검색</Button>
          </form>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as UserRole | '');
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-[var(--gray-300)] rounded-[var(--radius-md)] bg-white"
          >
            <option value="">전체 권한</option>
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Members Table */}
      <Card variant="default" className="bg-white overflow-hidden">
        {isLoading ? (
          <div className="text-center py-8 text-[var(--gray-500)]">로딩 중...</div>
        ) : members.length === 0 ? (
          <div className="text-center py-8 text-[var(--gray-500)]">검색 결과가 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--gray-200)] bg-[var(--gray-50)]">
                  <th className="text-left py-3 px-4 font-medium text-[var(--gray-700)]">회원</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--gray-700)]">연락처</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--gray-700)]">지역</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--gray-700)]">권한</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--gray-700)]">가입일</th>
                  <th className="text-center py-3 px-4 font-medium text-[var(--gray-700)]">관리</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-[var(--gray-100)] hover:bg-[var(--gray-50)]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--primary-light)] rounded-full flex items-center justify-center overflow-hidden relative">
                          {member.avatar_url ? (
                            <Image src={member.avatar_url} alt="" fill className="object-cover" />
                          ) : (
                            <span className="text-[var(--primary)] font-medium">{member.name?.[0]}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-[var(--gray-900)]">{member.name}</div>
                          <div className="text-sm text-[var(--gray-500)]">{member.district || '세부 지역 미설정'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--gray-700)]">
                      {member.phone || '-'}
                    </td>
                    <td className="py-3 px-4 text-[var(--gray-700)]">
                      {member.regions?.name || '-'}
                    </td>
                    <td className="py-3 px-4">
                      {editingMember === member.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value as UserRole | '')}
                            className="px-2 py-1 border border-[var(--gray-300)] rounded text-sm"
                          >
                            <option value="">선택</option>
                            {ROLE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                          <Button size="sm" onClick={() => handleRoleChange(member.id)}>저장</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingMember(null)}>취소</Button>
                        </div>
                      ) : (
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          member.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          member.role === 'moderator' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {member.role === 'admin' ? '관리자' :
                           member.role === 'moderator' ? '운영자' : '일반회원'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[var(--gray-500)] text-sm">
                      {formatDate(member.created_at!)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setEditingMember(member.id);
                          setNewRole(member.role || 'member');
                        }}
                        className="text-sm text-[var(--primary)] hover:underline"
                      >
                        권한변경
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  );
}

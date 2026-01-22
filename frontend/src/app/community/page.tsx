import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/server';
import { ChevronRight, MapPin, ClipboardList } from 'lucide-react';

export const runtime = 'edge';
export const revalidate = 60; // 60초마다 재검증

interface Region {
  id: string;
  name: string;
  level: number;
  parent_id: string | null;
}

interface RegionCommunity {
  id: string;
  name: string;
  description: string | null;
  type: string;
  region_id: string | null;
  committee_id: string | null;
  member_count: number | null;
  post_count: number | null;
  is_active: boolean | null;
  regions: Region | null;
}

interface CommitteeCommunity {
  id: string;
  name: string;
  description: string | null;
  type: string;
  region_id: string | null;
  committee_id: string | null;
  member_count: number | null;
  post_count: number | null;
  is_active: boolean | null;
}

async function getCommunities() {
  const supabase = await createClient();

  // Get only level 1 (광역시/도) region communities
  const [regionRes, committeeRes, districtCountRes] = await Promise.all([
    supabase
      .from('communities')
      .select('*, regions!inner(*)')
      .eq('type', 'region')
      .eq('is_active', true)
      .eq('regions.level', 1)
      .order('name'),
    supabase
      .from('communities')
      .select('*, committees(*)')
      .eq('type', 'committee')
      .eq('is_active', true)
      .order('name'),
    // Get count of districts per region
    supabase
      .from('regions')
      .select('parent_id')
      .eq('level', 2),
  ]);

  // Calculate district counts per parent region
  const districtCounts: Record<string, number> = {};
  if (districtCountRes.data) {
    for (const district of districtCountRes.data) {
      if (district.parent_id) {
        districtCounts[district.parent_id] = (districtCounts[district.parent_id] || 0) + 1;
      }
    }
  }

  return {
    regionCommunities: (regionRes.data || []) as RegionCommunity[],
    committeeCommunities: (committeeRes.data || []) as CommitteeCommunity[],
    districtCounts,
  };
}

export default async function CommunityPage() {
  const { regionCommunities, committeeCommunities, districtCounts } = await getCommunities();

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <div className="bg-[var(--primary)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">커뮤니티</h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            지역과 관심 정책 분야별로 당원들과 소통하고 의견을 나누세요.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Region Communities */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--gray-900)]">지역 커뮤니티</h2>
            <p className="text-sm text-[var(--gray-500)]">광역시/도를 선택하면 시/군/구 커뮤니티를 볼 수 있습니다</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {regionCommunities.map((community) => {
              const regionId = community.regions?.id;
              const districtCount = regionId ? districtCounts[regionId] || 0 : 0;
              return (
                <Link key={community.id} href={`/community/region/${regionId}`}>
                  <Card variant="default" className="bg-white hover:shadow-[var(--shadow-md)] transition-shadow h-full">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--primary-light)] rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-[var(--primary)]" />
                        </div>
                        <h3 className="font-semibold text-[var(--gray-900)]">{community.name}</h3>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--gray-400)]" />
                    </div>
                    <CardContent>
                      <div className="flex justify-between text-sm text-[var(--gray-500)]">
                        <span>당원 {(community.member_count || 0).toLocaleString()}명</span>
                        {districtCount > 0 && (
                          <span className="text-[var(--primary)]">{districtCount}개 시/군/구</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Committee Communities */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--gray-900)]">상임위원회 커뮤니티</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {committeeCommunities.map((community) => (
              <Link key={community.id} href={`/community/${community.id}`}>
                <Card variant="default" className="bg-white hover:shadow-[var(--shadow-md)] transition-shadow h-full">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-[var(--gray-900)]">{community.name}</h3>
                  </div>
                  <p className="text-sm text-[var(--gray-500)] mb-3">{community.description}</p>
                  <CardContent>
                    <div className="flex justify-between text-sm text-[var(--gray-500)]">
                      <span>당원 {(community.member_count || 0).toLocaleString()}명</span>
                      <span>게시글 {(community.post_count || 0).toLocaleString()}개</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Info Banner */}
        <section className="mt-12">
          <div className="bg-[var(--primary-light)] rounded-[var(--radius-xl)] p-8 text-center">
            <h3 className="text-xl font-bold text-[var(--primary)] mb-3">커뮤니티 참여 안내</h3>
            <p className="text-[var(--gray-600)] mb-4">
              커뮤니티에 참여하려면 로그인이 필요합니다.<br />
              당원으로 가입하시면 지역과 관심 분야의 커뮤니티에 자동으로 가입됩니다.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/login" className="text-[var(--primary)] font-medium hover:underline">
                로그인 →
              </Link>
              <Link href="/join" className="text-[var(--primary)] font-medium hover:underline">
                입당 신청 →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

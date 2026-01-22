import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, Users, FileText, MapPin, Building2, MapPinned } from 'lucide-react';

export const runtime = 'edge';
export const revalidate = 60;

interface Props {
  params: Promise<{ regionId: string }>;
}

async function getRegionWithDistricts(regionId: string) {
  const supabase = await createClient();

  // Get the parent region
  const { data: region, error: regionError } = await supabase
    .from('regions')
    .select('*')
    .eq('id', regionId)
    .eq('level', 1)
    .single();

  if (regionError || !region) return null;

  // Get the parent region's community
  const { data: parentCommunity } = await supabase
    .from('communities')
    .select('*')
    .eq('region_id', regionId)
    .eq('type', 'region')
    .single();

  // Get all districts (level 2) under this region
  const { data: districts } = await supabase
    .from('regions')
    .select('*')
    .eq('parent_id', regionId)
    .eq('level', 2)
    .order('name');

  // Get communities for these districts
  const districtIds = (districts || []).map(d => d.id);
  const { data: districtCommunities } = await supabase
    .from('communities')
    .select('*')
    .in('region_id', districtIds)
    .eq('type', 'region')
    .eq('is_active', true);

  // Map communities to districts
  const communityMap = new Map();
  if (districtCommunities) {
    for (const comm of districtCommunities) {
      communityMap.set(comm.region_id, comm);
    }
  }

  return {
    region,
    parentCommunity,
    districts: (districts || []).map(d => ({
      ...d,
      community: communityMap.get(d.id) || null,
    })),
  };
}

export default async function RegionDetailPage({ params }: Props) {
  const { regionId } = await params;
  const data = await getRegionWithDistricts(regionId);

  if (!data) {
    notFound();
  }

  const { region, parentCommunity, districts } = data;

  // Calculate totals
  const totalMembers = districts.reduce((sum, d) => sum + (d.community?.member_count || 0), 0) + (parentCommunity?.member_count || 0);
  const totalPosts = districts.reduce((sum, d) => sum + (d.community?.post_count || 0), 0) + (parentCommunity?.post_count || 0);

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <div className="bg-[var(--primary)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            전체 커뮤니티
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{region.name} 커뮤니티</h1>
              <p className="text-white/90 mt-1">
                {region.name} 지역의 시/군/구 커뮤니티를 둘러보세요
              </p>
            </div>
          </div>
          <div className="flex gap-6 mt-6 text-white/80">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              총 당원 {totalMembers.toLocaleString()}명
            </span>
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              총 게시글 {totalPosts.toLocaleString()}개
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Parent Region Community */}
        {parentCommunity && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-[var(--gray-900)] mb-4">{region.name} 전체 커뮤니티</h2>
            <Link href={`/community/${parentCommunity.id}`}>
              <Card variant="default" className="bg-[var(--primary-light)] hover:shadow-[var(--shadow-md)] transition-shadow border-2 border-[var(--primary)]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-[var(--gray-900)]">{parentCommunity.name}</h3>
                </div>
                <p className="text-sm text-[var(--gray-600)] mb-3">
                  {region.name} 전체 당원들이 소통하는 커뮤니티입니다
                </p>
                <CardContent>
                  <div className="flex justify-between text-sm text-[var(--gray-500)]">
                    <span>당원 {(parentCommunity.member_count || 0).toLocaleString()}명</span>
                    <span>게시글 {(parentCommunity.post_count || 0).toLocaleString()}개</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </section>
        )}

        {/* District Communities */}
        <section>
          <h2 className="text-lg font-bold text-[var(--gray-900)] mb-4">
            시/군/구 커뮤니티 ({districts.length}개)
          </h2>
          {districts.length === 0 ? (
            <Card variant="default" className="bg-white text-center py-8">
              <p className="text-[var(--gray-500)]">등록된 시/군/구 커뮤니티가 없습니다.</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {districts.map((district) => {
                if (!district.community) return null;
                return (
                  <Link key={district.id} href={`/community/${district.community.id}`}>
                    <Card variant="default" className="bg-white hover:shadow-[var(--shadow-md)] transition-shadow h-full">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 bg-[var(--primary-light)] rounded-lg flex items-center justify-center">
                          <MapPinned className="w-4 h-4 text-[var(--primary)]" />
                        </div>
                        <h3 className="font-semibold text-[var(--gray-900)]">{district.name}</h3>
                      </div>
                      <CardContent>
                        <div className="flex justify-between text-sm text-[var(--gray-500)]">
                          <span>당원 {(district.community.member_count || 0).toLocaleString()}명</span>
                          <span>게시글 {(district.community.post_count || 0).toLocaleString()}개</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Info Banner */}
        <section className="mt-12">
          <div className="bg-[var(--primary-light)] rounded-[var(--radius-xl)] p-8 text-center">
            <h3 className="text-xl font-bold text-[var(--primary)] mb-3">커뮤니티 참여 안내</h3>
            <p className="text-[var(--gray-600)] mb-4">
              커뮤니티에 참여하려면 로그인이 필요합니다.<br />
              당원으로 가입하시면 해당 지역의 커뮤니티에 자동으로 가입됩니다.
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

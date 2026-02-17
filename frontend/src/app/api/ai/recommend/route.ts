import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

interface ContentRecommendation {
  id: string;
  type: 'policy' | 'post' | 'event' | 'vote';
  title: string;
  description: string;
  score: number;
  reason: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '5');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get user's recent activities to understand interests
    const { data: activities } = await supabase
      .from('activities')
      .select('activity_type')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    // Get user's profile for region-based recommendations
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('region_id')
      .eq('id', userId)
      .single();

    // Calculate user interests
    const interests = calculateInterests(activities || []);

    const recommendations: ContentRecommendation[] = [];

    // Recommend policies based on interests (static policy data)
    if (interests.includes('policy') || interests.includes('voting')) {
      const staticPolicies = [
        { id: 'cooperative-economy', title: '협력경제 실현', summary: '무한 경쟁 대신 협력과 연대의 가치가 존중받는 경제 체제를 만듭니다.' },
        { id: 'inequality-reduction', title: '불평등 해소', summary: '자산과 소득의 불평등을 해소하고 누구나 존엄한 삶을 보장합니다.' },
        { id: 'climate-action', title: '기후위기 대응', summary: '탄소중립을 실현하고 지속가능한 미래를 만듭니다.' },
      ];

      for (const policy of staticPolicies.slice(0, 2)) {
        recommendations.push({
          id: policy.id,
          type: 'policy',
          title: policy.title,
          description: policy.summary,
          score: 85 + Math.random() * 15,
          reason: '관심 분야와 관련된 정책입니다.',
        });
      }
    }

    // Recommend community posts from user's region
    if (profile?.region_id && interests.includes('community')) {
      const { data: community } = await supabase
        .from('communities')
        .select('id')
        .eq('region_id', profile.region_id)
        .eq('type', 'region')
        .single();

      if (community) {
        const { data: posts } = await supabase
          .from('posts')
          .select('id, title, content')
          .eq('community_id', community.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (posts) {
          for (const post of posts) {
            recommendations.push({
              id: post.id,
              type: 'post',
              title: post.title,
              description: truncate(post.content, 100),
              score: 75 + Math.random() * 20,
              reason: '지역 커뮤니티의 최신 글입니다.',
            });
          }
        }
      }
    }

    // Recommend upcoming events
    if (interests.includes('events')) {
      const { data: events } = await supabase
        .from('events')
        .select('id, title, description, start_date')
        .gt('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(2);

      if (events) {
        for (const event of events) {
          recommendations.push({
            id: event.id,
            type: 'event',
            title: event.title,
            description: event.description || '곧 시작되는 행사입니다.',
            score: 70 + Math.random() * 25,
            reason: '관심 분야의 행사입니다.',
          });
        }
      }
    }

    // Recommend active votes
    const { data: votes } = await supabase
      .from('votes')
      .select('id, title, description')
      .eq('status', 'voting')
      .order('end_date', { ascending: true })
      .limit(2);

    if (votes) {
      for (const vote of votes) {
        recommendations.push({
          id: vote.id,
          type: 'vote',
          title: vote.title,
          description: vote.description || '진행 중인 투표입니다.',
          score: 90 + Math.random() * 10,
          reason: '참여 가능한 투표입니다.',
        });
      }
    }

    // Sort by score and limit
    recommendations.sort((a, b) => b.score - a.score);

    return NextResponse.json(recommendations.slice(0, limit));
  } catch (error) {
    console.error('Recommendation API error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}

function calculateInterests(activities: Array<{ activity_type: string }>): string[] {
  const counts: Record<string, number> = {};

  for (const activity of activities) {
    if (activity.activity_type === 'policy_propose') {
      counts['policy'] = (counts['policy'] || 0) + 2;
    } else if (activity.activity_type === 'post_create' || activity.activity_type === 'comment_create') {
      counts['community'] = (counts['community'] || 0) + 1;
    } else if (activity.activity_type === 'vote_participate') {
      counts['voting'] = (counts['voting'] || 0) + 2;
    } else if (activity.activity_type === 'event_attend') {
      counts['events'] = (counts['events'] || 0) + 1;
    }
  }

  // Return top interests, or default interests if none
  const sorted = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([key]) => key);

  if (sorted.length === 0) {
    return ['policy', 'community', 'events'];
  }

  return sorted;
}

function truncate(text: string, maxLength: number): string {
  // Remove HTML tags
  const clean = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return clean.substring(0, maxLength) + '...';
}

// AI-related utilities for policy summary and content recommendations

export interface PolicySummary {
  summary: string;
  keyPoints: string[];
  targetAudience: string;
  expectedImpact: string;
}

export interface ContentRecommendation {
  id: string;
  type: 'policy' | 'post' | 'event' | 'vote';
  title: string;
  description: string;
  score: number;
  reason: string;
}

// AI Summary API endpoint
const AI_API_ENDPOINT = process.env.NEXT_PUBLIC_AI_API_URL || '/api/ai';

// Generate policy summary using AI
export async function generatePolicySummary(
  policyContent: string,
  policyTitle: string
): Promise<PolicySummary> {
  try {
    const response = await fetch(`${AI_API_ENDPOINT}/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: policyContent,
        title: policyTitle,
        type: 'policy',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate summary');
    }

    return await response.json();
  } catch (error) {
    console.error('AI summary error:', error);
    // Return fallback summary
    return generateFallbackSummary(policyContent);
  }
}

// Fallback summary generation without AI (keyword extraction)
function generateFallbackSummary(content: string): PolicySummary {
  // Simple extractive summary - take first 200 chars
  const cleanContent = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const summary = cleanContent.substring(0, 300) + (cleanContent.length > 300 ? '...' : '');

  // Extract sentences that might be key points
  const sentences = cleanContent.split(/[.!?]/).filter(s => s.trim().length > 20);
  const keyPoints = sentences.slice(0, 3).map(s => s.trim() + '.');

  return {
    summary,
    keyPoints: keyPoints.length > 0 ? keyPoints : ['정책 내용을 확인해 주세요.'],
    targetAudience: '전체 시민',
    expectedImpact: '사회 전반에 긍정적 영향 기대',
  };
}

// Get content recommendations based on user activity
export async function getContentRecommendations(
  userId: string,
  limit: number = 5
): Promise<ContentRecommendation[]> {
  try {
    const response = await fetch(`${AI_API_ENDPOINT}/recommend?userId=${userId}&limit=${limit}`);

    if (!response.ok) {
      throw new Error('Failed to get recommendations');
    }

    return await response.json();
  } catch (error) {
    console.error('Recommendation error:', error);
    return [];
  }
}

// Interest-based content scoring
export interface UserInterest {
  category: string;
  score: number;
}

export function calculateUserInterests(activities: Array<{
  activity_type: string;
  metadata?: Record<string, unknown>;
}>): UserInterest[] {
  const interests: Record<string, number> = {};

  for (const activity of activities) {
    // Determine category from activity
    let category = 'general';

    if (activity.activity_type === 'policy_propose') {
      category = 'policy';
    } else if (activity.activity_type === 'post_create' || activity.activity_type === 'comment_create') {
      category = 'community';
    } else if (activity.activity_type === 'vote_participate') {
      category = 'voting';
    } else if (activity.activity_type === 'event_attend') {
      category = 'events';
    }

    interests[category] = (interests[category] || 0) + 1;
  }

  // Convert to array and sort by score
  return Object.entries(interests)
    .map(([category, score]) => ({ category, score }))
    .sort((a, b) => b.score - a.score);
}

// Simple content similarity scoring
export function calculateContentSimilarity(
  userInterests: UserInterest[],
  contentTags: string[]
): number {
  let score = 0;

  for (const interest of userInterests) {
    if (contentTags.some(tag =>
      tag.toLowerCase().includes(interest.category.toLowerCase()) ||
      interest.category.toLowerCase().includes(tag.toLowerCase())
    )) {
      score += interest.score * 10;
    }
  }

  return Math.min(score, 100);
}

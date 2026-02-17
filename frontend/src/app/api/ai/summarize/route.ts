import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface SummaryRequest {
  content: string;
  title: string;
  type: 'policy' | 'post';
}

interface PolicySummary {
  summary: string;
  keyPoints: string[];
  targetAudience: string;
  expectedImpact: string;
}

// OpenAI API integration (can be swapped with other providers)
async function generateAISummary(content: string, title: string): Promise<PolicySummary> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Return fallback summary if no API key
    return generateFallbackSummary(content, title);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `당신은 정치 정책 분석 전문가입니다. 주어진 정책 내용을 분석하여 다음 형식의 JSON으로 요약해주세요:
{
  "summary": "정책의 핵심 내용을 2-3문장으로 요약",
  "keyPoints": ["핵심 포인트 1", "핵심 포인트 2", "핵심 포인트 3"],
  "targetAudience": "이 정책의 주요 대상",
  "expectedImpact": "예상되는 영향"
}
한국어로 응답하고, JSON만 출력하세요.`,
          },
          {
            role: 'user',
            content: `정책 제목: ${title}\n\n정책 내용:\n${content.substring(0, 3000)}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const message = data.choices[0]?.message?.content;

    if (message) {
      try {
        // Parse JSON from response
        const jsonMatch = message.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch {
        console.error('Failed to parse AI response');
      }
    }

    return generateFallbackSummary(content, title);
  } catch (error) {
    console.error('AI API error:', error);
    return generateFallbackSummary(content, title);
  }
}

function generateFallbackSummary(content: string, title: string): PolicySummary {
  // Remove HTML tags and clean content
  const cleanContent = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const summary = cleanContent.substring(0, 250) + (cleanContent.length > 250 ? '...' : '');

  // Extract sentences for key points
  const sentences = cleanContent.split(/[.!?]/).filter(s => s.trim().length > 15);
  const keyPoints = sentences.slice(0, 3).map(s => s.trim());

  // Add placeholder key points if needed
  while (keyPoints.length < 3) {
    keyPoints.push(`${title} 관련 세부 내용`);
  }

  return {
    summary,
    keyPoints: keyPoints.map(p => p.endsWith('.') ? p : p + '.'),
    targetAudience: '전체 시민 및 당원',
    expectedImpact: '사회적 공정성 향상 및 시민 복지 개선 기대',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: SummaryRequest = await request.json();

    if (!body.content || !body.title) {
      return NextResponse.json(
        { error: 'Missing content or title' },
        { status: 400 }
      );
    }

    const summary = await generateAISummary(body.content, body.title);

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Summary API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}

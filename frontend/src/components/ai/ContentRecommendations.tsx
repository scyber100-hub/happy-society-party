'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  Sparkles,
  FileText,
  MessageSquare,
  Calendar,
  Vote,
  ChevronRight,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { getContentRecommendations, type ContentRecommendation } from '@/lib/ai';

interface ContentRecommendationsProps {
  userId: string;
  maxItems?: number;
}

const typeIcons = {
  policy: FileText,
  post: MessageSquare,
  event: Calendar,
  vote: Vote,
};

const typeLabels = {
  policy: '정책',
  post: '게시글',
  event: '행사',
  vote: '투표',
};

const typeColors = {
  policy: 'bg-blue-100 text-blue-600',
  post: 'bg-purple-100 text-purple-600',
  event: 'bg-green-100 text-green-600',
  vote: 'bg-orange-100 text-orange-600',
};

const typeLinks = {
  policy: '/policies/',
  post: '/community/posts/',
  event: '/events/',
  vote: '/votes/',
};

export function ContentRecommendations({ userId, maxItems = 5 }: ContentRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getContentRecommendations(userId, maxItems);
      setRecommendations(data);
    } catch {
      setError('추천을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, maxItems]);

  if (loading) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--primary)]" />
            맞춤 추천
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-3 py-8">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--gray-400)]" />
            <span className="text-[var(--gray-500)]">추천 콘텐츠를 분석하고 있습니다...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--primary)]" />
            맞춤 추천
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-[var(--gray-500)] mb-3">{error}</p>
            <button
              onClick={loadRecommendations}
              className="text-[var(--primary)] text-sm hover:underline flex items-center gap-1 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              다시 시도
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--primary)]" />
            맞춤 추천
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-[var(--gray-500)] py-4">
            더 많은 활동을 하시면 맞춤 추천을 받으실 수 있습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--primary)]" />
            맞춤 추천
          </CardTitle>
          <button
            onClick={loadRecommendations}
            className="text-[var(--gray-400)] hover:text-[var(--primary)]"
            title="새로고침"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-[var(--gray-100)]">
          {recommendations.map((item) => {
            const Icon = typeIcons[item.type];
            return (
              <Link
                key={`${item.type}-${item.id}`}
                href={`${typeLinks[item.type]}${item.id}`}
                className="flex items-start gap-4 p-4 hover:bg-[var(--gray-50)] transition-colors"
              >
                <div className={`p-2 rounded-lg ${typeColors[item.type]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[item.type]}`}>
                      {typeLabels[item.type]}
                    </span>
                    <span className="text-xs text-[var(--gray-400)]">
                      추천도 {Math.round(item.score)}%
                    </span>
                  </div>
                  <h4 className="font-medium text-[var(--gray-900)] truncate">
                    {item.title}
                  </h4>
                  <p className="text-sm text-[var(--gray-500)] line-clamp-2 mt-1">
                    {item.description}
                  </p>
                  <p className="text-xs text-[var(--primary)] mt-1">
                    {item.reason}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--gray-400)] flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

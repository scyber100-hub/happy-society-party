'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkles, CheckCircle2, Users, TrendingUp, Loader2, RefreshCw } from 'lucide-react';
import { generatePolicySummary, type PolicySummary as PolicySummaryType } from '@/lib/ai';

interface PolicySummaryProps {
  policyId: string;
  title: string;
  content: string;
  initialSummary?: PolicySummaryType | null;
}

export function PolicySummary({ title, content, initialSummary }: PolicySummaryProps) {
  const [summary, setSummary] = useState<PolicySummaryType | null>(initialSummary || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleGenerateSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await generatePolicySummary(content, title);
      setSummary(result);
    } catch {
      setError('요약 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (!summary && !loading && !error) {
    return (
      <Card className="bg-gradient-to-r from-[var(--primary-light)] to-blue-50 border-none">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Sparkles className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--gray-900)]">AI 정책 요약</h3>
              <p className="text-sm text-[var(--gray-600)]">
                AI가 정책 내용을 분석하여 핵심을 요약해드립니다
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={handleGenerateSummary}
            className="w-full"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI 요약 생성하기
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3 py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
            <span className="text-[var(--gray-600)]">AI가 정책을 분석하고 있습니다...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="outline" onClick={handleGenerateSummary}>
              <RefreshCw className="w-4 h-4 mr-2" />
              다시 시도
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-[var(--primary-light)]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="font-semibold text-[var(--gray-900)]">AI 정책 요약</h3>
          </div>
          <button
            onClick={handleGenerateSummary}
            className="text-sm text-[var(--gray-500)] hover:text-[var(--primary)] flex items-center gap-1"
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4" />
            새로고침
          </button>
        </div>

        {/* Summary */}
        <div className="bg-[var(--gray-50)] rounded-lg p-4 mb-4">
          <p className="text-[var(--gray-700)] leading-relaxed">
            {summary?.summary}
          </p>
        </div>

        {/* Key Points */}
        {summary?.keyPoints && summary.keyPoints.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-[var(--gray-900)] mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              핵심 포인트
            </h4>
            <ul className="space-y-2">
              {summary.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-[var(--gray-600)]">
                  <span className="w-5 h-5 bg-[var(--primary-light)] rounded-full flex items-center justify-center text-xs text-[var(--primary)] flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expandable Details */}
        {(summary?.targetAudience || summary?.expectedImpact) && (
          <>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-[var(--primary)] hover:underline mb-2"
            >
              {isExpanded ? '상세 정보 접기' : '상세 정보 펼치기'}
            </button>

            {isExpanded && (
              <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[var(--gray-200)]">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-[var(--gray-900)]">대상</h4>
                    <p className="text-sm text-[var(--gray-600)]">{summary?.targetAudience}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-[var(--gray-900)]">기대 효과</h4>
                    <p className="text-sm text-[var(--gray-600)]">{summary?.expectedImpact}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <p className="text-xs text-[var(--gray-400)] mt-4 pt-4 border-t border-[var(--gray-100)]">
          * AI가 생성한 요약이며, 실제 정책 내용과 다를 수 있습니다.
        </p>
      </CardContent>
    </Card>
  );
}

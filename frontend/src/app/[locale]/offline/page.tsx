'use client';

import { WifiOff, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="w-20 h-20 bg-[var(--gray-100)] rounded-full flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-10 h-10 text-[var(--gray-400)]" />
          </div>

          <h1 className="text-2xl font-bold text-[var(--gray-900)] mb-3">
            오프라인 상태입니다
          </h1>

          <p className="text-[var(--gray-600)] mb-6">
            인터넷 연결이 끊어진 것 같습니다.<br />
            연결을 확인한 후 다시 시도해 주세요.
          </p>

          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={handleRefresh}
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              다시 시도
            </Button>

            <Button
              variant="outline"
              onClick={handleGoHome}
              className="w-full flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              홈으로 이동
            </Button>
          </div>
        </div>

        <p className="mt-6 text-sm text-[var(--gray-500)]">
          오프라인에서도 이전에 방문한 페이지는<br />
          캐시에서 확인할 수 있습니다.
        </p>
      </div>
    </div>
  );
}

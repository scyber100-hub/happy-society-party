'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { usePWA } from '@/hooks/usePWA';

export function UpdatePrompt() {
  const { isUpdateAvailable, update } = usePWA();

  if (!isUpdateAvailable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-[var(--primary)] text-white rounded-xl shadow-xl p-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1">
              새 버전이 있습니다
            </h3>
            <p className="text-sm text-white/80 mb-3">
              앱을 새로고침하여 최신 버전을 사용하세요.
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={update}
              className="border-white text-white hover:bg-white/10"
            >
              지금 업데이트
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

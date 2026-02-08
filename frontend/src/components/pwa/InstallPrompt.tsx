'use client';

import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { usePWA } from '@/hooks/usePWA';

export function InstallPrompt() {
  const { isInstallable, isInstalled, install } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if user has dismissed before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      // Show again after 7 days
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
      }
    }

    // Show prompt after 30 seconds if installable
    if (isInstallable && !isInstalled && !isDismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, isDismissed]);

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showPrompt || isInstalled || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[var(--primary-light)] rounded-xl flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6 text-[var(--primary)]" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--gray-900)] mb-1">
              앱으로 설치하기
            </h3>
            <p className="text-sm text-[var(--gray-600)] mb-3">
              홈 화면에 추가하면 더 빠르고 편리하게 이용할 수 있습니다.
            </p>

            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleInstall}
                className="flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                설치
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
              >
                나중에
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, X, Loader2, CheckCircle2, XCircle, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { checkInWithQR, saveOfflineCheckIn, type CheckInResult } from '@/lib/events';
import { usePWA } from '@/hooks/usePWA';

interface QRScannerProps {
  onClose: () => void;
  onSuccess?: (result: CheckInResult) => void;
}

type ScanState = 'idle' | 'scanning' | 'processing' | 'success' | 'error' | 'offline-saved';

export function QRScanner({ onClose, onSuccess }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { isOnline } = usePWA();
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleQRDetected = useCallback(async (qrCode: string) => {
    if (scanState !== 'scanning') return;

    setScanState('processing');

    // Stop scanning
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    // Validate QR code format (should be 48 character hex string)
    if (!/^[a-f0-9]{48}$/.test(qrCode)) {
      setError('유효하지 않은 QR 코드입니다.');
      setScanState('error');
      return;
    }

    if (!isOnline) {
      // Save for offline sync
      try {
        await saveOfflineCheckIn(qrCode);
        setScanState('offline-saved');
      } catch {
        setError('오프라인 저장에 실패했습니다.');
        setScanState('error');
      }
      return;
    }

    try {
      const checkInResult = await checkInWithQR(qrCode);
      setResult(checkInResult);

      if (checkInResult.success) {
        setScanState('success');
        onSuccess?.(checkInResult);
      } else {
        setError(checkInResult.message);
        setScanState('error');
      }
    } catch (checkInError) {
      console.error('Check-in error:', checkInError);
      setError('체크인 처리 중 오류가 발생했습니다.');
      setScanState('error');
    }
  }, [scanState, isOnline, onSuccess]);

  const startScanning = useCallback(() => {
    // In a real app, you'd use a library like jsQR or @aspect-build/aspect-qr
    // For this implementation, we'll simulate QR detection
    // The actual QR code data would be extracted from the video frame

    scanIntervalRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Here you would use jsQR or similar to detect QR code
          // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          // const code = jsQR(imageData.data, imageData.width, imageData.height);

          // For demo purposes, check URL parameters for test QR code
          const urlParams = new URLSearchParams(window.location.search);
          const testQR = urlParams.get('testqr');
          if (testQR) {
            handleQRDetected(testQR);
          }
        }
      }
    }, 500);
  }, [handleQRDetected]);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setScanState('scanning');
        startScanning();
      }
    } catch (cameraError) {
      console.error('Camera error:', cameraError);
      setError('카메라에 접근할 수 없습니다. 권한을 확인해주세요.');
      setScanState('error');
    }
  }, [startScanning]);

  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    setError(null);
    setResult(null);
    setScanState('idle');
    stopCamera();
    startCamera();
  };

  // Manual QR input for testing/accessibility
  const [manualInput, setManualInput] = useState('');
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      handleQRDetected(manualInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <h2 className="text-lg font-semibold">QR 체크인</h2>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex items-center justify-center relative">
        {scanState === 'scanning' && (
          <>
            <video
              ref={videoRef}
              className="max-w-full max-h-full object-contain"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Scan overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-2 border-white rounded-2xl relative">
                <div className="absolute inset-0 border-4 border-transparent animate-pulse">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[var(--primary)] rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[var(--primary)] rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[var(--primary)] rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[var(--primary)] rounded-br-xl" />
                </div>
              </div>
            </div>
          </>
        )}

        {scanState === 'idle' && (
          <div className="text-center text-white">
            <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>카메라를 시작하는 중...</p>
          </div>
        )}

        {scanState === 'processing' && (
          <div className="text-center text-white">
            <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin" />
            <p>체크인 처리 중...</p>
          </div>
        )}

        {scanState === 'success' && result && (
          <div className="text-center text-white p-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold mb-2">체크인 완료!</h3>
            <p className="text-xl mb-1">{result.event?.title}</p>
            <p className="text-white/70">{result.event?.location}</p>
            <p className="text-sm text-white/50 mt-4">
              {new Date(result.check_in_time!).toLocaleString('ko-KR')}
            </p>
            <Button
              variant="outline"
              onClick={onClose}
              className="mt-8 border-white text-white hover:bg-white/10"
            >
              닫기
            </Button>
          </div>
        )}

        {scanState === 'offline-saved' && (
          <div className="text-center text-white p-8">
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <WifiOff className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold mb-2">오프라인 저장됨</h3>
            <p className="text-white/80 mb-4">
              인터넷 연결이 복구되면 자동으로 체크인됩니다.
            </p>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-white text-white hover:bg-white/10"
            >
              닫기
            </Button>
          </div>
        )}

        {scanState === 'error' && (
          <div className="text-center text-white p-8">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold mb-2">체크인 실패</h3>
            <p className="text-white/80 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={handleRetry}
                className="border-white text-white hover:bg-white/10"
              >
                다시 시도
              </Button>
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-white hover:bg-white/10"
              >
                닫기
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Manual Input (for testing/accessibility) */}
      {(scanState === 'scanning' || scanState === 'error') && (
        <div className="p-4 bg-black/50">
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="QR 코드 직접 입력"
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder:text-white/50 border border-white/20 focus:outline-none focus:border-white/40"
            />
            <Button type="submit" variant="primary">
              확인
            </Button>
          </form>
        </div>
      )}

      {/* Instructions */}
      {scanState === 'scanning' && (
        <div className="p-4 text-center text-white/70 text-sm">
          QR 코드를 프레임 안에 맞춰주세요
        </div>
      )}
    </div>
  );
}

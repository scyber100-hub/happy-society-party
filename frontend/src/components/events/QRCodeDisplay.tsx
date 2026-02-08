'use client';

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import { QrCode, Download, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { generateEventQRCode } from '@/lib/events';

interface QRCodeDisplayProps {
  eventId: string;
  eventTitle: string;
  existingQRCode?: string | null;
  onQRGenerated?: (qrCode: string) => void;
}

export function QRCodeDisplay({
  eventId,
  eventTitle,
  existingQRCode,
  onQRGenerated,
}: QRCodeDisplayProps) {
  const [qrCode, setQRCode] = useState<string | null>(existingQRCode || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (qrCode) {
      // Generate QR code image using a QR code API
      // In production, you might want to use a library like qrcode.react
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCode)}`;
      setQrImageUrl(url);
    }
  }, [qrCode]);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const newQRCode = await generateEventQRCode(eventId);
      setQRCode(newQRCode);
      onQRGenerated?.(newQRCode);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      alert('QR 코드 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!qrCode) return;
    try {
      await navigator.clipboard.writeText(qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    if (!qrImageUrl) return;

    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = `${eventTitle.replace(/[^a-zA-Z0-9가-힣]/g, '_')}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <QrCode className="w-5 h-5 text-[var(--primary)]" />
        QR 체크인 코드
      </h3>

      {!qrCode ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">
            QR 코드가 생성되지 않았습니다.
          </p>
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <QrCode className="w-4 h-4" />
                QR 코드 생성
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="text-center">
          {/* QR Code Image */}
          <div className="inline-block bg-white p-4 rounded-xl shadow-sm border mb-4">
            {qrImageUrl ? (
              <img
                src={qrImageUrl}
                alt="Event QR Code"
                className="w-64 h-64"
              />
            ) : (
              <div className="w-64 h-64 bg-gray-100 animate-pulse rounded" />
            )}
          </div>

          {/* QR Code Value */}
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-1">QR 코드 값</p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-xs bg-gray-100 px-3 py-1 rounded font-mono truncate max-w-[200px]">
                {qrCode}
              </code>
              <button
                onClick={handleCopy}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="복사"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              다운로드
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              재생성
            </Button>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            참석자가 이 QR 코드를 스캔하면 자동으로 체크인됩니다.
          </p>
        </div>
      )}
    </div>
  );
}

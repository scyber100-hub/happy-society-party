'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

interface PhoneVerificationProps {
  phone: string;
  onVerified: () => void;
  onPhoneChange?: (phone: string) => void;
}

export function PhoneVerification({ phone, onVerified, onPhoneChange }: PhoneVerificationProps) {
  const supabase = createClient();
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState(phone);

  useEffect(() => {
    setPhoneNumber(phone);
  }, [phone]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    onPhoneChange?.(formatted);
  };

  const sendVerificationCode = async () => {
    if (!phoneNumber || phoneNumber.replace(/[^\d]/g, '').length < 10) {
      setError('올바른 휴대폰 번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 인증 코드 생성 (실제 SMS 발송은 백엔드에서 처리)
      const { data, error: rpcError } = await supabase.rpc('generate_phone_verification_code', {
        p_phone: phoneNumber.replace(/[^\d]/g, ''),
      });

      if (rpcError) {
        throw rpcError;
      }

      // 실제 환경에서는 SMS API 연동 필요
      // 개발 환경에서는 콘솔에 코드 출력
      console.log('인증 코드:', data);

      setStep('verify');
      setCountdown(300); // 5분 카운트다운
    } catch {
      setError('인증 코드 발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (code.length !== 6) {
      setError('6자리 인증 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc('verify_phone_code', {
        p_phone: phoneNumber.replace(/[^\d]/g, ''),
        p_code: code,
      });

      if (rpcError) {
        throw rpcError;
      }

      if (data) {
        onVerified();
      } else {
        setError('인증 코드가 올바르지 않거나 만료되었습니다.');
      }
    } catch {
      setError('인증에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {step === 'input' ? (
        <>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                label="휴대폰 번호"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="010-0000-0000"
                maxLength={13}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={sendVerificationCode}
                isLoading={isLoading}
                disabled={!phoneNumber || phoneNumber.replace(/[^\d]/g, '').length < 10}
              >
                인증요청
              </Button>
            </div>
          </div>
          {error && (
            <p className="text-sm text-[var(--error)]">{error}</p>
          )}
        </>
      ) : (
        <>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                label="인증 코드"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
                placeholder="6자리 숫자 입력"
                maxLength={6}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={verifyCode}
                isLoading={isLoading}
                disabled={code.length !== 6 || countdown === 0}
              >
                확인
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            {countdown > 0 ? (
              <span className="text-[var(--gray-500)]">
                남은 시간: <span className="text-[var(--primary)] font-medium">{formatTime(countdown)}</span>
              </span>
            ) : (
              <span className="text-[var(--error)]">인증 시간이 만료되었습니다.</span>
            )}
            <button
              type="button"
              onClick={() => {
                setStep('input');
                setCode('');
                setError(null);
              }}
              className="text-[var(--primary)] hover:underline"
            >
              번호 변경
            </button>
          </div>
          {countdown === 0 && (
            <Button
              variant="outline"
              onClick={sendVerificationCode}
              isLoading={isLoading}
              className="w-full"
            >
              인증 코드 재발송
            </Button>
          )}
          {error && (
            <p className="text-sm text-[var(--error)]">{error}</p>
          )}
        </>
      )}
    </div>
  );
}

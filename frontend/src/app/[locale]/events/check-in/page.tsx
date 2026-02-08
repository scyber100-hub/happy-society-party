'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  QrCode,
  Camera,
  History,
  CheckCircle2,
  Clock,
  MapPin,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { QRScanner } from '@/components/events/QRScanner';
import {
  syncPendingCheckIns,
  getPendingCheckIns,
  type CheckInResult
} from '@/lib/events';
import { usePWA } from '@/hooks/usePWA';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

interface RecentCheckIn {
  id: string;
  event_title: string;
  event_location: string | null;
  attended_at: string;
}

export default function CheckInPage() {
  const { user, loading: authLoading } = useAuth();
  const { isOnline } = usePWA();
  const [showScanner, setShowScanner] = useState(false);
  const [recentCheckIns, setRecentCheckIns] = useState<RecentCheckIn[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<CheckInResult | null>(null);

  const loadRecentCheckIns = useCallback(async () => {
    if (!user) return;

    const supabase = createClient();

    const { data, error } = await supabase
      .from('event_participants')
      .select(`
        id,
        attended_at,
        events (
          title,
          location
        )
      `)
      .eq('user_id', user.id)
      .not('attended_at', 'is', null)
      .order('attended_at', { ascending: false })
      .limit(5);

    if (!error && data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedData = (data as any[]).map((item) => ({
        id: item.id,
        event_title: item.events?.title || 'Unknown Event',
        event_location: item.events?.location,
        attended_at: item.attended_at,
      }));
      setRecentCheckIns(mappedData);
    }
  }, [user]);

  const handleSync = useCallback(async () => {
    if (!isOnline || isSyncing) return;

    try {
      setIsSyncing(true);
      const synced = await syncPendingCheckIns();
      if (synced > 0) {
        await loadRecentCheckIns();
        await loadPendingCount();
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, loadRecentCheckIns]);

  useEffect(() => {
    if (user) {
      loadRecentCheckIns();
      loadPendingCount();
    }
  }, [user, loadRecentCheckIns]);

  useEffect(() => {
    // Auto-sync when coming online
    if (isOnline && pendingCount > 0) {
      handleSync();
    }
  }, [isOnline, pendingCount, handleSync]);

  async function loadPendingCount() {
    try {
      const pending = await getPendingCheckIns();
      setPendingCount(pending.length);
    } catch (error) {
      console.error('Failed to load pending check-ins:', error);
    }
  }

  const handleCheckInSuccess = (result: CheckInResult) => {
    setLastCheckIn(result);
    loadRecentCheckIns();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return `오늘 ${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days === 1) {
      return `어제 ${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days < 7) {
      return `${days}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white">
          <CardContent className="p-8 text-center">
            <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              로그인이 필요합니다
            </h2>
            <p className="text-gray-500 mb-6">
              QR 체크인을 이용하려면 로그인해주세요.
            </p>
            <Link href="/auth/login">
              <Button variant="primary">로그인</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <div className="bg-[var(--primary)] text-white py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <QrCode className="w-8 h-8" />
            <h1 className="text-3xl font-bold">QR 체크인</h1>
          </div>
          <p className="text-white/90">
            행사장의 QR 코드를 스캔하여 빠르게 체크인하세요
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Offline Banner */}
        {!isOnline && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-yellow-600" />
            <div className="flex-1">
              <p className="text-yellow-800 font-medium">오프라인 모드</p>
              <p className="text-sm text-yellow-600">
                체크인 정보가 저장되며, 인터넷 연결 시 자동으로 동기화됩니다.
              </p>
            </div>
          </div>
        )}

        {/* Pending Sync */}
        {pendingCount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-blue-800 font-medium">
                  동기화 대기 중인 체크인 {pendingCount}건
                </p>
                <p className="text-sm text-blue-600">
                  인터넷에 연결되면 자동으로 동기화됩니다.
                </p>
              </div>
            </div>
            {isOnline && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={isSyncing}
                className="border-blue-300 text-blue-700"
              >
                {isSyncing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  '동기화'
                )}
              </Button>
            )}
          </div>
        )}

        {/* Last Check-in Success */}
        {lastCheckIn && (
          <Card className="bg-green-50 border-green-200 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-green-800">체크인 완료!</p>
                  <p className="text-sm text-green-600">{lastCheckIn.event?.title}</p>
                </div>
                <button
                  onClick={() => setLastCheckIn(null)}
                  className="text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scan Button */}
        <Card className="bg-white mb-8">
          <CardContent className="p-8 text-center">
            <button
              onClick={() => setShowScanner(true)}
              className="w-32 h-32 bg-[var(--primary)] hover:bg-[var(--primary-dark)] rounded-full flex items-center justify-center mx-auto mb-6 transition-colors shadow-lg"
            >
              <Camera className="w-16 h-16 text-white" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              QR 코드 스캔
            </h2>
            <p className="text-gray-500 mb-6">
              버튼을 눌러 카메라로 QR 코드를 스캔하세요
            </p>
            <Button
              variant="primary"
              onClick={() => setShowScanner(true)}
              className="flex items-center gap-2 mx-auto"
            >
              <QrCode className="w-5 h-5" />
              스캔 시작
            </Button>
          </CardContent>
        </Card>

        {/* Recent Check-ins */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-[var(--primary)]" />
              최근 체크인 기록
            </h3>

            {recentCheckIns.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                아직 체크인 기록이 없습니다.
              </p>
            ) : (
              <div className="space-y-4">
                {recentCheckIns.map((checkIn) => (
                  <div
                    key={checkIn.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-[var(--primary-light)] rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {checkIn.event_title}
                      </p>
                      {checkIn.event_location && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {checkIn.event_location}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      {formatDate(checkIn.attended_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onClose={() => setShowScanner(false)}
          onSuccess={handleCheckInSuccess}
        />
      )}
    </div>
  );
}

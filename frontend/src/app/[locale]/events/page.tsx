'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Video,
  CheckCircle,
  ChevronRight
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  location: string | null;
  online_url: string | null;
  start_date: string;
  end_date: string;
  max_participants: number | null;
  current_participants: number;
  status: string;
}

interface MyRegistration {
  event_id: string;
  attended_at: string | null;
}

const eventTypeLabels: Record<string, string> = {
  meeting: '정기모임',
  rally: '집회/행사',
  seminar: '세미나',
  workshop: '워크숍',
  volunteer: '봉사활동',
};

const eventTypeColors: Record<string, string> = {
  meeting: 'bg-blue-100 text-blue-700',
  rally: 'bg-red-100 text-red-700',
  seminar: 'bg-purple-100 text-purple-700',
  workshop: 'bg-green-100 text-green-700',
  volunteer: 'bg-yellow-100 text-yellow-700',
};

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<MyRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

  const fetchEvents = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    const now = new Date().toISOString();

    let query = supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: filter === 'upcoming' });

    if (filter === 'upcoming') {
      query = query.gte('start_date', now).neq('status', 'cancelled');
    } else {
      query = query.lt('start_date', now);
    }

    const { data } = await query;
    setEvents(data || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    const supabase = createClient();
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        // 내 등록 현황 조회
        const { data: regs } = await supabase
          .from('event_participants')
          .select('event_id, attended_at')
          .eq('user_id', user.id);
        if (regs) setMyRegistrations(regs);
      }
      fetchEvents();
    };
    init();
  }, [fetchEvents]);

  useEffect(() => {
    fetchEvents();
  }, [filter, fetchEvents]);

  const handleRegister = async (eventId: string) => {
    if (!userId) {
      router.push('/auth/login?redirect=/events');
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.rpc('register_for_event', {
      p_event_id: eventId,
      p_user_id: userId,
    });

    const result = data as unknown as { success: boolean; message: string } | null;

    if (error) {
      alert('등록 실패: ' + error.message);
    } else if (result && !result.success) {
      alert(result.message);
    } else {
      alert('행사 등록이 완료되었습니다.');
      setMyRegistrations([...myRegistrations, { event_id: eventId, attended_at: null }]);
    }
  };

  const isRegistered = (eventId: string) => {
    return myRegistrations.some(r => r.event_id === eventId);
  };

  const hasAttended = (eventId: string) => {
    const reg = myRegistrations.find(r => r.event_id === eventId);
    return reg?.attended_at != null;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-yellow-500" />
          행사 일정
        </h1>

        {/* 필터 탭 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'upcoming'
                ? 'bg-yellow-400 text-black'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            예정된 행사
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'past'
                ? 'bg-yellow-400 text-black'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            지난 행사
          </button>
        </div>

        {/* 행사 목록 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{filter === 'upcoming' ? '예정된 행사가 없습니다.' : '지난 행사가 없습니다.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-yellow-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${eventTypeColors[event.event_type] || 'bg-gray-100 text-gray-700'}`}>
                        {eventTypeLabels[event.event_type] || event.event_type}
                      </span>
                      {event.online_url && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700 flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          온라인
                        </span>
                      )}
                      {isRegistered(event.id) && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {hasAttended(event.id) ? '참석완료' : '등록완료'}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>

                    {event.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(event.start_date)} {formatTime(event.start_date)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>
                          {event.current_participants}명 참여
                          {event.max_participants && ` / ${event.max_participants}명`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    {filter === 'upcoming' && !isRegistered(event.id) && (
                      <button
                        onClick={() => handleRegister(event.id)}
                        className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors flex items-center gap-1"
                      >
                        참가 신청
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                    {isRegistered(event.id) && event.online_url && (
                      <a
                        href={event.online_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Video className="w-4 h-4" />
                        참여하기
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

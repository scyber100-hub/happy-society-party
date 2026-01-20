'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

// 일정 데이터
const scheduleData = [
  {
    id: 'schedule-001',
    title: '서울시당 창당대회',
    description: '서울시당 정식 창당대회가 개최됩니다. 시당 대표 및 집행위원 선출이 진행됩니다.',
    date: '2026-01-25',
    time: '14:00',
    location: '서울 중구 프레스센터',
    type: 'event',
    isOnline: false,
  },
  {
    id: 'schedule-002',
    title: '신규 당원 입문 교육',
    description: '새로 가입하신 당원분들을 위한 입문 교육입니다. 당의 비전과 강령, 활동 방법을 안내합니다.',
    date: '2026-01-22',
    time: '19:00',
    location: '온라인 (Zoom)',
    type: 'education',
    isOnline: true,
  },
  {
    id: 'schedule-003',
    title: '경기도당 당원 간담회',
    description: '경기도 지역 당원분들과 함께하는 간담회입니다. 지역 현안과 정책에 대한 의견을 나눕니다.',
    date: '2026-01-20',
    time: '15:00',
    location: '수원시 팔달구 시민회관',
    type: 'meeting',
    isOnline: false,
  },
  {
    id: 'schedule-004',
    title: '정책위원회 공개 토론회',
    description: 'AI 시대 노동정책에 대한 공개 토론회입니다. 누구나 참여 가능합니다.',
    date: '2026-01-18',
    time: '14:00',
    location: '서울 마포구 당사 대회의실',
    type: 'event',
    isOnline: false,
  },
  {
    id: 'schedule-005',
    title: '청년위원회 온라인 모임',
    description: '청년 당원들의 정기 온라인 모임입니다. 청년 정책 아이디어를 함께 논의합니다.',
    date: '2026-01-17',
    time: '20:00',
    location: '온라인 (Discord)',
    type: 'meeting',
    isOnline: true,
  },
  {
    id: 'news-006',
    title: '2026년 1월 당원 교육 프로그램',
    description: '신규 당원을 위한 입문 교육과 기존 당원을 위한 심화 교육 프로그램입니다.',
    date: '2026-01-15',
    time: '19:00',
    location: '온라인 및 오프라인 동시 진행',
    type: 'education',
    isOnline: true,
  },
  {
    id: 'news-008',
    title: '전국 순회 당원 간담회 - 부산',
    description: '전국 순회 간담회의 첫 번째 일정으로 부산에서 개최됩니다.',
    date: '2026-01-12',
    time: '14:00',
    location: '부산 해운대구 문화회관',
    type: 'meeting',
    isOnline: false,
  },
];

const typeLabels: Record<string, { label: string; color: string }> = {
  event: { label: '행사', color: 'bg-blue-100 text-blue-700' },
  education: { label: '교육', color: 'bg-green-100 text-green-700' },
  meeting: { label: '모임', color: 'bg-purple-100 text-purple-700' },
};

export default function SchedulePage() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const today = new Date().toISOString().split('T')[0];

  const filteredSchedule = useMemo(() => {
    return scheduleData
      .filter((item) => {
        if (filter === 'upcoming') return item.date >= today;
        if (filter === 'past') return item.date < today;
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filter, today]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return { month, day, weekday };
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--primary)] text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/news" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            소식으로 돌아가기
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">일정</h1>
              <p className="text-white/80 mt-2">행복사회당의 행사 및 활동 일정입니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="border-b border-[var(--gray-200)] bg-white py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--gray-100)] text-[var(--gray-600)] hover:bg-[var(--gray-200)]'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'upcoming'
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--gray-100)] text-[var(--gray-600)] hover:bg-[var(--gray-200)]'
              }`}
            >
              예정된 일정
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'past'
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--gray-100)] text-[var(--gray-600)] hover:bg-[var(--gray-200)]'
              }`}
            >
              지난 일정
            </button>
          </div>
        </div>
      </section>

      {/* Schedule List */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {filteredSchedule.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-12 h-12 text-[var(--gray-300)] mx-auto mb-4" />
              <p className="text-[var(--gray-500)] text-lg">일정이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSchedule.map((item) => {
                const { month, day, weekday } = formatDate(item.date);
                const typeInfo = typeLabels[item.type] || typeLabels.event;
                const isPast = item.date < today;

                return (
                  <Card
                    key={item.id}
                    variant="bordered"
                    className={`hover:shadow-[var(--shadow-md)] transition-all ${isPast ? 'opacity-60' : ''}`}
                  >
                    <div className="flex gap-4">
                      {/* Date Box */}
                      <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center ${isPast ? 'bg-[var(--gray-100)]' : 'bg-[var(--primary-light)]'}`}>
                        <span className={`text-sm font-medium ${isPast ? 'text-[var(--gray-500)]' : 'text-[var(--primary)]'}`}>
                          {month}월
                        </span>
                        <span className={`text-2xl font-bold ${isPast ? 'text-[var(--gray-600)]' : 'text-[var(--primary)]'}`}>
                          {day}
                        </span>
                        <span className={`text-xs ${isPast ? 'text-[var(--gray-400)]' : 'text-[var(--primary-dark)]'}`}>
                          ({weekday})
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${typeInfo.color}`}>
                            {typeInfo.label}
                          </span>
                          {item.isOnline && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
                              온라인
                            </span>
                          )}
                          {isPast && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                              종료
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-[var(--gray-600)] mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-[var(--gray-500)]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {item.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {item.location}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center">
                        <ChevronRight className="w-5 h-5 text-[var(--gray-400)]" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-[var(--gray-50)] py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card variant="bordered" className="bg-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[var(--primary-light)] rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2">행사 참여 안내</h3>
                <p className="text-[var(--gray-600)] text-sm mb-4">
                  당원이시라면 모든 행사에 자유롭게 참여하실 수 있습니다.
                  일부 행사는 사전 신청이 필요할 수 있으니, 각 행사의 상세 안내를 확인해 주세요.
                </p>
                <Link href="/join" className="text-[var(--primary)] text-sm font-medium hover:underline">
                  아직 당원이 아니신가요? 입당 신청하기 →
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

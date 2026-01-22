'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  Bell,
  MessageSquare,
  Heart,
  Calendar,
  Users,
  Settings,
  CheckCheck,
  Trash2,
  Filter,
} from 'lucide-react';

// 더미 알림 데이터
const notificationsData = [
  {
    id: 1,
    type: 'announcement',
    icon: Bell,
    title: '새로운 정책 토론이 시작되었습니다.',
    message: '정책위원회에서 "AI 시대 노동정책" 토론이 시작되었습니다. 지금 참여해 보세요.',
    date: '2026-01-14 14:30',
    isRead: false,
    link: '/community/committees/policy',
  },
  {
    id: 2,
    type: 'event',
    icon: Calendar,
    title: '서울시당 정기 모임 안내',
    message: '1월 25일 오후 2시 서울시당 창당대회가 개최됩니다. 많은 참여 부탁드립니다.',
    date: '2026-01-13 10:00',
    isRead: false,
    link: '/news/schedule',
  },
  {
    id: 3,
    type: 'comment',
    icon: MessageSquare,
    title: '회원님의 게시글에 새 댓글이 달렸습니다.',
    message: '김철수님이 "환경 정책 제안" 게시글에 댓글을 남겼습니다.',
    date: '2026-01-12 16:45',
    isRead: false,
    link: '/community/committees/environment/posts/1',
  },
  {
    id: 4,
    type: 'like',
    icon: Heart,
    title: '회원님의 게시글을 좋아합니다.',
    message: '이영희님 외 5명이 회원님의 게시글을 좋아합니다.',
    date: '2026-01-12 14:20',
    isRead: true,
    link: '/community/committees/environment/posts/1',
  },
  {
    id: 5,
    type: 'payment',
    icon: Bell,
    title: '당비 납부가 완료되었습니다.',
    message: '2026년 1월 당비 10,000원 납부가 정상적으로 완료되었습니다.',
    date: '2026-01-10 09:00',
    isRead: true,
    link: '/portal/payments',
  },
  {
    id: 6,
    type: 'community',
    icon: Users,
    title: '환경위원회에 새 글이 올라왔습니다.',
    message: '환경위원회에 새로운 토론 주제가 등록되었습니다.',
    date: '2026-01-09 11:30',
    isRead: true,
    link: '/community/committees/environment',
  },
  {
    id: 7,
    type: 'announcement',
    icon: Bell,
    title: '당원 교육 프로그램 안내',
    message: '신규 당원을 위한 입문 교육이 1월 22일에 진행됩니다.',
    date: '2026-01-08 15:00',
    isRead: true,
    link: '/news/schedule',
  },
];

const filterOptions = [
  { id: 'all', label: '전체' },
  { id: 'unread', label: '읽지 않음' },
  { id: 'announcement', label: '공지' },
  { id: 'community', label: '커뮤니티' },
  { id: 'event', label: '일정' },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(notificationsData);
  const [activeFilter, setActiveFilter] = useState('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.isRead;
    return notification.type === activeFilter;
  });

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'bg-[var(--primary-light)] text-[var(--primary)]';
      case 'event':
        return 'bg-blue-100 text-blue-600';
      case 'comment':
        return 'bg-green-100 text-green-600';
      case 'like':
        return 'bg-red-100 text-red-500';
      case 'payment':
        return 'bg-yellow-100 text-yellow-600';
      case 'community':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-[var(--gray-100)] text-[var(--gray-600)]';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <div className="bg-[var(--primary)] text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/portal"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            대시보드로 돌아가기
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">알림</h1>
              <p className="text-white/80 mt-1">
                {unreadCount > 0 ? `읽지 않은 알림 ${unreadCount}개` : '모든 알림을 확인했습니다.'}
              </p>
            </div>
            <Link href="/portal/notifications/settings">
              <Button variant="secondary" size="sm">
                <Settings className="w-4 h-4 mr-1" />
                알림 설정
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Filter & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="w-4 h-4 text-[var(--gray-500)]" />
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveFilter(option.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === option.id
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-white text-[var(--gray-600)] hover:bg-[var(--gray-100)] border border-[var(--gray-200)]'
                }`}
              >
                {option.label}
                {option.id === 'unread' && unreadCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-1" />
              모두 읽음 처리
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <Card variant="default" className="bg-white">
          <CardContent className="p-0">
            {filteredNotifications.length > 0 ? (
              <div className="divide-y divide-[var(--gray-100)]">
                {filteredNotifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-[var(--gray-50)] transition-colors ${
                        !notification.isRead ? 'bg-[var(--primary-light)]/30' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={notification.link}
                            onClick={() => markAsRead(notification.id)}
                            className="block"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`font-medium ${!notification.isRead ? 'text-[var(--gray-900)]' : 'text-[var(--gray-700)]'}`}>
                                {!notification.isRead && (
                                  <span className="inline-block w-2 h-2 bg-[var(--primary)] rounded-full mr-2"></span>
                                )}
                                {notification.title}
                              </h4>
                              <span className="text-xs text-[var(--gray-400)] whitespace-nowrap">
                                {notification.date.split(' ')[0]}
                              </span>
                            </div>
                            <p className="text-sm text-[var(--gray-600)] mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                          </Link>
                        </div>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-[var(--gray-400)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-[var(--gray-300)] mx-auto mb-3" />
                <p className="text-[var(--gray-500)]">
                  {activeFilter === 'unread' ? '읽지 않은 알림이 없습니다.' : '알림이 없습니다.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="text-center mt-6">
            <Button variant="outline">
              이전 알림 더 보기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

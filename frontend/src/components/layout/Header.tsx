'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '../ui/Button';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { TenantSelector } from '../common/TenantSelector';

export function Header() {
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navigation = [
    {
      name: t('nav.about'),
      href: '/about',
      children: [
        { name: '비전과 가치', href: '/about/vision' },
        { name: '강령', href: '/about/platform' },
        { name: '역사', href: '/about/history' },
        { name: '조직도', href: '/about/organization' },
        { name: '당헌당규', href: '/about/constitution' },
        { name: '국제연대가', href: '/about/anthem' },
      ],
    },
    {
      name: t('nav.policies'),
      href: '/policies',
    },
    {
      name: t('nav.news'),
      href: '/news',
      children: [
        { name: '보도자료', href: '/news/press' },
        { name: '성명서', href: '/news/statements' },
        { name: '일정', href: '/news/schedule' },
      ],
    },
    {
      name: '당원활동',
      href: '/portal',
      children: [
        { name: '당원 포털', href: '/portal' },
        { name: '투표', href: '/votes' },
        { name: '행사', href: '/events' },
        { name: '공천신청', href: '/portal/nominations' },
        { name: '정책제안', href: '/portal/proposals' },
      ],
    },
    {
      name: '참여',
      href: '/participate',
      children: [
        { name: t('nav.join'), href: '/join' },
        { name: t('nav.donate'), href: '/donate' },
        { name: t('nav.community'), href: '/community' },
      ],
    },
    {
      name: 'International',
      href: '/intl/board',
      children: [
        { name: 'Global Board', href: '/intl/board' },
        { name: 'Votes', href: '/intl/votes' },
        { name: 'Chapters', href: '/intl/chapters' },
        { name: 'Contact', href: '/intl/contact' },
      ],
    },
  ];

  return (
    <header className="bg-white border-b border-[var(--gray-200)] sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo.svg"
              alt={t('common.appName')}
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="font-bold text-xl text-[var(--gray-900)]">{t('common.appName')}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="px-4 py-2 text-[var(--gray-700)] hover:text-[var(--primary)] font-medium transition-colors"
                >
                  {item.name}
                </Link>
                {item.children && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 w-48 bg-white border border-[var(--gray-200)] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] py-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-4 py-2 text-[var(--gray-600)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons, Tenant Selector, and Language Switcher */}
          <div className="hidden md:flex items-center space-x-3">
            <TenantSelector variant="compact" />
            <LanguageSwitcher />
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">{t('nav.login')}</Button>
            </Link>
            <Link href="/join">
              <Button variant="primary" size="sm">{t('nav.join')}</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <TenantSelector variant="compact" showLabel={false} />
            <LanguageSwitcher />
            <button
              className="p-2 text-[var(--gray-600)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--gray-200)]">
            {navigation.map((item) => (
              <div key={item.name} className="py-2">
                <Link
                  href={item.href}
                  className="block px-4 py-2 text-[var(--gray-700)] font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
                {item.children && (
                  <div className="ml-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-4 py-2 text-[var(--gray-500)] text-sm"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-4 px-4 space-y-2">
              <Link href="/auth/login" className="block">
                <Button variant="outline" fullWidth>{t('nav.login')}</Button>
              </Link>
              <Link href="/join" className="block">
                <Button variant="primary" fullWidth>{t('nav.join')}</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

import type { Metadata, Viewport } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-kr',
});

export const viewport: Viewport = {
  themeColor: '#1F6F6B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: '행복사회당 | 모든 국민의 행복을 위한 정당',
  description: '행복사회당은 모든 국민의 행복을 최우선 가치로 삼아, 공정하고 지속가능한 사회를 만들어가는 정당입니다.',
  keywords: ['행복사회당', '정당', '정치', '민주주의', '복지', '정책'],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icons/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '행복사회당',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: '행복사회당',
    description: '모든 국민의 행복을 위한 정당',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${notoSansKR.variable} antialiased min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import BottomNav from '@/components/layout/BottomNav';
import SideNav from '@/components/layout/SideNav';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '뜨개 노트',
  description: '뜨개질 프로젝트 & 인벤토리 관리',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '뜨개 노트',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-linen-50`}
      >
        <div className="flex min-h-screen">
          <SideNav />
          <div className="flex flex-col flex-1 min-w-0 md:max-w-3xl md:border-r md:border-linen-100">
            {children}
          </div>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}

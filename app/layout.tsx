import type { Metadata } from 'next';
import './globals.css';
import { ThemeInit } from '@/components/layout/theme-init';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'EcoOS Core — Enterprise Environmental Intelligence',
  description:
    'AI-powered waste triage, prediction, and analytics for institutional food service operations. Reduce waste, cut costs, and minimize environmental impact.',
  keywords: [
    'food waste',
    'sustainability',
    'AI',
    'environmental intelligence',
    'waste reduction',
    'enterprise',
  ],
  authors: [{ name: 'EcoOS Core Team' }],
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'EcoOS Core — Enterprise Environmental Intelligence',
    description: 'AI-powered waste triage and analytics platform',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <ThemeInit />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

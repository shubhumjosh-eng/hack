import type { Metadata } from 'next';
import './globals.css';
import { DashboardShell } from '@/components/layout/dashboard-shell';

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
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}

'use client';

import { AuthProvider } from '@/components/layout/auth-provider';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

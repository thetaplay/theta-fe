'use client'

import { useRouter } from 'next/navigation'
import { sdk } from '@farcaster/miniapp-sdk';
import { useEffect } from 'react';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    sdk.actions.ready();
    router.push('/home');
  }, [router]);

  return null;
}

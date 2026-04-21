'use client';

import { useEffect, useRef } from 'react';
import { useUserStore, UserInfo } from '@/store/useUserStore';

export function StoreInitializer({ user }: { user: UserInfo | null }) {
  const isInitialized = useRef(false);
  
  // We initialize the store immediately during the first render if we have user data,
  // to avoid flash of unauthenticated state. We do this only on the client.
  if (typeof window !== 'undefined' && !isInitialized.current && user) {
    useUserStore.getState().setUser(user);
    isInitialized.current = true;
  }

  useEffect(() => {
    if (user) {
      useUserStore.getState().setUser(user);
    } else {
      useUserStore.getState().clearUser();
    }
  }, [user]);

  return null;
}

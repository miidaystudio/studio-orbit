'use client';

import { useState, useEffect } from 'react';

export interface UserSession {
  name: string;
  email: string;
  role: string;
  initials: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCookie = (name: string) => {
      if (typeof document === 'undefined') return undefined;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return undefined;
    };

    const sessionCookie = getCookie('studio_session') || getCookie('studio_token');

    if (sessionCookie) {
      setUser({
        name: 'Alex Rivera',
        email: 'alex@orbitstudio.design',
        role: 'STUDIO_ADMIN',
        initials: 'AR',
      });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const logout = () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'studio_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'studio_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    setUser(null);
  };

  return { user, loading, logout };
}

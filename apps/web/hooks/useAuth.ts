'use client';

import { useState, useEffect } from 'react';

export interface UserSession {
  name: string;
  email: string;
  role: 'STUDIO_ADMIN' | 'CLIENT';
  initials: string;
  portalToken?: string;
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
    const roleCookie = (getCookie('studio_role') as 'STUDIO_ADMIN' | 'CLIENT') || 'STUDIO_ADMIN';
    const emailCookie = getCookie('studio_user_email') || (roleCookie === 'STUDIO_ADMIN' ? 'alex@orbitstudio.design' : 'sarah@lumina.io');
    const nameCookie = getCookie('studio_user_name') || (roleCookie === 'STUDIO_ADMIN' ? 'Alex Rivera' : 'Sarah Chen');
    const portalTokenCookie = getCookie('studio_portal_token');

    if (sessionCookie) {
      const nameParts = nameCookie.trim().split(' ');
      const initials = nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : nameCookie.slice(0, 2).toUpperCase();

      setUser({
        name: nameCookie,
        email: emailCookie,
        role: roleCookie,
        initials,
        portalToken: portalTokenCookie,
      });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const logout = () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'studio_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'studio_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'studio_user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'studio_user_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'studio_portal_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'studio_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    setUser(null);
  };

  return { user, loading, logout };
}

import { cookies } from 'next/headers';

export interface UserSessionData {
  id: string;
  name: string;
  email: string;
  role: 'STUDIO_ADMIN' | 'CLIENT';
  portalToken?: string;
  avatarUrl?: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'STUDIO_ADMIN' | 'CLIENT';
    image?: string;
  };
}

/**
 * Read session data from cookies (Server-side)
 */
export async function getSession(): Promise<UserSessionData | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('studio_session')?.value;
  const role = (cookieStore.get('studio_role')?.value as 'STUDIO_ADMIN' | 'CLIENT') || 'STUDIO_ADMIN';
  const email = cookieStore.get('studio_user_email')?.value || 'alex@orbitstudio.design';
  const name = cookieStore.get('studio_user_name')?.value || (role === 'STUDIO_ADMIN' ? 'Alex Rivera' : 'Sarah Chen');

  if (!sessionToken) return null;

  const userId = `usr_${sessionToken.slice(0, 8)}`;
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;

  return {
    id: userId,
    name,
    email,
    role,
    avatarUrl,
    user: {
      id: userId,
      name,
      email,
      role,
      image: avatarUrl,
    },
  };
}

/**
 * Server Action: Set Auth Cookies (Google OAuth / Passwordless Magic Link)
 */
export async function setAuthSessionAction(data: {
  email: string;
  name: string;
  role: 'STUDIO_ADMIN' | 'CLIENT';
  portalToken?: string;
}) {
  const cookieStore = await cookies();
  const token = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  cookieStore.set('studio_session', token, {
    path: '/',
    maxAge: 86400 * 7,
    httpOnly: false,
  });
  cookieStore.set('studio_role', data.role, {
    path: '/',
    maxAge: 86400 * 7,
    httpOnly: false,
  });
  cookieStore.set('studio_user_email', data.email, {
    path: '/',
    maxAge: 86400 * 7,
    httpOnly: false,
  });
  cookieStore.set('studio_user_name', data.name, {
    path: '/',
    maxAge: 86400 * 7,
    httpOnly: false,
  });

  if (data.portalToken) {
    cookieStore.set('studio_portal_token', data.portalToken, {
      path: '/',
      maxAge: 86400 * 7,
      httpOnly: false,
    });
  }

  return { success: true, token };
}

/**
 * Server Action: Logout / Clear Session
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('studio_session');
  cookieStore.delete('studio_role');
  cookieStore.delete('studio_user_email');
  cookieStore.delete('studio_user_name');
  cookieStore.delete('studio_portal_token');
  return { success: true };
}

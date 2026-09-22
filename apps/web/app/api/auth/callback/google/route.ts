import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const clientId =
    process.env.AUTH_GOOGLE_ID ||
    process.env.GOOGLE_CLIENT_ID ||
    '';

  const clientSecret =
    process.env.AUTH_GOOGLE_SECRET ||
    process.env.GOOGLE_CLIENT_SECRET ||
    '';

  const redirectUri = `${baseUrl}/api/auth/callback/google`;

  if (error || !code) {
    return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url));
  }

  try {
    // 1. Exchange authorization code for access token with Google
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Google Token Exchange Error:', tokenData);
      return NextResponse.redirect(new URL('/login?error=token_exchange_failed', request.url));
    }

    // 2. Fetch authenticated user's Gmail profile from Google
    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await userinfoResponse.json();
    const userEmail = profile.email || 'user@gmail.com';
    const userName = profile.name || 'Google User';

    // 3. Set Session Cookies
    const cookieStore = await cookies();
    const sessionToken = `google_sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    cookieStore.set('studio_session', sessionToken, { path: '/', maxAge: 86400 * 7 });
    cookieStore.set('studio_role', 'STUDIO_ADMIN', { path: '/', maxAge: 86400 * 7 });
    cookieStore.set('studio_user_email', userEmail, { path: '/', maxAge: 86400 * 7 });
    cookieStore.set('studio_user_name', userName, { path: '/', maxAge: 86400 * 7 });

    return NextResponse.redirect(new URL('/projects', request.url));
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}

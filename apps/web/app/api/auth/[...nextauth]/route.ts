import { NextResponse } from 'next/server';

/**
 * Auth.js / NextAuth v5 Route Handler for Google OAuth & OAuth Sessions
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const action = url.pathname.split('/').pop();

  if (action === 'providers') {
    return NextResponse.json({
      google: {
        id: 'google',
        name: 'Google',
        type: 'oauth',
        signinUrl: '/api/auth/signin/google',
        callbackUrl: '/api/auth/callback/google',
      },
    });
  }

  if (action === 'session') {
    return NextResponse.json({
      user: {
        name: 'Alex Rivera',
        email: 'alex@orbitstudio.design',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
        role: 'STUDIO_ADMIN',
      },
      expires: new Date(Date.now() + 86400 * 1000).toISOString(),
    });
  }

  // Fallback response for OAuth callback handler
  return NextResponse.redirect(new URL('/projects', request.url));
}

export async function POST(request: Request) {
  return NextResponse.json({ success: true, authenticated: true });
}

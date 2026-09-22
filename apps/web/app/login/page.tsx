'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('alex@orbitstudio.design');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'missing_google_credentials') {
      setErrorMessage('Google OAuth credentials not configured yet. Add AUTH_GOOGLE_ID & AUTH_GOOGLE_SECRET to your .env.local file.');
    } else if (error === 'oauth_failed') {
      setErrorMessage('Google OAuth authentication failed. Please try again.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      document.cookie = `studio_session=session_admin_${Date.now()}; path=/; max-age=86400`;
      document.cookie = `studio_role=STUDIO_ADMIN; path=/; max-age=86400`;
      document.cookie = `studio_user_email=${email}; path=/; max-age=86400`;
      document.cookie = `studio_user_name=Alex Rivera; path=/; max-age=86400`;
      document.cookie = `studio_token=session_admin_${Date.now()}; path=/; max-age=86400`;
      
      const destination = searchParams.get('from') || '/projects';
      
      router.push(destination);
      router.refresh();
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#141413] flex flex-col justify-center items-center px-6 selection:bg-[#E85D3F] selection:text-white font-sans">
      <div className="w-full max-w-md bg-white border border-[#141413]/10 rounded-[32px] p-8 sm:p-10 shadow-[0_20px_40px_-15px_rgba(20,20,19,0.06)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#14141308_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="space-y-3 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F4EE] border border-[#141413]/10 flex items-center justify-center p-1.5 shadow-sm">
              <img
                src="/favicon.jpg"
                alt="StudioOrbit Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5C5B57] px-3 py-1 bg-[#F7F4EE] rounded-full border border-[#141413]/10">
              Studio Admin Cockpit
            </span>
            <h1 className="text-4xl font-serif text-[#141413] pt-1">
              Sign in to <span className="italic font-light">StudioOrbit</span>.
            </h1>
            <p className="text-xs text-[#5C5B57] font-sans">
              Authenticate your agency owner session to manage projects and retainers.
            </p>
          </div>

          {errorMessage && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 space-y-1 animate-in fade-in duration-200">
              <span className="font-bold">⚠️ Configuration Notice</span>
              <p className="text-[11px] leading-relaxed">{errorMessage}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3.5 px-4 bg-white border border-[#141413]/15 hover:border-[#141413] text-[#141413] rounded-2xl text-xs font-semibold flex items-center justify-center gap-3 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google Workspace</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#141413]/10" />
            <span className="flex-shrink mx-4 text-[10px] font-mono text-[#5C5B57] uppercase tracking-wider">or email access</span>
            <div className="flex-grow border-t border-[#141413]/10" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5C5B57] mb-1.5">
                Studio Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="founder@agency.design"
                className="w-full bg-[#F7F4EE] border border-[#141413]/15 rounded-2xl px-4 py-3 text-xs font-mono text-[#141413] focus:outline-none focus:border-[#141413] focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#141413] text-[#F7F4EE] hover:bg-[#E85D3F] rounded-2xl text-xs font-mono uppercase tracking-wider transition-all duration-200 shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Enter Studio Cockpit →'}
            </button>
          </form>

          <div className="pt-4 border-t border-[#141413]/10 text-center">
            <p className="text-[11px] font-mono text-[#5C5B57]">
              Are you a client? Access your private project with your{' '}
              <a href="/portal/invite" className="text-[#E85D3F] font-semibold hover:underline">
                Magic Link Invite
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

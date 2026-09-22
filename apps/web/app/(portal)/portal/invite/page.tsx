'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ClientInviteOnboardingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token') || 'lumina-portal-token-9988';
  
  const invitedEmail = token.includes('aether')
    ? 'marcus@aether.design'
    : token.includes('kinesis')
    ? 'elena@kinesis.io'
    : 'sarah@lumina.io';

  const clientName = token.includes('aether')
    ? 'Aether Labs'
    : token.includes('kinesis')
    ? 'Kinesis Co'
    : 'Lumina Tech';

  const projectTitle = token.includes('aether')
    ? 'Aether Mobile App Redesign'
    : token.includes('kinesis')
    ? 'Kinesis E-Commerce System'
    : 'Lumina Brand & Portal System';

  const [inputEmail, setInputEmail] = useState(invitedEmail);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuthenticate = async (authType: 'google' | 'email') => {
    setLoading(true);
    setError(null);

    if (authType === 'google') {
      window.location.href = '/api/auth/google';
      return;
    }

    // Verify email matches invited profile
    if (inputEmail.trim().toLowerCase() !== invitedEmail.toLowerCase()) {
      setError(`This invite link was issued for ${invitedEmail}. Please authenticate with the invited email address.`);
      setLoading(false);
      return;
    }

    // Set client cookies for portal session
    document.cookie = `studio_session=client_sess_${Date.now()}; path=/; max-age=604800`;
    document.cookie = `studio_role=CLIENT; path=/; max-age=604800`;
    document.cookie = `studio_user_email=${inputEmail}; path=/; max-age=604800`;
    document.cookie = `studio_user_name=${clientName} Contact; path=/; max-age=604800`;
    document.cookie = `studio_portal_token=${token}; path=/; max-age=604800`;

    router.push(`/portal/${token}`);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121212] flex flex-col justify-center items-center px-6 selection:bg-[#C85A32] selection:text-white font-sans">
      <div className="w-full max-w-lg bg-white border border-[#E5E2DA] rounded-3xl p-8 sm:p-10 shadow-[0_20px_40px_-15px_rgba(18,18,18,0.06)] relative overflow-hidden space-y-6">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C85A32]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E5E2DA] text-[10px] font-mono uppercase tracking-widest text-[#C85A32]">
            <span className="w-2 h-2 rounded-full bg-[#C85A32] animate-pulse" />
            PRIVATE CLIENT INVITE
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#121212]">
            Welcome to <span className="italic font-normal text-[#C85A32]">{clientName}</span> Workspace.
          </h1>
          <p className="text-xs text-[#686661] max-w-md mx-auto">
            You have been invited by Orbit Studio to access <strong className="text-[#121212]">{projectTitle}</strong>.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-700 space-y-1 animate-in fade-in duration-200">
            <span className="font-bold">⚠️ Authentication Mismatch</span>
            <p className="text-[11px] leading-relaxed">{error}</p>
          </div>
        )}

        <div className="space-y-4 pt-2">
          <button
            type="button"
            onClick={() => handleAuthenticate('google')}
            disabled={loading}
            className="w-full py-3.5 px-4 bg-white border border-[#E5E2DA] hover:border-[#121212] text-[#121212] rounded-2xl text-xs font-semibold flex items-center justify-center gap-3 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
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
            <span>Continue with Google Account</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[#E5E2DA]" />
            <span className="flex-shrink mx-4 text-[10px] font-mono text-[#686661] uppercase tracking-wider">or verify email</span>
            <div className="flex-grow border-t border-[#E5E2DA]" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAuthenticate('email');
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#686661] mb-1.5">
                Invited Email Address
              </label>
              <input
                type="email"
                required
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="sarah@lumina.io"
                className="w-full bg-[#FAF8F5] border border-[#E5E2DA] rounded-2xl px-4 py-3 text-xs font-mono text-[#121212] focus:outline-none focus:border-[#C85A32] transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#121212] hover:bg-[#C85A32] text-white text-xs font-mono uppercase tracking-wider rounded-2xl transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Verifying Invite...' : 'Accept Invite & Enter Portal →'}
            </button>
          </form>
        </div>

        <div className="pt-4 border-t border-[#E5E2DA] text-center">
          <p className="text-[11px] font-mono text-[#686661]">
            Invite token: <code className="text-[#C85A32] font-semibold">{token}</code>
          </p>
        </div>
      </div>
    </div>
  );
}

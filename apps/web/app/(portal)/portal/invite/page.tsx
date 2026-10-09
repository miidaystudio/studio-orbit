'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, KeyRound, Lock } from 'lucide-react';

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
    <div className="min-h-screen bg-[#F9F9F9] text-[#111111] flex flex-col justify-center items-center px-6 selection:bg-[#346853] selection:text-white font-sans antialiased relative overflow-hidden">
      
      {/* Background Wire Line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1440 900" fill="none">
        <line x1="720" y1="0" x2="720" y2="280" stroke="#E5E7EB" strokeWidth="1" />
        <circle cx="720" cy="280" r="4" fill="#346853" />
      </svg>

      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-xl relative z-10 space-y-6">
        
        <div className="text-center space-y-3 flex flex-col items-center">
          <Link href="/" className="w-12 h-12 rounded-2xl bg-[#346853] flex items-center justify-center text-white shadow-xs hover:scale-105 transition">
            <div className="w-5 h-5 rounded-sm bg-white/20 border border-white/60" />
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#346853] border border-emerald-200 text-xs font-mono font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#346853]" />
            <span>Private Client Portal</span>
          </div>

          <h1 className="text-3xl font-extrabold font-heading text-[#111111] tracking-tight uppercase pt-1">
            Welcome to <span className="text-[#346853]">{clientName}</span>
          </h1>
          <p className="text-xs text-gray-500 max-w-md font-medium">
            You have been granted token-level review access to <strong className="text-[#111111]">{projectTitle}</strong>.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-700 space-y-1 animate-in fade-in duration-200">
            <span className="font-bold">⚠️ Authentication Notice</span>
            <p className="text-[11px] leading-relaxed">{error}</p>
          </div>
        )}

        <div className="space-y-4 pt-1">
          <button
            type="button"
            onClick={() => handleAuthenticate('google')}
            disabled={loading}
            className="w-full py-3.5 px-4 bg-white border border-gray-300 hover:border-[#111111] text-[#111111] rounded-2xl text-xs font-bold flex items-center justify-center gap-3 transition shadow-xs active:scale-[0.98] disabled:opacity-50"
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
            <span>Verify with Google Workspace</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[10px] font-mono uppercase text-gray-400 font-bold relative z-10">
              or enter via email token
            </span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Invited Recipient Email</label>
              <input
                type="email"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="your@company.com"
                className="w-full px-4 py-3 bg-[#F9F9F9] border border-gray-200 rounded-2xl text-xs font-mono font-medium focus:bg-white focus:border-[#346853] focus:outline-none transition"
              />
            </div>

            <button
              type="button"
              onClick={() => handleAuthenticate('email')}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#111111] hover:bg-[#346853] text-white rounded-2xl text-xs font-bold tracking-wide uppercase transition shadow-md flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <span>Unlocking Staging Workspace...</span>
              ) : (
                <>
                  <span>Access Review Sandbox</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#346853]" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
          <span>Token: {token.slice(0, 18)}...</span>
          <span>Encrypted (TLS 1.3)</span>
        </div>

      </div>
    </div>
  );
}

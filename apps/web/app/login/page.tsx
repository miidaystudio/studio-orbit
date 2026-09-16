'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('alex@orbitstudio.design');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Set valid session cookies for middleware & useAuth hook
      document.cookie = `studio_session=session_${Date.now()}; path=/; max-age=86400`;
      document.cookie = `studio_token=session_${Date.now()}; path=/; max-age=86400`;
      
      // Redirect to target destination or projects cockpit
      const searchParams = new URLSearchParams(window.location.search);
      const destination = searchParams.get('from') || '/projects';
      
      router.push(destination);
      router.refresh();
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#141413] flex flex-col justify-center items-center px-6 selection:bg-[#E85D3F] selection:text-white font-sans">
      <div className="w-full max-w-md bg-white border border-[#141413]/10 rounded-[32px] p-8 sm:p-10 shadow-[0_20px_40px_-15px_rgba(20,20,19,0.06)] relative overflow-hidden">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#14141308_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="space-y-2 text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5C5B57] px-3 py-1 bg-[#F7F4EE] rounded-full border border-[#141413]/10">
              Studio Access
            </span>
            <h1 className="text-4xl font-serif text-[#141413] pt-2">
              Sign in to <span className="italic font-light">StudioOrbit</span>.
            </h1>
            <p className="text-xs text-[#5C5B57] font-sans">
              Enter your studio email to authenticate your dashboard session.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
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
              <span className="text-[#E85D3F] font-medium">Magic Link</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

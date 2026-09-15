'use client';

import React, { useState } from 'react';

export default function MagicLinkLoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] px-4">
      <div className="max-w-md w-full bg-white border border-[#E9E2D3] rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C85A32]">Studio-Orbit</span>
          <h1 className="text-3xl font-serif font-semibold text-[#17140F] mt-2">Client Portal Access</h1>
          <p className="text-sm text-[#7B6E53] mt-2">
            Enter your email address to receive a passwordless magic link to your private workspace.
          </p>
        </div>

        {sent ? (
          <div className="bg-[#FAF8F5] border border-[#D8CDB6] p-4 rounded-xl text-center">
            <p className="text-sm font-medium text-[#17140F]">Magic Link Sent!</p>
            <p className="text-xs text-[#7B6E53] mt-1">
              We emailed a secure access token to <span className="font-semibold text-[#17140F]">{email}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#5E533E] mb-1">
                Work Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E9E2D3] text-[#17140F] focus:outline-none focus:border-[#C85A32] text-sm transition"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#17140F] hover:bg-[#2A241B] text-white text-sm font-medium rounded-xl transition shadow-sm"
            >
              Send Magic Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DeliverableItem, createDeliverableAction } from '@/app/actions/deliverables';
import DeliverableCard from '@/components/overview/DeliverableCard';
import Toast from '@/components/ui/Toast';
import { Plus, Search, Filter, Sparkles, Layers, Sliders, Activity, ShieldCheck, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface TelemetryMetrics {
  activeNodes: number;
  stagedVariants: number;
  motionProfiles: number;
  pendingHandoffs: number;
}

interface OverviewDeliverablesGridProps {
  initialDeliverables: DeliverableItem[];
  userName?: string;
  telemetry?: TelemetryMetrics;
}

type CreativeFilter = 'ALL' | 'OVERRIDES' | 'MOTION' | 'HANDOFF';

export default function OverviewDeliverablesGrid({
  initialDeliverables,
  userName = 'Alex Rivera',
  telemetry = {
    activeNodes: 2,
    stagedVariants: 2,
    motionProfiles: 1,
    pendingHandoffs: 1,
  },
}: OverviewDeliverablesGridProps) {
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>(initialDeliverables);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<CreativeFilter>('ALL');

  // Modal & Toast State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  let formattedName = userName;
  try {
    formattedName = decodeURIComponent(userName);
  } catch {
    formattedName = userName;
  }

  // Form State
  const [formState, setFormState] = useState({
    clientName: 'miidayStudio',
    name: '',
    tagline: '',
    badgeToken: '[DEV-SYSTEM-01]',
    stagingUrl: 'https://miidaystudio.online',
    allocatedHours: 40,
  });

  const handleCopyMagicLink = (token: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const url = `${origin}/review-sandbox?deliverableId=${token}`;
    navigator.clipboard.writeText(url);
    setToastMessage('✓ Client review workspace magic link copied!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('clientName', formState.clientName);
    formData.append('name', formState.name);
    formData.append('tagline', formState.tagline);
    formData.append('badgeToken', formState.badgeToken);
    formData.append('stagingUrl', formState.stagingUrl);
    formData.append('allocatedHours', formState.allocatedHours.toString());

    const result = await createDeliverableAction(formData);

    if (result.success && result.deliverable) {
      setDeliverables((prev) => [result.deliverable, ...prev]);
      setIsModalOpen(false);
      setToastMessage(`✓ Deliverable "${formState.name}" created successfully!`);
      setTimeout(() => setToastMessage(null), 3000);
      setFormState({
        clientName: 'miidayStudio',
        name: '',
        tagline: '',
        badgeToken: '[DEV-SYSTEM-01]',
        stagingUrl: 'https://miidaystudio.online',
        allocatedHours: 40,
      });
    }

    setIsSubmitting(false);
  };

  // Filter & Search Logic
  const filteredDeliverables = deliverables.filter((item) => {
    const matchesFilter =
      activeFilter === 'ALL' ||
      (activeFilter === 'OVERRIDES' && item.status !== 'COMPLETED') ||
      (activeFilter === 'MOTION' && item.status === 'IN_REVIEW') ||
      (activeFilter === 'HANDOFF' && item.status === 'COMPLETED');

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badgeToken.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-5 py-3 rounded-2xl text-xs font-mono font-bold shadow-xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#346853]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Dashboard Banner & Studio Principal Welcome */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#346853] border border-emerald-200 text-xs font-mono font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#346853] animate-pulse" />
            <span>Studio Master Cockpit</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] font-heading uppercase">
            Welcome back, <span className="text-[#346853]">{formattedName}</span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 max-w-xl font-medium">
            Manage your staging pipelines, coordinate visual QA overrides, review sprint burndown hours, and dispatch client review portals.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 bg-[#111111] hover:bg-[#346853] text-white rounded-2xl text-xs font-bold transition shadow-sm flex items-center gap-2 active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-[#346853]" />
            <span>New Deliverable</span>
          </button>
        </div>
      </div>

      {/* 2. Telemetry Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Staging Nodes', count: telemetry.activeNodes, icon: '🟢', sub: 'TLS 1.3 Verified' },
          { label: 'Staged Visual Variants', count: telemetry.stagedVariants, icon: '🎨', sub: 'DOM Mutator Active' },
          { label: 'Kinetic Motion Curves', count: telemetry.motionProfiles, icon: '∿', sub: 'CSS / GSAP Telemetry' },
          { label: 'Pending Client Sign-Offs', count: telemetry.pendingHandoffs, icon: '🔐', sub: 'Cryptographic Check' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500 font-mono font-bold">
              <span>{stat.label}</span>
              <span>{stat.icon}</span>
            </div>
            <div className="text-3xl font-extrabold font-heading text-[#111111]">
              {stat.count}
            </div>
            <div className="text-[10px] font-mono text-gray-400 font-semibold">
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Search & Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deliverables, clients, tags..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-[#346853] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded-2xl shadow-xs w-full sm:w-auto overflow-x-auto">
          {(['ALL', 'OVERRIDES', 'MOTION', 'HANDOFF'] as CreativeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono uppercase font-bold transition ${
                activeFilter === filter
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-gray-500 hover:text-[#111111] hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Deliverables Grid */}
      {filteredDeliverables.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeliverables.map((item, idx) => (
            <DeliverableCard
              key={item.id}
              item={item}
              isFeatured={idx === 0}
              onCopyMagicLink={handleCopyMagicLink}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-2xl">
            📦
          </div>
          <h3 className="text-lg font-bold text-[#111111] font-heading">
            No Deliverables Found
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchQuery ? `No matching deliverables for "${searchQuery}".` : 'Get started by creating your first client staging deliverable.'}
          </p>
        </div>
      )}

      {/* 5. Create Deliverable Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#346853] font-bold">
                NEW STAGING INSTANCE
              </span>
              <h3 className="text-2xl font-bold uppercase tracking-tight text-[#111111] font-heading">
                Create Staging Deliverable
              </h3>
            </div>

            <form onSubmit={handleCreateDeliverable} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Client Name</label>
                <input
                  type="text"
                  value={formState.clientName}
                  onChange={(e) => setFormState({ ...formState, clientName: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-[#346853] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Deliverable Title</label>
                <input
                  type="text"
                  placeholder="e.g. Lumina Kinetic Brand Overhaul"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-[#346853] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Description / Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Atomic design system & responsive viewports"
                  value={formState.tagline}
                  onChange={(e) => setFormState({ ...formState, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-[#346853] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Live Staging Target URL</label>
                <input
                  type="url"
                  value={formState.stagingUrl}
                  onChange={(e) => setFormState({ ...formState, stagingUrl: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-gray-200 rounded-xl text-xs font-mono focus:bg-white focus:border-[#346853] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Sprint Allocated Hours</label>
                  <input
                    type="number"
                    value={formState.allocatedHours}
                    onChange={(e) => setFormState({ ...formState, allocatedHours: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-gray-200 rounded-xl text-xs font-mono focus:bg-white focus:border-[#346853] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Badge Token</label>
                  <input
                    type="text"
                    value={formState.badgeToken}
                    onChange={(e) => setFormState({ ...formState, badgeToken: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-gray-200 rounded-xl text-xs font-mono focus:bg-white focus:border-[#346853] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-500 hover:text-[#111111]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#346853] hover:bg-[#2A5443] text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Instance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

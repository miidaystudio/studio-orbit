import React from 'react';
import Link from 'next/link';
import { db, deliverables, companies } from '@studio-orbit/db';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { getQaPinsAction } from '@/app/actions/deliverables';
import ReviewSandboxClient from '@/components/staging/ReviewSandboxClient';

interface PageProps {
  searchParams: Promise<{ deliverableId?: string; tab?: string }>;
}

export default async function ReviewSandboxPage({ searchParams }: PageProps) {
  const { deliverableId, tab } = await searchParams;
  const session = await getSession();
  const userId = session?.user?.id || session?.id;

  let activeDeliverable: any = null;

  // 1. Fetch by deliverableId search param
  if (deliverableId) {
    try {
      activeDeliverable = await db.query.deliverables.findFirst({
        where: eq(deliverables.id, deliverableId),
        with: { company: true },
      });
    } catch (err) {
      console.warn('Error querying deliverable by deliverableId:', err);
    }
  }

  // 2. Fallback to user's company deliverables if no deliverableId provided
  if (!activeDeliverable && userId) {
    try {
      const userCompany = await db.query.companies.findFirst({
        where: eq(companies.userId, userId),
        with: { deliverables: true },
      });

      if (userCompany && userCompany.deliverables && userCompany.deliverables.length > 0) {
        const sorted = [...userCompany.deliverables].sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        const targetId = sorted[0].id;
        activeDeliverable = await db.query.deliverables.findFirst({
          where: eq(deliverables.id, targetId),
          with: { company: true },
        });
      }
    } catch (err) {
      console.warn('Error querying user company deliverables:', err);
    }
  }

  // 3. Fallback to latest deliverable in PostgreSQL
  if (!activeDeliverable) {
    try {
      activeDeliverable = await db.query.deliverables.findFirst({
        orderBy: [desc(deliverables.createdAt)],
        with: { company: true },
      });
    } catch (err) {
      console.warn('Error querying fallback latest deliverable:', err);
    }
  }

  if (!activeDeliverable) {
    return (
      <div className="min-h-screen bg-[#7D8F9A] dark:bg-[#1B2731] flex flex-col justify-center items-center p-8 text-center space-y-4 text-[#F5F7F8]">
        <div className="w-12 h-12 rounded-2xl bg-[#16202A] border border-white/20 text-[#84CC16] flex items-center justify-center text-xl font-mono shadow-sm">
          🖥️
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#F5F7F8]">No Deliverables in Review Sandbox</h2>
        <p className="text-xs text-[#B4BFC5] max-w-md">
          There are currently no active deliverable records in your PostgreSQL database. Run the setup wizard to create your first project.
        </p>
        <Link
          href="/onboarding"
          className="px-6 py-2.5 rounded-full bg-[#16202A] hover:bg-[#1F2D38] border border-white/20 text-[#F5F7F8] text-xs font-mono uppercase tracking-wider transition shadow-sm"
        >
          Launch Onboarding Wizard →
        </Link>
      </div>
    );
  }

  // Fetch real QA pins for active deliverable
  const initialPins = await getQaPinsAction(activeDeliverable.id);

  const formattedDeliverable = {
    id: activeDeliverable.id,
    title: activeDeliverable.title,
    systemTag: activeDeliverable.systemTag,
    description: activeDeliverable.description,
    stagingUrl: activeDeliverable.stagingUrl,
    companyName: activeDeliverable.company?.name || 'Lumina Tech',
  };

  return (
    <ReviewSandboxClient
      deliverable={formattedDeliverable}
      initialPins={initialPins}
      initialTab={tab}
    />
  );
}

import { db, projects, canvasPins, pinComments, milestones, invoices } from './index';

async function seed() {
  console.log('🌱 Seeding StudioOrbit database via Drizzle ORM...');

  try {
    // Seed Project 1: Lumina Tech
    await db.insert(projects).values({
      id: 'proj-1',
      name: 'Lumina Brand Identity & Portal System',
      clientName: 'Lumina Tech',
      clientEmail: 'sarah@lumina.io',
      clientToken: 'lumina-portal-token-9988',
      stagingUrl: 'https://staging.lumina.design',
      status: 'ACTIVE',
      budgetInCents: 3500000,
      spentInCents: 1850000,
      targetEndDate: new Date('2026-10-31'),
    }).onConflictDoNothing();

    // Seed Pins for Lumina
    await db.insert(canvasPins).values({
      id: 'pin-1',
      projectId: 'proj-1',
      xPercent: 35.4,
      yPercent: 28.2,
      deviceViewport: 'desktop_1440',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      title: 'Hero Typography Alignment',
      status: 'OPEN',
    }).onConflictDoNothing();

    await db.insert(pinComments).values({
      id: 'c-1',
      pinId: 'pin-1',
      authorName: 'Sarah Chen',
      authorRole: 'CLIENT',
      content: 'Can we try a warmer serif display tone here instead of standard sans?',
    }).onConflictDoNothing();

    // Seed Milestones for Lumina
    await db.insert(milestones).values([
      {
        id: 'm-1',
        projectId: 'proj-1',
        title: 'Sprint 1: Brand Strategy & Moodboard',
        description: 'Visual positioning, color tokens, and editorial serif selection.',
        dueDate: new Date('2026-08-15'),
        status: 'APPROVED',
        signedBy: 'Sarah Chen',
        signedAt: new Date('2026-08-14'),
      },
      {
        id: 'm-2',
        projectId: 'proj-1',
        title: 'Sprint 2: Web App Visual System & Review Canvas',
        description: 'Interactive staging review canvas & responsive UI component kit.',
        dueDate: new Date('2026-09-30'),
        status: 'PENDING_APPROVAL',
      },
    ]).onConflictDoNothing();

    // Seed Invoices for Lumina
    await db.insert(invoices).values([
      {
        id: 'inv-1',
        invoiceNum: 'INV-2026-001',
        projectId: 'proj-1',
        amountInCents: 1250000,
        status: 'PAID',
        dueDate: new Date('2026-09-15'),
        stripeUrl: 'https://checkout.stripe.com/pay/inv_001',
      },
      {
        id: 'inv-2',
        invoiceNum: 'INV-2026-002',
        projectId: 'proj-1',
        amountInCents: 800000,
        status: 'ISSUED',
        dueDate: new Date('2026-09-25'),
        stripeUrl: 'https://checkout.stripe.com/pay/inv_002',
      },
    ]).onConflictDoNothing();

    console.log('✅ Drizzle seed finished successfully!');
  } catch (err) {
    console.error('❌ Drizzle seed failed:', err);
  }
}

seed();

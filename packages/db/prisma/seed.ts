import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding StudioOrbit database...');

  // Create Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'orbit-studio' },
    update: {},
    create: {
      name: 'Orbit Studio',
      slug: 'orbit-studio',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    },
  });

  // Create Studio Admin
  const admin = await prisma.user.upsert({
    where: { email: 'alex@orbitstudio.design' },
    update: {},
    create: {
      email: 'alex@orbitstudio.design',
      name: 'Alex Rivera',
      role: 'STUDIO_ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      organizationId: org.id,
    },
  });

  // Create Client User
  const clientUser = await prisma.user.upsert({
    where: { email: 'sarah@lumina.io' },
    update: {},
    create: {
      email: 'sarah@lumina.io',
      name: 'Sarah Chen',
      role: 'CLIENT',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  });

  // Create Project 1: Lumina Tech
  const projectLumina = await prisma.project.upsert({
    where: { clientToken: 'lumina-portal-token-9988' },
    update: {},
    create: {
      name: 'Lumina Brand Identity & Portal System',
      clientName: 'Lumina Tech',
      clientEmail: 'sarah@lumina.io',
      clientToken: 'lumina-portal-token-9988',
      status: 'ACTIVE',
      budgetInCents: 3500000,
      spentInCents: 1850000,
      organizationId: org.id,
      startDate: new Date('2026-08-01'),
      targetEndDate: new Date('2026-10-31'),
    },
  });

  // Create Milestones for Lumina
  await prisma.milestone.createMany({
    data: [
      {
        projectId: projectLumina.id,
        title: 'Sprint 1: Brand Strategy & Moodboard',
        description: 'Visual positioning, color tokens, and editorial serif selection.',
        dueDate: new Date('2026-08-15'),
        status: 'APPROVED',
        signedBy: 'Sarah Chen',
        signedAt: new Date('2026-08-14'),
      },
      {
        projectId: projectLumina.id,
        title: 'Sprint 2: Web App Visual System',
        description: 'Interactive review canvas & responsive UI component kit.',
        dueDate: new Date('2026-09-30'),
        status: 'IN_PROGRESS',
      },
      {
        projectId: projectLumina.id,
        title: 'Sprint 3: Component Library Hand-off',
        description: 'Production React components and S3 asset pipeline.',
        dueDate: new Date('2026-10-31'),
        status: 'UPCOMING',
      },
    ],
  });

  // Create Asset for Lumina
  const assetLumina = await prisma.asset.create({
    data: {
      projectId: projectLumina.id,
      title: 'Lumina Hero Dashboard Layout',
      versionNumber: 2,
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      width: 1920,
      height: 1080,
    },
  });

  // Create Canvas Pins
  const pin1 = await prisma.canvasPin.create({
    data: {
      assetId: assetLumina.id,
      xPercent: 35.4,
      yPercent: 28.2,
      title: 'Hero Title Typography',
      status: 'OPEN',
      comments: {
        create: [
          {
            authorId: clientUser.id,
            content: 'Can we try a warmer serif tone here instead of standard sans?',
          },
          {
            authorId: admin.id,
            content: 'Switching to Playfair Display / Instrument Serif now.',
          },
        ],
      },
    },
  });

  const pin2 = await prisma.canvasPin.create({
    data: {
      assetId: assetLumina.id,
      xPercent: 62.1,
      yPercent: 55.8,
      title: 'CTA Contrast & Terracotta Accent',
      status: 'RESOLVED',
      comments: {
        create: [
          {
            authorId: admin.id,
            content: 'Updated button hover to Terracotta #C85A32.',
          },
        ],
      },
    },
  });

  // Create Retainer for Lumina
  await prisma.retainer.create({
    data: {
      projectId: projectLumina.id,
      totalHours: 40,
      usedHours: 24,
      hourlyRate: 17500, // $175/hr
      cycleStart: new Date('2026-09-01'),
      cycleEnd: new Date('2026-09-30'),
    },
  });

  // Create Invoices for Lumina
  await prisma.invoice.createMany({
    data: [
      {
        invoiceNum: 'INV-2026-001',
        projectId: projectLumina.id,
        amountInCents: 1250000,
        status: 'PAID',
        issueDate: new Date('2026-09-01'),
        dueDate: new Date('2026-09-15'),
        stripeId: 'ch_mock_stripe_001',
      },
      {
        invoiceNum: 'INV-2026-002',
        projectId: projectLumina.id,
        amountInCents: 800000,
        status: 'ISSUED',
        issueDate: new Date('2026-09-10'),
        dueDate: new Date('2026-09-25'),
      },
    ],
  });

  // Create Project 2: Aether Labs
  const projectAether = await prisma.project.upsert({
    where: { clientToken: 'aether-portal-token-1122' },
    update: {},
    create: {
      name: 'Aether Mobile App Redesign',
      clientName: 'Aether Labs',
      clientEmail: 'marcus@aether.design',
      clientToken: 'aether-portal-token-1122',
      status: 'IN_REVIEW',
      budgetInCents: 5000000,
      spentInCents: 4200000,
      organizationId: org.id,
      startDate: new Date('2026-07-15'),
      targetEndDate: new Date('2026-10-15'),
    },
  });

  // Create Project 3: Kinesis Co
  const projectKinesis = await prisma.project.upsert({
    where: { clientToken: 'kinesis-portal-token-3344' },
    update: {},
    create: {
      name: 'Kinesis E-Commerce System',
      clientName: 'Kinesis Co',
      clientEmail: 'elena@kinesis.io',
      clientToken: 'kinesis-portal-token-3344',
      status: 'COMPLETED',
      budgetInCents: 2800000,
      spentInCents: 2800000,
      organizationId: org.id,
      startDate: new Date('2026-05-01'),
      targetEndDate: new Date('2026-08-31'),
    },
  });

  console.log(`✅ Seeding complete: Org "${org.name}", Projects: "${projectLumina.name}", "${projectAether.name}", "${projectKinesis.name}".`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

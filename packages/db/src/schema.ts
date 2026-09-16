import { pgTable, text, timestamp, integer, doublePrecision, varchar } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  clientName: text('client_name').notNull(),
  clientEmail: text('client_email').notNull(),
  clientToken: text('client_token').notNull().unique(),
  stagingUrl: text('staging_url').default('https://staging.lumina.design'),
  status: varchar('status', { length: 32 }).default('ACTIVE'),
  budgetInCents: integer('budget_in_cents').default(0),
  spentInCents: integer('spent_in_cents').default(0),
  startDate: timestamp('start_date').defaultNow(),
  targetEndDate: timestamp('target_end_date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const canvasPins = pgTable('canvas_pins', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  xPercent: doublePrecision('x_percent').notNull(),
  yPercent: doublePrecision('y_percent').notNull(),
  deviceViewport: varchar('device_viewport', { length: 32 }).default('desktop_1440'),
  userAgent: text('user_agent'),
  title: text('title').notNull(),
  status: varchar('status', { length: 32 }).default('OPEN'), // 'OPEN' | 'RESOLVED'
  createdAt: timestamp('created_at').defaultNow(),
});

export const pinComments = pgTable('pin_comments', {
  id: text('id').primaryKey(),
  pinId: text('pin_id').references(() => canvasPins.id, { onDelete: 'cascade' }),
  authorName: text('author_name').notNull(),
  authorRole: varchar('author_role', { length: 32 }).default('CLIENT'), // 'CLIENT' | 'STUDIO_ADMIN'
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const milestones = pgTable('milestones', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  dueDate: timestamp('due_date').notNull(),
  status: varchar('status', { length: 32 }).default('UPCOMING'), // 'UPCOMING' | 'IN_PROGRESS' | 'PENDING_APPROVAL' | 'APPROVED'
  signedAt: timestamp('signed_at'),
  signedBy: text('signed_by'),
});

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  invoiceNum: text('invoice_num').notNull().unique(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  amountInCents: integer('amount_in_cents').notNull(),
  status: varchar('status', { length: 32 }).default('DRAFT'), // 'DRAFT' | 'ISSUED' | 'PAID'
  issueDate: timestamp('issue_date').defaultNow(),
  dueDate: timestamp('due_date').notNull(),
  stripeUrl: text('stripe_url'),
});

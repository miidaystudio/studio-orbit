import { pgTable, text, timestamp, integer, doublePrecision, varchar, jsonb, boolean, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// -------------------------------------------------------------
// Core Authentication & Onboarding Models
// -------------------------------------------------------------

export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  image: text('image'),
  onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const companies = pgTable('companies', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  website: text('website'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const deliverables = pgTable('deliverables', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').references(() => companies.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  systemTag: text('system_tag').default('[DEV-SYSTEM-01]').notNull(),
  description: text('description'),
  stagingUrl: text('staging_url').notNull(),
  allocatedHours: integer('allocated_hours').default(40).notNull(),
  consumedHours: integer('consumed_hours').default(0).notNull(),
  nextMilestone: text('next_milestone').default('Sprint Review 1').notNull(),
  status: text('status', { enum: ['ACTIVE', 'IN_REVIEW', 'COMPLETED'] }).default('ACTIVE').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const qaPins = pgTable('qa_pins', {
  id: uuid('id').defaultRandom().primaryKey(),
  deliverableId: uuid('deliverable_id').references(() => deliverables.id, { onDelete: 'cascade' }).notNull(),
  xPercent: doublePrecision('x_percent').notNull(),
  yPercent: doublePrecision('y_percent').notNull(),
  title: text('title').notNull(),
  comment: text('comment'),
  pinType: text('pin_type').default('BUG').notNull(),
  status: text('status').default('OPEN').notNull(),
  authorName: text('author_name').default('Reviewer'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const companyRelations = relations(companies, ({ one, many }) => ({
  user: one(users, { fields: [companies.userId], references: [users.id] }),
  deliverables: many(deliverables),
}));

export const deliverableRelations = relations(deliverables, ({ one, many }) => ({
  company: one(companies, { fields: [deliverables.companyId], references: [companies.id] }),
  qaPins: many(qaPins),
}));

export const qaPinRelations = relations(qaPins, ({ one }) => ({
  deliverable: one(deliverables, { fields: [qaPins.deliverableId], references: [deliverables.id] }),
}));

// -------------------------------------------------------------
// Executive Creative Engineering OS Models
// -------------------------------------------------------------

export const clients = pgTable('clients', {
  id: text('id').$defaultFn(() => crypto.randomUUID()).primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  portalToken: text('portal_token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: text('id').$defaultFn(() => crypto.randomUUID()).primaryKey(),
  clientId: text('client_id').references(() => clients.id, { onDelete: 'cascade' }),
  title: text('title'),
  name: text('name'),
  stagingUrl: text('staging_url').notNull(),
  clientName: text('client_name'),
  clientEmail: text('client_email'),
  clientToken: text('client_token'),
  status: varchar('status', { length: 32 }).default('ACTIVE'),
  budgetInCents: integer('budget_in_cents').default(0),
  spentInCents: integer('spent_in_cents').default(0),
  startDate: timestamp('start_date').defaultNow(),
  targetEndDate: timestamp('target_end_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const visualVariants = pgTable('visual_variants', {
  id: text('id').$defaultFn(() => crypto.randomUUID()).primaryKey(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  isActive: boolean('is_active').default(false).notNull(),
  mutations: jsonb('mutations').default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const motionPresets = pgTable('motion_presets', {
  id: text('id').$defaultFn(() => crypto.randomUUID()).primaryKey(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  selector: text('selector').notNull(),
  curveName: text('curve_name').notNull(),
  bezierPoints: jsonb('bezier_points').notNull(),
  durationMs: integer('duration_ms').default(800).notNull(),
  delayMs: integer('delay_ms').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const handoffVaults = pgTable('handoff_vaults', {
  id: text('id').$defaultFn(() => crypto.randomUUID()).primaryKey(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  extractedAssets: jsonb('extracted_assets').default([]).notNull(),
  envChecklist: jsonb('env_checklist').default([]).notNull(),
  isSignedOff: boolean('is_signed_off').default(false).notNull(),
  signOffDetails: jsonb('sign_off_details'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const clientRelations = relations(clients, ({ one, many }) => ({
  user: one(users, { fields: [clients.userId], references: [users.id] }),
  projects: many(projects),
}));

export const projectRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, { fields: [projects.clientId], references: [clients.id] }),
  visualVariants: many(visualVariants),
  motionPresets: many(motionPresets),
  handoffVaults: many(handoffVaults),
}));

export const visualVariantRelations = relations(visualVariants, ({ one }) => ({
  project: one(projects, { fields: [visualVariants.projectId], references: [projects.id] }),
}));

export const motionPresetRelations = relations(motionPresets, ({ one }) => ({
  project: one(projects, { fields: [motionPresets.projectId], references: [projects.id] }),
}));

export const handoffVaultRelations = relations(handoffVaults, ({ one }) => ({
  project: one(projects, { fields: [handoffVaults.projectId], references: [projects.id] }),
}));

export const canvasPins = pgTable('canvas_pins', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  xPercent: doublePrecision('x_percent').notNull(),
  yPercent: doublePrecision('y_percent').notNull(),
  deviceViewport: varchar('device_viewport', { length: 32 }).default('desktop_1440'),
  userAgent: text('user_agent'),
  title: text('title').notNull(),
  status: varchar('status', { length: 32 }).default('OPEN'),
  pinType: varchar('pin_type', { length: 32 }).default('BUG'),
  billableHours: doublePrecision('billable_hours'),
  estimatedCostCents: integer('estimated_cost_cents'),
  clientApprovalStatus: varchar('client_approval_status', { length: 32 }).default('NOT_APPLICABLE'),
  originalText: text('original_text'),
  updatedText: text('updated_text'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const pinComments = pgTable('pin_comments', {
  id: text('id').primaryKey(),
  pinId: text('pin_id').references(() => canvasPins.id, { onDelete: 'cascade' }),
  authorName: text('author_name').notNull(),
  authorRole: varchar('author_role', { length: 32 }).default('CLIENT'),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const milestones = pgTable('milestones', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  dueDate: timestamp('due_date').notNull(),
  status: varchar('status', { length: 32 }).default('UPCOMING'),
  signedAt: timestamp('signed_at'),
  signedBy: text('signed_by'),
});

export const milestoneSignoffs = pgTable('milestone_signoffs', {
  id: text('id').primaryKey(),
  milestoneId: text('milestone_id').references(() => milestones.id, { onDelete: 'cascade' }),
  clientEmail: text('client_email').notNull(),
  clientIp: text('client_ip').notNull(),
  commitHashOrUrl: text('commit_hash_or_url'),
  signedAt: timestamp('signed_at').defaultNow(),
  signatureName: text('signature_name').notNull(),
  auditHash: text('audit_hash').notNull(),
  certificatePdfUrl: text('certificate_pdf_url'),
});

export const auditLedgerEvents = pgTable('audit_ledger_events', {
  id: text('id').primaryKey(),
  retainerId: text('retainer_id'),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  eventType: varchar('event_type', { length: 32 }).notNull(),
  description: text('description').notNull(),
  hoursDelta: doublePrecision('hours_delta').notNull(),
  amountInCents: integer('amount_in_cents'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  invoiceNum: text('invoice_num').notNull().unique(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  amountInCents: integer('amount_in_cents').notNull(),
  status: varchar('status', { length: 32 }).default('DRAFT'),
  issueDate: timestamp('issue_date').defaultNow(),
  dueDate: timestamp('due_date').notNull(),
  stripeUrl: text('stripe_url'),
});

export const sprintShowcases = pgTable('sprint_showcases', {
  id: text('id').primaryKey(),
  clientId: text('client_id').notNull(),
  title: text('title').notNull(),
  versionTag: varchar('version_tag', { length: 32 }).notNull(),
  stagingUrl: text('staging_url').notNull(),
  status: varchar('status', { length: 32 }).default('IN_REVIEW'),
  stops: jsonb('stops').notNull(),
  approvedAt: timestamp('approved_at'),
  approvalSignature: text('approval_signature'),
});

export const designTokenPresets = pgTable('design_token_presets', {
  id: text('id').primaryKey(),
  sprintId: text('sprint_id'),
  name: text('name').notNull(),
  tokens: jsonb('tokens').notNull(),
  createdByClient: boolean('created_by_client').default(false),
});

export const launchAudits = pgTable('launch_audits', {
  id: text('id').primaryKey(),
  stagingUrl: text('staging_url').notNull(),
  score: integer('score').notNull(),
  metaDetails: jsonb('meta_details').notNull(),
  assetIssues: jsonb('asset_issues').notNull(),
  scannedAt: timestamp('scanned_at').defaultNow(),
});

export const brandVaultRules = pgTable('brand_vault_rules', {
  id: text('id').primaryKey(),
  clientId: text('client_id').notNull(),
  approvedColors: jsonb('approved_colors').notNull(),
  approvedFonts: jsonb('approved_fonts').notNull(),
  minHealthScore: integer('min_health_score').default(85),
  lastAuditScore: integer('last_audit_score'),
});

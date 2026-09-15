# Studio-Orbit: Detailed Directory & File Breakdown

This document provides a comprehensive component-by-component breakdown of every directory and file in the **Studio-Orbit** monorepo, detailing its function, dependencies, and role in the system architecture.

---

## 1. Monorepo Root Files

| File | Purpose & Role |
| :--- | :--- |
| [`package.json`](file:///c:/Users/miiday_repo_work/studio-orbit/package.json) | Root workspace definition. Defines monorepo packages (`apps/*`, `packages/*`) and global scripts (`dev`, `build`, `lint`, `db:generate`, `db:push`, `db:seed`). |
| [`turbo.json`](file:///c:/Users/miiday_repo_work/studio-orbit/turbo.json) | Turborepo configuration pipeline. Caches build outputs (`.next`, `dist`), orchestrates parallel execution of app dev servers and package compilation. |
| [`docker-compose.yml`](file:///c:/Users/miiday_repo_work/studio-orbit/docker-compose.yml) | Orchestrates local Docker containers for **PostgreSQL 16** (port 5432) and **Redis 7** (port 6379) with persistent volume mounts. |
| [`tsconfig.json`](file:///c:/Users/miiday_repo_work/studio-orbit/tsconfig.json) | Base TypeScript configuration inherited by all monorepo apps and packages (strict mode enabled, ES2022 target). |
| [`pnpm-workspace.yaml`](file:///c:/Users/miiday_repo_work/studio-orbit/pnpm-workspace.yaml) | Defines workspace package globs for compatibility when using `pnpm`. |
| [`readme.md`](file:///c:/Users/miiday_repo_work/studio-orbit/readme.md) | Primary project documentation, installation instructions, architecture overview, and quick-start guide. |

---

## 2. Web Application (`apps/web/`)
**Technology**: Next.js 15 (App Router), React 18, Tailwind CSS, Lucide Icons.

### Pages & Routing (`apps/web/app/`)
| Path | Component Type | Purpose |
| :--- | :--- | :--- |
| [`layout.tsx`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/web/app/layout.tsx) | Root Layout | Loads global styles (`globals.css`) and imports Google Fonts (*Inter* and *Playfair Display*). |
| [`globals.css`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/web/app/globals.css) | Global Styles | Defines CSS variables for the parchment editorial theme (`--background: #FAF8F5`, `--accent: #C85A32`) and custom scrollbars. |
| [`(auth)/portal/login/page.tsx`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/web/app/(auth)/portal/login/page.tsx) | Auth Page | Passwordless magic-link login form for clients. Accepts email and sends instant workspace token. |
| [`(dashboard)/layout.tsx`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/web/app/(dashboard)/layout.tsx) | Studio Shell | Admin navigation sidebar containing links to Projects, Clients, and Invoices. |
| [`(dashboard)/projects/page.tsx`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/web/app/(dashboard)/projects/page.tsx) | Studio Admin Page | Studio internal project management dashboard listing active deliverables, budgets, and spent amounts. |
| [`(dashboard)/invoices/page.tsx`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/web/app/(dashboard)/invoices/page.tsx) | Studio Admin Page | Invoice table displaying payment status (`Paid`, `Sent`, `Overdue`), client names, and billing dates. |
| [`(dashboard)/clients/page.tsx`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/web/app/(dashboard)/clients/page.tsx) | Studio Admin Page | Client directory displaying active client tokens, contact emails, and launch buttons for client portals. |
| [`(portal)/portal/[token]/page.tsx`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/web/app/(portal)/portal/[token]/page.tsx) | Client Portal Page | Private client portal overview featuring active deliverable callouts, action items, and sprint milestone status. |
| [`(portal)/portal/[token]/canvas/[assetId]/page.tsx`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/web/app/(portal)/portal/[token]/canvas/[assetId]/page.tsx) | Canvas Page | Full-screen interactive review canvas page embedded inside the client portal. |
| [`(portal)/portal/[token]/billing/page.tsx`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/web/app/(portal)/portal/[token]/billing/page.tsx) | Client Billing Page | Client view of monthly retainer burn-down gauges and downloadable PDF invoice history. |
| [`api/webhooks/stripe/route.ts`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/web/app/api/webhooks/stripe/route.ts) | API Route | Stripe webhook endpoint handling payment settlement notifications (`invoice.payment_succeeded`). |
| [`api/upload/route.ts`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/web/app/api/upload/route.ts) | API Route | Direct S3 / Cloudflare R2 presigned upload URL generator for client deliverable image uploads. |

### Components (`apps/web/components/`)
| Component | Subsystem | Function |
| :--- | :--- | :--- |
| [`ReviewCanvas.tsx`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/web/components/canvas/ReviewCanvas.tsx) | Canvas | Pan/zoom viewport with percentage-based coordinate math (`0-100%`). Handles mouse clicks to place new coordinate pins. |
| [`FeedbackPin.tsx`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/web/components/canvas/FeedbackPin.tsx) | Canvas | Positioned marker component with animated CSS pulse rings and status-coded colors (`#C85A32` open, amber in review, emerald resolved). |
| [`PinCommentDrawer.tsx`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/web/components/canvas/PinCommentDrawer.tsx) | Canvas | Side panel displaying threaded discussions for a specific feedback pin with role tags (`client` vs `studio`). |
| [`VersionStack.tsx`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/web/components/canvas/VersionStack.tsx) | Canvas | Floating toolbar pill allowing clients to switch between deliverable iterations (`v1`, `v2`, `v3`). |
| [`RetainerGauge.tsx`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/web/components/billing/RetainerGauge.tsx) | Billing | Radial/horizontal progress bar calculating used agency hours vs. allocated monthly hours. |
| [`InvoicePDF.tsx`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/web/components/billing/InvoicePDF.tsx) | Billing | Clean printable invoice layout with subtotal, tax breakdown, and studio branding. |
| [`DeliveryRoadmap.tsx`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/web/components/milestones/DeliveryRoadmap.tsx) | Milestones | Visual sprint timeline board tracking phase progress and digital client approvals. |

---

## 3. Realtime WebSocket Service (`apps/realtime/`)
**Technology**: Node.js, `ws` WebSocket package, TypeScript.

| File | Purpose |
| :--- | :--- |
| [`package.json`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/realtime/package.json) | Package config for the WebSocket microservice with `ts-node-dev` live reloading. |
| [`src/presence.ts`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/realtime/src/presence.ts) | `PresenceTracker` class tracking connected client cursor `(x, y)` coordinates and active viewer rooms. |
| [`src/broadcaster.ts`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/realtime/src/broadcaster.ts) | `Broadcaster` utility class pushing JSON updates to all connected room sockets except sender. |
| [`src/index.ts`](file:///c:/Users/miiday_repo_work/studio-orbit/apps/realtime/src/index.ts) | Server entrypoint initializing WebSocket server on port `8080` listening for `PRESENCE_UPDATE` and `NEW_COMMENT_PIN`. |

---

## 4. Shared Packages (`packages/`)

### Database Layer (`packages/db/`)
| File | Purpose |
| :--- | :--- |
| [`prisma/schema.prisma`](file:///c:/Users/miiday_repo_work/studio-orbit/packages/db/prisma/schema.prisma) | Declarative schema for PostgreSQL. Defines `User`, `Client`, `Project`, `Milestone`, `Deliverable`, `FeedbackPin`, `PinComment`, `Retainer`, and `Invoice` entities. |
| [`prisma/seed.ts`](file:///c:/Users/miiday_repo_work/studio-orbit/packages/db/prisma/seed.ts) | Executable seed script inserting demo data for Alex Rivera (Studio Admin), Sarah Chen (Lumina Tech Client), and active project deliverables. |
| [`src/index.ts`](file:///c:/Users/miiday_repo_work/studio-orbit/packages/db/src/index.ts) | Exports global `prisma` client instance with hot-reload connection pooling safety. |

### Shared Types (`packages/types/`)
| File | Purpose |
| :--- | :--- |
| [`src/canvas.ts`](file:///c:/Users/miiday_repo_work/studio-orbit/packages/types/src/canvas.ts) | Interfaces for `Coordinate`, `PinStatus`, `PinComment`, `FeedbackPinData`, `CanvasAssetVersion`, and `PresenceUser`. |
| [`src/project.ts`](file:///c:/Users/miiday_repo_work/studio-orbit/packages/types/src/project.ts) | Interfaces for `ProjectStatus`, `Milestone`, `Client`, and `Project`. |
| [`src/billing.ts`](file:///c:/Users/miiday_repo_work/studio-orbit/packages/types/src/billing.ts) | Interfaces for `RetainerSummary`, `InvoiceLineItem`, `InvoiceStatus`, and `Invoice`. |
| [`src/index.ts`](file:///c:/Users/miiday_repo_work/studio-orbit/packages/types/src/index.ts) | Re-exports all type definitions as a single package entry point (`@studio-orbit/types`). |

### Shared Styling Config (`packages/config/`)
| File | Purpose |
| :--- | :--- |
| [`tailwind/tailwind.config.js`](file:///c:/Users/miiday_repo_work/studio-orbit/packages/config/tailwind/tailwind.config.js) | Centralized Tailwind config with custom parchment color scale (`parchment-50` through `950`), Terracotta accent (`#C85A32`), serif fonts (*Playfair Display*), and atmospheric shadow utilities. |

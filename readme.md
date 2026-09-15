<div align="center">

# 🪐 Studio-Orbit

**The high-end, editorial client portal and real-time review canvas monorepo for design & engineering studios.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15%20App%20Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-ef4444?logo=turborepo)](https://turbo.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-Parchment%20Editorial-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

[Overview](#-overview) • [Architecture](#-architecture) • [Key Features](#-key-features) • [Directory Breakdown](#-directory-breakdown) • [Getting Started](#-getting-started) • [License](#-license)

</div>

---

## 🪐 Overview

**Studio-Orbit** is an open-source, self-hostable client workspace monorepo. It bridges the gap between client communication, interactive coordinate-based visual review, and financial management for design & engineering studios.

Instead of sending clients to rigid corporate spreadsheets or generic ticket trackers, Studio-Orbit provides an editorial, warm parchment-themed interface powered by Next.js 15, Turborepo, Prisma ORM, and a Node.js WebSocket service for real-time presence.

---

## 🏗 Architecture

Studio-Orbit is structured as a **Turborepo monorepo** divided into `apps` and `packages`:

```
studio-orbit/
├── apps/
│   ├── web/               # Next.js 15 (App Router) Studio Admin & Client Portal
│   └── realtime/          # Node.js WebSocket service for live presence & canvas comments
├── packages/
│   ├── db/                # Prisma ORM Database layer & seed script
│   ├── types/             # Shared TypeScript interfaces
│   └── config/            # Shared Tailwind editorial parchment design tokens
├── docker-compose.yml     # PostgreSQL + Redis services
└── turbo.json             # Turborepo task pipeline
```

---

## ✨ Key Features

* **Coordinate-Pinned Review Canvas (`apps/web/components/canvas/`)**:
  - Pan/zoom viewport with percentage-based coordinate math (`0-100%`).
  - Animated pulse markers with status badges (`open`, `in_review`, `resolved`).
  - Threaded comment drawer with role-based tags (`client` vs `studio`).
  - Multi-version switcher (`v1`, `v2`, `v3`).
* **Client Portal & Magic Links (`apps/web/app/(auth)/`)**:
  - Zero-password login for clients via secure portal access tokens.
  - Client overview, delivery roadmaps, and instant project status.
* **Retainer & Invoice Ledger (`apps/web/components/billing/`)**:
  - Visual burn-down gauge for prepaid agency hours.
  - Printable PDF invoice generator with subtotal and tax breakdowns.
* **Realtime Presence Engine (`apps/realtime/`)**:
  - Node.js WebSocket server broadcasting viewer cursors and comment pins live.

---

## 📂 Complete Directory & File Breakdown

For an in-depth breakdown explaining the purpose of every file and folder in this codebase, see [`STRUCTURE_EXPLANATION.md`](file:///c:/Users/miiday_repo_work/studio-orbit/STRUCTURE_EXPLANATION.md).

| Path | Description |
| :--- | :--- |
| **`apps/web`** | **Next.js 15 App Router Frontend** |
| `├── app/(auth)/portal/login/page.tsx` | Magic link passwordless authentication page |
| `├── app/(dashboard)/` | Internal studio admin layout & navigation shell |
| `│   ├── projects/page.tsx` | Studio project management & budget tracker |
| `│   ├── invoices/page.tsx` | Stripe invoices & retainers ledger table |
| `│   └── clients/page.tsx` | Client profiles & workspace portal token manager |
| `├── app/(portal)/portal/[token]/` | Client-facing private workspace |
| `│   ├── page.tsx` | Client overview & milestone roadmap |
| `│   ├── canvas/[assetId]/page.tsx` | Full-screen interactive review canvas page |
| `│   └── billing/page.tsx` | Client retainer gauge & billing history |
| `├── app/api/webhooks/stripe/route.ts` | Stripe payment webhook listener |
| `├── app/api/upload/route.ts` | Presigned URL generator for direct S3 / R2 asset uploads |
| `├── components/canvas/` | `ReviewCanvas`, `FeedbackPin`, `PinCommentDrawer`, `VersionStack` |
| `├── components/billing/` | `RetainerGauge`, `InvoicePDF` |
| `└── components/milestones/` | `DeliveryRoadmap` |
| **`apps/realtime`** | **Node.js WebSocket Service** |
| `├── src/presence.ts` | Tracks live cursor locations & active room viewers |
| `├── src/broadcaster.ts` | Pushes comment pins & cursor updates to all room participants |
| `└── src/index.ts` | WebSocket server listening on port `8080` |
| **`packages/db`** | **Prisma ORM Layer** |
| `├── prisma/schema.prisma` | PostgreSQL database schema (User, Client, Project, Pin, Invoice) |
| `├── prisma/seed.ts` | Realistic demo seed data for Studio Admin & Client |
| `└── src/index.ts` | Global Prisma Client singleton |
| **`packages/types`** | **Shared TypeScript Interfaces** |
| `└── src/` | Shared types for canvas, project, milestone, and billing |
| **`packages/config`** | **Shared Design Tokens** |
| `└── tailwind/tailwind.config.js` | Parchment palette (`#FAF8F5`), Terracotta accent (`#C85A32`), & serif fonts |

---

## 🚀 Getting Started

### 1. Install Dependencies
Run from the workspace root:

```bash
npm install
```

### 2. Start PostgreSQL & Redis
Launch local database containers via Docker:

```bash
docker-compose up -d
```

### 3. Setup Database & Seed Data

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Start Development Servers

```bash
# Start all apps concurrently via Turborepo
npm run dev

# Or start Next.js web portal individually:
cd apps/web
npm run dev
```

Visit:
- **Studio Cockpit**: `http://localhost:3000/projects`
- **Client Portal**: `http://localhost:3000/portal/lumina-portal-token-9988`
- **Review Canvas**: `http://localhost:3000/portal/lumina-portal-token-9988/canvas/asset-99`

---

## 📄 License
Distributed under the MIT License. See [LICENSE](LICENSE) for details.
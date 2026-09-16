<div align="center">

# 🪐 StudioOrbit

**The open-source Design-to-Code Visual QA, Staging Review, and Client Approval Hub for design & engineering studios.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15%20App%20Router-black?logo=next.js)](https://nextjs.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?logo=drizzle)](https://orm.drizzle.team/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-Parchment%20Theme-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

[Overview](#-overview) • [Key Features](#-key-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [License](#-license)

</div>

---

## 🪐 Overview

**StudioOrbit** is a self-hostable monorepo combining an **interactive Staging Viewport with DOM coordinate pins** (Figma-style QA defect tracking on live staging URL sandboxes) with a **Drizzle ORM PostgreSQL database layer** and an **editorial studio dashboard** (milestone scope sign-offs, Stripe invoice settlements, and retainer hour burn-downs).

---

## ✨ Key Features

* **Visual QA & Staging Sandbox (`apps/web/components/staging/`)**:
  - Interactive device frame sandbox supporting Desktop (`1440px`), Tablet (`768px`), and Mobile (`375px`) viewports.
  - Zoom presets (`50%`, `75%`, `100%`, `Fit`).
  - Transparent `DOMPinOverlay` mapping click relative percentages (`xPercent`, `yPercent`) and logging device resolution and browser user-agent.
  - Marker status pills (Amber for Open, Emerald for Resolved).
  - Inspection drawer with threaded discussions and a "Mark Resolved" action.
* **GitHub Issue Bridge (`apps/web/app/api/github/sync/route.ts`)**:
  - Export visual QA defect pins directly into GitHub Issues with markdown detailing coordinates, device viewport, user-agent, and comment history.
* **Drizzle ORM Database Layer (`packages/db`)**:
  - PostgreSQL schema (`src/schema.ts`) using `drizzle-orm` and `pg` for `projects`, `canvas_pins`, `pin_comments`, `milestones`, and `invoices`.
* **Client Scope Governance (`components/scope/MilestoneSignOff.tsx`)**:
  - Timestamped digital sign-off trigger preventing scope creep.
* **Retainer & Invoicing Hub (`apps/web/app/(studio)/billing/page.tsx`)**:
  - SVG circular burn-down gauge for consumed vs. allocated monthly hours and Stripe checkout ledger.

---

## 🏗 Architecture

```
studio-orbit/
├── apps/
│   ├── web/               # Next.js 15 App Router Frontend & Staging Visual QA
│   └── realtime/          # Node.js WebSocket Service for live presence
├── packages/
│   ├── db/                # Drizzle ORM PostgreSQL schema & seed script
│   ├── types/             # Shared TypeScript models
│   └── config/            # Shared Tailwind editorial parchment design tokens
├── docker-compose.yml     # PostgreSQL 16 + Redis 7 services
└── turbo.json             # Turborepo task pipeline
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start PostgreSQL & Redis (Docker)
```bash
docker-compose up -d
```

### 3. Initialize Drizzle Database & Seed Data
```bash
# Push Drizzle schema to PostgreSQL
npm --prefix packages/db run db:push

# Run Drizzle seed script
npm --prefix packages/db run db:seed
```

### 4. Start Development Server
```bash
cd apps/web
npm run dev
```

Visit:
- **Projects Cockpit**: `http://localhost:3000/projects`
- **Visual QA Staging**: `http://localhost:3000/staging`
- **Retainer & Billing**: `http://localhost:3000/billing`

---

## 📄 License
Distributed under the MIT License. See [LICENSE](LICENSE) for details.
# Contributing to StudioOrbit

We appreciate your interest in contributing to **StudioOrbit**, the premier open-source editorial client portal and coordinate-pinned review hub for modern studios.

---

## Code Quality Standards

* **TypeScript Strictness:** Strict mode is enforced. Avoid explicit `any` types; prefer union types or generics.
* **Component Modularity:** Separate pure presentation components from canvas coordinate calculation math.
* **Styling Tokens:** Use predefined theme tokens (`parchment-*`, `ink-*`, `hairline`, `terracotta`) rather than arbitrary hex values.
* **Monorepo Packages:** Do not cross-import files directly across package boundaries; use `@studio-orbit/types` or `@studio-orbit/db`.

---

## Development Workflow

1. Fork the repo and create your branch:
   ```bash
   git checkout -b feat/canvas-[#issue-number]
   ```

2. Verify typing and run tests:
   ```bash
   npm run build
   ```

3. Follow the Conventional Commits specification:
   ```bash
   git commit -m "feat(canvas): add percentage coordinate mapping popover"
   ```

4. Open a Pull Request with before/after screenshots or screen recordings.

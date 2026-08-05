# QR Code Generator — README & Cloudflare Deploy (Design)

Date: 2026-08-05

## Goal

Impress recruiters with a polished, well-documented README and a fully working
Cloudflare Pages deployment, mirroring the existing `alex-pimentel/imposition`
repository conventions.

## Context

- Monorepo: `packages/core` (pure logic), `packages/ui` (React components,
  Zustand store), `packages/web` (Vite entrypoint).
- CI already exists (`.github/workflows/ci.yml`) and already contains the same
  Cloudflare Pages deploy job as `imposition`: `cloudflare/wrangler-action@v3`
  with `pages deploy packages/web/dist --project-name=qrcode`, using
  `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets, gated to `main`.
- No `README.md` and no `LICENSE` file exist.
- Live URL chosen by user: `https://qrcode.agenteresolve.com.br/`.

## Deliverables

1. **README.md** — English, prettier-compliant, structured like the imposition
   README: badges (React 19, TypeScript 5.8, Vite 6, Tailwind 4, Zustand 5,
   qrcode, Docker, MIT) + CI badge, Features, Architecture (ASCII diagram),
   Stack table, Project Structure tree, Quick Start, How it Works, Commands,
   Deploy (Cloudflare Pages via wrangler-action), License, and a
   "try it now → https://qrcode.agenteresolve.com.br/" footer.
2. **LICENSE** — MIT license matching `package.json` and the app footer.
3. **Pipeline validation** — confirm the CI deploy job matches `imposition` and
   the YAML is valid; no functional changes expected.
4. **Deploy docs** — README documents the GitHub secrets required to enable the
   deploy job.

## App Features (to document)

- Text/URL input with Enter-to-generate
- Size (100–600px) and margin (0–10) controls
- Custom foreground/background colors
- 7 color templates (Classic, Dark, Blue, Green, Purple, Coral, Amber)
- Error correction: L (7%), M (15%), Q (25%), H (30%)
- Output formats: PNG (raster) and SVG (vector)
- Download PNG/SVG, copy to clipboard
- History persisted in localStorage (max 20 entries), load/delete/clear
- 100% client-side — no backend

## Not in scope

- No Electron/desktop package (unlike `imposition`).
- No code changes to the application itself.

## Verification

- `npm run format` passes on the new files.
- `npm run build -w packages/web` still builds.
- CI YAML validated (action versions, job graph).

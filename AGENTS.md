# AGENTS.md

## Project Goal

QR Code Generator — web application for creating customizable QR codes from URLs or text, with PNG export. Built as a monorepo following portfolio conventions.

## Development Rules

- keep the interface simple, clear, and focused on productivity
- always validate changes with lint/build when possible
- the app is client-side only — no backend, no server state

## Main Structure

- `packages/core` — shared pure logic (types, QR generation wrapper, download util)
- `packages/ui` — React components, hooks, Zustand store, Tailwind CSS
- `packages/web` — Web app (Vite + React entrypoint)

## Commands

- `npm run dev -w packages/web` — web dev server (Vite)
- `npm run build -w packages/web` — build web for production (tsc + vite)
- `npm run lint` — ESLint all packages
- `npm run format` — Prettier check all files
- `npm run format:fix` — Prettier fix all files

## Important Notes

- the QR code library is `qrcode` (npm package, v1.x)
- input is sanitized by the library — no additional escaping needed
- error correction levels: L (7%), M (15%), Q (25%), H (30%)
- output is PNG via data URL (base64)
- works completely client-side — no network requests
- when changing packages/core or packages/ui, verify the web build still works
- never use `workspace:*` (npm does not support it); use `"*"` to reference workspace packages
- deploy is handled automatically by GitHub Actions on merge to main

# 🔳 qrcode

**QR Code generator — React + TypeScript + Vite**

Web application for creating customizable QR codes from URLs or text, with color templates, error correction control, PNG/SVG export, and persistent history — fully client-side, no backend required.

[![React](https://img.shields.io/badge/react-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/typescript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Vite](https://img.shields.io/badge/vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/) [![Tailwind CSS](https://img.shields.io/badge/tailwindcss-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/) [![Zustand](https://img.shields.io/badge/zustand-5-443E38?style=for-the-badge&logo=react&logoColor=white)](https://github.com/pmndrs/zustand) [![qrcode](https://img.shields.io/badge/qrcode-1.5-000000?style=for-the-badge)](https://www.npmjs.com/package/qrcode) [![Docker](https://img.shields.io/badge/docker-compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/compose/) [![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](https://opensource.org/licenses/MIT)

[![CI](https://github.com/alex-pimentel/qrcode/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/alex-pimentel/qrcode/actions/workflows/ci.yml)

---

## 🚀 Features

- **Text & URL input** — Generate a QR code from any text or link with one click (or Enter)
- **Custom colors** — Pick any foreground and background color
- **Color templates** — One-click presets (Classic, Dark Mode, Blue, Green, Purple, Coral, Amber)
- **Error correction** — Choose Low (7%), Medium (15%), Quartile (25%), or High (30%)
- **Size & margin** — Fine-tune dimensions (100–600px) and quiet-zone margin
- **PNG + SVG export** — Download as raster PNG or vector SVG
- **Copy to clipboard** — One-click copy of the generated image
- **History** — Last 20 codes persisted in `localStorage`, with load/delete/clear actions

---

## 🏗️ Architecture

```
         ┌────────────────────────────────────────────────┐
         │                 packages/ui                     │
         │  React components (QRForm, QRDisplay,           │
         │  QRSettings, QRHistory), Zustand store          │
         └────────────────┬───────────────────────────────┘
                          │ imports
         ┌────────────────▼───────────────────────────────┐
         │                packages/core                    │
         │  Types & defaults, qrcode wrapper,              │
         │  PNG/SVG generation, download utilities         │
         └────────────────┬───────────────────────────────┘
                          │ imports
         ┌────────────────▼───────────────────────────────┐
         │                packages/web                     │
         │  Vite + React entrypoint                        │
         │  Cloudflare Pages deploy                        │
         └────────────────┬───────────────────────────────┘
                          │
         ┌────────────────▼───────────────────────────────┐
         │               Docker / Nginx                    │
         │               :8080                             │
         └────────────────────────────────────────────────┘
```

---

## 🛠️ Stack

| Layer         | Technology                                                            |
| ------------- | --------------------------------------------------------------------- |
| **Web**       | [Vite 6](https://vite.dev/) + [React 19](https://react.dev/)          |
| **Language**  | [TypeScript 5.8](https://www.typescriptlang.org/)                     |
| **State**     | [Zustand 5](https://github.com/pmndrs/zustand)                        |
| **Styling**   | [Tailwind CSS 4](https://tailwindcss.com/)                            |
| **QR**        | [qrcode 1.5](https://www.npmjs.com/package/qrcode)                    |
| **Testing**   | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) |
| **Container** | [Docker Compose](https://docs.docker.com/compose/)                    |
| **CI/CD**     | [GitHub Actions](https://github.com/features/actions)                 |
| **Deploy**    | [Cloudflare Pages](https://pages.cloudflare.com/)                     |

---

## 📦 Project Structure

```
qrcode/
├── packages/
│   ├── core/                  # Shared logic
│   │   └── src/
│   │       ├── index.ts       # Public API
│   │       ├── qr.ts          # qrcode wrapper, PNG/SVG, downloads
│   │       └── types.ts       # Types, defaults & templates
│   │
│   ├── ui/                    # React components & state
│   │   └── src/
│   │       ├── App.tsx        # App shell
│   │       ├── store.ts       # Zustand store
│   │       ├── components/    # QRForm, QRDisplay, QRSettings, QRHistory…
│   │       └── styles/        # Tailwind globals
│   │
│   └── web/                   # Web version
│       └── src/
│           └── main.tsx       # Vite entry point
│
├── tests/e2e/                 # Playwright end-to-end tests
├── .github/workflows/         # CI/CD pipeline
├── Dockerfile                 # Nginx production build
└── docker-compose.yml         # Development container
```

---

## ⚡ Quick Start

```bash
# Prerequisites: Node.js 18+, npm

git clone git@github.com:alex-pimentel/qrcode.git
cd qrcode
npm install
```

### Web (development)

```bash
npm run dev -w packages/web
# → http://localhost:5173
```

### Docker

```bash
docker compose up --build
# → http://localhost:8080
```

---

## 🔄 How it Works

1. **Input** — Type a URL or any text
2. **Customize** — Pick colors, a template, error correction level, size, and margin
3. **Generate** — The `qrcode` library renders PNG and SVG entirely in the browser
4. **Export** — Download the image or copy it to the clipboard
5. **History** — Generated codes are saved in `localStorage` for quick reuse

```
User input → Customize settings → Generate → Download / Copy
                     ↕
             Zustand store (state)
                     ↕
       core (qrcode wrapper, PNG/SVG)
```

---

## 🧪 Commands

| Command                           | Description                       |
| --------------------------------- | --------------------------------- |
| `npm run dev -w packages/web`     | Web dev server (Vite)             |
| `npm run build -w packages/web`   | Build web for production          |
| `npm run preview -w packages/web` | Preview the production build      |
| `npm run lint`                    | ESLint all packages               |
| `npm test`                        | Run unit tests (Vitest)           |
| `npx playwright test`             | Run end-to-end tests (Playwright) |
| `npm run format`                  | Prettier check all files          |
| `docker compose up --build`       | Docker web serve                  |

---

## ☁️ Deploy

The web version is deployed to **Cloudflare Pages** via GitHub Actions on merge to `main`, using [Wrangler](https://developers.cloudflare.com/workers/wrangler/) (`cloudflare/wrangler-action@v3`). [![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)](https://pages.cloudflare.com/)

```yaml
- uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    command: pages deploy packages/web/dist --project-name=qrcode
```

Configure these repository secrets on GitHub to enable the deploy job:

| Secret                  | Description                                 |
| ----------------------- | ------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare API token with Pages edit rights |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account identifier               |

---

## 📄 License

[MIT](LICENSE) © 2026 [Alex Pimentel](https://github.com/alex-pimentel)

---

Built with ❤️ using React, TypeScript, and Vite — [**try it now →**](https://qrcode.agenteresolve.com.br/)

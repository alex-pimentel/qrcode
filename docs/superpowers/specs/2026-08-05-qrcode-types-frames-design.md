# QR Code Generator — QR Types, Frames & UI Polish (Design)

Date: 2026-08-05

## Goal

Extend the QR Code Generator with multiple QR types, decorative frames,
automatic template application, and improved color picking, following the
features of qr-code-generator.com (Wi-Fi, sites, PIX) while keeping the
shadcn/Radix/Tailwind conventions.

## Approved scope

1. **QR types** — Text, URL, Wi-Fi, PIX, Email, SMS (user selected; no vCard).
2. **Colors** — `react-colorful` popover picker + HEX input for foreground/background.
3. **Templates** — redesigned swatches; clicking a template applies colors AND
   regenerates the QR automatically.
4. **Frames** — none, solid (2 thicknesses, custom color), decorative corners,
   optional caption text. Applied to preview AND PNG/SVG export.
5. **Tooltips** — `@radix-ui/react-tooltip` (already installed) on icon buttons.

Also included (root-caused bug fixes already applied):

- Tailwind v4 `@source` so `packages/ui` classes are compiled (was missing all utilities).
- `--color-popover`/`--color-popover-foreground` theme tokens (dropdowns were transparent).

## Architecture

### packages/core

- `types.ts` — `QRType`, per-type payload interfaces (`UrlPayload`,
  `WifiPayload`, `PixPayload`, `EmailPayload`, `SmsPayload`), `QRFrameConfig`
  (`type: 'none'|'solid'|'corners'`, `color`, `thickness`, `caption`),
  extended `QRSettings`.
- `payloads.ts` — `buildPayload(settings)` returns the QR string or `null`
  when required fields are empty. Builders: text, url (auto `https://`),
  wifi (`WIFI:T:<WPA|WEP|nopass>;S:..;P:..;H:..;;`), pix (EMV/BCB with
  CRC16-CCITT poly 0x1021 init 0xFFFF), email (`mailto:`), sms (`SMSTO:`).
- `frames.ts` — frame geometry + SVG element builders + canvas drawing helpers.
- `qr.ts` — `generateQRDataURL`/`generateQRSVG` compose the base QR (from the
  `qrcode` lib) with the configured frame (canvas for PNG, `<svg>` wrapper with
  `<rect>`/`<text>` for SVG). Base QR keeps its quiet zone (margin option).

### packages/ui

- `store.ts` — settings extended with `type`, payload fields, `frame`;
  actions per field; `applyTemplate` regenerates; `generate` uses `buildPayload`.
- New components: `ColorField` (react-colorful + hex), `FrameField`, `QRTypeForm`
  (type selector + type-specific fields + Generate), `Tooltip` wrapper.
- Reworked: `QRSettings` (type-agnostic design settings + frames + templates),
  `QRTemplates` (swatches + auto-apply), `QRDisplay`/`QRHistory` (tooltips).

### packages/web

- Tests: payload builders + PIX CRC16 known vector; e2e updated for new UI.

## PIX payload format (EMV CPV 61, static)

`000201` + `26`+len+`0014BR.GOV.BCB.PIX`+`01`+len+key + `52040000` +
`5303986` + optional `54`+len+amount + `5802BR` + `59`+len+name +
`60`+len+city + `62`+len+`05`+len+txid(default `***`) + `6304` + CRC16.

## Verification

- Unit tests (core payloads + CRC16), Vitest passes.
- Playwright e2e passes with updated UI.
- `npm run lint`, `npm run format`, `npm run build -w packages/web` pass.
- Playwright visual check on local dev server confirms frames/colors/tooltips.

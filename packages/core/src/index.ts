export { generateQRDataURL, generateQRSVG, downloadQR, downloadSVG, copyToClipboard } from './qr';
export { buildPayload, canGeneratePayload, describePayload, crc16CCITT } from './payloads';
export { frameMetrics, composeFrameSVG } from './frames';
export type {
  QRSettings,
  QRType,
  QROutputFormat,
  QRTemplate,
  QRHistoryEntry,
  WifiPayload,
  WifiSecurity,
  PixPayload,
  EmailPayload,
  SmsPayload,
  QRFrameConfig,
  QRFrameType,
  QRFrameThickness,
} from './types';
export { DEFAULT_QR_SETTINGS, QR_TEMPLATES, QR_TYPES } from './types';

import type { QRCodeErrorCorrectionLevel } from 'qrcode';

export type QRType = 'text' | 'url' | 'wifi' | 'pix' | 'email' | 'sms';

export type WifiSecurity = 'WPA' | 'WEP' | 'nopass';

export interface WifiPayload {
  ssid: string;
  password: string;
  security: WifiSecurity;
  hidden: boolean;
}

export interface PixPayload {
  key: string;
  amount: string;
  name: string;
  city: string;
  txid: string;
}

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

export interface SmsPayload {
  number: string;
  message: string;
}

export type QRFrameType = 'none' | 'solid' | 'corners';

export type QRFrameThickness = 'thin' | 'thick';

export interface QRFrameConfig {
  type: QRFrameType;
  color: string;
  thickness: QRFrameThickness;
  caption: string;
}

export interface QRSettings {
  type: QRType;
  text: string;
  url: string;
  wifi: WifiPayload;
  pix: PixPayload;
  email: EmailPayload;
  sms: SmsPayload;
  width: number;
  margin: number;
  foreground: string;
  background: string;
  errorCorrectionLevel: QRCodeErrorCorrectionLevel;
  frame: QRFrameConfig;
}

export type QROutputFormat = 'png' | 'svg';

export interface QRTemplate {
  id: string;
  label: string;
  foreground: string;
  background: string;
}

export interface QRHistoryEntry {
  id: string;
  label: string;
  settings: QRSettings;
  dataURL: string;
  timestamp: number;
}

export const QR_TYPES: { value: QRType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'url', label: 'URL' },
  { value: 'wifi', label: 'Wi-Fi' },
  { value: 'pix', label: 'PIX' },
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
];

export const DEFAULT_QR_SETTINGS: QRSettings = {
  type: 'text',
  text: '',
  url: '',
  wifi: { ssid: '', password: '', security: 'WPA', hidden: false },
  pix: { key: '', amount: '', name: '', city: '', txid: '' },
  email: { to: '', subject: '', body: '' },
  sms: { number: '', message: '' },
  width: 300,
  margin: 2,
  foreground: '#000000',
  background: '#ffffff',
  errorCorrectionLevel: 'M',
  frame: { type: 'none', color: '#000000', thickness: 'thin', caption: '' },
};

export const QR_TEMPLATES: QRTemplate[] = [
  { id: 'classic', label: 'Classic', foreground: '#000000', background: '#ffffff' },
  { id: 'dark', label: 'Dark Mode', foreground: '#ffffff', background: '#1a1a2e' },
  { id: 'blue', label: 'Blue', foreground: '#1e40af', background: '#ffffff' },
  { id: 'green', label: 'Green', foreground: '#166534', background: '#f0fdf4' },
  { id: 'purple', label: 'Purple', foreground: '#6b21a8', background: '#faf5ff' },
  { id: 'coral', label: 'Coral', foreground: '#b91c1c', background: '#fff5f5' },
  { id: 'amber', label: 'Amber', foreground: '#92400e', background: '#fffbeb' },
];

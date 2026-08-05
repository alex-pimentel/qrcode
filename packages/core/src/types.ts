import type { QRCodeErrorCorrectionLevel } from 'qrcode';

export interface QRSettings {
  text: string;
  width: number;
  margin: number;
  foreground: string;
  background: string;
  errorCorrectionLevel: QRCodeErrorCorrectionLevel;
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
  text: string;
  dataURL: string;
  timestamp: number;
}

export const DEFAULT_QR_SETTINGS: QRSettings = {
  text: '',
  width: 300,
  margin: 2,
  foreground: '#000000',
  background: '#ffffff',
  errorCorrectionLevel: 'M',
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

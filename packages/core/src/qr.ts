import QRCode from 'qrcode';
import type { QRSettings } from './types';

export async function generateQRDataURL(settings: QRSettings): Promise<string> {
  const { text, width, margin, foreground, background, errorCorrectionLevel } = settings;

  return QRCode.toDataURL(text, {
    width,
    margin,
    color: {
      dark: foreground,
      light: background,
    },
    errorCorrectionLevel,
  });
}

export async function generateQRSVG(settings: QRSettings): Promise<string> {
  const svg = await QRCode.toString(settings.text, {
    type: 'svg',
    width: settings.width,
    margin: settings.margin,
    color: {
      dark: settings.foreground,
      light: settings.background,
    },
    errorCorrectionLevel: settings.errorCorrectionLevel,
  });
  return svg;
}

export function downloadQR(dataURL: string, filename = 'qrcode.png'): void {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadSVG(svgContent: string, filename = 'qrcode.svg'): void {
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(dataURL: string): Promise<void> {
  const response = await fetch(dataURL);
  const blob = await response.blob();
  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob,
    }),
  ]);
}

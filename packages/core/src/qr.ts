import QRCode from 'qrcode';
import type { QRSettings } from './types';
import { composeFramePNG, composeFrameSVG } from './frames';

function qrCodeOptions(settings: QRSettings) {
  return {
    width: settings.width,
    margin: settings.margin,
    color: {
      dark: settings.foreground,
      light: settings.background,
    },
    errorCorrectionLevel: settings.errorCorrectionLevel,
  };
}

function extractSvgInner(svg: string): string {
  const start = svg.indexOf('>') + 1;
  const end = svg.lastIndexOf('</svg>');
  return svg.slice(start, end);
}

export async function generateQRDataURL(settings: QRSettings, text: string): Promise<string> {
  const base = await QRCode.toDataURL(text, qrCodeOptions(settings));
  if (settings.frame.type === 'none' && !settings.frame.caption) return base;
  return composeFramePNG(base, settings);
}

export async function generateQRSVG(settings: QRSettings, text: string): Promise<string> {
  const svg = await QRCode.toString(text, { ...qrCodeOptions(settings), type: 'svg' });
  return composeFrameSVG(extractSvgInner(svg), settings);
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

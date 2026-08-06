import type { QRSettings } from './types';

export interface FrameMetrics {
  width: number;
  height: number;
  qrX: number;
  qrY: number;
  pad: number;
  thickness: number;
  captionH: number;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
}

export function frameMetrics(qrWidth: number, settings: QRSettings): FrameMetrics {
  const frame = settings.frame;
  const thickness =
    frame.thickness === 'thick' ? Math.max(12, qrWidth * 0.08) : Math.max(6, qrWidth * 0.04);
  const gap = Math.max(6, qrWidth * 0.03);
  const captionH = frame.caption ? Math.max(28, qrWidth * 0.08) : 0;
  const pad = frame.type === 'solid' || frame.type === 'corners' ? thickness + gap : 0;
  return {
    width: qrWidth + pad * 2,
    height: qrWidth + pad * 2 + captionH,
    qrX: pad,
    qrY: pad,
    pad,
    thickness,
    captionH,
  };
}

function cornerRects(m: FrameMetrics, color: string): Rect[] {
  const t = m.thickness;
  const qrSize = m.width - 2 * m.pad;
  const len = Math.max(20, m.width * 0.15);
  const x0 = m.qrX;
  const y0 = m.qrY;
  const x1 = m.qrX + qrSize;
  const y1 = m.qrY + qrSize;
  return [
    { x: x0 - t, y: y0 - t, w: len, h: t, fill: color },
    { x: x0 - t, y: y0 - t, w: t, h: len, fill: color },
    { x: x1 - len, y: y0 - t, w: len, h: t, fill: color },
    { x: x1, y: y0 - t, w: t, h: len, fill: color },
    { x: x0 - t, y: y1, w: len, h: t, fill: color },
    { x: x0 - t, y: y1 - len, w: t, h: len, fill: color },
    { x: x1 - len, y: y1, w: len, h: t, fill: color },
    { x: x1, y: y1 - len, w: t, h: len, fill: color },
  ];
}

function frameRects(m: FrameMetrics, settings: QRSettings): Rect[] {
  const rects: Rect[] = [{ x: 0, y: 0, w: m.width, h: m.height, fill: settings.background }];
  if (settings.frame.type === 'solid') {
    rects.push({ x: 0, y: 0, w: m.width, h: m.height - m.captionH, fill: settings.frame.color });
    rects.push({
      x: m.thickness,
      y: m.thickness,
      w: m.width - 2 * m.thickness,
      h: m.height - m.captionH - 2 * m.thickness,
      fill: settings.background,
    });
  } else if (settings.frame.type === 'corners') {
    rects.push(...cornerRects(m, settings.frame.color));
  }
  return rects;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function composeFramePNG(qrDataURL: string, settings: QRSettings): Promise<string> {
  const { width } = settings;
  const m = frameMetrics(width, settings);

  const img = new Image();
  await new Promise<void>((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(finish, 2000);
    img.onload = finish;
    img.onerror = finish;
    img.src = qrDataURL;
  });

  const canvas = document.createElement('canvas');
  canvas.width = m.width;
  canvas.height = m.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return qrDataURL;

  for (const rect of frameRects(m, settings)) {
    ctx.fillStyle = rect.fill;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  }

  ctx.drawImage(img, m.qrX, m.qrY, width, width);

  if (m.captionH > 0) {
    ctx.fillStyle = settings.foreground;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${Math.round(m.captionH * 0.42)}px system-ui, sans-serif`;
    ctx.fillText(settings.frame.caption, m.width / 2, m.height - m.captionH / 2);
  }

  return canvas.toDataURL('image/png');
}

export function composeFrameSVG(qrInner: string, settings: QRSettings): string {
  const { width } = settings;
  const m = frameMetrics(width, settings);

  const rects = frameRects(m, settings)
    .map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${r.fill}"/>`)
    .join('');

  const caption =
    m.captionH > 0
      ? `<text x="${m.width / 2}" y="${m.height - m.captionH / 2}" text-anchor="middle" dominant-baseline="central" font-family="system-ui, sans-serif" font-size="${Math.round(m.captionH * 0.42)}" fill="${settings.foreground}">${escapeXml(settings.frame.caption)}</text>`
      : '';

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${m.width}" height="${m.height}" viewBox="0 0 ${m.width} ${m.height}">` +
    rects +
    `<g transform="translate(${m.qrX} ${m.qrY})">${qrInner}</g>` +
    caption +
    '</svg>'
  );
}

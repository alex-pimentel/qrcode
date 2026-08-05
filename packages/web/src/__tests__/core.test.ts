import { describe, it, expect } from 'vitest';
import { DEFAULT_QR_SETTINGS } from '@qrcode/core';
import type { QRSettings } from '@qrcode/core';

describe('QR Core Types', () => {
  it('should have valid default settings', () => {
    expect(DEFAULT_QR_SETTINGS.text).toBe('');
    expect(DEFAULT_QR_SETTINGS.width).toBe(300);
    expect(DEFAULT_QR_SETTINGS.margin).toBe(2);
    expect(DEFAULT_QR_SETTINGS.foreground).toBe('#000000');
    expect(DEFAULT_QR_SETTINGS.background).toBe('#ffffff');
    expect(DEFAULT_QR_SETTINGS.errorCorrectionLevel).toBe('M');
  });

  it('should accept custom settings', () => {
    const settings: QRSettings = {
      text: 'https://example.com',
      width: 500,
      margin: 4,
      foreground: '#ff0000',
      background: '#0000ff',
      errorCorrectionLevel: 'H',
    };

    expect(settings.text).toBe('https://example.com');
    expect(settings.width).toBe(500);
    expect(settings.errorCorrectionLevel).toBe('H');
  });
});

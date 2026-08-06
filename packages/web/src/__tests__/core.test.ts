import { describe, it, expect } from 'vitest';
import { DEFAULT_QR_SETTINGS, buildPayload, describePayload, crc16CCITT } from '@qrcode/core';
import type { QRSettings } from '@qrcode/core';

describe('QR Core Types', () => {
  it('should have valid default settings', () => {
    expect(DEFAULT_QR_SETTINGS.type).toBe('text');
    expect(DEFAULT_QR_SETTINGS.text).toBe('');
    expect(DEFAULT_QR_SETTINGS.width).toBe(300);
    expect(DEFAULT_QR_SETTINGS.margin).toBe(2);
    expect(DEFAULT_QR_SETTINGS.foreground).toBe('#000000');
    expect(DEFAULT_QR_SETTINGS.background).toBe('#ffffff');
    expect(DEFAULT_QR_SETTINGS.errorCorrectionLevel).toBe('M');
    expect(DEFAULT_QR_SETTINGS.frame.type).toBe('none');
  });

  it('should accept custom settings', () => {
    const settings: QRSettings = {
      ...DEFAULT_QR_SETTINGS,
      type: 'url',
      url: 'https://example.com',
      width: 500,
      margin: 4,
      foreground: '#ff0000',
      background: '#0000ff',
      errorCorrectionLevel: 'H',
    };

    expect(settings.url).toBe('https://example.com');
    expect(settings.width).toBe(500);
    expect(settings.errorCorrectionLevel).toBe('H');
  });
});

describe('QR Payload Builders', () => {
  it('builds text payload', () => {
    const settings = { ...DEFAULT_QR_SETTINGS, type: 'text' as const, text: 'Hello' };
    expect(buildPayload(settings)).toBe('Hello');
  });

  it('returns null for empty text', () => {
    expect(buildPayload({ ...DEFAULT_QR_SETTINGS, type: 'text' as const, text: '  ' })).toBeNull();
  });

  it('builds url payload with https prefix', () => {
    const settings = { ...DEFAULT_QR_SETTINGS, type: 'url' as const, url: 'example.com' };
    expect(buildPayload(settings)).toBe('https://example.com');
  });

  it('keeps existing protocol in url', () => {
    const settings = {
      ...DEFAULT_QR_SETTINGS,
      type: 'url' as const,
      url: 'http://example.com/x',
    };
    expect(buildPayload(settings)).toBe('http://example.com/x');
  });

  it('builds wifi payload (WPA)', () => {
    const settings = {
      ...DEFAULT_QR_SETTINGS,
      type: 'wifi' as const,
      wifi: { ssid: 'MyNet', password: 'secret123', security: 'WPA' as const, hidden: false },
    };
    expect(buildPayload(settings)).toBe('WIFI:T:WPA;S:MyNet;P:secret123;H:false;;');
  });

  it('builds wifi payload (nopass) and escapes special chars', () => {
    const settings = {
      ...DEFAULT_QR_SETTINGS,
      type: 'wifi' as const,
      wifi: { ssid: 'Café;Net', password: '', security: 'nopass' as const, hidden: true },
    };
    expect(buildPayload(settings)).toBe('WIFI:T:nopass;S:Café\\;Net;H:true;;');
  });

  it('builds a valid static PIX payload with CRC16', () => {
    const settings = {
      ...DEFAULT_QR_SETTINGS,
      type: 'pix' as const,
      pix: {
        key: 'a1f6108c-4e2d-4e5e-8f2f-7d7b5f5e9c5a',
        amount: '1.00',
        name: 'Fulano de Tal',
        city: 'SAO PAULO',
        txid: '',
      },
    };
    expect(buildPayload(settings)).toBe(
      '00020126580014BR.GOV.BCB.PIX0136a1f6108c-4e2d-4e5e-8f2f-7d7b5f5e9c5a52040000530398654041.005802BR5913Fulano de Tal6009SAO PAULO62070503***63046423',
    );
  });

  it('returns null for pix without key', () => {
    const settings = {
      ...DEFAULT_QR_SETTINGS,
      type: 'pix' as const,
      pix: { ...DEFAULT_QR_SETTINGS.pix, key: '  ' },
    };
    expect(buildPayload(settings)).toBeNull();
  });

  it('builds email payload', () => {
    const settings = {
      ...DEFAULT_QR_SETTINGS,
      type: 'email' as const,
      email: { to: 'test@example.com', subject: 'Hi', body: 'Hello there' },
    };
    expect(buildPayload(settings)).toBe('mailto:test@example.com?subject=Hi&body=Hello%20there');
  });

  it('builds sms payload', () => {
    const settings = {
      ...DEFAULT_QR_SETTINGS,
      type: 'sms' as const,
      sms: { number: '+5511999999999', message: 'Hello' },
    };
    expect(buildPayload(settings)).toBe('SMSTO:+5511999999999:Hello');
  });
});

describe('CRC16-CCITT', () => {
  it('computes the documented PIX CRC', () => {
    const body =
      '00020126580014BR.GOV.BCB.PIX0136a1f6108c-4e2d-4e5e-8f2f-7d7b5f5e9c5a52040000530398654041.005802BR5913Fulano de Tal6009SAO PAULO62070503***6304';
    expect(crc16CCITT(body)).toBe('6423');
  });
});

describe('describePayload', () => {
  it('describes each type', () => {
    expect(
      describePayload({
        ...DEFAULT_QR_SETTINGS,
        type: 'wifi' as const,
        wifi: { ...DEFAULT_QR_SETTINGS.wifi, ssid: 'MyNet' },
      }),
    ).toBe('Wi-Fi: MyNet');
    expect(
      describePayload({
        ...DEFAULT_QR_SETTINGS,
        type: 'pix' as const,
        pix: { ...DEFAULT_QR_SETTINGS.pix, name: 'João' },
      }),
    ).toBe('PIX: João');
    expect(
      describePayload({
        ...DEFAULT_QR_SETTINGS,
        type: 'email' as const,
        email: { ...DEFAULT_QR_SETTINGS.email, to: 'a@b.com' },
      }),
    ).toBe('Email: a@b.com');
  });
});

import type { EmailPayload, PixPayload, QRSettings, SmsPayload, WifiPayload } from './types';

function utf8Length(value: string): number {
  return new TextEncoder().encode(value).length;
}

export function crc16CCITT(data: string): string {
  const bytes = new TextEncoder().encode(data);
  let crc = 0xffff;
  for (const byte of bytes) {
    crc ^= byte << 8;
    for (let i = 0; i < 8; i++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function emvField(id: string, value: string): string {
  if (!value) return '';
  return `${id}${String(utf8Length(value)).padStart(2, '0')}${value}`;
}

export function buildTextPayload(text: string): string | null {
  const value = text.trim();
  return value ? value : null;
}

export function buildUrlPayload(url: string): string | null {
  const value = url.trim();
  if (!value) return null;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function escapeWifiValue(value: string): string {
  return value.replace(/([\\;,:"])/g, '\\$1');
}

export function buildWifiPayload(wifi: WifiPayload): string | null {
  const ssid = wifi.ssid.trim();
  if (!ssid) return null;
  const hidden = wifi.hidden ? 'true' : 'false';
  const escapedSsid = escapeWifiValue(ssid);
  if (wifi.security === 'nopass') {
    return `WIFI:T:nopass;S:${escapedSsid};H:${hidden};;`;
  }
  return `WIFI:T:${wifi.security};S:${escapedSsid};P:${escapeWifiValue(wifi.password)};H:${hidden};;`;
}

export function buildPixPayload(pix: PixPayload): string | null {
  const key = pix.key.trim();
  if (!key) return null;
  const merchantName = pix.name.trim() || 'QR Code';
  const merchantCity = pix.city.trim() || 'SAO PAULO';

  const merchantAccount = emvField('26', `0014BR.GOV.BCB.PIX${emvField('01', key)}`);
  const amount = emvField('54', pix.amount.trim());
  const merchant = emvField('59', merchantName);
  const city = emvField('60', merchantCity);
  const txid = emvField('62', emvField('05', pix.txid.trim() || '***'));

  const body =
    '000201' +
    merchantAccount +
    '52040000' +
    '5303986' +
    amount +
    '5802BR' +
    merchant +
    city +
    txid;

  return body + '6304' + crc16CCITT(body + '6304');
}

export function buildEmailPayload(email: EmailPayload): string | null {
  const to = email.to.trim();
  if (!to) return null;
  const params: string[] = [];
  if (email.subject.trim()) params.push(`subject=${encodeURIComponent(email.subject.trim())}`);
  if (email.body.trim()) params.push(`body=${encodeURIComponent(email.body.trim())}`);
  return `mailto:${to}${params.length ? `?${params.join('&')}` : ''}`;
}

export function buildSmsPayload(sms: SmsPayload): string | null {
  const number = sms.number.trim();
  if (!number) return null;
  return `SMSTO:${number}:${sms.message.trim()}`;
}

export function buildPayload(settings: QRSettings): string | null {
  switch (settings.type) {
    case 'text':
      return buildTextPayload(settings.text);
    case 'url':
      return buildUrlPayload(settings.url);
    case 'wifi':
      return buildWifiPayload(settings.wifi);
    case 'pix':
      return buildPixPayload(settings.pix);
    case 'email':
      return buildEmailPayload(settings.email);
    case 'sms':
      return buildSmsPayload(settings.sms);
  }
}

export function canGeneratePayload(settings: QRSettings): boolean {
  return buildPayload(settings) !== null;
}

export function describePayload(settings: QRSettings): string {
  switch (settings.type) {
    case 'text':
      return settings.text.trim() || 'Text';
    case 'url':
      return settings.url.trim() || 'URL';
    case 'wifi':
      return `Wi-Fi: ${settings.wifi.ssid.trim()}`;
    case 'pix':
      return `PIX: ${settings.pix.name.trim() || settings.pix.key.trim()}`;
    case 'email':
      return `Email: ${settings.email.to.trim()}`;
    case 'sms':
      return `SMS: ${settings.sms.number.trim()}`;
  }
}

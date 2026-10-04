import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useQRStore } from '@qrcode/ui';
import { DEFAULT_QR_SETTINGS } from '@qrcode/core';
import type { QRHistoryEntry } from '@qrcode/core';

const HISTORY_KEY = 'agenteresolve:qrcode:history';
const LEGACY_KEY = 'qrcode-history';

function makeEntry(label: string): QRHistoryEntry {
  return {
    id: `entry-${label}`,
    label,
    settings: structuredClone(DEFAULT_QR_SETTINGS),
    dataURL: 'data:image/png;base64,AAAA',
    timestamp: Date.now(),
  };
}

describe('QR history persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    useQRStore.setState({
      settings: structuredClone(DEFAULT_QR_SETTINGS),
      qrDataURL: null,
      qrSVG: null,
      generating: false,
      error: null,
      history: [],
    });
  });

  it('saves history under the namespaced key and never the legacy key', async () => {
    const { setText, generate } = useQRStore.getState();
    setText('https://example.com');
    await generate();

    expect(localStorage.getItem(HISTORY_KEY)).not.toBeNull();
    expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
  }, 10000);

  it('loads history from the namespaced key on startup', async () => {
    vi.resetModules();
    localStorage.setItem(HISTORY_KEY, JSON.stringify([makeEntry('Namespaced')]));

    const mod = await import('@qrcode/ui');
    const history = mod.useQRStore.getState().history;

    expect(history).toHaveLength(1);
    expect(history[0].label).toBe('Namespaced');
  });

  it('migrates legacy history into the namespaced key on startup', async () => {
    vi.resetModules();
    localStorage.setItem(LEGACY_KEY, JSON.stringify([makeEntry('Legacy')]));

    const mod = await import('@qrcode/ui');
    const history = mod.useQRStore.getState().history;

    expect(history).toHaveLength(1);
    expect(history[0].label).toBe('Legacy');
    expect(localStorage.getItem(HISTORY_KEY)).not.toBeNull();
    expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
  });
});

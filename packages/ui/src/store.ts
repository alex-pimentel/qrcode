import { create } from 'zustand';
import {
  generateQRDataURL,
  generateQRSVG,
  downloadQR,
  downloadSVG,
  copyToClipboard,
  DEFAULT_QR_SETTINGS,
} from '@qrcode/core';
import type { QRSettings, QROutputFormat, QRHistoryEntry } from '@qrcode/core';

const HISTORY_KEY = 'qrcode-history';
const MAX_HISTORY = 20;

function loadHistory(): QRHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QRHistoryEntry[];
  } catch {
    return [];
  }
}

function saveHistory(entries: QRHistoryEntry[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {
    // storage full — ignore
  }
}

export type QRState = {
  settings: QRSettings;
  outputFormat: QROutputFormat;
  qrDataURL: string | null;
  qrSVG: string | null;
  generating: boolean;
  error: string | null;
  history: QRHistoryEntry[];
};

export type QRActions = {
  setText: (text: string) => void;
  setWidth: (width: number) => void;
  setMargin: (margin: number) => void;
  setForeground: (color: string) => void;
  setBackground: (color: string) => void;
  setErrorCorrectionLevel: (level: QRSettings['errorCorrectionLevel']) => void;
  setOutputFormat: (format: QROutputFormat) => void;
  applyTemplate: (foreground: string, background: string) => void;
  generate: () => Promise<void>;
  download: () => void;
  copyImage: () => Promise<void>;
  removeHistory: (id: string) => void;
  clearHistory: () => void;
  loadHistoryEntry: (entry: QRHistoryEntry) => void;
};

export type QRStore = QRState & QRActions;

export const useQRStore = create<QRStore>((set, get) => ({
  settings: { ...DEFAULT_QR_SETTINGS },
  outputFormat: 'png',
  qrDataURL: null,
  qrSVG: null,
  generating: false,
  error: null,
  history: loadHistory(),

  setText: (text) =>
    set((state) => ({
      settings: { ...state.settings, text },
      error: null,
    })),

  setWidth: (width) =>
    set((state) => ({
      settings: { ...state.settings, width: Math.max(100, Math.min(600, width)) },
    })),

  setMargin: (margin) =>
    set((state) => ({
      settings: { ...state.settings, margin: Math.max(0, Math.min(10, margin)) },
    })),

  setForeground: (foreground) =>
    set((state) => ({
      settings: { ...state.settings, foreground },
    })),

  setBackground: (background) =>
    set((state) => ({
      settings: { ...state.settings, background },
    })),

  setErrorCorrectionLevel: (errorCorrectionLevel) =>
    set((state) => ({
      settings: { ...state.settings, errorCorrectionLevel },
    })),

  setOutputFormat: (outputFormat) => set({ outputFormat }),

  applyTemplate: (foreground, background) =>
    set((state) => ({
      settings: { ...state.settings, foreground, background },
    })),

  generate: async () => {
    const { settings } = get();
    if (!settings.text.trim()) {
      set({ error: 'Enter text or URL to generate a QR code', qrDataURL: null });
      return;
    }

    set({ generating: true, error: null });
    try {
      const [dataURL, svg] = await Promise.all([
        generateQRDataURL(settings),
        generateQRSVG(settings),
      ]);

      const entry: QRHistoryEntry = {
        id: crypto.randomUUID(),
        text: settings.text,
        dataURL,
        timestamp: Date.now(),
      };

      set((state) => {
        const nextHistory = [entry, ...state.history.filter((h) => h.text !== settings.text)].slice(
          0,
          MAX_HISTORY,
        );
        saveHistory(nextHistory);
        return { qrDataURL: dataURL, qrSVG: svg, generating: false, history: nextHistory };
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to generate QR code',
        generating: false,
        qrDataURL: null,
        qrSVG: null,
      });
    }
  },

  download: () => {
    const { qrDataURL, qrSVG, outputFormat, settings } = get();
    if (outputFormat === 'svg' && qrSVG) {
      const filename = settings.text ? `qrcode.svg` : 'qrcode.svg';
      downloadSVG(qrSVG, filename);
    } else if (qrDataURL) {
      const filename = settings.text ? `qrcode.png` : 'qrcode.png';
      downloadQR(qrDataURL, filename);
    }
  },

  copyImage: async () => {
    const { qrDataURL } = get();
    if (!qrDataURL) return;
    try {
      await copyToClipboard(qrDataURL);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  },

  removeHistory: (id) =>
    set((state) => {
      const next = state.history.filter((h) => h.id !== id);
      saveHistory(next);
      return { history: next };
    }),

  clearHistory: () => {
    saveHistory([]);
    set({ history: [] });
  },

  loadHistoryEntry: (entry) =>
    set((state) => ({
      settings: { ...state.settings, text: entry.text },
      qrDataURL: entry.dataURL,
      qrSVG: null,
      error: null,
    })),
}));

export const selectHasQR = (state: QRStore) => state.qrDataURL !== null;

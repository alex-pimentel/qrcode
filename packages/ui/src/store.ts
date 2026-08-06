import { create } from 'zustand';
import {
  generateQRDataURL,
  generateQRSVG,
  downloadQR,
  downloadSVG,
  copyToClipboard,
  DEFAULT_QR_SETTINGS,
  buildPayload,
  describePayload,
} from '@qrcode/core';
import type {
  QRSettings,
  QRType,
  QROutputFormat,
  QRHistoryEntry,
  WifiPayload,
  PixPayload,
  EmailPayload,
  SmsPayload,
  QRFrameConfig,
} from '@qrcode/core';

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
  setType: (type: QRType) => void;
  setText: (text: string) => void;
  setUrl: (url: string) => void;
  setWifi: (wifi: Partial<WifiPayload>) => void;
  setPix: (pix: Partial<PixPayload>) => void;
  setEmail: (email: Partial<EmailPayload>) => void;
  setSms: (sms: Partial<SmsPayload>) => void;
  setWidth: (width: number) => void;
  setMargin: (margin: number) => void;
  setForeground: (color: string) => void;
  setBackground: (color: string) => void;
  setErrorCorrectionLevel: (level: QRSettings['errorCorrectionLevel']) => void;
  setOutputFormat: (format: QROutputFormat) => void;
  setFrame: (frame: Partial<QRFrameConfig>) => void;
  applyTemplate: (foreground: string, background: string) => Promise<void>;
  generate: () => Promise<void>;
  download: () => void;
  copyImage: () => Promise<void>;
  removeHistory: (id: string) => void;
  clearHistory: () => void;
  loadHistoryEntry: (entry: QRHistoryEntry) => void;
};

export type QRStore = QRState & QRActions;

export const useQRStore = create<QRStore>((set, get) => ({
  settings: structuredClone(DEFAULT_QR_SETTINGS),
  outputFormat: 'png',
  qrDataURL: null,
  qrSVG: null,
  generating: false,
  error: null,
  history: loadHistory(),

  setType: (type) => set((state) => ({ settings: { ...state.settings, type } })),

  setText: (text) => set((state) => ({ settings: { ...state.settings, text }, error: null })),

  setUrl: (url) => set((state) => ({ settings: { ...state.settings, url }, error: null })),

  setWifi: (wifi) =>
    set((state) => ({
      settings: { ...state.settings, wifi: { ...state.settings.wifi, ...wifi } },
      error: null,
    })),

  setPix: (pix) =>
    set((state) => ({
      settings: { ...state.settings, pix: { ...state.settings.pix, ...pix } },
      error: null,
    })),

  setEmail: (email) =>
    set((state) => ({
      settings: { ...state.settings, email: { ...state.settings.email, ...email } },
      error: null,
    })),

  setSms: (sms) =>
    set((state) => ({
      settings: { ...state.settings, sms: { ...state.settings.sms, ...sms } },
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

  setForeground: (foreground) => set((state) => ({ settings: { ...state.settings, foreground } })),

  setBackground: (background) => set((state) => ({ settings: { ...state.settings, background } })),

  setErrorCorrectionLevel: (errorCorrectionLevel) =>
    set((state) => ({ settings: { ...state.settings, errorCorrectionLevel } })),

  setOutputFormat: (outputFormat) => set({ outputFormat }),

  setFrame: (frame) =>
    set((state) => ({
      settings: { ...state.settings, frame: { ...state.settings.frame, ...frame } },
    })),

  applyTemplate: async (foreground, background) => {
    set((state) => ({ settings: { ...state.settings, foreground, background } }));
    await get().generate();
  },

  generate: async () => {
    const { settings } = get();
    const payload = buildPayload(settings);
    if (!payload) {
      set({
        error: 'Fill in the required fields to generate a QR code',
        qrDataURL: null,
        qrSVG: null,
      });
      return;
    }

    set({ generating: true, error: null });
    try {
      const [dataURL, svg] = await Promise.all([
        generateQRDataURL(settings, payload),
        generateQRSVG(settings, payload),
      ]);

      const entry: QRHistoryEntry = {
        id: crypto.randomUUID(),
        label: describePayload(settings),
        settings: structuredClone(settings),
        dataURL,
        timestamp: Date.now(),
      };

      set((state) => {
        const nextHistory = [entry, ...state.history.filter((h) => h.label !== entry.label)].slice(
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
    const { qrDataURL, qrSVG, outputFormat } = get();
    if (outputFormat === 'svg' && qrSVG) {
      downloadSVG(qrSVG);
    } else if (qrDataURL) {
      downloadQR(qrDataURL);
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
    set({
      settings: structuredClone(entry.settings),
      qrDataURL: entry.dataURL,
      qrSVG: null,
      error: null,
    }),
}));

export const selectHasQR = (state: QRStore) => state.qrDataURL !== null;

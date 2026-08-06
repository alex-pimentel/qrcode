import { describe, it, expect, beforeEach } from 'vitest';
import { useQRStore } from '@qrcode/ui';
import { DEFAULT_QR_SETTINGS } from '@qrcode/core';

describe('QR Store', () => {
  beforeEach(() => {
    useQRStore.setState({
      settings: structuredClone(DEFAULT_QR_SETTINGS),
      qrDataURL: null,
      qrSVG: null,
      generating: false,
      error: null,
    });
  });

  it('should update text', () => {
    const { setText } = useQRStore.getState();
    setText('Hello World');
    expect(useQRStore.getState().settings.text).toBe('Hello World');
  });

  it('should update url', () => {
    const { setUrl } = useQRStore.getState();
    setUrl('example.com');
    expect(useQRStore.getState().settings.url).toBe('example.com');
  });

  it('should update wifi fields', () => {
    const { setWifi } = useQRStore.getState();
    setWifi({ ssid: 'MyNet', security: 'nopass' });
    const wifi = useQRStore.getState().settings.wifi;
    expect(wifi.ssid).toBe('MyNet');
    expect(wifi.security).toBe('nopass');
  });

  it('should update frame config', () => {
    const { setFrame } = useQRStore.getState();
    setFrame({ type: 'solid', color: '#ff0000' });
    const frame = useQRStore.getState().settings.frame;
    expect(frame.type).toBe('solid');
    expect(frame.color).toBe('#ff0000');
  });

  it('should update width within bounds', () => {
    const { setWidth } = useQRStore.getState();
    setWidth(200);
    expect(useQRStore.getState().settings.width).toBe(200);
    setWidth(50);
    expect(useQRStore.getState().settings.width).toBe(100);
    setWidth(1000);
    expect(useQRStore.getState().settings.width).toBe(600);
  });

  it('should update margin within bounds', () => {
    const { setMargin } = useQRStore.getState();
    setMargin(5);
    expect(useQRStore.getState().settings.margin).toBe(5);
    setMargin(-1);
    expect(useQRStore.getState().settings.margin).toBe(0);
    setMargin(20);
    expect(useQRStore.getState().settings.margin).toBe(10);
  });

  it('should update colors', () => {
    const { setForeground, setBackground } = useQRStore.getState();
    setForeground('#ff0000');
    setBackground('#00ff00');
    expect(useQRStore.getState().settings.foreground).toBe('#ff0000');
    expect(useQRStore.getState().settings.background).toBe('#00ff00');
  });

  it('should update error correction level', () => {
    const { setErrorCorrectionLevel } = useQRStore.getState();
    setErrorCorrectionLevel('H');
    expect(useQRStore.getState().settings.errorCorrectionLevel).toBe('H');
    setErrorCorrectionLevel('L');
    expect(useQRStore.getState().settings.errorCorrectionLevel).toBe('L');
  });

  it('should set error when generating with empty fields', async () => {
    const { generate } = useQRStore.getState();
    await generate();
    const state = useQRStore.getState();
    expect(state.error).toBe('Fill in the required fields to generate a QR code');
    expect(state.qrDataURL).toBeNull();
  });

  it('should generate QR code with valid text', async () => {
    const { setText, generate } = useQRStore.getState();
    setText('https://example.com');
    await generate();
    const state = useQRStore.getState();
    expect(state.error).toBeNull();
    expect(state.qrDataURL).not.toBeNull();
    expect(state.qrDataURL).toContain('data:image/png;base64,');
  }, 10000);

  it('should auto-regenerate when applying a template', async () => {
    const { setText, applyTemplate } = useQRStore.getState();
    setText('Hello');
    await applyTemplate('#ff0000', '#ffffff');
    const state = useQRStore.getState();
    expect(state.settings.foreground).toBe('#ff0000');
    expect(state.qrDataURL).not.toBeNull();
  }, 10000);
});

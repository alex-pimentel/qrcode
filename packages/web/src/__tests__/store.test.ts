import { describe, it, expect, beforeEach } from 'vitest';
import { useQRStore } from '@qrcode/ui';

describe('QR Store', () => {
  beforeEach(() => {
    useQRStore.setState({
      settings: {
        text: '',
        width: 300,
        margin: 2,
        foreground: '#000000',
        background: '#ffffff',
        errorCorrectionLevel: 'M',
      },
      qrDataURL: null,
      generating: false,
      error: null,
    });
  });

  it('should update text', () => {
    const { setText } = useQRStore.getState();
    setText('Hello World');
    expect(useQRStore.getState().settings.text).toBe('Hello World');
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

  it('should set error when generating with empty text', async () => {
    const { generate } = useQRStore.getState();
    await generate();
    const state = useQRStore.getState();
    expect(state.error).toBe('Enter text or URL to generate a QR code');
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
});

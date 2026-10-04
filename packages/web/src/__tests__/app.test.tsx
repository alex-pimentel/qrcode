import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { App } from '@qrcode/ui';

describe('App service shell', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders inside the shared service shell without a Clerk key', () => {
    render(<App />);

    expect(document.querySelector('[data-slot="service-shell"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="header"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="footer"]')).not.toBeNull();
  });

  it('shows a graceful sign-in prompt and keeps QR generation available when Clerk is absent', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: 'Entrar' })).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Generate' })).not.toBeNull();
  });

  it('renders the QR generator under the shell title', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('QR Code Generator');
    expect(screen.getByPlaceholderText('Enter text...')).not.toBeNull();
  });
});

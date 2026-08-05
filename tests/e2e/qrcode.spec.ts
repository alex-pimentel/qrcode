import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'http://localhost:5173';

test.describe('QR Code Generator E2E', () => {
  test('should render the app correctly', async ({ page }) => {
    await page.goto(APP_URL);

    await expect(page.locator('h1')).toHaveText('QR Code Generator');
    await expect(page.getByPlaceholder('Enter URL or text...')).toBeVisible();
  });

  test('should show empty state message', async ({ page }) => {
    await page.goto(APP_URL);

    await expect(page.getByText('Enter text or a URL above and click Generate')).toBeVisible();
  });

  test('should generate QR code from URL input', async ({ page }) => {
    await page.goto(APP_URL);

    const input = page.getByPlaceholder('Enter URL or text...');
    await input.fill('https://example.com');
    await page.getByRole('button', { name: 'Generate', exact: true }).click();

    await expect(page.locator('img[alt="QR Code"]')).toBeVisible({ timeout: 10000 });
  });

  test('should disable generate button when input is empty', async ({ page }) => {
    await page.goto(APP_URL);

    const button = page.getByRole('button', { name: 'Generate', exact: true });
    await expect(button).toBeDisabled();
  });

  test('should generate QR code on Enter key', async ({ page }) => {
    await page.goto(APP_URL);

    const input = page.getByPlaceholder('Enter URL or text...');
    await input.fill('https://example.com');
    await input.press('Enter');

    await expect(page.locator('img[alt="QR Code"]')).toBeVisible({ timeout: 10000 });
  });

  test('should show download button after generation', async ({ page }) => {
    await page.goto(APP_URL);

    const input = page.getByPlaceholder('Enter URL or text...');
    await input.fill('https://example.com');
    await page.getByRole('button', { name: 'Generate', exact: true }).click();

    await expect(page.getByRole('button', { name: 'Download PNG' })).toBeVisible({
      timeout: 10000,
    });
  });

  test('should have settings panel with controls', async ({ page }) => {
    await page.goto(APP_URL);

    await expect(page.locator('#qr-width')).toBeVisible();
    await expect(page.locator('#qr-margin')).toBeVisible();
    await expect(page.locator('#qr-fg')).toBeVisible();
    await expect(page.locator('#qr-bg')).toBeVisible();
    await expect(page.getByRole('combobox').first()).toBeVisible();
  });
});

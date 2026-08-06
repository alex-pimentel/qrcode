import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'http://localhost:5173';

test.describe('QR Code Generator E2E', () => {
  test('should render the app correctly', async ({ page }) => {
    await page.goto(APP_URL);

    await expect(page.locator('h1')).toHaveText('QR Code Generator');
    await expect(page.getByPlaceholder('Enter text...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'URL' })).toBeVisible();
  });

  test('should show empty state message', async ({ page }) => {
    await page.goto(APP_URL);

    await expect(
      page.getByText('Fill in the fields and click Generate to create a QR code'),
    ).toBeVisible();
  });

  test('should generate QR code from text', async ({ page }) => {
    await page.goto(APP_URL);

    const input = page.getByPlaceholder('Enter text...');
    await input.fill('Hello world');
    await page.getByRole('button', { name: 'Generate', exact: true }).click();

    await expect(page.locator('img[alt="QR Code"]')).toBeVisible({ timeout: 10000 });
  });

  test('should generate QR code from URL type', async ({ page }) => {
    await page.goto(APP_URL);

    await page.getByRole('button', { name: 'URL' }).click();
    const input = page.getByPlaceholder('Enter URL...');
    await input.fill('https://example.com');
    await page.getByRole('button', { name: 'Generate', exact: true }).click();

    await expect(page.locator('img[alt="QR Code"]')).toBeVisible({ timeout: 10000 });
  });

  test('should switch between all QR types', async ({ page }) => {
    await page.goto(APP_URL);

    for (const label of ['Wi-Fi', 'PIX', 'Email', 'SMS']) {
      await page.getByRole('button', { name: label }).click();
      await expect(page.getByRole('button', { name: 'Generate', exact: true })).toBeVisible();
    }
  });

  test('should disable generate button when input is empty', async ({ page }) => {
    await page.goto(APP_URL);

    const button = page.getByRole('button', { name: 'Generate', exact: true });
    await expect(button).toBeDisabled();
  });

  test('should generate QR code on Enter key', async ({ page }) => {
    await page.goto(APP_URL);

    const input = page.getByPlaceholder('Enter text...');
    await input.fill('Hello world');
    await input.press('Enter');

    await expect(page.locator('img[alt="QR Code"]')).toBeVisible({ timeout: 10000 });
  });

  test('should show download button after generation', async ({ page }) => {
    await page.goto(APP_URL);

    const input = page.getByPlaceholder('Enter text...');
    await input.fill('Hello world');
    await page.getByRole('button', { name: 'Generate', exact: true }).click();

    await expect(page.getByRole('button', { name: 'Download PNG' })).toBeVisible({
      timeout: 10000,
    });
  });

  test('should add entry to history after generation', async ({ page }) => {
    await page.goto(APP_URL);

    const input = page.getByPlaceholder('Enter text...');
    await input.fill('Hello world');
    await page.getByRole('button', { name: 'Generate', exact: true }).click();

    await expect(page.getByText('History').first()).toBeVisible();
    await expect(page.getByText('Hello world').first()).toBeVisible({ timeout: 10000 });
  });

  test('should have settings panel with controls', async ({ page }) => {
    await page.goto(APP_URL);

    await expect(page.locator('#qr-width')).toBeVisible();
    await expect(page.locator('#qr-margin')).toBeVisible();
    await expect(page.getByText('Foreground')).toBeVisible();
    await expect(page.getByText('Background')).toBeVisible();
    await expect(page.getByRole('combobox').first()).toBeVisible();
  });

  test('should show frame caption input when frame is solid', async ({ page }) => {
    await page.goto(APP_URL);

    await page.getByRole('combobox', { name: 'Frame' }).click();
    await page.getByRole('option', { name: 'Solid' }).click();

    await expect(page.locator('#qr-frame-caption')).toBeVisible();

    await page.getByRole('button', { name: /Frame color/i }).click();
    await expect(page.locator('#qr-frame-color')).toBeVisible();
  });
});

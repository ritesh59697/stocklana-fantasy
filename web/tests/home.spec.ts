import { test, expect } from '@playwright/test';

test.describe('Stocklana Fantasy Landing Page & Navigation', () => {
  test('should load the landing page, verify all sections, and enter tournament', async ({ page }) => {
    // Navigate to root
    await page.goto('/');

    // 1. Verify Brand & Header
    await expect(page.getByText('Stocklana Fantasy').first()).toBeVisible();

    // 2. Verify Hero Headline & Supporting copy
    await expect(page.getByText('Fantasy trading for real markets.')).toBeVisible();
    await expect(page.getByText(/Build a \$100K virtual portfolio/i)).toBeVisible();

    // 3. Verify Key Product Stats Strip
    await expect(page.getByText('$100K').first()).toBeVisible();
    await expect(page.getByText('Virtual Capital').first()).toBeVisible();
    await expect(page.getByText('5 USDC').first()).toBeVisible();
    await expect(page.getByText('Entry Stake').first()).toBeVisible();
    await expect(page.getByText('Pyth').first()).toBeVisible();
    await expect(page.getByText('Market Data').first()).toBeVisible();

    // 4. Verify Supported Assets Strip
    await expect(page.getByRole('heading', { name: 'Supported Tokenized Equities' })).toBeVisible();
    await expect(page.getByText('AAPLx').first()).toBeVisible();
    await expect(page.getByText('NVDAx').first()).toBeVisible();
    await expect(page.getByText('TSLAx').first()).toBeVisible();
    await expect(page.getByText('SPYx').first()).toBeVisible();

    // 5. Verify How It Works Section
    await expect(page.getByRole('heading', { name: 'How It Works', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Stake', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Draft', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Lock', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Compete', exact: true })).toBeVisible();

    // 6. Verify Product Preview Section
    await expect(page.getByText('See the arena before entering')).toBeVisible();
    await expect(page.getByText('Prize Pool: $1,450.00 USDC').first()).toBeVisible();
    await expect(page.getByText('Draft Portfolio').first()).toBeVisible();

    // 7. Verify Technology Trust & Demo Transparency
    await expect(page.getByText('Built on Solana').first()).toBeVisible();
    await expect(page.getByText(/Leaderboard and prize settlement are currently demo functionality/i).first()).toBeVisible();

    // 8. Test "Enter Tournament" navigation into actual game dashboard
    const enterBtn = page.getByRole('button', { name: /Enter Tournament/i }).first();
    await enterBtn.click();

    // Verify game dashboard is loaded
    await expect(page.getByText('Draft Portfolio')).toBeVisible();
    await expect(page.getByText('Select your tokenized equities to build your roster.')).toBeVisible();
    await expect(page.getByRole('button', { name: /Select Wallet/i })).toBeVisible();

    // 9. Test return to landing page via "← Overview"
    const backBtn = page.getByRole('button', { name: /Overview/i });
    await expect(backBtn).toBeVisible();
    await backBtn.click();

    // Verify returned to landing page
    await expect(page.getByText('Fantasy trading for real markets.')).toBeVisible();
  });
});

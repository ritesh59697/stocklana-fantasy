import { test, expect } from '@playwright/test';

test('Verify visual screenshots and console errors', async ({ page }) => {
  // Mock Pyth Hermes API for fast local testing
  await page.route('**/*hermes.pyth.network/v2/updates/price/latest*', async (route) => {
    const json = {
      binary: { data: [] },
      parsed: [
        { id: "49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688", price: { price: "227400000", expo: -6 } },
        { id: "24a68280be3e8db74e92a2a0753232c941e7845dc670987178ee9eb637568578", price: { price: "119200000", expo: -6 } },
        { id: "16dad506d7db8da01c87581c87ca897a012a153557d4d578c3b9c9e1bc0632f1", price: { price: "221800000", expo: -6 } },
        { id: "19e09bb805456ada3979a7d1cbb4b6d63babc3a0f8e8a9509f68afa5c4c11cd5", price: { price: "564900000", expo: -6 } }
      ]
    };
    await route.fulfill({ json, status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
  });

  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // 1. Desktop 1440px
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.getByText('Fantasy trading for real markets.')).toBeVisible();

  // Save desktop screenshot
  await page.screenshot({ path: 'test-results/landing_desktop.png', fullPage: true });

  // 2. Mobile 375px
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.getByText('Fantasy trading for real markets.')).toBeVisible();

  // Verify horizontal overflow
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  expect(overflow).toBeFalsy();

  // Save mobile screenshot
  await page.screenshot({ path: 'test-results/landing_mobile_375.png', fullPage: true });

  // 3. Navigate to tournament
  await page.getByRole('button', { name: /Enter Tournament/i }).first().click();
  await expect(page.getByText('Draft Portfolio')).toBeVisible();

  // Save tournament screenshot
  await page.screenshot({ path: 'test-results/tournament_entered.png' });

  // 4. Back to overview
  await page.getByRole('button', { name: /Overview/i }).click();
  await expect(page.getByText('Fantasy trading for real markets.')).toBeVisible();

  expect(consoleErrors).toHaveLength(0);
});

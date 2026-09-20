import { test, expect } from '@playwright/test';

test.describe('Stocklana Fantasy Landing Page Deep Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Pyth network API
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
  });

  test('Desktop: Landing Page interactive walkthrough & modal handling', async ({ page }) => {
    await page.goto('/');

    // Check Hero elements
    await expect(page.getByText('Fantasy trading for real markets.')).toBeVisible();
    await expect(page.getByText('$100,000.00').first()).toBeVisible();

    // Check Pyth Live pill
    await expect(page.getByText(/PYTH/i).first()).toBeVisible();

    // Check How It Works modal trigger from hero
    const howItWorksBtn = page.getByRole('button', { name: 'How It Works' }).first();
    await howItWorksBtn.click();
    await expect(page.getByText('How Stocklana Fantasy Works')).toBeVisible();
    await expect(page.getByText('Protocol Architecture & Rules')).toBeVisible();

    // Close modal
    await page.locator('div.fixed button:has(svg)').first().click();
    await expect(page.getByText('Protocol Architecture & Rules')).not.toBeVisible();

    // Check Technology Disclosures
    await expect(page.getByText('Devnet Program').first()).toBeVisible();
    await expect(page.getByText('hGenhdu1tQPYJCvKF1XnemEV83eo1gQvp7LgcmRcway')).toBeVisible();
    await expect(page.getByText(/Yield integration planned/i)).toBeVisible();

    // Click Navbar Enter Tournament
    const navEnter = page.getByRole('banner').getByRole('button', { name: /Enter Tournament/i });
    await navEnter.click();

    // Verify tournament cockpit
    await expect(page.getByText('Draft Portfolio')).toBeVisible();
    await expect(page.getByText('Select your tokenized equities to build your roster.')).toBeVisible();
  });

  test('Mobile (375px): Responsive layout & zero horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    // Check headline and mobile CTA
    await expect(page.getByText('Fantasy trading for real markets.')).toBeVisible();
    const heroEnterBtn = page.getByRole('button', { name: /Enter Tournament/i }).first();
    await expect(heroEnterBtn).toBeVisible();

    // Verify no horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // Allow sub-pixel boundary

    // Test mobile enter tournament button
    await heroEnterBtn.click();
    await expect(page.getByText('Draft Portfolio')).toBeVisible();
  });

  test('Direct routing: ?view=tournament opens arena directly', async ({ page }) => {
    await page.goto('/?view=tournament');
    await expect(page.getByText('Draft Portfolio')).toBeVisible();
    await expect(page.getByText('Select your tokenized equities to build your roster.')).toBeVisible();

    // Back to overview returns to landing
    await page.getByRole('button', { name: /Overview/i }).click();
    await expect(page.getByText('Fantasy trading for real markets.')).toBeVisible();
  });
});

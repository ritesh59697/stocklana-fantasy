import { test, expect } from '@playwright/test';

test.describe('Theme & Light Mode Verification Suite', () => {
  test.beforeEach(async ({ page }) => {
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
  });

  test('Landing Page: Toggle to Light Mode, verify classes, localStorage, and visual screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Verify initial load
    await expect(page.getByText('Fantasy trading for real markets.')).toBeVisible();

    // Locate ThemeToggle in navbar
    const themeBtn = page.getByRole('button', { name: /Switch to (light|dark) mode/i }).first();
    await expect(themeBtn).toBeVisible();

    // Ensure we start in default dark mode
    await expect(page.locator('html')).toHaveClass(/dark/);
    const initialStoredTheme = await page.evaluate(() => localStorage.getItem('stocklana_theme'));
    expect(initialStoredTheme).toBe('dark');

    // Click toggle to switch to Light Mode
    await themeBtn.click();

    // Verify root html has 'light' class and does NOT have 'dark'
    await expect(page.locator('html')).toHaveClass(/light/);
    const hasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(hasDark).toBeFalsy();

    // Verify localStorage has 'light'
    const storedLightTheme = await page.evaluate(() => localStorage.getItem('stocklana_theme'));
    expect(storedLightTheme).toBe('light');

    // Screenshot Landing Page in Light Mode
    await page.screenshot({ path: 'test-results/landing_lightmode_desktop.png', fullPage: true });

    // Switch back to Dark Mode
    await themeBtn.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    const storedDarkTheme = await page.evaluate(() => localStorage.getItem('stocklana_theme'));
    expect(storedDarkTheme).toBe('dark');

    // Screenshot Landing Page in Dark Mode
    await page.screenshot({ path: 'test-results/landing_darkmode_desktop.png', fullPage: true });
  });

  test('Tournament Dashboard: Light Mode interaction, card contrast, and draft operation', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    // Directly navigate with light theme set in localStorage
    await page.addInitScript(() => {
      localStorage.setItem('stocklana_theme', 'light');
    });

    await page.goto('/?view=tournament');

    // Verify Root is immediately light (preventing FOUC)
    await expect(page.locator('html')).toHaveClass(/light/);
    await expect(page.getByText('Draft Portfolio')).toBeVisible();

    // Verify Interactive Sandbox in light mode
    await expect(page.getByText('Interactive Sandbox')).toBeVisible();

    // Test drafting an asset in light mode
    const buyButton = page.getByRole('button', { name: '+' }).first();
    await buyButton.click();

    // Verify allocation percentage updated
    await expect(page.getByText(/\d+\.\d+%/).first()).toBeVisible();

    // Save screenshot of Tournament Dashboard in Light Mode
    await page.screenshot({ path: 'test-results/tournament_lightmode.png' });

    // Open How It Works modal in light mode
    await page.getByRole('button', { name: 'How It Works' }).click();
    await expect(page.getByText('How Stocklana Fantasy Works')).toBeVisible();
    await page.screenshot({ path: 'test-results/how_it_works_lightmode.png' });

    // Close modal
    await page.locator('div.fixed button:has(svg)').first().click();
    await expect(page.getByText('Protocol Architecture & Rules')).not.toBeVisible();

    // Open Kamino Telemetry in light mode
    const kaminoTrigger = page.getByTitle('Click to view Kamino Yield Telemetry');
    await kaminoTrigger.click();
    await expect(page.getByText('Kamino DeFi Yield Telemetry')).toBeVisible();
    await page.screenshot({ path: 'test-results/kamino_telemetry_lightmode.png' });
  });

  test('Mobile (375px): Light Mode visual and layout integrity', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.addInitScript(() => {
      localStorage.setItem('stocklana_theme', 'light');
    });
    await page.goto('/');

    await expect(page.getByText('Fantasy trading for real markets.')).toBeVisible();

    // Verify no horizontal overflow in light mode
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflow).toBeFalsy();

    await page.screenshot({ path: 'test-results/landing_lightmode_mobile_375.png', fullPage: true });
  });
});

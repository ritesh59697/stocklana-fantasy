import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { width: 375, height: 812, name: 'mobile_375' },
  { width: 390, height: 844, name: 'mobile_390' },
  { width: 768, height: 1024, name: 'tablet_768' },
  { width: 1440, height: 900, name: 'desktop_1440' },
];

test.describe('Final Refinement Pass: Viewport & Layout Audit', () => {
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

  for (const vp of VIEWPORTS) {
    test(`Verify ${vp.name} (${vp.width}x${vp.height}) zero overflow and capture screenshots`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await expect(page.getByText('Stocklana Fantasy').first()).toBeVisible();
      await page.waitForTimeout(300);

      // 1. Verify zero horizontal overflow in Dark Mode
      const darkOverflow = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          innerWidth: window.innerWidth,
          hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
        };
      });

      expect(darkOverflow.hasOverflow).toBe(false);

      // 2. Capture Dark Mode Screenshot
      await page.screenshot({
        path: `/Users/ritesh/.gemini/antigravity-ide/brain/898c1a80-99ba-4815-a74d-e13684214b82/refinement_${vp.name}_dark.png`,
        fullPage: true,
      });

      // 3. Switch to Light Mode and check overflow + capture
      const themeBtn = page.getByRole('button', { name: /Switch to (light|dark) mode/i }).first();
      await themeBtn.click();
      await page.waitForTimeout(300);

      const lightOverflow = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          innerWidth: window.innerWidth,
          hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
        };
      });

      expect(lightOverflow.hasOverflow).toBe(false);

      await page.screenshot({
        path: `/Users/ritesh/.gemini/antigravity-ide/brain/898c1a80-99ba-4815-a74d-e13684214b82/refinement_${vp.name}_light.png`,
        fullPage: true,
      });
    });
  }
});

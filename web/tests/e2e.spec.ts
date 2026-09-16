import { test, expect } from '@playwright/test';

test.describe('Stocklana Fantasy Full E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Pyth network API
    await page.route('**/*hermes.pyth.network/v2/updates/price/latest*', async route => {
      const json = {
        binary: { data: [] },
        parsed: [
          { id: "49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688", price: { price: "150000000", expo: -6 } },
          { id: "24a68280be3e8db74e92a2a0753232c941e7845dc670987178ee9eb637568578", price: { price: "400000000", expo: -6 } },
          { id: "16dad506d7db8da01c87581c87ca897a012a153557d4d578c3b9c9e1bc0632f1", price: { price: "200000000", expo: -6 } },
          { id: "19e09bb805456ada3979a7d1cbb4b6d63babc3a0f8e8a9509f68afa5c4c11cd5", price: { price: "500000000", expo: -6 } }
        ]
      };
      await route.fulfill({ json, status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
    });
  });

  test('should connect wallet, stake, draft, and lock portfolio', async ({ page }) => {
    // Navigate with the mockWallet parameter to bypass wallet provider
    await page.goto('/?mockWallet=true');
    await expect(page.getByText('Stocklana Fantasy', { exact: false })).toBeVisible();

    // Initially with 0 stocks, button tells user to draft at least 1 stock
    await expect(page.getByRole('button', { name: /Draft at Least 1 Stock to Enter/i })).toBeVisible();

    // Draft AAPLx (clicking the +10 button for the first stock, which is AAPLx)
    await page.getByText('+10').first().click({ force: true });

    // Verify Stake button is now enabled
    const stakeBtn = page.getByRole('button', { name: /Stake 5 USDC & Lock Draft/i });
    await expect(stakeBtn).toBeVisible({ timeout: 10000 });
    await expect(stakeBtn).toBeEnabled();
    
    await stakeBtn.click();

    // Verify transaction receipt
    await expect(page.getByText('Portfolio Locked On-Chain!', { exact: false })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Your fantasy portfolio is officially locked into the tournament.', { exact: false })).toBeVisible();
  });
});

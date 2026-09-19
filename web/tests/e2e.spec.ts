import { test, expect } from '@playwright/test';

test.describe('Stocklana Fantasy Full E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Pyth network API
    await page.route('**/*hermes.pyth.network/v2/updates/price/latest*', async route => {
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

  test('Complete Judge Walkthrough: Connect -> Review Architecture -> Draft -> Stake & Lock -> Receipt -> Unstake', async ({ page }) => {
    // 1. Connect wallet sandbox with $100k capital
    await page.goto('/?mockWallet=true');
    await expect(page.getByText('Stocklana Fantasy', { exact: false })).toBeVisible();
    await expect(page.getByText('$100,000.00').first()).toBeVisible();

    // 2. Review Protocol Architecture modal and close it
    await page.getByRole('button', { name: /How It Works/i }).click();
    await expect(page.getByText('How Stocklana Fantasy Works')).toBeVisible();
    await expect(page.getByText('Stake 5 USDC')).toBeVisible();
    await expect(page.getByText('Zero Loss (0%)')).toBeVisible();
    // Close modal via the X button
    await page.locator('div.fixed button:has(svg)').first().click();
    await expect(page.getByText('How Stocklana Fantasy Works')).not.toBeVisible();

    // 3. Draft Stocks: Use Equal Split
    await expect(page.getByRole('button', { name: /Draft at Least 1 Stock to Enter/i })).toBeVisible();
    await page.getByRole('button', { name: /Equal Split/i }).click();

    // Verify stock allocation has updated
    await expect(page.getByText('99.4%')).toBeVisible();
    await expect(page.getByText('109 shares')).toBeVisible(); // AAPLx
    await expect(page.getByText('209 shares')).toBeVisible(); // NVDAx

    // 4. Stake 5 USDC & Lock Draft
    const stakeBtn = page.getByRole('button', { name: /Stake 5 USDC & Lock Draft/i });
    await expect(stakeBtn).toBeVisible();
    await expect(stakeBtn).toBeEnabled();
    await stakeBtn.click();

    // 5. Verify On-Chain Receipt Modal
    await expect(page.getByText('Portfolio Locked On-Chain!')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('5.00 USDC (Zero Loss)')).toBeVisible();
    await expect(page.getByText('Solana Tx Signature')).toBeVisible();

    // 6. View Live Leaderboard & Locked Portfolio
    await page.getByRole('button', { name: /View Live Leaderboard/i }).click();
    await expect(page.getByText('Your Portfolio')).toBeVisible();
    await expect(page.getByText('PORTFOLIO LOCKED')).toBeVisible();
    await expect(page.getByText('Active Tournament Entry')).toBeVisible();

    // 7. Verify Zero-Loss Unstake
    const unstakeBtn = page.getByRole('button', { name: /Unstake 5 USDC/i });
    await expect(unstakeBtn).toBeVisible();
    await unstakeBtn.click();

    // 8. Verify Capital Refunded & Arena Reset
    await expect(page.getByText(/Zero-loss verified! 5.00 USDC has been refunded/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Draft at Least 1 Stock to Enter/i })).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test.describe('Stocklana Fantasy Homepage', () => {
  test('should load the homepage and display key elements', async ({ page }) => {
    // Navigate to the local app
    await page.goto('/');

    // Check title text inside header
    await expect(page.getByText('Stocklana Fantasy', { exact: false })).toBeVisible();

    // Verify "Prize Pool" indicator is visible
    await expect(page.getByText(/Prize Pool:/i).first()).toBeVisible();
    
    // Check initial state: Should see the Draft Portfolio header
    await expect(page.getByText('Draft Portfolio')).toBeVisible();
  });
});

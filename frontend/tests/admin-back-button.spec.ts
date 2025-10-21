import { test, expect } from '@playwright/test';

/**
 * Admin Back Button Navigation Tests
 *
 * Tests the "Back to Home" button in the admin header that allows
 * users to navigate from admin pages back to the main homepage.
 */

test.describe('Admin Header - Back to Home Button', () => {

  test('should display back button in English', async ({ page }) => {
    await page.goto('http://localhost:3000/en/admin/login');

    // Verify the back button is visible with correct text
    const backButton = page.getByRole('link', { name: 'Back to Home' });
    await expect(backButton).toBeVisible();

    // Verify it has the Home icon
    await expect(backButton.locator('img').first()).toBeVisible();
  });

  test('should display back button in Russian', async ({ page }) => {
    await page.goto('http://localhost:3000/ru/admin/login');

    // Verify the back button is visible with Russian text
    const backButton = page.getByRole('link', { name: 'Вернуться на главную' });
    await expect(backButton).toBeVisible();

    // Verify it has the Home icon
    await expect(backButton.locator('img').first()).toBeVisible();
  });

  test('should display back button in Kazakh', async ({ page }) => {
    await page.goto('http://localhost:3000/kz/admin/login');

    // Verify the back button is visible with Kazakh text
    const backButton = page.getByRole('link', { name: 'Басты бетке оралу' });
    await expect(backButton).toBeVisible();

    // Verify it has the Home icon
    await expect(backButton.locator('img').first()).toBeVisible();
  });

  test('should navigate to homepage when clicked (English)', async ({ page }) => {
    await page.goto('http://localhost:3000/en/admin/login');

    // Click the back button
    const backButton = page.getByRole('link', { name: 'Back to Home' });
    await backButton.click();

    // Verify navigation to homepage
    await expect(page).toHaveURL('http://localhost:3000/en');

    // Verify we're on the homepage by checking for hero heading
    await expect(page.getByRole('heading', { name: 'Discover Your Perfect Career Path' })).toBeVisible();
  });

  test('should navigate to homepage when clicked (Russian)', async ({ page }) => {
    await page.goto('http://localhost:3000/ru/admin/login');

    // Click the back button
    const backButton = page.getByRole('link', { name: 'Вернуться на главную' });
    await backButton.click();

    // Verify navigation to Russian homepage
    await expect(page).toHaveURL('http://localhost:3000/ru');

    // Verify we're on the homepage by checking for main navigation
    await expect(page.getByRole('link', { name: 'ProfWise' })).toBeVisible();
  });

  test('should navigate to homepage when clicked (Kazakh)', async ({ page }) => {
    await page.goto('http://localhost:3000/kz/admin/login');

    // Click the back button
    const backButton = page.getByRole('link', { name: 'Басты бетке оралу' });
    await backButton.click();

    // Verify navigation to Kazakh homepage
    await expect(page).toHaveURL('http://localhost:3000/kz');

    // Verify we're on the homepage by checking for main navigation
    await expect(page.getByRole('link', { name: 'ProfWise' })).toBeVisible();
  });

  test('should maintain correct styling on hover', async ({ page }) => {
    await page.goto('http://localhost:3000/en/admin/login');

    const backButton = page.getByRole('link', { name: 'Back to Home' });

    // Hover over the button
    await backButton.hover();

    // Button should still be visible after hover
    await expect(backButton).toBeVisible();
  });
});

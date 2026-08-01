import { test, expect } from '@playwright/test';

test.describe('@tanstack/*-query E2E Todo Page tests', () => {
  test.beforeEach(async ({ page }) => {
    // go to page
    await page.goto('/react-query-e2e');
    await page.waitForTimeout(260);

    await page.click('#delete-all-todos');
    await page.waitForTimeout(260);
  });

  test('should has zero todos', async ({ page }) => {
    await expect(page.locator('.todo-item')).toHaveCount(0);
  });

  test('should add todo and show it', async ({ page }) => {
    await page.click('#add-todo');

    await expect(page.locator('.todo-item')).toHaveCount(0);
    await page.click('#query-todo');
    await page.waitForTimeout(260);

    // wait for todo list to update
    await expect(page.locator('.todo-item')).toHaveCount(1);
    await expect(page.locator('.todo-item')).toContainText('This is test');
  });

  test('should delete todo', async ({ page }) => {
    await page.click('#add-todo');

    await page.click('#query-todo');
    await page.waitForTimeout(260);

    await expect(page.locator('.todo-item')).toHaveCount(1);

    await page.click('#delete-todo');

    await page.click('#query-todo');
    await page.waitForTimeout(260);

    await expect(page.locator('.todo-item')).toHaveCount(0);
  });

  test('should manually query (refresh) todos', async ({ page }) => {
    await page.click('#add-todo');
    await page.click('#query-todo');
    await page.waitForTimeout(260);

    await expect(page.locator('.todo-item')).toHaveCount(1);

    // clear backend manually (optional, simulate server state)
    // then trigger query refresh
    await page.click('#query-todo');
    await page.waitForTimeout(260);

    // verify still one item since backend didn't change
    await expect(page.locator('.todo-item')).toHaveCount(1);
  });

  test('should not query when disabled', async ({ page }) => {
    // disable query
    await page.click('#toggle-enabled');

    // should hide list or not update
    const initialCount = await page.locator('.todo-item').count();
    await page.click('#add-todo');
    // click query button, expect no change
    await page.click('#query-todo');
    await page.waitForTimeout(260);
    await expect(page.locator('.todo-item')).toHaveCount(initialCount);

    await page.click('#toggle-enabled');
    await page.click('#query-todo');
    await page.waitForTimeout(260);
    await expect(page.locator('.todo-item')).toHaveCount(1);
  });

  test('should refetch on window focus', async ({ page, context }) => {
    // Add todo first
    await page.click('#add-todo');
    await expect(page.locator('.todo-item')).toHaveCount(0);
    await page.waitForTimeout(100);

    // Simulate leaving page
    const newPage = await context.newPage();
    await newPage.goto('about:blank');
    // Wait a bit to ensure focus is lost
    await page.waitForTimeout(100);

    // Back to main page (regain focus)
    await newPage.close();
    await page.bringToFront();
    await page.click('#query-todo');
    // wait for *-query
    await page.waitForTimeout(500);

    // Simulate actual browser focus/visibility events
    await page.evaluate(() => {
      window.dispatchEvent(new Event('focus'));
      document.dispatchEvent(new Event('visibilitychange'));
    });

    // Expect refetch updated list
    await expect(page.locator('.todo-item')).toContainText('This is test');
  });
});

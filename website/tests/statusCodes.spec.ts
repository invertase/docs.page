import { test, expect, Page } from '@playwright/test';

async function assertExists(page: Page, selector: string) {
  await page.waitForSelector(selector, { timeout: 10000 });
}

test('500', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/500');
  await assertExists(page, 'text=Error');
});

test('200', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/200');
  await assertExists(page, 'text=Hello World');
});

test('400', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/400');
  await assertExists(page, 'text=Bad Request');
});

test('404', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/404');
  await assertExists(page, 'text=Page not found');
});

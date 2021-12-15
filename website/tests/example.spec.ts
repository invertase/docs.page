import { test, expect } from '@playwright/test';

test('500', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/500');
  await page.waitForSelector('text=Error');
});

test('200', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/200');
  await page.waitForSelector('text=Hello World');
});

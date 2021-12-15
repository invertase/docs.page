import { test, expect } from '@playwright/test';

test('500', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/500');
  await page.waitForSelector('text=Error');
});

test('200', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/200');
  await page.waitForSelector('text=Hello World');
});

test('400', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/400');
  await page.waitForSelector('text=Bad Request');
});

test('404', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/404');
  await page.waitForSelector('text=Page not found');
});

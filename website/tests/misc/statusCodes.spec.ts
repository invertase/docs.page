import { test } from '@playwright/test';
import { assertExists } from '../helpers';

test('500', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/500');
  await assertExists(page, 'text=Error');
});

test('200', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/200');
  const component = await page.waitForSelector('data-test-id=documentation-provider');
  console.log(component);
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

import { expect, test } from '@playwright/test';
import { assertExists } from '../helpers';

test('500', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/500', { timeout: 5000 });
  const errorTitleContent = await page.textContent('data-testid=error-title', { timeout: 5000 });

  expect(errorTitleContent).toBe('Internal server error');
});

test('200', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/200', { timeout: 5000 });
  await assertExists(page, 'text=Hello World');
});

test('400', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/400', { timeout: 5000 });
  const errorTitleContent = await page.textContent('data-testid=error-title', { timeout: 5000 });

  expect(errorTitleContent).toBe('Bad request');
});

test('404', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/404', { timeout: 5000 });
  const errorTitleContent = await page.textContent('data-testid=error-title', { timeout: 5000 });

  expect(errorTitleContent).toBe('Page not found');
});

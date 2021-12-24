import { expect, test } from '@playwright/test';
import { assertExists } from '../helpers';

test('500', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/500', { timeout: 5000 });
  const errorTitleContent = await page.textContent('data-testid=error-title', { timeout: 5000 });
  await assertExists(page, 'data-testid=error-container')

  expect(errorTitleContent).toBe('Internal server error');
  const errorStatusCode = await page.textContent('data-testid=error-status-code', { timeout: 5000 });
  expect(errorStatusCode).toBe('500')

});

test('200', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/200', { timeout: 5000 });
  await assertExists(page, 'text=Hello World');
});

test('400', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/400', { timeout: 5000 });
  const errorTitleContent = await page.textContent('data-testid=error-title', { timeout: 5000 });
  const errorStatusCode = await page.textContent('data-testid=error-status-code', { timeout: 5000 });

  await assertExists(page, 'data-testid=error-container')
  expect(errorTitleContent).toBe('This page could not be generated');
  expect(errorStatusCode).toBe('400')
});

test('404', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/404', { timeout: 5000 });
  const errorTitleContent = await page.textContent('data-testid=error-title', { timeout: 5000 });
  await assertExists(page, 'data-testid=error-container')

  expect(errorTitleContent).toBe('This page could not be found');
  const errorStatusCode = await page.textContent('data-testid=error-status-code', { timeout: 5000 });
  expect(errorStatusCode).toBe('404')
});

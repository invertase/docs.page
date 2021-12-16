import { test } from '@playwright/test';
import { assertExists } from '../helpers';

test('Homepage  should load', async ({ page }) => {
  await page.goto('http://localhost:3001');
  await assertExists(page, 'text=docs.page');
  await assertExists(page, 'text=Instant Open Source docs with zero configuration.');
});

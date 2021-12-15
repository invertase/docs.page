import { test, expect, Page } from '@playwright/test';

const takeScreenshot = async (page: Page, fileName: string) => {
  await page.screenshot({ path: `tests/screenshots/${fileName}.png` });
};

test('200', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/200');
  await takeScreenshot(page, '200');
});

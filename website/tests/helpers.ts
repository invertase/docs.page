import { Page } from '@playwright/test';

export async function assertExists(page: Page, selector: string) {
  await page.waitForSelector(selector, { timeout: 5000 });
}

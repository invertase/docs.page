// example.spec.ts
import { test, expect } from '@playwright/test';
import { default as domains } from '../domains.json';

const stagingUrl = 'https://staging-docs-page-website-euw1-dzpolnxswq-ew.a.run.app';

// skip these as these are not working (user error)
const skipList = ['dokumentacja.otwartaturystyka.pl'];

domains.forEach(domain => {
  if (!skipList.includes(domain[0])) {
    test(`${domain[0]}`, async ({ page }) => {
      const response = await page.goto(`https://${domain[0]}`);

      expect(response).toBeDefined();
      expect(response!.status()).toBe(200);

      const screenshotName = `${domain[1]}-original.png`;
      await expect(page).toHaveScreenshot(screenshotName);

      await page.goto(`${stagingUrl}/${domain[1]}`);
      await expect(page).toHaveScreenshot(screenshotName);
    });
  }
});

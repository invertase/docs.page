// example.spec.ts
import { test, expect } from '@playwright/test';
import {default as domains} from '../domains.json';

const stagingUrl = 'https://staging-docs-page-website-euw1-dzpolnxswq-ew.a.run.app';

domains.forEach(domain => {
    test(`${domain[0]}`, async ({ page }) => {

        const response = await page.goto(`https://${domain[0]}`);

        expect(response).toBeDefined();
        expect(response!.status()).toBe(200);

        const screenshotName = `${domain[1]}-original.png`;
        await expect(page).toHaveScreenshot(`${domain[1]}-original.png`);

        await page.goto(`${stagingUrl}/${domain[1]}`)
        await expect(page).toHaveScreenshot(`${domain[1]}-original.png`);
    });
})

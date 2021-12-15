import { test, expect, Page } from '@playwright/test';

const takeScreenshot = async (page: Page, fileName: string) => {
  await page.screenshot({ path: `tests/screenshots/${fileName}.png` });
};

test('200', async ({ page }) => {
  await page.goto('http://localhost:3001/_test/200');
  await takeScreenshot(page, '200');
});


const projects = ['invertase/melos', 'csells/go_router'];
projects.forEach(project => {
  test(project, async ({ page }) => {
    await page.goto(`http://localhost:3001/${project}`);
    await takeScreenshot(page, project);
  });
});

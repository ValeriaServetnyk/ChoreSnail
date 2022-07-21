import { expect, test } from '@playwright/test';

const baseUrl = 'http://localhost:3000';

test('navigation test', async ({ page }) => {
  await page.goto(baseUrl);
  const title = page.locator('h1');
  await expect(title).toHaveText('END INEQUALITY');
});

test('Navigate to private profile', async ({ page }) => {
  await page.goto(`${baseUrl}/users/private-profile`);
  const dashboardTitle = page.locator('h1');
  await expect(dashboardTitle).toHaveText('Welcome to your dashboard sweet');
});

test('Add participants to project', async ({ page }) => {
  await page.goto(`${baseUrl}/projects/30`);
  await page.locator('text=Edit').click();
  await page.locator('text=Save').click();
  await page.locator('text=Continue').click();
});

test('Add chores to project', async ({ page }) => {
  await page.goto(`${baseUrl}/projects/30/chores`);
  const addChoreButton = page.locator('Button');
  await expect(addChoreButton).toHaveText('Add Chores');
  const choreList = await page.$$('[data-test-id^="chores-page-chores-"]');
  expect(choreList).toHaveLength(20);
});

test('Project summary page', async ({ page }) => {
  await page.goto(`${baseUrl}/projects/30/projectDashboard`);
  const projectSummaryTitle = page.locator('h1');
  await expect(projectSummaryTitle).toHaveText('Project summary');
  const shareProjectButton = page.locator('Button');
  await expect(shareProjectButton).toHaveText('Share project');
});

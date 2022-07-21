import { Page } from '@playwright/test';

const baseUrl = 'http://localhost:3000';

export default async function login(
  page: Page,
  username: string,
  password: string,
): Promise<void> {
  await page.goto(`${baseUrl}/login`);
  await page.locator('id=username').fill(username);
  await page.locator('id=password').fill(password);

  await Promise.all([
    page.waitForNavigation(),
    page.locator('button[type=submit] >> "Login"').click(),
  ]);
}

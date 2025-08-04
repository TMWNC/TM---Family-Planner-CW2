const { test, expect } = require('@playwright/test');

test('loads event groups from live JS and server', async ({ page }) => {
  // Log in if required
  await page.goto('http://localhost:3000/login');
  await page.fill('#email', 'your@test.com');
  await page.fill('#password', 'password123');
  await page.click('button[type="submit"]');

  // Go to event page
  await page.goto('http://localhost:3000/event');

  // Wait for fetchAndRenderEvents to load .EventGroup
  await page.waitForSelector('.EventGroup', { timeout: 5000 });

  const eventGroups = await page.$$('.EventGroup');
  expect(eventGroups.length).toBeGreaterThan(0);
});

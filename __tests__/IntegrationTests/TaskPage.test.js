
//////// Created 16/07/2025 by Tommy Mannix 


///////////////// Unit test suite/////////////////////////////
/// This test suite tests the generation of the task list events in the system


const { test, expect } = require('@playwright/test');

test.describe('Task Page Integration Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    
  });

  test.afterEach(async ({ page }) => {
    await page.goto('http://localhost:3000/auth/logout');
  });


  test('Task page loads with Task groups', async ({ page }) => {
    // Visit login page first (if login is needed)
    await page.fill('#email', 'test@test.com');
    await page.fill('#password', 'Password');
    await page.click('button[type="submit"]');
  
    // Navigate to the event page
    await page.goto('http://localhost:3000/tasks');
    // Wait for JS to render event groups
    await page.waitForSelector('.EventGroup');
  
    // Count how many groups are loaded
    const groups = await page.$$('.EventItem');
    expect(groups.length).toBeGreaterThan(0);
  });


  test('Task page Create model opens when selected', async ({ page }) => {
    // Visit login page first (if login is needed)
    await page.fill('#email', 'test@test.com');
    await page.fill('#password', 'Password');
    await page.click('button[type="submit"]');
  
    // Navigate to the event page
    await page.goto('http://localhost:3000/tasks');
    // Wait for JS to render event groups
    await page.waitForSelector('.EventGroup');
  
    // Count how many groups are loaded
    const groups = await page.$$('.EventItem');

    await page.click('#CreateTaskButton');
    const hasClass = await page.locator('#eventCreateModal').evaluate((el) =>
    el.classList.contains('hidden')
  );

  expect(hasClass).toBe(false);
  });




  test('Task page Create page closes when X selected', async ({ page }) => {
    // Visit login page first (if login is needed)
    await page.fill('#email', 'test@test.com');
    await page.fill('#password', 'Password');
    await page.click('button[type="submit"]');
  
    // Navigate to the event page
    await page.goto('http://localhost:3000/tasks');
    // Wait for JS to render event groups
    await page.waitForSelector('.EventGroup');

    await page.click('#CreateTaskButton');
 
  await page.click('#closeModalBtn');
  const hasClass = await page.locator('#eventCreateModal').evaluate((el) =>
  el.classList.contains('hidden')
);
  expect(hasClass).toBe(true);
  });



  
  
  
});

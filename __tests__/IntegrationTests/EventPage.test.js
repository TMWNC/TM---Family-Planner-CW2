
//////// Created 16/07/2025 by Tommy Mannix 


///////////////// Unit test suite/////////////////////////////
/// This test suite test the generation of the event list events in the system


const { test, expect } = require('@playwright/test');

test.describe('Event Page  Integration Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
   
  });

  test.afterEach(async ({ page }) => {
    await page.goto('http://localhost:3000/auth/logout');
  });


  test('event page loads with event groups', async ({ page }) => {
    // Visit login page first (if login is needed)
 
    await page.fill('#email', 'test@test.com');
    await page.fill('#password', 'Password');
    await page.click('button[type="submit"]');
  
    // Navigate to the event page
    await page.goto('http://localhost:3000/event');
  
    // Wait for JS to render event groups
    await page.waitForSelector('.EventGroup');
  
    // Count how many groups are loaded
    const groups = await page.$$('.EventGroup');
    expect(groups.length).toBeGreaterThan(0);
  });

  
  test('event  card selection shows model', async ({ page }) => {
    // Visit login page first (if login is needed)
 
    await page.fill('#email', 'test@test.com');
    await page.fill('#password', 'Password');
    await page.click('button[type="submit"]');
  
    // Navigate to the event page
    await page.goto('http://localhost:3000/event');
  
    // Wait for JS to render event groups
    await page.waitForSelector('.EventGroup');

    const buttons = await page.$$('.EventItem ');
      await buttons[0].click();
    
      const title = await page.$('.EventCardTitle');
      const text = await title.textContent();
      expect(text).toBe('Johns Birthday Party');
  
  });



test('event page loads with no events', async ({ page }) => {
  await page.fill('#email', 'test@test1.com');
  await page.fill('#password', 'test');
  await page.click('button[type="submit"]');

  // Navigate to the event page
  await page.goto('http://localhost:3000/event');

  // Wait for JS to render event groups
  await page.waitForSelector('#eventContainer p');

// Get the text content of the first <p> inside #eventContainer
const paragraphText = await page.textContent('#eventContainer p');

// Check the text is not empty or equals expected value
expect(paragraphText).toBe('No upcoming events found.'); 
});
});




test('Attempt to view events unauthenticated - should be rejected to /auth/login', async ({ page }) => {
  // Visit login page first (if login is needed)
  // Navigate to the event page
  await page.goto('http://localhost:3000/event');
  await page.waitForURL('**/login'); // wildcard pattern
  expect(page.url()).toBe('http://localhost:3000/auth/login');


  
});

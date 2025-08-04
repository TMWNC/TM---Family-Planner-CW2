
//////// Created 16/07/2025 by Tommy Mannix 


///////////////// Unit test suite/////////////////////////////
/// This test suite test the generation of the event list events in the system


const { test, expect } = require('@playwright/test');

test.describe('Login Page Integration Tests', () => {

  // go to login page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
  });
  // log out after each test
  test.afterEach(async ({ page }) => {
    await page.goto('http://localhost:3000/auth/logout');
  });


  test('Login with correct credentials', async ({ page }) => {
    // Visit login page first (if login is needed)
 
    await page.fill('#email', 'test@test.com');
    await page.fill('#password', 'Password');
    await page.click('button[type="submit"]');
  
    // Navigate to the event page
    await page.goto('http://localhost:3000/home');
  
    // Wait for JS to render event groups
    await page.waitForSelector('h1');

    const title = await page.$('h1');
    const text = await title.textContent();
    expect(text).toBe(' Hello Test User!');
  });


  
  test('Login with incorrect credentials - error message shown', async ({ page }) => {
    // Visit login page first (if login is needed)
 
    await page.fill('#email', 'test@test.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');
   // Wait for redirect or error message to appear
   await page.waitForURL('**/auth/login');

    expect(page.url()).toBe('http://localhost:3000/auth/login');
  

    // Wait for JS to render event groups
 // Wait for and assert the error message
  const errorMessage = await page.locator('p').first(); // or use more specific selector if possible
  await expect(errorMessage).toHaveText('Invalid username or password');
  });

  
  
  test('Login user name no password - error message shown', async ({ page }) => {
    // Visit login page first (if login is needed)
 
    await page.fill('#email', 'test@test.com');
   
    await page.click('button[type="submit"]');
   // Wait for redirect or error message to appear
   await page.waitForURL('**/auth/login');

    expect(page.url()).toBe('http://localhost:3000/auth/login');
  

    // Wait for JS to render event groups
 // Wait for and assert the error message
  const errorMessage = await page.locator('p').first(); // or use more specific selector if possible
  await expect(errorMessage).toHaveText('Password is required');
  });



test('Login  password  no user name- error message shown', async ({ page }) => {
  // Visit login page first (if login is needed)

 
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
 // Wait for redirect or error message to appear
 await page.waitForURL('**/auth/login');

  expect(page.url()).toBe('http://localhost:3000/auth/login');


  // Wait for JS to render event groups
// Wait for and assert the error message
const errorMessage = await page.locator('p').first(); // or use more specific selector if possible
await expect(errorMessage).toHaveText('Email is required');
});




test('Login  No username or password- error message shown', async ({ page }) => {
  // Visit login page first (if login is needed)
  await page.click('button[type="submit"]');
 // Wait for redirect or error message to appear
 await page.waitForURL('**/auth/login');

  expect(page.url()).toBe('http://localhost:3000/auth/login');


  // Wait for JS to render event groups
// Wait for and assert the error message
const errorMessage = await page.locator('p').first(); // or use more specific selector if possible
await expect(errorMessage).toHaveText('Email is required');
});
});



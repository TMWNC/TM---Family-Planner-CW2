
//////// Created 16/07/2025 by Tommy Mannix 


///////////////// Unit test suite/////////////////////////////
/// This test suite test the generation of the event list events in the system


const { test, expect } = require('@playwright/test');

test.describe('Create New user Page Integration Tests', () => {

  // go to login page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/auth/create');
  });

  test('Select create account with no values entered', async ({ page }) => {
    // Visit login page first (if login is needed)
    await page.click('button[type="submit"]');
    await page.waitForURL('**/auth/create');
    expect(page.url()).toBe('http://localhost:3000/auth/create');
  const errorMessage = await page.locator('p').first(); // or use more specific selector if possible
  await expect(errorMessage).toHaveText('Email is required');
  });

  test('Select create account with email an no other data  entered', async ({ page }) => {
    // Visit login page first (if login is needed)
    await page.fill('#email', 'test@test.com');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/auth/create');
    expect(page.url()).toBe('http://localhost:3000/auth/create');
  const errorMessage = await page.locator('p').first(); // or use more specific selector if possible
  await expect(errorMessage).toHaveText('Password is required');
  });

  test('Select create account with email,password no other data  entered', async ({ page }) => {
    // Visit login page first (if login is needed)
    await page.fill('#email', 'test@test.com');
    await page.fill('#Password', 'test');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/auth/create');
    expect(page.url()).toBe('http://localhost:3000/auth/create');
  const errorMessage = await page.locator('p').first(); // or use more specific selector if possible
  await expect(errorMessage).toHaveText('Please enter a First Name');
  });


test('Select create account with email,password,firstname no other data  entered', async ({ page }) => {
  // Visit login page first (if login is needed)
  await page.fill('#email', 'test@test.com');
    await page.fill('#Password', 'test');
    await page.fill('#FName', 'testname');
    
  await page.click('button[type="submit"]');
  await page.waitForURL('**/auth/create');
  expect(page.url()).toBe('http://localhost:3000/auth/create');
const errorMessage = await page.locator('p').first(); // or use more specific selector if possible
await expect(errorMessage).toHaveText('Please enter a Surname');
});


test('Select create account with email,password,firstname,surname and existing email address', async ({ page }) => {
  // Visit login page first (if login is needed)
  await page.fill('#email', 'test@test.com');
    await page.fill('#Password', 'test');
    await page.fill('#FName', 'testname');
    await page.fill('#SName', 'testname');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/auth/create');
  expect(page.url()).toBe('http://localhost:3000/auth/create');
const errorMessage = await page.locator('p').first(); // or use more specific selector if possible
await expect(errorMessage).toHaveText('user already exists');
});
});




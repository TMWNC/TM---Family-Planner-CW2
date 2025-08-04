
//////// Created 11/07/2025 by Tommy Mannix 


///////////////// Unit test suite/////////////////////////////
//// These unit tests are designed to test the Database module and 
/// ensure that values are correctly returned


//get mysql module
const mysqlmodule = require('../../Modules/MySqlModule');


beforeAll(async () => {
  await mysqlmodule.initDbConnection();
});

afterAll(() => {
  mysqlmodule.closeConnection();
});
// unit tests hashing checks
describe('Database Unit Tests', () => {

/////////// Test 1 ///////////////////////////////////////
////////// get hashed password for a user attempting login 
test('get hashed password for a user attempting login ', async () => {
  const result = await mysqlmodule.gethash('test@test.com');
  expect(result).toBeDefined();
  expect(result[0][0].Password).toBe('$2b$10$pwuqnp4J4VvR5bP5UoNCcOrvHWNxZd84dG24G20oWNXlrECIL/B8a');

});

/////////// Test 2 ///////////////////////////////////////
////////// get User information for a confirmed user 
test('get User information for a confirmed user after authentication ', async () => {
  const result = await mysqlmodule.GetUserInfoLogin(1);
  expect(result).toBeDefined();

  console.log(result[0][0]);
  expect(result[0][0].FirstName).toBe('Test');
});


/////////// Test 3 ///////////////////////////////////////
////////// get User information for a confirmed user 
test(' get User information for a confirmed user a', async () => {
  const result = await mysqlmodule.GetUserInfoLogin(1);
  expect(result).toBeDefined();

  console.log(result[0][0]);
  expect(result[0][0].FirstName).toBe('Test');
});

});
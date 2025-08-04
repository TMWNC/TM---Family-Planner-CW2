
//////// Created 09/07/2025 by Tommy Mannix 


///////////////// Unit test suite/////////////////////////////
//// This unit tests the hashing module to ensure that values are compard correctly


//get the hasing middleware
const hashing = require('../../middleware/Hashing');

// unit tests hashing checks
describe('Password hash verification', () => {

////////// Matching passwords
test('compare plain text to hashed - correct plaintext', async () => {
  const result = await hashing.verifyhash('Password', '$2b$10$WoIbeWRgomAqJoeoH4scnuZKhXhMcI8Q.ELxfo2LX5TCfb24X3bqa');
  expect(result).toBe(true);
});


/// non-matching passwords

test('compare plain text to hashed - incorrect plaintext', async () => {
  const result = await hashing.verifyhash('password', '$2b$10$WoIbeWRgomAqJoeoH4scnuZKhXhMcI8Q.ELxfo2LX5TCfb24X3bqa');
  expect(result).toBe(false);
});
});
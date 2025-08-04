// Created 16/07/2025 by Tommy Mannix
// This middleware uses Express-rate-limit to protect the webserver from DDos
// requires npm install Express-rate-limit 
// this is then instantiated on the index.JS page 

const rateLimit = require('Express-rate-limit');

// this a global rate limit where in a 15 minute window there can be 100 refreshes 
// of a connection to the server before it is decided to be brute force or malicious
// once 100 refreshes have taken place return status 429 too many requests
const rateLimiting = rateLimit(
    { windowMs: 15 * 60 * 1000, max: 100 }
);


// Login-specific rate limiter: only 5 attempts per 15 minutes
// Used to protect sensitive routes like /login from brute-force attacks.
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3, // lower to 3 attempts for login
    message: 'Too many login attempts. Please try again later.',
  });

  module.exports = {
    rateLimiting,
    loginLimiter
  };
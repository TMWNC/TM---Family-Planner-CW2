
///////// Created 07/07/2025 by Tommy Mannix ///////////////////////
////////////////////////////////////////////////////////////////////
/////////////////// Session set up//////////////////////////////////
////////////////////////////////////////////////////////////////////
//session allocation and management 
const session = require('express-session');

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'fallback-secret', // ensure fallback for tests
  resave: false, // avoid unnecessary resaves
  saveUninitialized: false, // don't create empty sessions
  cookie: {
    secure: false, // must be false for supertest (which uses HTTP)
    httpOnly: true, // prevents JS access to cookie
    maxAge: 1000 * 60 * 60 // 1 hour — optional
  }
});
  module.exports = {sessionMiddleware};
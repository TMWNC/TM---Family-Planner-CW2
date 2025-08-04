
///////// Created 11/07/2025 by Tommy Mannix ///////////////////////
/// This middleware configures and secures the web application from 
/// cross site scripting the Zanini's (2023) guide has been used 
// to support confguration
////////////////////////////////////////////////////////////////////


// Content secure policy and protection from cross site scripting
const helmet = require('helmet');

const helmetConfiguration = 
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ['\'self\''],
      scriptSrc: ['\'self\''],
    },
  });

  module.exports = {helmetConfiguration};

////////////////////////////////////////////////////////////////////////
////////////     Created 06/07/2025 by Tommy Mannix ///////////////////
/////////// This  is the main start up server script for the web 
/////////// application and handles routing and configuration of the server



///////////////// include dependencies/////////////////////////////////
const express = require('express');

// environment variable access 
require('dotenv').config();
// custom pathing
const path = require('path');

// error messages on front end 
const flash = require('connect-flash');




//////////////////////// Middle ware linkages////////////////////////////
////////////////////// Middle ware configuration is in /middleware///////
const SessionSetup = require('./middleware/SessionDetails');

///////////////// set up the app system ///////////////////////////////////
// configure express view engine
const app = express();
app.use(express.json());

/// Configure to use ejs View engine
app.set('view engine', 'ejs'); 


///////////////Enable helmet content secure policy//////////////////////////
//////////// Configuration stored in /middleware/HelmetSetup.js////////////
const helmetconfig = require('./middleware/HelmetSetup');
app.use(helmetconfig.helmetConfiguration);

// assign a port from the .env file
const PORT = process.env.PORT || 3000;

//Set up the public folder for public assets such as CSS files
app.use('/public', express.static(path.join(__dirname, 'public')));


///////// set up routing files for use within the server instance//////////
///////// all routes are stored in /routes ////////////////////////////////
const homerouter = require('./Routes/HomeRoute');
const AuthRouter = require('./Routes/AuthRoute');
const eventRouter = require('./Routes/EventsRoute');
const apiRouter = require('./Routes/Api');
const taskRouter = require('./Routes/TasksRoute');
const groupRouter = require('./Routes/groupRoute');
//////////// Set up the usage of JSON and Urlencoding within Express
app.use(express.json()); // For parsing JSON request bodies
app.use(express.urlencoded({ extended: true })); // For parsing form-encoded data



/////// assign session usage using /middleware/Sessionsetup
app.use(SessionSetup.sessionMiddleware); 

////////////////// Flash message middleware set up /////////////////////
app.use(flash());
const flashconfig = require('./middleware/FlashMessages');
app.use(flashconfig.flashmessages);


////////////////// Set up routing end points////////////////////////////
app.use('/home',homerouter); // load /home routes
app.use('/auth',AuthRouter); // load y /auth routes
app.use('/event',eventRouter); // load  /event routes
app.use('/api',apiRouter); // load  /event routes
app.use('/tasks',taskRouter); // load  /tasks routes
app.use('/groups',groupRouter); // load  /tasks routes

////////////////// instantiate Rate limiting middleware///////////////////
/// config in /Middleware/rateLimit 
const rateLimitConfig = require('./middleware/rateLimit');
app.use(rateLimitConfig.rateLimiting);

//////////////// Default route redirect to login page if there is not an active session
app.get('/', async(req, res) => {
    res.redirect('./auth');
    });
    //////////////// Start the server//////////////////////////////
    
    /// make the server listen on the port
    app.listen(PORT, () => {
      console.log(`HTTPS server running at https://localhost:${PORT}`);
    });
    

    module.exports = app; 
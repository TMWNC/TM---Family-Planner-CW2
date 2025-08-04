// Created 08/07/2025 by Tommy Mannix

////////////////////////////////////////////////////////
////////// This route caters for all /auth routes
////////////////////////////////////////////////////////


const express = require('express');
const router =  express.Router();


const validation = require('../middleware/Validation');
const { validationResult } = require('express-validator');
const rateLimiting = require('../middleware/rateLimit');
/////////////////////////////////////////////////////////
////// Middle ware that will be needed for route/////////
// Check authorisation of express sessions 
const CheckAuth = require('../middleware/checkauth');

//get the hasing middleware
const hashing = require('../middleware/Hashing');


// get mysql module middleware 
const MySqlModule = require('../Modules/MySqlModule');

//////////////////////////////////////////////////////////
//////             Start of routes     ///////////////////


//// Default GET Route for /auth
 router.get('/', async(req, res) => {
    res.redirect('./auth/login');
 });






//////////////////////////////////////////////////////////
//////             /auth/login         ///////////////////


////  GET Route for /auth/Login
router.get('/login', async(req, res) => {
    

         res.render('../Views/~login/login');


});

//// Default POST Route for /auth/login
// Destroy the session object and log the user out rateLimiting.loginLimiter
router.post('/login',/*validation.validateLogin,*/ async(req, res) => {


  // check the validation
  const errors = validationResult(req);
  // if there is an error that is detected from the validation
  if (!errors.isEmpty()) {
    // get the first error
    const firstError = errors.array()[0].msg;
    // flash the first error
    req.flash('error_msg', firstError);
    // redirect out
    res.redirect('/auth/login');
  }





// get password passed from front end
  const password = req.body.password;
const username = req.body.email;


try{

// retrieve the users credentials from the database
const hashedpassword = await MySqlModule.gethash(username);
// convert the database row to JSON
const jsonRow = JSON.parse(JSON.stringify(hashedpassword[0]));
// test plain text password against hashed version


const testvalue = await hashing.verifyhash(password,jsonRow[0].Password);

// if it matches assign a session id and move on 
if(testvalue){
// assing the userID into the session
  req.session.userID = jsonRow[0].UserID; // Set session identifie

// get the logged in users name 
  const userdata = await MySqlModule.GetUserInfoLogin(req.session.userID);


  const jsonUserData = JSON.parse(JSON.stringify(userdata[0]));

// enter the users name into a session object
  req.session.userName = jsonUserData[0].FirstName + ' ' + jsonUserData[0].Surname;
  // redirect to the home page now authenticated
  res.redirect('/home');
  
}
// otherwise flash an error message
else
{

req.flash('error_msg', 'Invalid username or password');
return res.redirect('/auth/login');
}


}
catch (err){

  console.log(err);
  req.flash('error_msg', 'Invalid username or password');
 return res.redirect('/auth/login');
}



  });
  

//////////////////////////////////////////////////////////
//////             /auth/logout         ///////////////////


//// Default POST Route for /auth/logout
// Destroy the session object and log the user out
router.post('/logout', CheckAuth.requireAuth, async(req, res) => {


req.session.destroy();
 res.redirect('/auth/login');
});


////  GET Route for /auth/logout
router.get('/logout', CheckAuth.requireAuth, async(req, res) => {
  req.session.destroy();
 res.redirect('/auth/login');
});


 

//// Default POST Route for /auth/logout
// Destroy the session object and log the user out
router.post('/Create',validation.validateRegister, async(req, res) => {
  

  // check the validation
  const errors = validationResult(req);
  // if there is an error that is detected from the validation
  if (!errors.isEmpty()) {

    // get the first error
    const firstError = errors.array()[0].msg;
    // flash the first error
    req.flash('error_msg', firstError);
    // redirect out
    res.redirect('/auth/create');
  }

try{
  // store the passed values from the body
  const email = req.body.email;
  const Fname= req.body.FName;
  const Sname= req.body.SName;
  const plaintextPassword = req.body.Password;

  // hash the password
  const hashedPassword = await hashing.generatehash(plaintextPassword);

  // create the user 
  const created = await MySqlModule.createUser(email,Fname,Sname,hashedPassword);

  console.log(created)
 // if there is a new user created
  if(created){
    // flash account created to the user on the log in page
  req.flash('error_msg', 'Account created log in now');
res.redirect('/auth/login');

  }
  // otherwise show an error
  else{
  //  req.flash('error_msg', 'user already exists');
    res.redirect('/auth/login');
  }
 // req.session.destroy();
   //res.redirect("/auth/login");
  }
  catch{
    req.flash('error_msg', 'unknown error - contact admin');
    res.redirect('/auth/create');
  }


  });

  ////  GET Route for /auth/logout
  router.get('/Create', async(req, res) => {
   // req.session.destroy();
   res.render('../Views/~login/CreateUser');
 //  res.redirect("/auth/login");
  });



  module.exports = router;
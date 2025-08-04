

// Created 08/07/2025 by Tommy Mannix

//////////////////////////////////////////////////////////////////////////////////
//// This middleware checks the authentication of a users session, if it is valid 
/// the attached route will continue otherwise it will redirect to auth/login
/////////////////////////////////////////////////////////////////////////////////

// check the authorisation from the session values
const requireAuth = (req, res, next) => {

  
    // check user ID if it is present in the session cookie continue
    if (req.session.userID) {
        next(); 

        // otherwise default to auth/login
    } else {
        console.log('NOT AUTHORISED!');
        res.redirect('../../auth/login'); // User is not authenticated, redirect to login page
    }
};


module.exports = {requireAuth};
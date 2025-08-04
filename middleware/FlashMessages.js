

// Created 09/07/2025 by Tommy Mannix

//////////////////////////////////////////////////////////////////////////////////
//// This middleware  sets up the use of flash middle ware for error messages 
/////////////////////////////////////////////////////////////////////////////////

// check the authorisation from the session values
const flashmessages = (req, res, next) => {

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
};


module.exports = {flashmessages};
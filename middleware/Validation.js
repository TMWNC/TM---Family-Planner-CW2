
// Created 09/07/2025 by Tommy Mannix

//////////////////////////////////////////////////////////////////////////////////
//// This middleware the use of validation on End points to secure them from 
//// invalid inputs and SQL injection 
//// This system operates on Express validator and is separated by function for
//// each end point
/////////////////////////////////////////////////////////////////////////////////
const { body, query } = require('express-validator');


/// Validation for Registration page for new users  For all ensure iti s trimmed and escaped
// to protect from SQL injection
const validateRegister = [
    // email input
body('email').notEmpty().withMessage('Email is required')
.isEmail().withMessage('Please enter a valid Email')
.normalizeEmail().escape().trim(),
 // password input
body('Password').notEmpty().withMessage('Password is required')
.escape().trim(),

//Fore name input
body('FName').notEmpty().withMessage('Please enter a First Name')
.escape().trim(),


// surname input
body('SName').notEmpty().withMessage('Please enter a Surname')
.escape().trim()

];




////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

/// Validation for login page for existing users it is  trimmed and escaped
// to protect from SQL injection
const validateLogin = [
    // Email input
    body('email').notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid Email')
    .normalizeEmail().escape().trim(),
    // Password in plain text input
    body('password').notEmpty().withMessage('Password is required')
    .escape().trim(),
    
    ];
    

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

/// Validation for /api/getdetailtask it is  trimmed and escaped
// to protect from SQL injection
const validateDetailTask = [
    // Email input
    query('taskID').notEmpty().withMessage('TaskIDisrequired')
    .isNumeric().withMessage('Please enter a valid number')
   .escape().trim(),
 
    
    ];
    

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

/// Validation for /api/updateTaskStatus it is  trimmed and escaped
// to protect from SQL injection
const validateUpdateTaskStatus = [
    // Email input
    body('taskID').notEmpty().withMessage('TaskID isrequired')
    .isNumeric().withMessage('Please enter a valid number')
   .escape().trim(),
   body('status').notEmpty().withMessage('statusisrequired')
   .isBoolean().withMessage('Please enter a valid number')
  .escape().trim(),
    
    ];
    

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

/// Validation for /api/getUserGroups it is  trimmed and escaped
// to protect from SQL injection
const validategetUserGroups = [
    // Email input
    query('UserID').notEmpty().withMessage('UserID isrequired')
    .isNumeric().withMessage('Please enter a valid number')
   .escape().trim(),
 
    
    ];
    



////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

/// Validation for Get Event Detail
// to protect from SQL injection
const validateGetEventDetail = [
    // Email input
    query('EventID').notEmpty().withMessage('EventID is required')
    .isNumeric().withMessage('Please enter a valid number')
    .escape().trim(),
    
    ];
    

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

/// Validation for Get Event Detail
// to protect from SQL injection
const validateUpdateSubTask = [
    // Email input
    body('subtaskID').notEmpty().withMessage('subtaskID1 is required')
    .isNumeric().withMessage('Please enter a valid number')
    .escape().trim(),
    body('checkvalue').notEmpty().withMessage('checkvalue is required')
    .isBoolean().withMessage('Please enter a boolean value')
    .escape().trim(),
    ];
    

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

/// Validation for Get Event Detail
// to protect from SQL injection
const validateFindMember = [
    // Email input
    query('email')
    .escape().trim()
    
    ];
    


    
/// Validation for Get Event Detail
// to protect from SQL injection
const validateCreateGroup = [
    // Email input
    body('groupName')
    .escape().trim(),

   
    body('members').isArray(),
  body('members.*.userID').notEmpty().withMessage('UserID is required'),
  body('members.*.permission').notEmpty().withMessage('UserID is required')
    ];



      
/// Validation for Get Event Detail
// to protect from SQL injection
const validateViewGroup = [
    // Email input
    query('groupID')
    .escape().trim(),

 
    ];



    
/// Validation for invite respo
// to protect from SQL injection
const validateGroupinviteResponse= [
    // Email input
    body('groupID')
    .escape().trim(),

 
    ];
    
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
module.exports = {
    validateRegister,
    validateLogin,
    validateGetEventDetail,
    validateDetailTask,
    validateUpdateSubTask,
    validateUpdateTaskStatus,
    validategetUserGroups,
    validateFindMember,
    validateCreateGroup,
    validateViewGroup,
    validateGroupinviteResponse
  };


// Created 15/07/2025 by Tommy Mannix

////////////////////////////////////////////////////////
////////// This route caters for all /tasks routes
////////////////////////////////////////////////////////


const express = require('express');
const router =  express.Router();

const validation = require('../middleware/Validation');
const { validationResult } = require('express-validator');

/////////////////////////////////////////////////////////
////// Middle ware that will be needed for route/////////
// Check authorisation of express sessions for protected end points
const CheckAuth = require('../middleware/checkauth');
const { body } = require('express-validator');
const MySqlModule = require('../Modules/MySqlModule');


//////////////////////////////////////////////////////////
//////             Start of routes     ///////////////////
//////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////
//////             /tasks        ///////////////////

//////////////// This the events page as a rendered page
///////////////
router.get('/', CheckAuth.requireAuth, async(req, res) => {
  try{
    res.render('../Views/~Task/Task');
  }
  catch{
    res.json('no events');
  }
      
   });
  


    //// Created 24/07/2025 
//////////////////////////////////////////////////////////
//////             /tasks/create ///////////////////
//////////////// this creates a new tasks
router.post('/create', CheckAuth.requireAuth, async(req, res) => {
  // check the validation
 const errors = validationResult(req);
 // if there is an error that is detected from the validation
 if (!errors.isEmpty()) {
   // get the first error
   const firstError = errors.array()[0].msg;
   // flash the first error
   req.flash('error_msg', firstError);

   console.log(firstError);
   // redirect out
   return res.status(400).json({ success: false, error: firstError }); 
 }
try{

console.log(req.body)

 //const currentTasks = await MySqlModule.GetTaskTypes ()


//return res.json(currentTasks)

 const eventdetails = req.body.eventDetails

 console.log(eventdetails)
 const attendees = req.body.attendees;
 const tasks = req.body.tasklist;
   // Extract input values
   const [
    { EventValue: taskName },
    { EventValue: taskType },
    { EventValue: dueDate },
    { EventValue: taskDescription },
    { ItemValue: taskitem },
    { ItemValue: taskitems },
    { ItemValue: paricipant },
  
  ] = eventdetails;
  
  const attendeesJSON = Array.isArray(attendees) ? attendees : JSON.parse(attendees);
  
  const tasklist = Array.isArray(tasks) ? tasks : JSON.parse(tasks);

  const response = await MySqlModule.CreateTaskWithUsersAndSubtasks(
    taskName,taskType,dueDate,taskDescription,req.session.userID,JSON.stringify(attendeesJSON),JSON.stringify(tasklist))


  }
  catch(err){
    console.log(err);
    res.json('no events');
    return res.status(500).json({ success: false, error: 'Server error while declining invite.' });
  }
      
   });

   





  module.exports = router;
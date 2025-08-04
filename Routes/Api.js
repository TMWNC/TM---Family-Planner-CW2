

// Created 15/07/2025 by Tommy Mannix

////////////////////////////////////////////////////////
////////// This route caters for all /api routes 
////////////////////////////////////////////////////////


const express = require('express');
const router =  express.Router();

/////////////////////////////////////////////////////////
////// Middle ware that will be needed for route/////////
// Check authorisation of express sessions for protected end points
const CheckAuth = require('../middleware/checkauth');
const MySqlModule = require('../Modules/MySqlModule');

// module to group dates together
const groupEvents = require('../Modules/groupDates'); 
const validation = require('../middleware/Validation');
const { validationResult } = require('express-validator');
//////////////////////////////////////////////////////////
//////             Start of routes     ///////////////////
//////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////
//////             /api       ///////////////////

//////////////// This returns a JSON list of any events for the logged in user
/////////////// and works with asyncronus calls from the front end
router.get('/', CheckAuth.requireAuth, async( res) => {
  try{
    res.render('../Views/~Event/Events');
  }
  catch{
    res.json('no events');
  }
      
   });
  





//////////////////////////////////////////////////////////
//////             /api/getEventDetail?EventID=1        ///////////////////
///// Pass into it URL parameter EventID 

//////////////// This returns a JSON list of any events for the logged in user
/////////////// and works with asyncronus calls from the front end
 router.get('/getEventDetail', CheckAuth.requireAuth,validation.validateGetEventDetail, async(req, res) => {


   // check the validation
   const errors = validationResult(req);
   // if there is an error that is detected from the validation
   if (!errors.isEmpty()) {
     // get the first error
     const firstError = errors.array()[0].msg;
     // flash the first error
     req.flash('error_msg', firstError);
     // redirect out
     res.json(firstError);
   }
 
   


try{
  const  EventID  = req.query.EventID || null;
  // get the list of raw events from the database

  const eventlist = await MySqlModule.GetDetailedEventView(EventID,req.session.userID);
  
  console.log(eventlist)

  // return the grouped item
   res.json(eventlist);
}
catch{
  res.json('no events');
}
    
 });




//////////////////////////////////////////////////////////
//////             /api/getEventList        ///////////////////

//////////////// This returns a JSON list of any events for the logged in user
/////////////// and works with asyncronus calls from the front end
router.get('/getEventList', validation.validateGetEventDetail, CheckAuth.requireAuth, async(req, res) => {
  try{
  
    
    // get the list of raw events from the database
    const eventlist = await MySqlModule.GetListOfEvents(req.session.userID);
    
    // group together the dates using the middleware
    const grouped = groupEvents(eventlist);
  
    // return the grouped item
     res.json(grouped);
  }
  catch{
    res.json('no events');
  }
      
   });
  

  


  
//////////////////////////////////////////////////////////
//////             /api/getMembersInAllGroups        ///////////////////

//////////////// This returns a JSON list of any events for the logged in user
/////////////// and works with asyncronus calls from the front end
router.get('/getMembersInAllGroups', CheckAuth.requireAuth, async(req, res) => {
  try{
  
    
    // get the list of raw events from the database
    const memberlist = await MySqlModule.GetListOfEvents(req.session.userID);
    
    
  
    // return the grouped item
     res.json(memberlist);
  }
  catch{
    res.json('no events');
  }
      
   });
  

  
  



  
//////////////////////////////////////////////////////////
//////             /api/getListOfEventTypes        ///////////////////

//////////////// This returns a JSON list of all event types stored in the database
router.get('/getListOfEventTypes', CheckAuth.requireAuth, async(req, res) => {
  try{
  
    
    // get the list of raw events from the database
    const EventTypeList = await MySqlModule.GetListOfEventTypes(req.session.userID);
    
    
  
    // return the grouped item
     res.json(EventTypeList);
  }
  catch{
    res.json('no events');
  }
      
   });
  






  
//////////////////////////////////////////////////////////
//////             /api/getTaskList        ///////////////////

//////////////// This returns a JSON list of any tasks for the logged in user
/////////////// and works with asyncronus calls from the front end
router.get('/getTaskList', validation.validateGetEventDetail, CheckAuth.requireAuth, async(req, res) => {
  try{
  
    
    // get the list of raw events from the database
    const TaskList = await MySqlModule.GetListOfUserTasks(req.session.userID);
    
    // group together the dates using the middleware
    const grouped = groupEvents(TaskList);
  
    // return the grouped item
     res.json(grouped);
  }
  catch(err){
    console.log(err);
    res.json('no events');
  }
      
   });
  
 
  



  
  
//////////////////////////////////////////////////////////
//////             /api/getTaskDetail        ///////////////////

//////////////// This returns a JSON list of a task for the logged in user
/////////////// and works with asyncronus calls from the front end
router.get('/getTaskDetail', validation.validateDetailTask, CheckAuth.requireAuth, async(req, res) => {
 
 
  // check the validation
 const errors = validationResult(req);
 // if there is an error that is detected from the validation
 if (!errors.isEmpty()) {
   // get the first error
   const firstError = errors.array()[0].msg;
   // flash the first error
   req.flash('error_msg', firstError);
   // redirect out
   res.json(firstError);
 }



try{
  
  // get the task ID in the URL parameter
  const taskid = req.query.taskID;
    
    // get the list of raw events from the database
    const TaskList = await MySqlModule.getDetailedTask(req.session.userID,taskid);
    

    // return the grouped item
     res.json(TaskList);
  }
  catch(err){
    console.log(err);
    res.json('no events');
  }
      
   });
  





  
//////////////////////////////////////////////////////////
//////             /api/updateSubtask      ///////////////////

//////////////// This value updates the database with the updated sub task completion asyncronously
router.post('/updateSubtask', validation.validateUpdateSubTask, CheckAuth.requireAuth, async(req, res) => {
 
 
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
   return res.json({ success: false, error: firstError });
 }



try{
  
  // get the task ID in the URL parameter
  const subtaskID = req.body.subtaskID;
  const rawValue = req.body.checkvalue;
  const checkvalue = rawValue === true || rawValue === 'true' || rawValue === 1 || rawValue === '1' ? 1 : 0;
  


    // get the list of raw events from the database
    const TaskList = await MySqlModule.UpdateSubtaskStatus(subtaskID,req.session.userID,checkvalue);


    // return an ok code to the client
    res.status(200).json({ success: true });
  }
  catch(err){
    console.log(err);
    res.json('no events');
  
  }
      
   });
  




   

  //// Created 16/07/2025 
//////////////////////////////////////////////////////////
//////             /api/updateTaskStatus      ///////////////////
//////////////// This value updates the database with the updated  task completion asyncronously
router.post('/updateTaskStatus', validation.validateUpdateTaskStatus, CheckAuth.requireAuth, async(req, res) => {
 
 
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
   return res.json({ success: false, error: firstError });
 }



try{
  
  // get the task ID in the URL parameter
  const taskID = req.body.taskID;
  const rawValue = req.body.status;
  const checkvalue = rawValue === true || rawValue === 'true' || rawValue === 1 || rawValue === '1' ? 1 : 0;
  


    // get the list of raw events from the database
    const TaskList = await MySqlModule.UpdateTaskStatusByUser(taskID,checkvalue,req.session.userID);
  

    // return an ok code to the client
    res.status(200).json({ success: true });
  }
  catch(err){
    console.log(err);
    res.json('no events');
  
  }
      
   });
  


   
  //// Created 21/07/2025 
//////////////////////////////////////////////////////////
//////             /api/ListUserGroups      ///////////////////
//////////////// this end point returns a list of the groups a user is a part of 
router.get('/ListUserGroups', CheckAuth.requireAuth, async(req, res) => {
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
   return res.json({ success: false, error: firstError });
 }
try{
  
  


    // get the list of raw events from the database
    const grouplist = await MySqlModule.GetUsersGroups(req.session.userID);
    

    // return an ok code to the client
    res.status(200).json({ grouplist });
  }
  catch(err){
    console.log(err);
    res.json('no events');
  
  }
      
   });
  

   
  //// Created 21/07/2025 
//////////////////////////////////////////////////////////
//////             /api/ListPendingInvites     ///////////////////
//////////////// this end point returns a list of the groups a user is a part of 
router.get('/ListPendingInvites', CheckAuth.requireAuth, async(req, res) => {
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
   return res.json({ success: false, error: firstError });
 }
try{
  
  


    // get the list of raw events from the database
    const grouplist = await MySqlModule.GetUsersInvites(req.session.userID);
  

    // return an ok code to the client
    res.status(200).json({ grouplist });
  }
  catch(err){
    console.log(err);
    res.json('no events');
  
  }
      
   });


    
  //// Created 21/07/2025 
//////////////////////////////////////////////////////////
//////             /api/findmember ///////////////////
//////////////// this end point returns the USerID for a passed member email 
// only accepts full emails not partials
router.get('/findmember',validation.validateFindMember, CheckAuth.requireAuth, async(req, res) => {
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
   return res.json({ success: false, error: firstError });
 }
try{
  
  const email = req.query.email


    // get the list of raw events from the database
    const emaillist = await MySqlModule.GetUserFromEmail(email);

    // return an ok code to the client
    res.status(200).json({ emaillist });
  }
  catch(err){
    console.log(err);
    res.json('no events');
  
  }
      
   });
  
   


   
  //// Created 21/07/2025 
//////////////////////////////////////////////////////////
//////             /api/CreateGroup ///////////////////
//////////////// this end point allows the creation of a new group
// only accepts full emails not partials
router.post('/CreateGroup',validation.validateCreateGroup, CheckAuth.requireAuth, async(req, res) => {
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
   return res.json({ success: false, error: firstError });
 }
try{

  
  const { groupName, members } = req.body;



const creategroup = await MySqlModule.CreateGroupWithPermissions(groupName,  JSON.stringify(members),req.session.userID)

  res.json({ message: "Group received", groupName, members });


  }
  catch(err){
    console.log(err);
    res.json('no events');
  
  }
      
   });
  


   
  //// Created 21/07/2025 
//////////////////////////////////////////////////////////
//////             /api/viewGroup ///////////////////
//////////////// this end point allows the creation of a new group
// only accepts full emails not partials
router.get('/viewGroup',validation.validateViewGroup, CheckAuth.requireAuth, async(req, res) => {
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
   return res.json({ success: false, error: firstError });
 }
try{

  
  const groupID=  req.query.groupID;


const grouplist = await MySqlModule.GetGroupDetails(groupID,req.session.userID)

  res.json(grouplist);
  }
  catch(err){
    console.log(err);
    res.json('no events');
  
  }
      
   });


    //// Created 21/07/2025 
//////////////////////////////////////////////////////////
//////             /api/updategroup ///////////////////
//////////////// this end point allows the creation of a new group
// only accepts full emails not partials
router.post('/updategroup', CheckAuth.requireAuth, async(req, res) => {
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
   return res.json({ success: false, error: firstError });
 }
try{

  console.log(req.body)
  
  const groupID=  req.body.groupID;
  const members = req.body.members
  const groupName= req.body.groupName

const grouplist = await MySqlModule.GetGroupDetails(groupID,req.session.userID)


console.log(grouplist[0])

// check to make sure the logged in user is the owner before commiting edit
if(grouplist[0].IsCurrentUserOwner != 1)
{

  return res.status(403).json({ success: false, message: 'Forbidden' });
  // if they are not then reject as forbidden
}


/////// Identify users to delete and insert within the groups
// 1. Convert existing and new members into maps for easy lookup
const existingMap = new Map(); // userID -> permission
grouplist.forEach(m => existingMap.set(String(m.UserID), String(m.GroupRoleID)));

const newMap = new Map(); // userID -> permission
members.forEach(m => newMap.set(String(m.userID), String(m.permission)));

//  Identify members to delete (in DB but not in my passed JSON)
const toDelete = [...existingMap.keys()].filter(id => !newMap.has(id));

// 3. Identify members to insert (in new JSON but not in DB)
const toInsert = members.filter(m => !existingMap.has(String(m.userID)));

// 4. Identify members to update (in both, but with different permission)
const toUpdate = members.filter(m => {
  const existingPerm = existingMap.get(String(m.userID));
  return existingPerm && existingPerm !== String(m.permission);
});

// itereate through and make the updatess

// update the permissions 
for (const m of toUpdate) {
  await MySqlModule.UpdateGroupMemberPermission(groupID, m.userID, m.permission);
}

// insert new ones
for (const m of toInsert) {
  await MySqlModule.InsertGroupMember(groupID, m.userID, m.permission);
}
// delete the users 
for (const userID of toDelete) {
 
  await MySqlModule.DeleteGroupMember(groupID, userID);
}


await MySqlModule.UpdateGroupName(groupID, groupName);

return res.json({ success: true, message: 'Group updated' });


 // res.json(grouplist);
  }
  catch(err){
    console.log(err);
    res.json('no events');
  
  }
      
   });



   
    //// Created 21/07/2025 
//////////////////////////////////////////////////////////
//////             /api/invite/accept ///////////////////
//////////////// this endpoint accepts a users invitation to a group
router.post('/invite/accept',validation.validateGroupinviteResponse, CheckAuth.requireAuth, async(req, res) => {
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
   return res.json({ success: false, error: firstError });
 }
try{

  console.log(req.body)
  
  const groupID =  req.body.groupID;

const acceptResponse = await MySqlModule.AcceptGroupInvite(groupID,req.session.userID)
return res.status(200).json({ success: true, message: 'Invite accepted.' });


  }
  catch(err){
    console.log(err);
    res.json('no events');
  
  }
      
   });



   
    //// Created 21/07/2025 
//////////////////////////////////////////////////////////
//////             /api/invite/decline ///////////////////
//////////////// this endpoint declines a users invitation to a group
router.post('/invite/decline',validation.validateGroupinviteResponse, CheckAuth.requireAuth, async(req, res) => {
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
   return res.status(400).json({ success: false, error: firstError }); // ❌ Client error
 }
try{

  console.log(req.body)
  
  const groupID=  req.body.groupID;

  await MySqlModule.DeclineGroupInvite(groupID,req.session.userID)
  return res.status(200).json({ success: true, message: 'Invite declined.' });

  }
  catch(err){
    console.log(err);
    res.json('no events');
    return res.status(500).json({ success: false, error: 'Server error while declining invite.' });
  }
      
   });




   
   
    //// Created 21/07/2025 
//////////////////////////////////////////////////////////
//////             /api/events/getmembers ///////////////////
//////////////// this endpoint returns a list of members for a searched value
router.get('/events/getmembers', CheckAuth.requireAuth, async(req, res) => {
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


  
  const search=  req.query.search;
console.log(search)

  const results = await MySqlModule.GetMembersInSameGroupsBySearch(req.session.userID,search)

  console.log(results)
  return res.status(200).json({ success: true, message: results});

  }
  catch(err){
    console.log(err);
    res.json('no events');
    return res.status(500).json({ success: false, error: 'Server error while declining invite.' });
  }
      
   });




   
   
    //// Created 24/07/2025 
//////////////////////////////////////////////////////////
//////             /api/events/create ///////////////////
//////////////// this endpoint creates a new event
router.post('/events/create', CheckAuth.requireAuth, async(req, res) => {
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

  const body = req.body;
  const inputvalues = body.inputvalues;
  const attendees = body.attendees;
  
  const attendeesJSON = Array.isArray(attendees) ? attendees : JSON.parse(attendees);
  
  // Log for debugging
  console.log("Body:", body);
  console.log("First Attendee UserID:", attendeesJSON[0]?.userID);
  console.log(inputvalues)
  // Extract input values
  const [
    { ItemValue: eventTitle },
    { ItemValue: eventDate },
    { ItemValue: eventTime },
    { ItemValue: EventType },
    { ItemValue: eventDescription },
    { ItemValue: latitude },
    { ItemValue: longitude },
  
  ] = inputvalues;
  

  console.log("Event value is" + EventType)
  const ownerUserID = req.session.userID;
  
  // Call stored procedure
  const results = await MySqlModule.CreateEventWithAttendees(
    eventTitle,
    eventDate,
    eventTime,
    eventDescription,
    latitude,
    longitude,
    ownerUserID,
    JSON.stringify(attendeesJSON),
    EventType
  );
  
  // Respond
  return res.status(200).json({ success: true, message: "Event created successfully" });
  
  }
  catch(err){
    console.log(err);
    res.json('no events');
    return res.status(500).json({ success: false, error: 'Server error while declining invite.' });
  }
      
   });



   
   
    //// Created 24/07/2025 
//////////////////////////////////////////////////////////
//////             /api/events/update ///////////////////
//////////////// this endpoint creates a new event
router.post('/events/update', CheckAuth.requireAuth, async(req, res) => {
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


  

  const body = req.body;
  const inputvalues = body.inputvalues;
  const attendees = body.attendees;
  
  const attendeesJSON = Array.isArray(attendees) ? attendees : JSON.parse(attendees);
  
  // Extract input values
  const [
    { ItemValue: eventTitle },
    { ItemValue: eventDate },
    { ItemValue: eventTime },
    { ItemValue: EventType },
    { ItemValue: eventDescription },
    { ItemValue: latitude },
    { ItemValue: longitude },
  
  ] = inputvalues;
  
  const ownerUserID = req.session.userID;
  
 const currentMembers = await MySqlModule.GetAttendeesForEvent (req.body.eventID)


 //  Extract just the userIDs from both arrays
const newUserIDs = attendeesJSON.map(a => parseInt(a.userID));
const currentUserIDs = currentMembers.map(a => parseInt(a.UserID));


console.log(currentUserIDs)
//  Determine who to ADD (in newUserIDs but not currentUserIDs)
const addList = newUserIDs
  .filter(id => !currentUserIDs.includes(id))
  .map(id => ({ userID: id }));

//  Determine who to REMOVE (in currentUserIDs but not newUserIDs)
const removeList = currentUserIDs
  .filter(id => !newUserIDs.includes(id))
  .map(id => ({ userID: id }));

// Now log or send these to the stored procedure
console.log("Add List:", addList);
console.log("Remove List:", removeList);



 console.log(attendeesJSON)
  console.log(currentMembers)


  
  
  // Call stored procedure
  const results = await MySqlModule.UpdateEventAndAttendees(
    req.body.eventID,
    eventTitle,
    eventDate,
    eventTime,
    eventDescription,
    latitude,
    longitude,
    EventType,
    JSON.stringify(addList) || null,
    JSON.stringify(removeList) || null,
    ownerUserID,
   
  );



  return res.status(200).json({ success: true, message: "test"});

  }
  catch(err){
    console.log(err);
    res.json('no events');
    return res.status(500).json({ success: false, error: 'Server error while declining invite.' });
  }
      
   });




   
    //// Created 24/07/2025 
//////////////////////////////////////////////////////////
//////             /api/events/response ///////////////////
//////////////// this endpoint updates a users response to an event
router.post('/events/response', CheckAuth.requireAuth, async(req, res) => {
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


  
  const eventID = req.body.eventid;
  const responseID = req.body.val;
  const ownerUserID = req.session.userID;
  console.log(req.body)
console.log(eventID)
console.log(responseID)
console.log(ownerUserID)
 const currentMembers = await MySqlModule.updateUserResponse (eventID,ownerUserID,responseID)




  return res.status(200).json({ success: true, message: "test"});

  }
  catch(err){
    console.log(err);
    res.json('no events');
    return res.status(500).json({ success: false, error: 'Server error while declining invite.' });
  }
      
   });



   
   
    //// Created 24/07/2025 
//////////////////////////////////////////////////////////
//////             /api/events/response ///////////////////
//////////////// this endpoint updates a users response to an event
router.get('/events/response', CheckAuth.requireAuth, async(req, res) => {
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



  
 const currentMembers = await MySqlModule.getResponseOptions ()


return res.json(currentMembers)

 

  }
  catch(err){
    console.log(err);
    res.json('no events');
    return res.status(500).json({ success: false, error: 'Server error while declining invite.' });
  }
      
   });

 
   
    //// Created 24/07/2025 
//////////////////////////////////////////////////////////
//////             /api/tasks/getTaskTypes ///////////////////
//////////////// this endpoint returns A JSON of task types to populate input boxes
router.get('/tasks/getTaskTypes', CheckAuth.requireAuth, async(req, res) => {
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

console.log("get tasks type")

 const currentTasks = await MySqlModule.GetTaskTypes ()


return res.json(currentTasks)

 

  }
  catch(err){
    console.log(err);
    res.json('no events');
    return res.status(500).json({ success: false, error: 'Server error while declining invite.' });
  }
      
   });


   
  module.exports = router;
// Created 09/07/2025 by Tommy Mannix
////////////////////////////////////////////////////////////////////////
// This module is designed to hold any SQL commands within the system 
// For security each query will be created separately in its on function 
// with IN parameters and a return of the outcome to the logic layer 
///////////////////////////////////////////////////////////////////////


//////// Set up mysql dependencies and dotenv for access to env variables
var mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

var activeConnection = null;

activeConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DATABASE
});



/**
 * DB connection using the env file, this will be used for all functions and control the active
connection to the database
 */
function initDbConnection() {
  // check to see if there is an active connection if so return true 
  // else create a connection pool
  if (activeConnection) {
    // Already connected — skip
    return Promise.resolve();
  }

  activeConnection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DATABASE
  });

  return Promise.resolve();
 
}



/**
 *Get hashed password for user
 */
async function gethash(username ){
  /* Check to see if there is an active connection if not create the connection */
if (!activeConnection) await initDbConnection();
    const sql = 'call GetUsers(?)';
    const values = [
        username
    ];
    try{
    return new Promise((resolve, reject) => {
 
     // Use a parameterized query to prevent SQL injection
     activeConnection.query(sql, values, (error, results) => {
    /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(results); 
      }
    });
  });
    }
    catch{
      return 'failed';
    }
  }


  /**
   * Create a new user
   */
  function createUser(username, firstname, surname, hashedPassword) {
    const sqlCall = 'CALL CreateUser(?, ?, ?, ?, @usercreated)';
    const sqlSelect = 'SELECT @usercreated AS usercreated';
    const values = [
        username,firstname,surname,hashedPassword
    ];

    console.log(values);
    return new Promise((resolve, reject) => {
      // First: Call the stored procedure
      activeConnection.query(sqlCall, values, (err) => {
        /* if rhere is an error return faklse */
if (err) return reject(err);
  
        // Second: Fetch the OUT parameter
        activeConnection.query(sqlSelect, (err, results) => {
          /* if there is an error return */
if (err) return reject(err);
  
          // Extract the value
          const created = results[0]?.usercreated;
          resolve(created); // true or false
        });
      });
    });
  }



  

/**
 *retrieve user information on login
 */
function GetUserInfoLogin(UserID) {

  const sql = 'call GetUserInfo(?)';
const values = [
  UserID
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
 /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results); 
  }
});
});
}
catch{
  return 'failed';
}
}





/**
 *retrieve list of user events for the event cards
 */
function GetListOfEvents(UserID) {
  
  const sql = 'call GetListOfEvents(?)';
const values = [
  UserID
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
  /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}




/**
 * Created 15/07/2025 retrieve detailed view of event pass into it EventID.
 */
function GetDetailedEventView(EventID,userID) {
  
  const sql = 'call getEventDetail(?,?)';
const values = [
  EventID,userID
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
 /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}





/**
 *Created 15/07/2025 retrieve a list of all event types in the database.
 */
function GetListOfEventTypes() {
  const sql = 'call GetListOfEventTypes()';
const values = [
  
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
  /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}






/**
 * Created 15/07/2025retrieve a list of Tasks assigned to the logged in user.
 */
function GetListOfUserTasks(userID) {
  
  const sql = 'call getuserTasks(?)';
const values = [
  userID
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
  /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}





/**
 *Created 15/07/2025 retrieve detailed task list for a task assigned to the logged in user.
 */
function getDetailedTask(userID,taskid) {
  
  const sql = 'call GetTaskDetail(?,?)';
const values = [
  userID,taskid
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
/* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}





/** 
 * Created 15/07/2025update the status of sub task to true or false
 */
function UpdateSubtaskStatus(inputSubtaskID,inputUserID,inputStatus) {
  
  const sql = 'call UpdateSubtaskStatus(?,?,?)';
const values = [
  inputSubtaskID,inputUserID,inputStatus
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
  /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}




/** 
 * Created 16/07/2025 update the status of task to complete or incomplete
 */
function UpdateTaskStatusByUser(taskID,status,userID) {
  
  const sql = 'call UpdateTaskStatusByUser(?,?,?)';
const values = [
  taskID,status,userID
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
  /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}




/** 
 * Created 21/07/2025 Returns a list of all the groups that user is a member of 
 */
function GetUsersGroups(userID) {
  
  const sql = 'call GetUserGroupsWithRoleLabel(?)';
const values = [
 userID
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
  /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}





/** 
 * Created 21/07/2025 Returns an email address if the entered Email exists within the system 
 * * Only returns full matches not partial
 */
function GetUserFromEmail(userEmail) {
  
  const sql = 'call CheckEmail(?)';
const values = [
  userEmail
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
  /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}

/**
 * Close the database connection if there is an active connection
 * USED ONLY BY SUPERTEST 
 */ 
function closeConnection() {
  /* Check if there is an active connection if so 
  break the connection */
if (activeConnection) {
    activeConnection.end();
    activeConnection = null;
  }
}



/** 
 * Created 21/07/2025 Returns a list of all the groups that user is a member of 
 */
function GetUsersInvites(userID) {
  
  const sql = 'call GetPendingGroupInvitations(?)';
const values = [
 userID
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
  /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}





/** 
 * Created 21/07/2025 Creates a new group with members from creation
 */
function CreateGroupWithPermissions(inputGroupName,inputMembersJSON,creatorUserID) {
  
  const sql = 'call CreateGroupWithPermissions(?,?,?)';
const values = [
  inputGroupName,inputMembersJSON,creatorUserID
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
  /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}


/** 
 * Created 21/07/2025 retrives the details of a group with members from creation
 * * Verifys that the user is a member of the group before returning a value
 */
function GetGroupDetails(GroupID,UserID) {
  
  const sql = 'call GetGroupDetails(?,?)';
const values = [
  GroupID,UserID
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
  /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}






/** 
 * Created 21/07/2025 Updates the Users group status to 1 to mark as accepted
 * * 
 */
function AcceptGroupInvite(GroupID,UserID) {
  
  const sql = 'call acceptInvite(?,?)';
const values = [
  UserID, GroupID
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
  /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}



/** 
 * Created 21/07/2025 Deletes the invite from the users list as they have declined
 * * 
 */
function DeclineGroupInvite(GroupID,UserID) {
  
  const sql = 'call declineInvite(?,?)';
const values = [
  UserID, GroupID
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
  /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}





/** 
 * Created 21/07/2025 Deletes user from a group when removed by an admin 
 * * 
 */
function DeleteGroupMember(GroupID,UserID) {
  
  const sql = 'call DeleteGroupMember(?,?)';
const values = [
  GroupID,UserID
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
  /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}




/** 
 * Created 21/07/2025 Deletes user from a group when removed by an admin 
 * * 
 */
function InsertGroupMember (GroupID,UserID,GroupRoleID) {
  
  const sql = 'call InsertGroupMember(?,?,?)';
const values = [
  GroupID, UserID,GroupRoleID
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
  /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}



/** 
 * Created 21/07/2025 Deletes user from a group when removed by an admin 
 * * 
 */
function UpdateGroupMemberPermission  (GroupID,UserID,GroupRoleID) {
  
  const sql = 'call UpdateGroupMemberPermission (?,?,?)';
const values = [
  GroupID, UserID,GroupRoleID
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
  /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}




/** 
 * Created 21/07/2025 Deletes user from a group when removed by an admin 
 * * 
 */
function UpdateGroupName  (GroupID,GroupName,) {
  
  const sql = 'call UpdateGroupName  (?,?)';
const values = [
  GroupID, GroupName
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
  /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}





/** 
 * Created 21/07/2025 Returns list of users according to the logged in user and 
 *  a search parameter
 * * 
 */
function GetMembersInSameGroupsBySearch  (username,Searchterm,) {
  
  const sql = 'call GetMembersInSameGroupsBySearch  (?,?)';
const values = [
  username, Searchterm
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
  /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}



/** 
 * Created 24/07/2025 creates a new event with attendees
 * * 
 */
function CreateEventWithAttendees  (inEventName ,inEventDate ,inEventTime,inEventDescription , inLatitude ,inLongitude ,inUserID,inAttendeesJSON,EventType  ) {
  
  const sql = 'call CreateEventWithAttendees  (?,?,?,?,?,?,?,?,?)';
const values = [
  inEventName ,inEventDate ,inEventTime,inEventDescription , inLatitude ,inLongitude ,inUserID,inAttendeesJSON,EventType
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
  /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}



/** 
 * Created 24/07/2025 retrieves a list of hte current users on an event
 * * 
 */
function GetAttendeesForEvent   (userID  ) {
  
  const sql = 'call GetAttendeesForEvent   (?)';
const values = [
  userID
];
try{
return new Promise((resolve, reject) => {
 // Use a parameterized query to prevent SQL injection
 activeConnection.query(sql, values, (error, results) => {
  /* Check if there is an error if so log on the console 
  otherwise return the row results */
if (error) {
    console.log(error);
    reject(error);
  } else {
    resolve(results[0]); 
  }
});
});
}
catch{
  return 'failed';
}
}




/** 
 * Created 24/07/2025 retrieves a list of hte current users on an event
 * * 
 */function UpdateEventAndAttendees(
  eventID,
  eventTitle,
  eventDate,
  eventTime,
  eventDescription,
  latitude,
  longitude,
  eventTypeID,
  toAdd,
  toRemove,
  userID
) {
  const sql = `
  CALL UpdateEventAndAttendees(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    eventID,
  eventTitle,
  eventDate,
  eventTime,
  eventDescription,
  latitude,
  longitude,
  eventTypeID,
  toAdd,
  toRemove,
  userID
  ];

  return new Promise((resolve, reject) => {
    activeConnection.query(sql, values, (error, results) => {
      if (error) {
        console.log("SQL Error:", error);
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}





/** 
 * Created 24/07/2025 retrieves a list of hte current users on an event
 * * 
 */function updateUserResponse(
 eventID,UserID,responseID
) {
  const sql = `
  CALL updateUserResponse(?, ?, ?)
  `;

  const values = [
    eventID,UserID,responseID
  ];

  return new Promise((resolve, reject) => {
    activeConnection.query(sql, values, (error, results) => {
      if (error) {
        console.log("SQL Error:", error);
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}


/** 
 * Created 24/07/2025 retrieves a list of hte current users on an event
 * * 
 */function getResponseOptions(
) {
  const sql = `
  CALL getResponseOptions()
  `;



  return new Promise((resolve, reject) => {
    activeConnection.query(sql, values, (error, results) => {
      if (error) {
        console.log("SQL Error:", error);
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}


/** 
 * Created 24/07/2025 retrieves a list of hte potential task types
 * * 
 */function GetTaskTypes(
) {
  const sql = `
  CALL GetTaskTypes()
  `;

  const values = [
  
  ]

  return new Promise((resolve, reject) => {
    activeConnection.query(sql, values, (error, results) => {
      if (error) {
        console.log("SQL Error:", error);
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}





/** 
 * Created 24/07/2025 Creates a mew task
 * * 
 */function CreateTaskWithUsersAndSubtasks(inTaskName ,inTaskTypeID ,inDueDate ,
  inTaskDescription ,inCreatorUserID ,inAttendeesJSON ,inSubTasksJSON 
 
) {
  const sql = `
  CALL CreateTaskWithUsersAndSubtasks(?, ?, ?,?,?,?,?)
  `;

  const values = [
    inTaskName ,inTaskTypeID ,inDueDate ,
    inTaskDescription ,inCreatorUserID ,inAttendeesJSON ,inSubTasksJSON 
  ];

  return new Promise((resolve, reject) => {
    activeConnection.query(sql, values, (error, results) => {
      if (error) {
        console.log("SQL Error:", error);
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}




  module.exports={
    gethash,
    createUser,
    GetUserInfoLogin,
    GetListOfEvents,
    initDbConnection,
    closeConnection,
    GetDetailedEventView,
    GetListOfEventTypes,
    GetListOfUserTasks,
    getDetailedTask,
    UpdateSubtaskStatus,
    UpdateTaskStatusByUser,
    GetUsersGroups,
    GetUsersInvites,
    GetUserFromEmail,
    CreateGroupWithPermissions,
    GetGroupDetails,
    AcceptGroupInvite,
    DeclineGroupInvite,
    DeleteGroupMember,
    UpdateGroupMemberPermission,
    InsertGroupMember,
    UpdateGroupName,
    GetMembersInSameGroupsBySearch,
    CreateEventWithAttendees,
    GetAttendeesForEvent,
    UpdateEventAndAttendees,
    updateUserResponse,
    getResponseOptions,
    GetTaskTypes,
    CreateTaskWithUsersAndSubtasks

  };
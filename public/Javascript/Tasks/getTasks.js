// Created 15/07/2025 by Tommy Mannix
// This script fetches and renders a list of tasks for the logged in user 
// it then assigns an event listener to each event which opens a model box
// the script then fetches a detailed view of the task and shows it on screen




// fetch and render the global task list and populate the task container
async function fetchAndRenderTasks() {
  console.log("rendering")
  try {

    // get the list of Tasks from the endpoint
    const response = await fetch('/api/getTaskList');

    // convert to JSON
    const groupedEvents = await response.json();

    // Target the container for the events
    const container = document.getElementById('TaskContainer');

    // clear it 
    container.innerHTML = ''; 

    // if there are no events in the request then output that there are no events
    if (!groupedEvents || isEventListEmpty(groupedEvents)) {
      container.innerHTML = '<p>No upcoming events found.</p>';
      return;
    }

    // Loop through each group (Today, August, etc.)
    Object.entries(groupedEvents).forEach(([groupName, events]) => {

      if (!Array.isArray(events) || events.length === 0) return;

      // Create wrapper for each month/group
      const groupWrapper = document.createElement('section');
      groupWrapper.className = 'EventGroup';

      // create the heading for the group i.e. today, august, etc.
      const header = document.createElement('h2');
      header.textContent = groupName;
      header.className = 'EventHeader';
      groupWrapper.appendChild(header); 

      // Container for that group's events
      const groupEventContainer = document.createElement('div');
      groupEventContainer.className = 'EventContainer';

      // iterate through the group for each event...
      events.forEach(event => {
        // create a div element for the outer event container
        const eventItem = document.createElement('div');
        eventItem.className = 'EventItem hardbox';

        // add the event type
        const type = document.createElement('p');
        type.className = 'EventType';
        type.textContent = event.taskTypeName || null;

        // add the title
        const title = document.createElement('h3');
        title.className = 'EventCardTitle';
        title.textContent = event.taskName;

        // add the date
        const date = document.createElement('p');
        date.className = 'EventCardDate';
        // set the date format to be in UK standard as DDMMYYYY
        date.textContent = new Date(event.completionDate).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'long', year: 'numeric'
        });


        const status = document.createElement('p');
        if(event.completionStatus == "0"){
          status.textContent = "Incomplete"
        }
        else{
          status.textContent = "Complete"
        }
       
        status.className = 'EventCardStatus';
        // add the link to view more 
        const viewMore = document.createElement('a');
        viewMore.className = 'viewmore';
        viewMore.href = '#'; // or link to event details
        viewMore.textContent = 'View info';

        // Append all elements to the event card
        eventItem.appendChild(type);
        eventItem.appendChild(title);
        eventItem.appendChild(date);
        eventItem.appendChild(status);
        eventItem.appendChild(viewMore);

        // append the event card to the group container
        groupEventContainer.appendChild(eventItem);

        eventItem.addEventListener('click', () => {
          showTaskModal(event);
        });
      });

      // append the group container to the group wrapper
      groupWrapper.appendChild(groupEventContainer);

      // append the group wrapper to the main event container
      container.appendChild(groupWrapper);
    });
  } catch (err) {
    console.error('Failed to fetch events:', err);
    document.getElementById('eventContainer').innerHTML = '<p>Error loading events.</p>';
  }
}

// check if all event groups are empty
function isEventListEmpty(groupedEvents) {
  return Object.values(groupedEvents).every(group => Array.isArray(group) && group.length === 0);
}






// This function fetches a detailed JSON file of a selected event, event is 
// passed as an object when each button is added an event listener
async function GetandRenderTaskDetail(event){
  try{
        // get the list of events from the endpoint
        const response = await fetch(`/api/getTaskDetail?taskID=${event.taskID}`);

        console.log('test');
        
        const details = await response.json();

        console.log(details);
  return details;
  
  }
  catch{
  
  }
  }
  
  // show the modal box, pass in the task information from the list generated
async function showTaskModal(event) {
  // get the pressed task information based on the item clicked
  const eventdetails = await GetandRenderTaskDetail(event);

  // convert the task sub items and assigned users into usable JSON arrays
  const subtasks = JSON.parse(eventdetails[0].subtasks);
  const assignedUsers = JSON.parse(eventdetails[0].assignedUsers);

  // count total number of subtasks
  const subtaskTotal = subtasks.length;

  // filter to find how many subtasks have been completed
  const completedTasks = subtasks.filter(t => t.subtaskStatus === 1).length;

  // convert completion date to UK format
  const date = new Date(eventdetails[0].completionDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  // generate HTML to show each subtask as a list item
  // Build subtasks with checkboxes
const subtaskHTML = subtasks.map(task => `
<li>
  <label class="subtaskCheckbox">
    <input 
      type="checkbox" 
      ${task.subtaskStatus === 1 ? 'checked' : ''} 
      data-subtask-id="${task.subtaskID}"
    >
    <p>${task.subtaskName}${task.completedBy ? ` – <em> completed by ${task.completedBy}</em>` : ''}</p>
  </label>
</li>
`).join('');

  // generate HTML to show assigned users and indicate who is the creator
  const userHTML = assignedUsers.map(user => `
    <li>
      ${user.fullName} ${user.isCreator ? '<strong>(Owner)</strong>' : ''}
    </li>
  `).join('');

  // select the modal and target its content
  const modal = document.getElementById('eventCreateModal');
  const content = document.getElementById('modalEventDetails');

  console.log(eventdetails[0].completionStatus);
  // inject the content dynamically into the modal
  content.innerHTML = `
    <div class="taskDetails">
      <h2>${eventdetails[0].taskName}</h2>

      <select class="dropdownStatus" id="completionStatus" name="completionStatus">
      <option value="true" ${eventdetails[0].completionStatus === 1 ? 'selected' : ''}>Complete</option>
      <option value="false" ${eventdetails[0].completionStatus === 0 ? 'selected' : ''}>Incomplete</option>
    </select>

      <p><strong>Type:</strong> ${eventdetails[0].taskTypeName}</p>
      <p><strong>Due:</strong> ${date}</p>
      <p><strong>Description:</strong> ${eventdetails[0].taskDescription}</p>
      <p><strong>Progress:</strong> ${completedTasks}/${subtaskTotal} complete</p>

      <h3>Subtasks</h3>
      <ul class="subtaskList">
        ${subtaskHTML}
      </ul>

      <h3>Assigned To</h3>
      <ul class="userList">
        ${userHTML}
      </ul>
    </div>
  `;

  // finally, show the modal on screen
  modal.classList.remove('hidden');


  
// Add listeners to checkboxes after rendering
document.querySelectorAll('.subtaskCheckbox input[type="checkbox"]').forEach(checkbox => {
  // Set initial state
  if (checkbox.checked) {
    console.log(checkbox.checked);
    console.log(checkbox.dataset.subtaskId);
    checkbox.parentElement.classList.add('checked');
  }

  // Add listener to update style
  checkbox.addEventListener('change', () => {
    console.log(checkbox.checked);
    console.log(checkbox.dataset.subtaskId);
    checkbox.parentElement.classList.toggle('checked', checkbox.checked);
    updateCheckBox(checkbox.dataset.subtaskId,checkbox.checked);
  });


});


// Get the select dropdown for completion status
const optionbox = document.getElementById('completionStatus');
updatePillColor(optionbox)
// Add an event listener to run when the dropdown changes
optionbox.addEventListener('change', () => {
  const selectedValue = optionbox.value === 'true'; // convert to boolean
  const taskID = eventdetails[0].taskID; // get the task ID from the loaded details

  console.log(`${taskID} is taskid`)
  // Call the function to update the task in the database
  updatePillColor(optionbox);
  updateTaskStatus(taskID, selectedValue);
});




}

// Close modal when clicking the X button
document.getElementById('closeModalBtn').addEventListener('click', () => {
  fetchAndRenderTasks()
  document.getElementById('eventCreateModal').classList.add('hidden');
});

//  close modal using Escape key for Keyboard users
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('eventCreateModal').classList.add('hidden');
  }




});



function updatePillColor(optionbox) {
    
  if (optionbox.value === 'true') {
    optionbox.classList.add('complete');
    optionbox.classList.remove('incomplete');
  } else {
    optionbox.classList.add('incomplete');
    optionbox.classList.remove('complete');
  }
}

// send the checkbox update to the database to be stored
async function updateCheckBox(subtaskID,checkvalue){
  try {
    const response = await fetch('/api/updateSubtask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subtaskID: subtaskID,
        checkvalue: checkvalue
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Update successful:', result);
    return result;
  } catch (err) {
    console.error('Failed to update subtask:', err);
  }
  }





// send the status box update to the database to be stored marking the task as complete
async function updateTaskStatus(taskid,statusvalue){

  console.log(taskid)
  try {
    const response = await fetch('/api/updateTaskStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        taskID: taskid,
        status: statusvalue
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Update successful:', result);
    return result;
  } catch (err) {
    console.error('Failed to update subtask:', err);
  }
  }






  document.getElementById("CreateTaskButton").addEventListener("click", () => {
    showCreateTaskModal({ isNew: true }); // Empty modal for creation
  });


  
  function showCreateTaskModal() {
    const modal = document.getElementById('eventCreateModal');
    const content = document.querySelector('#modalEventDetails');
  



    modal.classList.remove("hidden")
    content.innerHTML = ""

    content.innerHTML = `

    <h2>Create New Task</h2>
  
    <div class="formItem">
      <label for="taskName">Task Name:</label>
      <input type="text" id="taskName" required />
    </div>
  
    <div class="formItem">
      <label for="taskType">Type:</label>
      <select id="taskType"></select>
    </div>
  
    <div class="formItem">
      <label for="dueDate">Due Date:</label>
      <input type="date" id="dueDate" required />
    </div>
  
    <div class="formItem">
      <label for="taskDescription">Description:</label>
      <textarea id="taskDescription"></textarea>
    </div>
  
    <div class="formItem">
    <label for="taskitem">add a task:</label>
    <textarea id="taskitem"></textarea>
    <button class =" additem groupbutton"> add Task </button>
    
    <div class="formItem">
    <label for="taskitems">Tasks:</label>
    <ul id = "taskitems " class ="taskitems" > </ul>

    </div>
  </div>


  <div class="formItem">
  <label for="paricipant">add participant:</label>
  <textarea id="paricipant" placeholder ="Type a name or email"></textarea>
<ul class ="namedrop" id ="namedrop"> </ul>

<div class="formItem">
  <h3>Added Members </h3>
  <ul class ="memberwrapper" > 

  </ul>
  </div>
 </div>




   
      <button id="saveTaskBtn">Create Task</button>

 
  
    `;
  
    const additem = document.querySelector(".additem")
    const taskitems = document.querySelector(".taskitems")
      
    
    
    additem.addEventListener("click", () => 
    {
      const li = document.createElement("li")
      li.className="taskItem"
      const namep = document.createElement("p")
     namep.textContent = document.getElementById("taskitem").value
    const removebut = document.createElement("button")
    removebut.classList.add("removebutton")
    removebut.classList.add("groupbutton")
    removebut.textContent = "Remove"
    removebut.addEventListener("click", () => li.remove())
      li.appendChild(namep);
      li.appendChild(removebut);
      taskitems.appendChild(li);
      document.getElementById("taskitem").value = ""

    });


  
    const paricipant = document.querySelector("#paricipant")

    paricipant.addEventListener("input",handleuserSearch)

    populateTaskTypeSelect(); // Call to fill task type dropdown
  
    document.getElementById('saveTaskBtn').addEventListener('click',CreateButtonPressed  )
  
    modal.classList.remove('hidden');
  }
  
// populate the task type drop down 
  async function populateTaskTypeSelect() {
    try {
      // get the items from the sever end point
      const response = await fetch('../../api/tasks/getTaskTypes');
      const taskTypes = await response.json();
  
      // find the drop down
      const select = document.getElementById('taskType');
      select.innerHTML = ''; // Clear existing options
  

      console.log(taskTypes)
      // iterate through and add the options
      taskTypes.forEach((type) => {

        console.log(type)
        const option = document.createElement('option');
        option.value = type.TaskTypeID;
        option.textContent = type.TaskTypeName; 
        select.appendChild(option);
      });
  
    } catch (err) {
      console.error('Failed to populate task types:', err);
    }
  }
  


// adds a member to the members list on the drop down takes in the users ID Name and permission level
function addMemberToList(userID, fullName) {
  let userlist = document.querySelector(".memberwrapper");

const li = document.createElement("li");
li.dataset.userID = userID
li.className ="memberitem"
const pName = document.createElement("p")
pName.textContent = fullName
const removebut = document.createElement("button")
    removebut.classList.add("removebutton")
    removebut.classList.add("groupbutton")
    removebut.textContent = "Remove"

    removebut.addEventListener("click", () => li.remove())
    li.appendChild(pName);
    li.appendChild(removebut)
    userlist.appendChild(li)
}
  
 // This is the logic for the auto complete search bar for adding people to the event
 async function handleuserSearch() {

  const suggestions = document.querySelector(".namedrop")
  const input = document.querySelector("#paricipant")

  // take the boxes input 
const query = input.value.trim();

// if the query is less than 2 characters in length then return nothing
if (query.length < 2) return suggestions.innerHTML = "";

// fetch the list of users from the server encoding the input email address in the URL parameter
const res = await fetch(`../../api/events/getmembers?search=${encodeURIComponent(query)}`);
// conver the resposne to JSON
const data = await res.json();

console.log(data)
// reset the suggestions drop down
suggestions.innerHTML = "";


// iterate through  the list there should only be one distinct value
data.message.forEach(data => {

  // create a list item to append into the unordered list 
  const li = document.createElement("li");
  // encode it with the users first and surname
  li.textContent = `${data.FirstName} ${data.Surname}`;

  // when they click the suggestion pass the user to the addmember to list function 
  li.addEventListener("click", () => {
      // pass as owner
   addMemberToList(data.UserID, `${data.FirstName} ${data.Surname}`);
    input.value = "";
    suggestions.innerHTML = "";
  });
  // append the li to the ul
  suggestions.appendChild(li);
});
}



async function CreateButtonPressed(){


  

  // get a list of the input form items child 1 is needed
const formitems = document.querySelectorAll(".formItem")

console.log(formitems)
// create a JSON array of the item names and values
const inputvalues = Array.from(formitems).map(item => ({
  ItemName: item.children[1].id,

  EventValue: item.children[1].value,


}));

const attendees = document.querySelectorAll(".memberitem") || null

// iterate through the children and get the user IDS 
const members = Array.from(attendees).map(item => ({
  userID: item.dataset.userID,

}));

const tasklist = document.querySelectorAll(".taskItem") || null
const tasks = Array.from(tasklist).map(item => ({
  ItemValue:item.children[0].textContent
}));

const payload = {
  eventDetails:inputvalues,
  attendees:members,
  tasklist:tasks
}

const url = "../../tasks/create"
PostJSON(url,payload)
}



// posts to the server with 
async function PostJSON(url, jsonData) {



  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonData)
    });
    const data = await res.json();
    console.log("Server response:", data);
  } catch (err) {
    console.error("POST failed:", err);
  }
}



// Call it on page load and render the task list
document.addEventListener('DOMContentLoaded', fetchAndRenderTasks);

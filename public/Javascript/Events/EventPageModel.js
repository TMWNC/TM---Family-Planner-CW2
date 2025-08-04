
// Created 15/07/2025 by Tommy Mannix
// This script opens a full page model which will display the chosen events information


// updated 23/07/2025 by Tommy Mannix
// added the ability to update and create a new event 


//24/07/2025 added the abiltiy to respond to an event

// find the create button and add open create model to open the model box
const CreateEventButton = document.getElementById('CreateEventButton');
const CloseModelCreateButton = document.querySelector('.close-modal');
const modal = document.getElementById('eventCreateModal');

window.addEventListener("DOMContentLoaded", () => {

CreateEventButton.addEventListener('click', openCreateModel);
CloseModelCreateButton.addEventListener('click', closeCreateModel);
});



// on opening find the model box and remove the hidden tag to show it on screen
async function openCreateModel(){
// select the model and target its content

modal.classList.remove('hidden');

// render a member list and event list
const memberlist = await getListofMembers();
const eventlist = await getListofEvents();

const emptyevent = {
    EventID: null,
    EventName: "",
    EventDate: new Date().toISOString(),
    shortdesc: "",
    EventDescription: "",
    EventTypeID: null,
    Attendees: "[]",
    EventLatitude:"",
    EventLongitude:""
  };
  modalMode ="create"

showEventModal(emptyevent)

// populate the evetn type drop down list
//populateEventTypeSelect(eventlist);
//pass the details to show model to show the value


}
function closeCreateModel() {

    
   
        const searchbox = document.getElementById("searchbox");

        if (searchbox) {
            searchbox.removeEventListener("input", handleuserSearch);
        }

  
    

    const modal = document.getElementById('eventCreateModal');
    modal.classList.add('hidden');
  
    // Optional: Clear contents to reset for next open
    const content = document.querySelector("#modalEventDetails");
    if (content) content.innerHTML = '';
  }
  

function testresponse() {

    

    const testitems = document.querySelectorAll(".attendingStatus")


    testitems.forEach(ScreenObject => {
var text
 

    if (ScreenObject.tagName === 'SELECT') {
        text = ScreenObject.value.trim().toLowerCase()  ; 
      }
      else{
        text = ScreenObject.textContent.trim().toLowerCase() ; 
      }


    
    const validClasses = ["decline", "accept", "tentative","invited"];
   
  
    // Determine which class to apply based on text
    let targetClass = null;
    if (text === "2" || text ==="accepted") {
      targetClass = "accept";
    } else if (text === "3"  || text ==="tentative") {
      targetClass = "tentative";
    } else if (text === "1"  || text ==="declined") {
      targetClass = "decline";
    }
    else if (text === "4" || text ==="invited") {
        targetClass = "invited";
      }
  

    console.log(targetClass)
    // If a valid class was determined
    if (targetClass) {
      // Remove all valid classes
      validClasses.forEach(cls => ScreenObject.classList.remove(cls));
      // Add the target class
      ScreenObject.classList.add(targetClass);
    } else {
      console.warn("Invalid response text:", text);
    }

});
  }

// this retrieves alist of event type such as wedding graduation etc
async function getListofEvents(){
    try {
        // get the list of events from the endpoint
        const eventlist = await fetch('/api/getListOfEventTypes');
        const data = await eventlist.json();
return data;
    }
    catch{
        alert('error');
    }
}

// this retrieves alist of members within the users groups that they can invite
async function getListofMembers(){
    try {
        // get the list of events from the endpoint
        const memberlist = await fetch('/api/getMembersInAllGroups');
        const data = await memberlist.json();
return data;
    }
    catch{
        alert('error');
    }
}


// this populate the event type selection box with the available event types
function populateEventTypeSelect(eventTypes) {




    const select = document.querySelector('#EventType');

    console.log(select)
    select.innerHTML = ''; // Clear any existing options
  
    eventTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type.EventTypeID;   // Adjust key names as per your API
      option.textContent = type.EventTypeName;
      select.appendChild(option);

      
    });
  }


  async function fetchAndPopulateEventTypes() {
    try {
      const response = await fetch('../../api/getListOfEventTypes');
  
      if (!response.ok) {
        throw new Error(`Failed to fetch event types: ${response.status}`);
      }
  

      const eventTypes = await response.json();
      console.log(eventTypes)
      populateEventTypeSelect(eventTypes);
    } catch (error) {
      console.error('Error loading event types:', error);
    }
  }

  


async function GetandRenderEventDetail(eventID){
    try{
          // get the list of events from the endpoint
          const response = await fetch(`/api/getEventDetail?EventID=${eventID}`);

          const details = await response.json();

console.log(details)
        

    return details;
    
    }
    catch{
    
    }
    }
    



    // show the modal box pass in the event information from the list generated, 
    async function showEventModal(event ) {
  
        const modal = document.getElementById('eventModal');
    // get the pressed event information based on the item clicked
        const eventdetails = await GetandRenderEventDetail(event.EventID);
    

       // parse the attendees list from a string into a JSON file
       const attendeeslist = JSON.parse(eventdetails[0].Attendees || '[]');
    
       // find how many attendees there are for the event
       const attendeeNum = attendeeslist.length;
       // filter it down to accepted and declined to be shown on the interface
       const accepted = attendeeslist.filter(a => a.ResponseStatus === 'Accepted');
       const declined = attendeeslist.filter(a => a.ResponseStatus === 'Declined');
       
    
     
       if(eventdetails[0].IsOwner == 1 )
       {
        modalMode = "edit"
       }
       else if(modalMode = "create")
       {
        modalMode = "create"
       }
       else{
        modalMode = "view"
       }
       
       if(eventdetails.length > 1){
        renderEventDetails(event, attendeeNum, accepted, declined, modalMode);
     
       }
       else{

        console.log(eventdetails.length)
       renderEventDetails(eventdetails, attendeeNum, accepted, declined, modalMode);
       }

    
        modal.classList.remove('hidden');
      }
    
    
    async  function renderEventDetails(eventdetails, attendeeNum, accepted, declined, mode) {
       
    
        const wrapper = document.querySelector("#modalEventDetails");
        wrapper.innerHTML = "";
      
      
        const data = eventdetails[0] || {};
      
        // Utility: create a form item
        const createFormItem = (labelText, inputEl, labelFor) => {
          const wrapper = document.createElement("div");
          wrapper.className = "formItem";
      
          const label = document.createElement("label");
          label.setAttribute("for", labelFor);
          label.textContent = labelText;
      
          wrapper.appendChild(label);
       


          wrapper.appendChild(inputEl);
          return wrapper;
        };
      
   //////////////// Attending status drop down box/////////////////////////////// 
       
          const attending = document.createElement("select");;
          attending.className = "attendingStatus";
          attending.id = "attendingStatus";
       

          

         


// add the options
["Declined", "Accepted", "Tentative", "invited"].forEach((status, index) => {
    const option = document.createElement("option");
    option.value = index + 1; // index is correctly used here
    option.textContent = status;
    attending.appendChild(option);
  });


  if( data.EventResponseForUser == "Declined"){
    attending.value = "1"
  }
  else if( data.EventResponseForUser  == "Accepted"){
    attending.value = "2"
  }
  else if( data.EventResponseForUser == "Tentative"){
    attending.value = "3"
  }
  else{
    attending.value = "4"
  }

  


       
        // create the Div wapper
          const attendingWrapper = createFormItem("Your Response:", attending, "attendingStatus");
         
          wrapper.appendChild(attendingWrapper);
        
          attending.addEventListener("change", () => UpdateResponse(attending.value, data.EventID));

/////////// Event attendance information
      
          const stats = document.createElement("div");
          stats.className = "attendeeStats";
          stats.id = "attendeeStats";
          stats.innerHTML = `
            <p id="invited"><strong>Invited:</strong> ${attendeeNum}</p>
            <p id="accepted"><strong>Accepted:</strong> ${accepted.length}</p>
            <p id="declined"><strong>Declined:</strong> ${declined.length}</p>
          `;
         
          wrapper.appendChild(stats);
        
      
        // 3. Event Title
        const titleEl = mode === "view"
          ? document.createElement("h2")
          : document.createElement("input");
      
        titleEl.className = "eventTitle";
        titleEl.id = "eventTitle";
        titleEl.classList.add("inputitem")
      
        if (mode === "view") {
          titleEl.textContent = data.EventName || "";
        } else {
          titleEl.type = "text";
          titleEl.required = true;
          titleEl.value = data.EventName || "";
        }
      
        wrapper.appendChild(createFormItem("Event Title:", titleEl, "eventTitle"));
      

// Get the raw date from data, or use today's date
const rawDate = data.EventDate ? new Date(data.EventDate) : new Date();

// Format it for the input[type="date"] as 'YYYY-MM-DD' in local time
const year = rawDate.getFullYear();
const month = String(rawDate.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
const day = String(rawDate.getDate()).padStart(2, '0');

const dateValue = `${year}-${month}-${day}`;


        // 4. Event Date
        const dateEl = mode === "view"
          ? document.createElement("p")
          : document.createElement("input");
      
        dateEl.className = "eventDate";
        dateEl.id = "eventDate";
        dateEl.classList.add("inputitem")

      
        if (mode === "view") {
          dateEl.textContent = rawDate.toLocaleDateString("en-GB");
        } else {
          dateEl.type = "date";
          dateEl.value = dateValue;
        
          dateEl.required = true;
        }
      
        wrapper.appendChild(createFormItem("Date:", dateEl, "eventDate"));




   // 4. Event time////////////////////////////////////////////////////////
   const timeEl = mode === "view"
   ? document.createElement("p")
   : document.createElement("input");

   timeEl.className = "eventTime";
   timeEl.id = "eventTime";
   timeEl.classList.add("inputitem")
   const timeValue = data.EventTime ; // "HH:mm"

 if (mode === "view") {
    timeEl.textContent = timeValue;
 } else {
    timeEl.type = "time";
    timeEl.value = timeValue;
    timeEl.required = true;
 }

 wrapper.appendChild(createFormItem("time::", timeEl, "eventTime"));




   // 4. Event Type///////////////////////////////////////////
   const EventType = mode === "view"
   ? document.createElement("p")
   : document.createElement("select");

   EventType.className = "EventType";
   EventType.id = "EventType";
   EventType.classList.add("inputitem")


 if (mode === "view") {
    EventType.textContent = data.EventTypeName;
 } else {



   EventType.textContent = data.EventTypeName;
   EventType.required = true;
 }

 wrapper.appendChild(createFormItem("EventType:", EventType, "EventType"));

 await fetchAndPopulateEventTypes()





      
        // 5. Short Description / Summary
        const subEl = mode === "view"
          ? document.createElement("p")
          : document.createElement("input");
      
        subEl.className = "eventSubtext";
        subEl.id = "eventSubtext";
        subEl.classList.add("inputitem")
        
        if (mode === "view") {
          subEl.textContent = data.shortdesc || "";
        } else {
          subEl.type = "text";
          subEl.value = data.shortdesc || "";
        }
      
  
      
        // 6. Description
        const descEl = mode === "view"
          ? document.createElement("div")
          : document.createElement("textarea");
      
        descEl.className = "eventDescription";
        descEl.id = "eventDescription";
        descEl.classList.add("inputitem")
        if (mode === "view") {
          descEl.innerHTML = `<p>${data.EventDescription || "No description available."}</p>`;
        } else {
          descEl.value = data.EventDescription || "";
          descEl.rows = 4;
          descEl.required = true;
        }
      
        wrapper.appendChild(createFormItem("Description:", descEl, "eventDescription"));

    

        //  Submit button (Create/Update only) and latitude and longitude co-ordinates
        if (modalMode === "create" || modalMode === "edit") {
            
            const searchbox = document.createElement("Textarea")
             searchbox.id = "searchbox";
             

             const suggestions = document.createElement("ul")
             suggestions.id = "suggestions"
             suggestions.classList.add("namedrop")
           
             
wrapper.appendChild(createFormItem("add attendees", searchbox, "searchbox"));
wrapper.appendChild( suggestions);

searchbox.addEventListener("input", handleuserSearch);



const latitude = document.createElement("Textarea")
latitude.id = "latitude"
latitude.textContent = data.EventLatitude
const longitude = document.createElement("textarea")
longitude.id="longitude"
longitude.textContent = data.EventLongitude


latitude.classList.add("inputitem")
longitude.classList.add("inputitem")


wrapper.appendChild(createFormItem("latitude", latitude, "latitude"));

wrapper.appendChild(createFormItem("longitude", longitude, "longitude"));


  




          const saveBtn = document.createElement("button");
          saveBtn.textContent = modalMode === "create" ? "Create Event" : "Update Event";
          saveBtn.className = "modalSubmitBtn";
          saveBtn.addEventListener("click", () => handleSubmit( data.EventID || null));
          
          
          wrapper.appendChild(saveBtn);
        }
      



const parsed = JSON.parse(data.Attendees)
console.log(parsed)
        const attendeelist = document.createElement("ul");
    attendeelist.classList.add("eventAttendeeList")

        parsed.forEach(attendee => {



            const li = document.createElement("li")
            li.dataset.attendeeID = attendee.AttendeeID

            const name = document.createElement("p")
            name.textContent = attendee.AttendeeName
            const response = document.createElement("p")
            response.textContent = attendee.ResponseStatus
            response.classList.add("attendingStatus")

            testresponse()

            li.appendChild(name);
            li.appendChild(response)
            attendeelist.appendChild(li)
        });


        wrapper.appendChild(attendeelist);
        testresponse()
          //////////////////////////////////////////////////////////////////////////////////
       // This needs updating with the GOOGLE MAPS API!/////////////////////////////////
       ////////////////////////////////////////////////////////////////////////////////
       const location = document.createElement("div");
       location.className = "eventLocation";
       location.id = "eventLocation";
       location.innerHTML = `14 Waverly Lane<br>Mansfield<br>NG18 4HD`;

     
       wrapper.appendChild(createFormItem("Location:", location, "eventLocation"));
   
        const modalbox = document.getElementById('eventCreateModal');
        modalbox.classList.remove("hidden");
      }
      
  
      
      // Optional: close modal on ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          document.getElementById('eventCreateModal').classList.add('hidden');
        }
      });
      

      // This is the logic for the auto complete search bar for adding people to the event
async function handleuserSearch() {


    const input = document.getElementById("searchbox")
  
    const suggestions = document.getElementById("suggestions");
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

// adds a member to the members list on the drop down takes in the users ID Name and permission level
function addMemberToList(userID, fullName) {
  let userlist = document.querySelector(".eventAttendeeList");

  // If the attendee list doesn't exist yet, create it
  if (!userlist) {
    userlist = document.createElement("ul");
    userlist.classList.add("eventAttendeeList");

    const wrapper = document.querySelector("#modalEventDetails");
    if (wrapper) {
      wrapper.appendChild(userlist);
    } else {
      console.warn("No modalEventDetails wrapper found.");
      return;
    }
  }

  const li = document.createElement("li");
  li.classList.add("rowitem");
  li.dataset.attendeeID = userID;

  const namep = document.createElement("p");
  namep.textContent = fullName;

  const removebutton = document.createElement("button");
  removebutton.textContent = "remove";
  removebutton.classList.add("groupbutton");
  removebutton.addEventListener("click", () => li.remove());

  li.appendChild(namep);
  li.appendChild(removebutton);
  userlist.appendChild(li);
}

// what happens when submit or update are pressed
async function handleSubmit( data){
    // identify the input items
  const inputitems = document.querySelectorAll(".inputitem")
// identify the event attendee list and get the LI children containing encoded data
const attendees = document.querySelector(".eventAttendeeList").children || null

// iterate through the children and get the user IDS 
const members = Array.from(attendees).map(item => ({
    userID: item.dataset.attendeeID,

  }));

// create a JSON array of the item names and values
  const inputvalues = Array.from(inputitems).map(item => ({
    ItemName: item.id,

    ItemValue:item.value.trim()

  }));

// encode into on pay load to be sent to the server
const payload = {
inputvalues: inputvalues,
attendees:members,
eventID :data || null
}

// create a default API route to be passed
// assume its creation
let url = "../../api/events/create"

if(modalMode == "edit"){
     url = "../../api/events/update"
}


 // pass the URL and payload to post JSON to send to the server
  // postJSON found in getRequest
  await PostJSON(url, payload);
  fetchAndRenderEvents(); // refresh the list
  closeCreateModel(); // reset panel

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
  



  async function UpdateResponse(val,eventid){
    testresponse()

const payload = {
    val:val,
    eventid:eventid
}

const url = "../../api/events/response"
try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log("Server response:", data);
  } catch (err) {
    console.error("POST failed:", err);
  }


  }
// Call it on page load


const CreateEventButton = document.getElementById('CreateEventButton');
CreateEventButton.addEventListener('click', openCreateModel);


const CloseModelCreateButton = document.getElementById('closeCreateModalBtn');
CloseModelCreateButton.addEventListener('click', closeCreateModel);

async function openCreateModel(){

// select the model and target its content
const modal = document.getElementById('eventModal');

modal.classList.remove('hidden');


const memberlist = await getListofMembers();
const eventlist = await getListofEvents();
populateEventTypeSelect(eventlist);
showEventModal(eventlist)

}

function closeCreateModel(){
    const modal = document.getElementById('eventModal');
    modal.classList.add('hidden');
}


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


function populateEventTypeSelect(eventTypes) {
    const select = document.getElementById('EventType');
    select.innerHTML = ''; // Clear any existing options
  
    eventTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type.EventTypeID;   // Adjust key names as per your API
      option.textContent = type.EventTypeName;
      select.appendChild(option);
    });
  }
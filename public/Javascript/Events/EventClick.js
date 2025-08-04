// Created 15/07/2025 by Tommy Mannix
// This script opens a full page model which will display the chosen events information




async function GetandRenderEventDetail(eventID){
try{
      // get the list of events from the endpoint
      const response = await fetch(`/api/getEventDetail?EventID=${eventID}`);
      const details = await response.json();
return details;

}
catch{

}
}


// show the modal box pass in the event information from the list generated, 
async function showEventModal(event) {

  alert("fire")
  console.log('test');
// get the pressed event information based on the item clicked
    const eventdetails = await GetandRenderEventDetail(event.EventID);


    // select the model and target its content
    const modal = document.getElementById('eventModal');
 
  

   // parse the attendees list from a string into a JSON file
   const attendeeslist = JSON.parse(eventdetails[0].Attendees);

   // find how many attendees there are for the event
   const attendeeNum = attendeeslist.length;
   // filter it down to accepted and declined to be shown on the interface
   const accepted = attendeeslist.filter(a => a.ResponseStatus === 'Accepted');
   const declined = attendeeslist.filter(a => a.ResponseStatus === 'Declined');
   
   renderEventDetails(eventdetails,attendeeNum,accepted,declined)
   

    modal.classList.remove('hidden');
  }


  function renderEventDetails(eventdetails, attendeeNum, accepted, declined) {
    
    const content = document.getElementById("content");
    content.innerHTML = ""; // Clear previous content
  
    const wrapper = document.createElement("div");
    wrapper.className = "modalEventDetails";
  
    // 1. Attending Status
    const statusWrapper = document.createElement("div");
    statusWrapper.className = "formItem";
  
    const statusLabel = document.createElement("label");
    statusLabel.setAttribute("for", "attendingStatus");
    statusLabel.textContent = "Your Response:";
  
    const status = document.createElement("div");
    status.className = "attendingStatus";
    status.id = "attendingStatus";
    status.textContent = eventdetails[0].EventResponseForUser;
  
    statusWrapper.appendChild(statusLabel);
    statusWrapper.appendChild(status);
    wrapper.appendChild(statusWrapper);
  
    // 2. Attendee Stats
    const statsWrapper = document.createElement("div");
    statsWrapper.className = "formItem";
  
    const statsLabel = document.createElement("label");
    statsLabel.setAttribute("for", "attendeeStats");
    statsLabel.textContent = "Attendance Overview:";
  
    const stats = document.createElement("div");
    stats.className = "attendeeStats";
    stats.id = "attendeeStats";
    stats.innerHTML = `
      <p id="invited"><strong>Invited:</strong> ${attendeeNum}</p>
      <p id="accepted"><strong>Accepted:</strong> ${accepted.length}</p>
      <p id="declined"><strong>Declined:</strong> ${declined.length}</p>
    `;
  
    statsWrapper.appendChild(statsLabel);
    statsWrapper.appendChild(stats);
    wrapper.appendChild(statsWrapper);
  
    // 3. Event Date
    const dateWrapper = document.createElement("div");
    dateWrapper.className = "formItem";
  
    const dateLabel = document.createElement("label");
    dateLabel.setAttribute("for", "eventDate");
    dateLabel.textContent = "Date:";
  
    const date = document.createElement("div");
    date.className = "eventDate";
    date.id = "eventDate";
    date.textContent = new Date(eventdetails[0].EventDate).toLocaleDateString("en-GB");
  
    dateWrapper.appendChild(dateLabel);
    dateWrapper.appendChild(date);
    wrapper.appendChild(dateWrapper);
  
    // 4. Title
    const titleWrapper = document.createElement("div");
    titleWrapper.className = "formItem";
  
    const titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", "eventTitle");
    titleLabel.textContent = "Event Title:";
  
    const title = document.createElement("h2");
    title.className = "eventTitle";
    title.id = "eventTitle";
    title.textContent = eventdetails[0].EventName;
  
    titleWrapper.appendChild(titleLabel);
    titleWrapper.appendChild(title);
    wrapper.appendChild(titleWrapper);
  
    // 5. Subtext
    const subtextWrapper = document.createElement("div");
    subtextWrapper.className = "formItem";
  
    const subtextLabel = document.createElement("label");
    subtextLabel.setAttribute("for", "eventSubtext");
    subtextLabel.textContent = "Summary:";
  
    const subtext = document.createElement("p");
    subtext.className = "eventSubtext";
    subtext.id = "eventSubtext";
    subtext.textContent = eventdetails[0].shortdesc || "";
  
    subtextWrapper.appendChild(subtextLabel);
    subtextWrapper.appendChild(subtext);
    wrapper.appendChild(subtextWrapper);
  
    // 6. Description
    const descWrapper = document.createElement("div");
    descWrapper.className = "formItem";
  
    const descLabel = document.createElement("label");
    descLabel.setAttribute("for", "eventDescription");
    descLabel.textContent = "Description:";
  
    const description = document.createElement("div");
    description.className = "eventDescription";
    description.id = "eventDescription";
    description.innerHTML = `
      <p>${eventdetails[0].EventDescription || "No description available."}</p>
    `;
  
    descWrapper.appendChild(descLabel);
    descWrapper.appendChild(description);
    wrapper.appendChild(descWrapper);
  
    // 7. Location
    const locationWrapper = document.createElement("div");
    locationWrapper.className = "formItem";
  
    const locationLabel = document.createElement("label");
    locationLabel.setAttribute("for", "eventLocation");
    locationLabel.textContent = "Location:";
  
    const location = document.createElement("div");
    location.className = "eventLocation";
    location.id = "eventLocation";
    location.innerHTML = `
      14 Waverly Lane<br>
      Mansfield<br>
      NG18 4HD
    `;
  
    locationWrapper.appendChild(locationLabel);
    locationWrapper.appendChild(location);
    wrapper.appendChild(locationWrapper);
  
    // Append to DOM
    content.appendChild(wrapper);
    modal.classList.remove("hidden");
  }
  

  
  // Close modal when clicking the X
  document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.getElementById('eventModal').classList.add('hidden');
  });
  
  // Optional: close modal on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.getElementById('eventModal').classList.add('hidden');
    }
  });
  
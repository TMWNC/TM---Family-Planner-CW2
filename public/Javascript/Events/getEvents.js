async function fetchAndRenderEvents(window = globalThis.window) {
  
  try {

    // get the list of events from the endpoint
    const response = await fetch('/api/getEventList');

    // convert to JSON
    const groupedEvents = await response.json();

    // Target the container for the events
    const container = document.getElementById('eventContainer');

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
        type.textContent = event.EventTypeName;

        // add the title
        const title = document.createElement('h3');
        title.className = 'EventCardTitle';
        title.textContent = event.EventName;

        // add the date
        const date = document.createElement('p');
        date.className = 'EventCardDate';
        // set the date format to be in UK standard as DDMMYYYY
        date.textContent = new Date(event.EventDate).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'long', year: 'numeric'
        });

        // add the link to view more 
        const viewMore = document.createElement('a');
        viewMore.className = 'viewmore';
        viewMore.href = '#'; // or link to event details
        viewMore.textContent = 'View info';

        // Append all elements to the event card
        eventItem.appendChild(type);
        eventItem.appendChild(title);
        eventItem.appendChild(date);
        eventItem.appendChild(viewMore);

        // append the event card to the group container
        groupEventContainer.appendChild(eventItem);

        eventItem.addEventListener('click', () => {
          showEventModal(event);
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

// Call it on page load
document.addEventListener('DOMContentLoaded', fetchAndRenderEvents);


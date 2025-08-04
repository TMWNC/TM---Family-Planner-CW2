// Date created 10/07/2025 by Tommy Mannix

// This module passes a JSON list of events in date order, it then converts it into 
// today, this week and this month style allowing it to be passed to /events/getlist end point
//////////////////////////////////////////////////////////////////////////////////////////////

// use date-fns to parse the dates 
const { isToday, isThisWeek, isThisMonth, format } = require('date-fns');



/**
 *create groups to be passed which will store the date categories
 */
function groupEvents(events) {
    const grouped = {
      Today: [],
      'This week': [],
      'This month': [],
    };
    const monthGroups = {};



// iterate through each event
events.forEach(event => {
    // turn it into a valid date
    const eventDate = new Date(event.EventDate || event.completionDate);


    // check if it satisfys as today 
    if (isToday(eventDate)) {
      grouped['Today'].push(event);
      
        // check if it satisfys as thisweek 
    } else /* Add comment */
if (isThisWeek(eventDate, { weekStartsOn: 1 })) {
      grouped['This week'].push(event);
        // check if it satisfys as this month 
    } else /* Add comment */
if (isThisMonth(eventDate)) {
      grouped['This month'].push(event);

        // otherwise it is another month and push that date to the list
    } else {

      const monthLabel = format(eventDate, 'MMMM yyyy');
      /* if there is a month label add it to the month groups as a new group */
if (!monthGroups[monthLabel]) {
        monthGroups[monthLabel] = [];
      }
      monthGroups[monthLabel].push(event);
    }
  });



  return { ...grouped, ...monthGroups };
}

module.exports = groupEvents;



/*
* This function getches the groups from the web server and renders them on the screen
*/
async function fetchAndRenderGroups() {
    try {
   
   
const ListGroupurl = `../../api/ListUserGroups`
      const response = await GetJSONRequest(ListGroupurl);


   
      const ListGroupInvitesURL = `../../api/ListPendingInvites`
      const GroupInvites = await GetJSONRequest(ListGroupInvitesURL);

      console.log(GroupInvites)
      // display the hotel to the user
      displayGroups(response.grouplist);
     displayInviteGroups(GroupInvites.grouplist);
    } catch (err) {

      // if the request fails then write an error to the console
      console.error('Failed to fetch groups:', err);
    }
  }
    
    /*

* actually renders the group list items card on screen for user and is run on dom load after fetching 
* the hotels and also whenever a filter is applied 
*/
  function displayGroups(response) {  // Target the container for the group

        // if there are no group in the request then output that there are no groups
        if (response.length < 1) {
          container.innerHTML = '<p>No Groups </p>';
          return;
        }
    // ger the outer container
    const GroupList = document.querySelector('.activeGroups');
    // clear the outer container for the groups
    GroupList.innerHTML = ''; 
    // Loop through each group 
  response.forEach((group) => {

   

    let groupitem = document.createElement("li");
    let namep = document.createElement("p")
    let statusp = document.createElement("p");
    let button = document.createElement("button");
  

groupitem.appendChild(namep);
groupitem.appendChild(statusp)
groupitem.appendChild(button)

button.classList.add("groupbutton")
button.dataset.groupID = group.GroupID;
button.textContent = "view group"
namep.textContent = `${group.GroupName} (${group.MemberCount})`
statusp = group.UserRoleLabel


  
button.addEventListener("click", function () {

  document.querySelector(".CreateGroup").dataset.mode = "invite";
  document.querySelector(".CreateGroup").dataset.groupid  = button.dataset.groupID;
  openEditGroup(button.dataset.groupID)
});

GroupList.appendChild(groupitem)
});

   
    
  }
  
/*
  * actually renders the group list items card on screen for user and is run on dom load after fetching 
  * the hotels and also whenever a filter is applied 
  */
    function displayInviteGroups(response) {  // Target the container for the group
  
          // if there are no group in the request then output that there are no groups
          if (response.length < 1) {
            container.innerHTML = '<p>No Invites </p>';
            return;
          }
      // ger the outer container
      const GroupList = document.querySelector('.InviteGroups');
      // clear the outer container for the groups
      GroupList.innerHTML = ''; 
      // Loop through each group 
    response.forEach((group) => {
  
      let groupitem = document.createElement("li");
      let namep = document.createElement("p")
      let statusp = document.createElement("p");
      let button = document.createElement("button");
    

groupitem.appendChild(namep);
groupitem.appendChild(statusp)


button.classList.add("groupbutton")
button.dataset.groupID = group.GroupID;
button.textContent = "view Invite"
namep.textContent = group.GroupName
statusp = group.InvitationStatus

groupitem.appendChild(button)
    
  button.addEventListener("click", function () {
  
    document.querySelector(".CreateGroup").dataset.mode = "edit";
   document.querySelector(".CreateGroup").dataset.groupid  = button.dataset.groupID;
   OpenAcceptInvite(button.dataset.groupID)
  });
 
  GroupList.appendChild(groupitem)
  
  });

    }
    
  

  function gotoURL(url){
    window.location.href = url;
  }



  // Call it on page load

  document.addEventListener('DOMContentLoaded', fetchAndRenderGroups);

  
/*
*Create 21/07/2025 by Tommy Mannix
* This script allows the creation,editing and updating of groups within the system and handles the logic for 
* the hidden menu system on the groups page
*/


/* create links to the UI items for access in JS */
const input = document.getElementById("InviteAdmins");
const suggestions = document.getElementById("Admin-email-suggestions");
const memberinput = document.getElementById("InviteMembers");
const membersuggestions = document.getElementById("member-email-suggestions");
const userlist = document.querySelector(".memberwrapper");
const panel = document.querySelector(".CreateGroup");
const form = document.querySelector(".hiddenmenuform");
const submitbutton = document.querySelector(".FormSubmit");
const createbutton = document.querySelector(".createbut")
const closebutton = document.querySelector(".closebutton")

let type = 1

// on window load assign the eventlisteners 
window.addEventListener("DOMContentLoaded", () => {
    // add the ability to search for users in the admin input area
  input.addEventListener("input", handleAdminInput);
    // add the ability to search for users in the member input area
  memberinput.addEventListener("input", handleMemberInput);

    // disable the form submit when the button is pressed as this is handled within the script
  form.addEventListener("submit", e => e.preventDefault());

  // add a click event to the buttons 
  // handles the act of update creat or edit 
  submitbutton.addEventListener("click", CreateGroup);
  closebutton.addEventListener("click",closeGroupPanel)
  createbutton.addEventListener("click",openCreateGroupPanel)
});



// This is the logic for the auto complete search bar for the admin box when an E-mail
// is typed in, it only accepts full emails 
async function handleAdminInput() {
    // take the boxes input 
  const query = input.value.trim();

  // if the query is less than 2 characters in length then return nothing
  if (query.length < 2) return suggestions.innerHTML = "";

  // fetch the list of users from the server encoding the input email address in the URL parameter
  const res = await fetch(`../../api/findmember?email=${encodeURIComponent(query)}`);
  // conver the resposne to JSON
  const data = await res.json();
  // reset the suggestions drop down
  suggestions.innerHTML = "";


  // iterate through  the list there should only be one distinct value
  data.emaillist.forEach(email => {

    // create a list item to append into the unordered list 
    const li = document.createElement("li");
    // encode it with the users first and surname
    li.textContent = `${email.FirstName} ${email.Surname}`;

    // when they click the suggestion pass the user to the addmember to list function 
    li.addEventListener("click", () => {
        // pass as owner
      addMemberToList(email.UserID, `${email.FirstName} ${email.Surname}`, "1", "Owner");
      input.value = "";
      suggestions.innerHTML = "";
    });
    // append the li to the ul
    suggestions.appendChild(li);
  });
}

// This function is similar to the admin member input and is the auto complete for the member inputbox
async function handleMemberInput() {
  const query = memberinput.value.trim();

  if (query.length < 2) return membersuggestions.innerHTML = "";

  const res = await fetch(`../../api/findmember?email=${encodeURIComponent(query)}`);
  const data = await res.json();
  membersuggestions.innerHTML = "";

  data.emaillist.forEach(email => {
    console.log(email)
    const li = document.createElement("li");
    li.textContent = `${email.FirstName} ${email.Surname}`;
    li.addEventListener("click", () => {
        // pass to the add member list that they are a member
      addMemberToList(email.UserID, `${email.FirstName} ${email.Surname}`, "2", "Member");
      memberinput.value = "";
      membersuggestions.innerHTML = "";
    });
    membersuggestions.appendChild(li);
  });
}

// adds a member to the members list on the drop down takes in the users ID Name and permission level
function addMemberToList(userID, fullName, permission, roleLabel) {

    // create a list item and class it as a row item to be used later
  const li = document.createElement("li");
  li.classList.add("rowitem");
  // encode the users ID and permission in its data set 
  li.dataset.userid = userID;
  li.dataset.permission = permission;

  // append the users details with a button that removes the user from the list
  const namep = document.createElement("p");
  const rolep = document.createElement("p");
  const removebutton = document.createElement("button");

  namep.textContent = fullName;
  rolep.textContent = roleLabel;
  removebutton.textContent = "remove";
  removebutton.classList.add("groupbutton");
  removebutton.addEventListener("click", () => li.remove() );

  li.appendChild(namep);
  li.appendChild(rolep);
  li.appendChild(removebutton);
  userlist.appendChild(li);
}

// this function handles if the create button is pressed and resets the form in 
// create mode
function openCreateGroupPanel() {

    // type 1 is creating a team
    type = 1

    // set the panels data set mode to create for use when submitting values to the server
  panel.dataset.mode = "create";
  panel.dataset.groupid = "";

  // find the group name and reset it along with the other UI elements
  document.querySelector("#GroupName").value = "";
  input.value = "";
  memberinput.value = "";
  suggestions.innerHTML = "";
  membersuggestions.innerHTML = "";
  userlist.innerHTML = `<li><h2> members </h2></li>`;

  // set the title to create a group
  document.querySelector(".CreateGroup h2").textContent = "Create a group";
// set all the boxes to be editable
  document.querySelector("#GroupName").disabled = false;
  input.disabled = false;
  memberinput.disabled = false;

  // change the button text to create group
  submitbutton.textContent ="create group"
  submitbutton.style.display = "inline-block";
  panel.classList.add("active");
}



/// this function closes the group panel 
function closeGroupPanel() {
    // find the panel and remove the active tag
    const existing = document.querySelector("#acceptwrapper");
    if (existing) existing.remove();
  panel.classList.remove("active");

}

//  Logic to create or update a group including the creation of a JSON payload to be sent to post
async function CreateGroup() {
  
    // get the group names value and trim to remove white space
  const groupName = document.querySelector("#GroupName").value.trim();
  if (!groupName) return alert("Please enter a group name.");
  if (groupName.length > 60) return alert("groupname too long.");
  // iterate through the row items and rip the userID and permission
  const rowitems = userlist.querySelectorAll(".rowitem");
  const members = Array.from(rowitems).map(item => ({
    userID: item.dataset.userid,
    permission: item.dataset.permission
  }));

  // collate together in JSON format
  const payload = { 
    groupName,
     members };
    
     // get teh panels current mode either edit or create
  const mode = panel.dataset.mode;
  const groupID = panel.dataset.groupid;

  // default to create 
  let url = "../../api/CreateGroup";
  if (mode === "edit") {
    payload.groupID = groupID;
    url = "../../api/UpdateGroup";
  }

  // pass the URL and payload to post JSON to send to the server
  // postJSON found in getRequest
  await PostJSON(url, payload);
  fetchAndRenderGroups(); // refresh the list
  closeGroupPanel(); // reset panel
}




// thisis the logic for editing a group when edit is pressed
async function openEditGroup(groupID) {

      // type 2 is editing a team
      type =2;

      // pull the data from the server using the passed groupID
    const res = await fetch(`../../api/viewGroup?groupID=${groupID}`);

  
    const data = await res.json();

   
  // identify if the user is the owner
    const isOwner = data[0].IsCurrentUserOwner;

    panel.classList.add("active");
    
    // if they are the owner set to edit else view
    panel.dataset.mode = isOwner ? "edit" : "view";
    panel.dataset.groupid = groupID;
  
    //get the group anme and display it 
    document.querySelector("#GroupName").value = data[0].GroupName;

    // test to see if they are the owner if so display Edit group other wise View group
    document.querySelector(".CreateGroup h2").textContent = isOwner ? "Edit Group" : "View Group";
  
    // popualte the User list 
    userlist.innerHTML = `<li><h2> members </h2></li>`;
    data.forEach(member => {

        console.log(member)

        // create  the row item and encode its userID and grouprole like earlier
      const li = document.createElement("li");
      li.classList.add("rowitem");
      li.dataset.userid = member.UserID;
      li.dataset.permission = member.GroupRoleID;
  
      const namep = document.createElement("p");
      const rolep = document.createElement("p");
      namep.textContent = `${member.FirstName} ${member.Surname}`;
      rolep.textContent = member.RoleName;
  
      li.appendChild(namep);
      li.appendChild(rolep);
  
      // Add remove button only if editing
      if (isOwner) {
        document.querySelector(".CreateGroup h2").textContent = "Edit group" ;
        const removebutton = document.createElement("button");
        removebutton.textContent = "remove";
        removebutton.classList.add("groupbutton");
        removebutton.addEventListener("click", () => li.remove());
        li.appendChild(removebutton);
      }
  
      userlist.appendChild(li);
    });
  
    // Enable/disable inputs based on permission
    document.querySelector("#GroupName").disabled = !isOwner;
    input.disabled = !isOwner;
    memberinput.disabled = !isOwner;
    submitbutton.textContent ="Edit  group"
 
    submitbutton.style.display = isOwner ? "inline-block" : "none";
    const existing = document.querySelector("#acceptwrapper");
    if (existing) existing.remove();

   
  }
  

  // logic for opening an invitiation to accept

async function OpenAcceptInvite(groupID) {

    const res = await fetch(`../../api/viewGroup?groupID=${groupID}`);

  
    const data = await res.json();
   



var isOwner = 0;
    panel.classList.add("active");
    panel.dataset.mode = isOwner ? "edit" : "view";
    panel.dataset.groupid = groupID;
  
    document.querySelector("#GroupName").value = data[0].GroupName;
    document.querySelector(".CreateGroup h2").textContent ="Invite Group";
  
    userlist.innerHTML = `<li><h2> members </h2></li>`;
    data.forEach(member => {
      const li = document.createElement("li");
      li.classList.add("rowitem");
      li.dataset.userid = member.userID;
      li.dataset.permission = member.permission;
  
      const namep = document.createElement("p");
      const rolep = document.createElement("p");
      namep.textContent = `${member.FirstName} ${member.Surname}`;
      rolep.textContent = member.RoleName;
  
      li.appendChild(namep);
      li.appendChild(rolep);
  
 
      userlist.appendChild(li);
    });
  
    const existing = document.getElementById("acceptwrapper");
    if (existing) existing.remove();

    const divwrapper = document.createElement("div");

    divwrapper.id ="acceptwrapper"

    divwrapper.innerHTML = " "
    const hiddenmenuform = document.querySelector(".hiddenmenuform")
    console.log(hiddenmenuform.innerHTML)
  
    const Accept = document.createElement("button")
    Accept.classList.add("accept")
    Accept.textContent ="Accept"
    const decline = document.createElement("button")
    decline.classList.add("decline")
    decline.textContent ="decline"
    divwrapper.appendChild(Accept)
    divwrapper.appendChild(decline)
    hiddenmenuform.appendChild(divwrapper)


    // Enable/disable inputs based on permission
    document.querySelector("#GroupName").disabled = !isOwner;
    input.disabled = !isOwner;
    memberinput.disabled = !isOwner;
    submitbutton.style.display = isOwner ? "inline-block" : "none";

   
// click handlers for accept and decline  buttons
Accept.addEventListener("click", async () => {
  const response = await fetch("../../api/invite/accept", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // send the the groups ID
    body: JSON.stringify({ groupID }) // send group ID
  });

  if (response.ok) {
    alert("You have accepted the invite.");
    // close the panel
    closeGroupPanel();
    // rerender the list
    fetchAndRenderGroups();
  } else {
    alert("Failed to accept invite.");
  }
});

decline.addEventListener("click", async () => {
  const response = await fetch("../../api/invite/decline", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ groupID })
  });

  if (response.ok) {
    alert("You declined the invite.");
    closeGroupPanel();
    fetchAndRenderGroups();
  } else {
    alert("Failed to decline invite.");
  }
  
   
  });
}
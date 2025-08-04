const input = document.getElementById("InviteAdmins");
const suggestions = document.getElementById("Admin-email-suggestions");


const userlist = document.querySelector(".memberwrapper")
const panel = document.querySelector(".hiddenmenu")




async function handleAdminInput() {
    const query = input.value;
    if (query.length < 2) {
      suggestions.innerHTML = "";
      return;
    }
  
    const response = await fetch(`../../api/findmember?email=${encodeURIComponent(query)}`);
    const data = await response.json();
    suggestions.innerHTML = "";
  
    data.emaillist.forEach(email => {
      const li = document.createElement("li");
      const name = `${email.FirstName} ${email.Surname}`;
      li.textContent = name;
      li.addEventListener("click", () => {
        addMemberToList(email.UserID, name, "1", "Owner");
        input.value = "";
        suggestions.innerHTML = "";
      });
      suggestions.appendChild(li);
    });
  }
  

  async function handleMemberInput() {
    const query = memberinput.value;
    if (query.length < 2) {
      membersuggestions.innerHTML = "";
      return;
    }
  
    const response = await fetch(`../../api/findmember?email=${encodeURIComponent(query)}`);
    const data = await response.json();
    membersuggestions.innerHTML = "";
  
    data.emaillist.forEach(email => {
      const li = document.createElement("li");
      const name = `${email.FirstName} ${email.Surname}`;
      li.textContent = name;
      li.addEventListener("click", () => {
        addMemberToList(email.UserID, name, "2", "Member");
        memberinput.value = "";
        membersuggestions.innerHTML = "";
      });
      membersuggestions.appendChild(li);
    });
  }
  


function openCreateGroupPanel() {
input.addEventListener("input", async () => {
    const query = input.value;
  
    if (query.length < 2) {
      suggestions.innerHTML = "";
      return;
    }
  
    const response = await fetch(`../../api/findmember?email=${encodeURIComponent(query)}`);
    const data = await response.json();
  
    console.log(data.emaillist)
    suggestions.innerHTML = "";
    data.emaillist.forEach(email => {

        alert("match")



      const li = document.createElement("li");
    
      const addedmembersli = document.createElement("li");
      const listp = document.createElement("p")
      const namep = document.createElement("p");
      const rolep = document.createElement("p");
      const removebutton = document.createElement("button");


      listp.textContent = email.FirstName + " " + email.Surname;
      
      
     


      li.addEventListener("click", () => {

        namep.textContent = email.FirstName + " " + email.Surname;
        rolep.textContent = "Owner"
         removebutton.textContent = "remove";
         removebutton.classList.add("groupbutton")

         userlist.appendChild(addedmembersli);
         addedmembersli.classList.add("rowitem")
         addedmembersli.dataset.userid = email.UserID;
         addedmembersli.dataset.permission = "1";
         addedmembersli.appendChild(namep)
         addedmembersli.appendChild(rolep)
         addedmembersli.appendChild(removebutton)

        input.value = "";
        suggestions.innerHTML = "";
      });
      suggestions.appendChild(li);
      li.appendChild(listp)

      



    });
  });    


////////// generate the drop doewn for the invite members box
  const memberinput = document.getElementById("InviteMembers");
  const membersuggestions = document.getElementById("member-email-suggestions");
  
  memberinput.addEventListener("input", async () => {
    const query = memberinput.value;
  
    if (query.length < 2) {
        membersuggestions.innerHTML = "";
      return;
    }
  
    const response = await fetch(`../../api/findmember?email=${encodeURIComponent(query)}`);
    const data = await response.json();
  
    console.log(data.emaillist)
    membersuggestions.innerHTML = "";
    data.emaillist.forEach(email => {

        alert("match")



      const li = document.createElement("li");
 
    

      const addedmembersli = document.createElement("li");
      const listp = document.createElement("p")
      const namep = document.createElement("p");
      const rolep = document.createElement("p");
      const removebutton = document.createElement("button");


      listp.textContent = email.FirstName + " " + email.Surname;
      
      
     


      li.addEventListener("click", () => {

        namep.textContent = email.FirstName + " " + email.Surname;
        rolep.textContent = "Member"
         removebutton.textContent = "remove";
         removebutton.classList.add("groupbutton")
       
         userlist.appendChild(addedmembersli);
         addedmembersli.dataset.userid = email.UserID;
         addedmembersli.dataset.permission = "2";
         addedmembersli.classList.add("rowitem")
         addedmembersli.appendChild(namep)
         addedmembersli.appendChild(rolep)
         addedmembersli.appendChild(removebutton)

         memberinput.value = "";
         membersuggestions.innerHTML = "";
      });
      membersuggestions.appendChild(li);
      li.appendChild(listp)

      



    });
  });    

  // prevent default form
  const form = document.querySelector(".hiddenmenuform");

  form.addEventListener("submit", function(event) {
    event.preventDefault(); // stops the form from submitting
    console.log("Form submission prevented.");
    // You can now handle the data manually (e.g., send via fetch/AJAX)
  });


const submitbutton = document.querySelector(".FormSubmit")
submitbutton.addEventListener("click",CreateGroup)



}


function addMemberToList(userID, fullName, permission, roleLabel) {
    const li = document.createElement("li");
    li.classList.add("rowitem");
    li.dataset.userid = userID;
    li.dataset.permission = permission;
  
    const namep = document.createElement("p");
    const rolep = document.createElement("p");
    const removebutton = document.createElement("button");
  
    namep.textContent = fullName;
    rolep.textContent = roleLabel;
    removebutton.textContent = "remove";
    removebutton.classList.add("groupbutton");
    removebutton.addEventListener("click", () => li.remove());
  
    li.appendChild(namep);
    li.appendChild(rolep);
    li.appendChild(removebutton);
    userlist.appendChild(li);
  }
  

/*
*
*/


async function CreateGroup() {
    const groupName = document.querySelector("#GroupName").value.trim();
    if (!groupName) {
      alert("Please enter a group name.");
      return;
    }
  
    const rowitems = userlist.querySelectorAll(".rowitem");
  
    const members = Array.from(rowitems).map(item => ({
      userID: item.dataset.userid,
      permission: item.dataset.permission
    }));
  
    const JSONsend = {
     groupName: groupName,
     members: members  
    };
  
    console.log("Sending JSON:", JSONsend);
  
    let url = "../../api/CreateGroup";

    if (mode === "edit") {
        JSONsend.groupID = groupID;
      url = "../../api/UpdateGroup";
    }


    await PostJSON(url, JSONsend);

    fetchAndRenderGroups();
  }
  



  async function openEditGroup(groupID) {
    const res = await fetch(`../../api/viewGroup?groupID=${groupID}`);
    const data = await res.json(); // data: { groupName: "", members: [] }
  
console.log(data)

    document.querySelector("#GroupName").value = data[0].GroupName;
    panel.dataset.mode = "edit";

    var mode = panel.dataset.mode
    panel.dataset.groupid = groupID;

    document.querySelector(".CreateGroup h2").textContent =
    mode === "edit" ? "Edit Group" : "Create Group";

    // Clear the member list
    userlist.innerHTML = `<li><h2> members </h2></li>`;
  
    data.forEach(member => {
      const li = document.createElement("li");
      li.classList.add("rowitem");
      li.dataset.userid = member.userID;
      li.dataset.permission = member.permission;
  
      const namep = document.createElement("p");
      const rolep = document.createElement("p");
      const removebutton = document.createElement("button");
  
      namep.textContent = `${member.FirstName} ${member.Surname}`;
      rolep.textContent = member.RoleName ;
      removebutton.textContent = "remove";
      removebutton.classList.add("groupbutton");
      removebutton.onclick = () => li.remove();
  
      li.appendChild(namep);
      li.appendChild(rolep);
      li.appendChild(removebutton);
      userlist.appendChild(li);
    });
  
    panel.classList.add("active"); // make panel visible
  }
  
  function openCreateGroupPanel() {
    panel.dataset.mode = "create";
    panel.dataset.groupid = "";
    document.querySelector("#GroupName").value = "";
    input.value = "";
    memberinput.value = "";
    suggestions.innerHTML = "";
    membersuggestions.innerHTML = "";
    userlist.innerHTML = `<li><h2> members </h2></li>`;
    document.querySelector(".CreateGroup h2").textContent = "Create a group";
    panel.classList.add("active");
  }
  
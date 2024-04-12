let allTasks = [];
let priority;

async function init() {
  includeHTML();
  await loadAllTasks();
  await loadContacts();
  await loadAssignedContacts();
  // createAndPushInitials();
  // createAndPushColors();
  renderContactsToAssign();
  showAssignedtoContacts();
}

/**
 * This function gets the form elements values, pushes them into the array "allTasks" and saves them in the storage.
 *
 */
async function addTask() {
  let title = document.getElementById("taskTitle").value;
  let description = document.getElementById("taskDescription").value;
  let dueDate = document.getElementById("taskDueDate").value;
  let category = document.getElementById("taskCategory").value;
  let status = "toDo";

  let task = {
    title: title,
    description: description,
    dueDate: dueDate,
    priority: priority,
    // assignedTo: assignedContactInfos,
    assignedTo: assignedContacts,
    category: category,
    subtasks: subtasks,
    status: status,
  };

  pushTask(task);
  await storeAllTasks();
  console.log(allTasks);
  clearInputs();
}

function pushTask(task) {
  allTasks.push(task);
}

async function storeAllTasks() {
  await setItem("remoteTasks", allTasks);
}

/**
 * This function loads an array from the storage and parses it.
 *
 *
 */
async function loadAllTasks() {
  let response = await getItem("remoteTasks");
  allTasks = await JSON.parse(response);
}

function setPrioUrgent() {
  priority = "urgent";
  console.log(priority);
}
function setPrioMedium() {
  priority = "medium";
  console.log(priority);
}
function setPrioLow() {
  priority = "low";
  console.log(priority);
}

function clearInputs() {
  document.getElementById("taskForm").reset();
}

// wenn alles leer ist soll nichts getan werden am anfang
// ich schreibe was rein und wenn alle felder voll sind soll der button enabled werden
// ich lösche eine Sache - 1. Ifabrfage wird wieder true und

function disOrEnableButton() {
  // If all those three have value...
  if (document.getElementById("taskTitle").value == "" || document.getElementById("taskDueDate").value == "" || document.getElementById("taskCategory").value == "") {
    // In the beginning the button is disabled and nothin has to be done
    if (document.getElementById("submit_task_button").hasAttribute("disabled")) {
      // This else-statement is used if the required inputs had values so that the button was enabled, but then one input was deleted. In this case the disabled attribute has to be set again and the button has to get back the css of the enabled button.
    } else {
      document.getElementById("submit_task_button").setAttribute("disabled", "disabled");
      document.getElementById("submit_task_button").classList.add("btn_dark_disabled");
      document.getElementById("submit_task_button").classList.remove("btn_dark");
    }
    // If all inputs have values, the button is enabled.
  } else {
    document.getElementById("submit_task_button").removeAttribute("disabled");
    document.getElementById("submit_task_button").classList.remove("btn_dark_disabled");
    document.getElementById("submit_task_button").classList.add("btn_dark");
  }
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    let dropdowns = document.getElementsByClassName("dropdown-content");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

// Contacts to assign

// ***********************************************************Alte Version, die derzeit noch größtenteils eingebunden ist
let contactsX = ["Sofia", "Anton Mayer", "Anja Schulz", "Benedikt Ziegler", "David Eisenberg"];
// let contactInitials = [];
// let contactColors = [];
// ***********************************************************

// ${contactInfos[i].contacts}

// ********************** RIGHT STRUKTURE FOR LATER

// let assignedContactsX = [];

// function addassignedContactInfos() {
//   let assignedContact = []; //Todo: Umbenennen
//   let assignedContactInitial = [];
//   let assignedContactColor = [];

//   let assignedContactX = {
//     assignedContact: assignedContact,
//     assignedContactInitial: assignedContactInitial,
//     assignedContactColor: assignedContactColor
//   }

//   pushAssignedContactInfo(assignedContactInfo);

// }

// function pushAssignedContactInfo(assignedContactInfo) {
//   assignedContactInfos.push(assignedContactInfo);
// }
// ************************

let assignedContacts = [];
let assignedContactInitials = [];
let assignedContactColors = [];

let colors = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", "#1FD7C1", "#FF745E", "#FFA35E", "#FC71FF", "#FFC701", "#0038FF", "#C3FF2B", "#FFE62B", "#FF4646", "#FFBB2B"];

function addCheckboxImage(j) {
  for (let i = 0; i < assignedContacts.length; i++) {
    const assContact = assignedContacts[i];
    let contactsIndex = contacts.indexOf(assContact);
    // result is index in contacts OR -1
    if (contactsIndex == -1) {
      document.getElementById(`checkBoxImage${j}`).src = "../assets/img/icons/checkbox_empty.png";
    } else {
      document.getElementById(`checkBoxImage${contactsIndex}`).src = "../assets/img/icons/checkbox_filled.png";
    }
  }
}

// Trash:

// function createAndPushInitials() {
//   for (let i = 0; i < contactsX.length; i++) {
//     let contact = contactsX[i];
//     let contactAsString = contact.toString();
//     let initials = contactAsString.match(/\b(\w)/g).join("");
//     let firstTwoInitials = initials.slice(0, 2);
//     contactInitials.push(firstTwoInitials);
//     console.log("contactInitials:", contactInitials);
//   }
// }

// function createAndPushColors() {
//   for (let i = 0; i < contactsX.length; i++) {
//     let color = colors[generateRandomNumber()];
//     contactColors.push(color);
//     // console.log("contactColors:", contactColors);
//   }
// }

// function generateRandomNumber() {
//   return Math.floor(Math.random() * 15);
// }

// Trash Ende

// Render Dropdown mit contacts
function renderContactsToAssign() {
  let i = 0; // Todo: do I need that????
  for (i = 0; i < contacts.length; i++) {
    document.getElementById("myDropdown").innerHTML += generateContactToAssign(i);
  }
  addCheckboxImage(i); // Todo: put somewhere else
}

function generateContactToAssign(i) {
  return `<div class="dropdown-content-div" onclick="stopPropagation()">
  <div class="dropdown_container">
    <div  style="background-color:${contacts[i].contactColor}" class="initials_circle"><span class="initials_span">${contacts[i].contactInitials}</span></div>
    <span id="contacts${i}">${contacts[i].contactName}</span>
  </div>
  <div id="checkboxContainer${i}"><img id="checkBoxImage${i}" src="../assets/img/icons/checkbox_empty.png" alt="" onclick='selectAssignedContact(${i})'/></div>
</div>`;
}

async function selectAssignedContact(i) {
  // function selectOrUnselectContact
  console.log("i: ", i);
  if (document.getElementById(`checkBoxImage${i}`).src.endsWith("/checkbox_filled.png")) {
    document.getElementById(`checkBoxImage${i}`).src = "../assets/img/icons/checkbox_empty.png";
    let currentContact = contacts[i];
    let indexInAssignedContact = assignedContacts.indexOf(currentContact);
    console.log("indexInAssignedContact:", indexInAssignedContact);
    assignedContacts.splice(indexInAssignedContact, 1); // aus dem array löschen
  } else {
    changeCheckboxImage(i);
    pushAssignedContacts(i);
  }
  await storeAssignedContacts();
  showAssignedtoContacts();
  console.log("assignedContacts: ", assignedContacts);
}

function changeCheckboxImage(i) {
  document.getElementById(`checkBoxImage${i}`).src = "../assets/img/icons/checkbox_filled.png";
}

function pushAssignedContacts(i) {
  let assignedContact = contacts[i];
  assignedContacts.push(assignedContact);
  console.log("assignedContacts: ", assignedContacts);
}

function stopPropagation() {
  event.stopPropagation(onclick);
}

async function storeAssignedContacts() {
  // assignedContacts = [];
  await setItem("remoteAssignedContacts", assignedContacts);
}

async function loadAssignedContacts() {
  let response = await getItem("remoteAssignedContacts");
  assignedContacts = await JSON.parse(response);
}

function showAssignedtoContacts() {
  document.getElementById("assignedtoContactsContainer").innerHTML = "";
  for (let i = 0; i < assignedContacts.length; i++) {
    let j = contacts.indexOf(assignedContacts[i]);
    document.getElementById("assignedtoContactsContainer").innerHTML += generateInitialCircles(j);
  }
}

function generateInitialCircles(i) {
  // Farbcode durch Variable ersetzen.
  return `
  <div id="initialCircle${i}" style="background-color:${contacts[i].contactColor}" class="initials_circle"><span class="initials_span">${contacts[i].contactInitials}</span></div>
  `;
}

// ******************************Subtasks

// store and load contactInitials and contactColors
// Make one array of objects instead of 3 arrays.

// let subtasks [
//   {
// nameSubtask: nameSubtask,
// stausSubtask:
// },
// {
//   nameSubtask:
//   stausSubtask:
//   },
// ]

let subtasks = [];

function showIconsSubtasks() {
  if (document.getElementById("taskSubtask").value !== "") {
    document.getElementById("iconsSubtasksContainer").classList.remove("d_none");
  } else {
    document.getElementById("iconsSubtasksContainer").classList.add("d_none");
  }
}

function clearSubtask() {
  document.getElementById("taskSubtask").value = "";
  document.getElementById("iconsSubtasksContainer").classList.add("d_none");
}

function addSubtask() {
  if (document.getElementById("taskSubtask").value) {
    let nameSubtask = document.getElementById("taskSubtask").value;
    let statusSubtask = "inProgress";

    let subtask = {
      nameSubtask: nameSubtask,
      statusSubtask: statusSubtask,
    };
    subtasks.push(subtask);
    console.log(subtasks);
    clearSubtask();
    renderSubtasks();
  }
  // Todo: If Create Task is clicked, subtasks needs to  be stored
}

function renderSubtasks() {
  document.getElementById("subtasksRenderContainer").innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    let subtaskName = subtasks[i].nameSubtask;
    document.getElementById("subtasksRenderContainer").innerHTML += generateSubtasks(i, subtaskName);
  }
}

function generateSubtasks(i, subtaskName) {
  return `<div id="renderedSubtask${i}" onclick="makeRenderedSubtasksEditable(${i})" onmouseover="showPenAndTrash(${i})" onmouseout="hidePenAndTrash(${i})" class="rendered_subtask">
  <div class="span_container ">
    <span class="rendered_subtasks_span">&#x2022</span>
    <span id="subtasName${i}"> ${subtaskName}</span>
  </div>
  <div id="containerPenAndTrash${i}" class="d_none">
    <img onclick="makeRenderedSubtasksEditable(${i})" id="pen${i}" src="../assets/img/icons/subtasks_pen.png" alt="">
    <img src="../assets/img/icons/subtask_line.png" alt="">
    <img onclick="deleteSubtask(${i})" id="trash${i}" src="../assets/img/icons/subtask_trash.png" alt="">
  </div>
  <div id="containerTrashAndCheck${i}" class="d_none">
    <img onclick="deleteRenderedSubtask(${i})" src="../assets/img/icons/subtask_trash.png" alt="">
    <img src="../assets/img/icons/subtask_line.png" alt="">
    <img onclick="overwriteSubtask(${i})" src="../assets/img/icons/subtask_check.png" alt="">
  </div>
</div>`;
}

function showPenAndTrash(i) {
  document.getElementById(`containerPenAndTrash${i}`).classList.remove("d_none");
}

function hidePenAndTrash(i) {
  document.getElementById(`containerPenAndTrash${i}`).classList.add("d_none");
}

function deleteSubtask(i) {
  subtasks.splice(i, 1);
  // Todo: push array in storage if add task is pressed
  renderSubtasks();
}

function makeRenderedSubtasksEditable(i) {
  document.getElementById(`renderedSubtask${i}`).setAttribute("contenteditable", true);
  document.getElementById(`renderedSubtask${i}`).onmouseover = function () {};
  showTrashAndCheck(i);
}

function showTrashAndCheck(i) {
  document.getElementById(`containerTrashAndCheck${i}`).classList.remove("d_none");
}

function deleteRenderedSubtask(i) {
  deleteSubtask(i);
}

function overwriteSubtask(i) {
  // In dieser Funktion passiert der Fehler
  let newValueSubtaskName = document.getElementById(`subtasName${i}`).innerText;
  subtasks[i].nameSubtask = newValueSubtaskName;
  renderSubtasks();
  // containerTrashAndCheck soll verschwinden - funktioniert nicht:
  document.getElementById(`containerTrashAndCheck${i}`).classList.add("d_none");
  // Die Funktion showPenAndTrash soll wieder onmouseover ausgeführt werden - funktioniert nicht:
  document.getElementById(`renderedSubtask${i}`).onmouseover = function () {
    showPenAndTrash(i);
  }; // funktioniert nicht
}

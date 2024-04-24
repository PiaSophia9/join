// let allTasks = [];
let todo = [];
let inProgress = [];
let awaitFeedback = [];
let done = [];
let matchingTodos = [];
const CATEGORY_COLORS = {"Technical Task": "#1FD7C1", "User Story": "#0038FF"};
const PRIO_IMAGE_URLS = {
  low: "../assets/img/icons/prio_kow_green.svg",
  medium: "../assets/img/icons/prio_medium_orange.svg",
  urgent: "../assets/img/icons/prio_urgent_red.svg",
};
let currentDraggedElement;

async function initBoard() {
  await loadAllTasks();
  updateHTML(allTasks);
  unlogAllSidebarLinks();
  logSidebarLink("boardSidebar");
  loadUserInitials();
}

/**
 * This function loads the array "allTasks" from the server and assign it to the array "todos"
 */
// async function loadAllTasksBoard() {
//     let response = await getItem('remoteTasks');
//     todos = await JSON.parse(response);
// }

/**
 * This function updates the task areas.
 * The todo-Array is filtered for each status and a new array for the tasks at this specific status is given back.
 * Then, these arrays are passed into the function "updateArea"
 */
function updateHTML(arrayName) {
  todo = arrayName.filter((t) => t["status"] == "toDo");
  inProgress = arrayName.filter((t) => t["status"] == "in-progress");
  awaitFeedback = arrayName.filter((t) => t["status"] == "await-feedback");
  done = arrayName.filter((t) => t["status"] == "done");

  updateArea("toDo", todo, arrayName);
  updateArea("in-progress", inProgress, arrayName);
  updateArea("await-feedback", awaitFeedback, arrayName);
  updateArea("done", done, arrayName);
}

/**
 * In this function, the task-area first gets cleared. After that, if the areaArray is empty, the function "generateEmptyHTML" is called. This function just return a div with the text "no tasks here".
 * If the array isn't empty, the task-element for every task in the array is created by calling the function "generateTodoHTML"
 * @param {string} areaName
 * @param {Array} areaArray
 */
function updateArea(areaName, areaArray, arrayName) {
  document.getElementById(areaName).innerHTML = "";
  if (areaArray.length == 0) {
    document.getElementById(areaName).innerHTML += generateEmptyHTML();
  } else {
    for (let index = 0; index < areaArray.length; index++) {
      const element = areaArray[index];
      document.getElementById(areaName).innerHTML += generateTodoHTML(element, arrayName);
      document.getElementById(`prio-image${arrayName.indexOf(element)}`).innerHTML += generatePrioImage(element, arrayName);
      createInitials(element, arrayName);
      if (element.subtasks.length != 0) {
        document.getElementById(`subtask-progress${arrayName.indexOf(element)}`).style.display = "flex";
      }
    }
  }
}

function generateTodoHTML(element, arrayName) {
  return /*html*/ `
        <div draggable="true" ondragstart="startDragging(${arrayName.indexOf(element)}); highlightAreas()" ondragend="removeHighlightAreas()" class="task" id="task${arrayName.indexOf(
    element
  )}" onclick="openTaskDetails(${arrayName.indexOf(element)})">
            <span class="task-category" style="background-color: ${CATEGORY_COLORS[element.category]}">${element["category"]}</span>
            <span class="task-title">${element["title"]}</span>
            <span class="task-description">${element["description"]}</span>
            <!-- if there are no subtasks, the progress-bar should not be displayed -->
            <div class="subtask-progress" id="subtask-progress${arrayName.indexOf(element)}" style="display: none">
                <progress class="progress-bar" value="${calculateSubtaskProgress(element)}" max="100"></progress>
                <span>${checkSubtaskStatus(element)}/${element.subtasks.length} Subtasks</span>
            </div>
            <div class="user-and-prio">
                <div class="assigned-to" id="assigned-to${arrayName.indexOf(element)}"></div>
                <div id="prio-image${arrayName.indexOf(element)}"></div>
            </div>
        </div>
    `;
}

function startDragging(id) {
  currentDraggedElement = id;
  dragCardHighlight(currentDraggedElement);
}

function createInitials(element, arrayName) {
  if (element["assignedTo"] == "") {
    return "";
  } else {
    for (let i = 0; i < element.assignedTo.length; i++) {
      document.getElementById(`assigned-to${arrayName.indexOf(element)}`).innerHTML += /*html*/ `
                <span class="assigned-user" style="background-color: ${element.assignedTo[i].contactColor}">${element.assignedTo[i].contactInitials}</span>
            `;
    }
  }
}

function generatePrioImage(element, arrayName) {
  let imageContainer = document.getElementById(`prio-image${arrayName.indexOf(element)}`);
  if (element["priority"] == undefined) {
    imageContainer.style.display = "none";
  } else {
    return /*html*/ `
            <img src="${PRIO_IMAGE_URLS[element.priority]}" alt="">
        `;
  }
}

function checkSubtaskStatus(element) {
  if (element.subtasks.length != 0) {
    let subtasksDone = 0;
    element.subtasks.forEach((subtask) => {
      if (subtask.statusSubtask == "done") {
        subtasksDone++;
      }
    });
    return subtasksDone;
  }
}

function calculateSubtaskProgress(element) {
  // calculate progress if one ore more subtasks are marked done
  let substasksDone = checkSubtaskStatus(element);
  let progress = (substasksDone / element.subtasks.length) * 100;
  return progress;
}

function generateEmptyHTML() {
  return `<div class="task no-task">No tasks here</div>`;
}

function allowDrop(event) {
  event.preventDefault();
}

async function moveTo(status) {
  allTasks[currentDraggedElement]["status"] = status;
  // update status in database
  await storeAllTasksBoard();
  // load tasks from database
  await loadAllTasks();
  updateHTML(allTasks);
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function highlightAreas() {
  let dragAreas = document.getElementsByClassName("drag-area");
  for (let i = 0; i < dragAreas.length; i++) {
    dragAreas[i].classList.add("drag-area-highlight");
  }
}

function removeHighlightAreas() {
  let dragAreas = document.getElementsByClassName("drag-area");
  for (let i = 0; i < dragAreas.length; i++) {
    dragAreas[i].classList.remove("drag-area-highlight");
  }
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

function dragCardHighlight(currentDraggedElement) {
  document.getElementById(`task${currentDraggedElement}`).classList.add("on-drag-highlight");
}

async function storeAllTasksBoard() {
  await setItem("remoteTasks", allTasks);
}

// open addTask popup
async function openAddTask() {
  document.getElementById("body").style.overflow = "hidden";
  let modalBg = document.getElementById("modal-bg");
  modalBg.style.width = "100%";
  modalBg.style.left = 0;
  clearForm();
  await loadAllTasks();
  await loadContacts();
  renderContactsToAssign();
  renderCategories();
}

async function closeModal() {
  let modalBg = document.getElementById("modal-bg");
  modalBg.style.width = 0;
  modalBg.style.left = "100%";
  document.getElementById("body").style.overflow = "auto";
  await redoChangesToTaskForm();
  await initBoard();
  // setTimeout(initBoard(), 5000);
  // setTimeout(location.reload(), 5000);
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", async function (event) {
  let modalBg = document.getElementById("modal-bg");
  if (event.target == modalBg) {
    modalBg.style.width = 0;
    modalBg.style.left = "100%";
    document.getElementById("body").style.overflow = "auto";
    await redoChangesToTaskForm();
    await initBoard();
    // location.reload();
  }
});

// create fullscreen tasks
function openTaskDetails(index) {
  document.getElementById("body").style.overflow = "hidden";
  let modalBg = document.getElementById("modal-bg-details");
  modalBg.style.width = "100%";
  modalBg.style.left = 0;
  let taskDetailsContainer = document.getElementById("task-details");
  taskDetailsContainer.innerHTML = "";
  taskDetailsContainer.innerHTML += createTaskDetailsHtml(index);
  displayAssignedContacts(allTasks[index]);
  displaySubstasks(allTasks[index]);
}

function createTaskDetailsHtml(index) {
  let task = allTasks[index];
  return /*html*/ `
        <div class="details-top">
            <span class="task-category" style="background-color: ${CATEGORY_COLORS[task.category]}">${task.category}</span>
            <span id="close-modal" class="close-modal" onclick="closeModalDetails()">&times;</span>
        </div>
        <div class="details-bottom">
            <h1 class="details-h1">${task.title}</h1>
            <div class="description-container">
              <p>Description: </p>
              <p>${task.description}</p>
            </div>
            <div class="due-date">
                <p>Due date:</p>
                <p>${task.dueDate}</p>
            </div>
            <div class="priority-container">
                <p>Priority:</p>
                <div class="priority">
                    <p>${task.priority}</p>
                    <p>${generatePrioImage(task, allTasks)}</p>
                </div>
            </div>
            <div class="assigned-to-container">
                <p>Assigned to:</p>
                <div class="assigned-to-contacts" id="assigned-to-contacts"></div>
            </div>
            <div class="subtasks-container">
                <p class="subtasks-p" style="margin-block-end: 0.2em;">Subtasks:</p>
                <div class="subtasks" id="subtasks"></div>
            </div>
            <div class="edit-and-delete-buttons">
                <button onclick="deleteTask(${index})" onmouseover="turnBlue('delete-image', 'delete_blue.svg')" onmouseleave="turnBlack('delete-image', 'delete.svg')"><img src="../assets/img/icons/delete.svg" alt="" id="delete-image">Delete</button>
                <img class="tiny_line_board" src="../assets/img/icons/tiny_line.png" alt="" style="height: fit-content;">
                <button onclick="openEditTask(${index})" onmouseover="turnBlue('edit-image', 'edit_blue.svg')" onmouseleave="turnBlack('edit-image', 'edit.svg')"><img src="../assets/img/icons/edit.svg" alt="" id="edit-image">Edit</button>
            </div>
        </div>
    `;
}

function displaySubstasks(task) {
  let subtasksContainer = document.getElementById("subtasks");
  subtasksContainer.innerHTML = "";
  for (let i = 0; i < task["subtasks"].length; i++) {
    const subtask = task["subtasks"][i];
    // wenn Status == done, gefüllte Checkbox rendern, anonsten leere
    if (subtask.statusSubtask == "inProgress") {
      subtasksContainer.innerHTML += /*html*/ `
                <div class="subtask">
                    <img src="../assets/img/icons/check_box_empty.png" alt="" onclick="toggleCheckbox(${i}, ${allTasks.indexOf(task)})" id="subtask-checkbox${i}">
                    <p class="subtask-text">${subtask.nameSubtask}</p>
                </div>
            `;
    } else {
      subtasksContainer.innerHTML += /*html*/ `
                <div class="subtask">
                    <img src="../assets/img/icons/checkbox_filled.png" alt="" id="checkbox-filled${i}" onclick="toggleCheckbox(${i}, ${allTasks.indexOf(task)})">
                    <p class="subtask-text">${subtask.nameSubtask}</p>
                </div>
            `;
    }
  }
}

function toggleCheckbox(i, taskIndex) {
  if (allTasks[taskIndex].subtasks[i].statusSubtask == "inProgress") {
    allTasks[taskIndex].subtasks[i].statusSubtask = "done";
    storeAllTasksBoard();
    displaySubstasks(allTasks[taskIndex]);
  } else {
    allTasks[taskIndex].subtasks[i].statusSubtask = "inProgress";
    storeAllTasksBoard();
    displaySubstasks(allTasks[taskIndex]);
  }
}

function displayAssignedContacts(task) {
  let assignedContactContainer = document.getElementById("assigned-to-contacts");
  assignedContactContainer.innerHTML = "";
  for (let i = 0; i < task["assignedTo"].length; i++) {
    const assignedContact = task["assignedTo"][i];

    assignedContactContainer.innerHTML += /*html*/ `
        <div class="assigned-to-contact">
            <p class="initials_circle" style="background-color: ${assignedContact.contactColor}">${assignedContact.contactInitials}</p>
            <p>${assignedContact.contactName}</p>
        </div>
    `;
  }
}

async function deleteTask(index) {
  allTasks.splice(index, 1);
  await storeAllTasksBoard();
  showSnackbarBoard('Task succesfully deleted');
  closeModalDetails();
  await initBoard();
}

async function closeModalDetails() {
  let modalBg = document.getElementById("modal-bg-details");
  modalBg.style.width = 0;
  modalBg.style.left = "100%";
  document.getElementById("body").style.overflow = "auto";
  await initBoard();
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", async function (event) {
  let modalBg = document.getElementById("modal-bg-details");
  if (event.target == modalBg) {
    modalBg.style.width = 0;
    modalBg.style.left = "100%";
    document.getElementById("body").style.overflow = "auto";
    initBoard();
  }
});

async function openEditTask(index) {
  clearArrays();
  closeModalDetails();
  document.getElementById("body").style.overflow = "hidden";
  let modalBg = document.getElementById("modal-bg");
  modalBg.style.width = "100%";
  modalBg.style.left = 0;
  document.getElementById("add-task-heading").style.display = "none";
  changeButtonsInTaskform(index);
  document.getElementById('taskTitle').onkeyup = "borderRedIfTitleEmptyEdit()";
  document.getElementById('categoryButton').setAttribute('disabled', 'true');
  await loadAllTasks();
  await loadContacts();
  await fillTaskFields(index);
}

async function fillTaskFields(index) {
  document.getElementById("taskTitle").value = allTasks[index].title;
  document.getElementById("taskDescription").value = allTasks[index].description;
  document.getElementById("taskDueDate").value = allTasks[index].dueDate;
  document.getElementById("assignedToDropdown").innerHTML = "";
  document.getElementById("categoryDropdown").innerHTML = "";
  document.getElementById("buttonName").innerHTML = allTasks[index].category;
  setPrioButton(index);
  allTasks[index].assignedTo.forEach((contact) => assignedContacts.push(contact));
  allTasks[index].subtasks.forEach((subtask) => subtasks.push(subtask));
  renderContactsToAssign();
  showAssignedtoContacts();
  renderCategories();
  renderSubtasks();
}

function changeButtonsInTaskform(index) {
  document.getElementById("buttons_container").innerHTML = /*html*/ `
        <button onclick="checkRequiredFieldsEdit(${index})" id="save_changes_button" type="button" class="btn_dark">Ok <img src="../assets/img/icons/white_check.svg" alt="" /></button>
    `;
}

async function saveTaskChanges(index) {
  showSnackbarBoard('Changes saved');
  allTasks[index].title = document.getElementById("taskTitle").value;
  allTasks[index].description = document.getElementById("taskDescription").value;
  allTasks[index].dueDate = document.getElementById("taskDueDate").value;
  allTasks[index].assignedTo = assignedContacts;
  allTasks[index].category = document.getElementById("buttonName").innerHTML;
  allTasks[index].subtasks = subtasks;
  allTasks[index].priority = priority;
  await storeAllTasksBoard();
  closeModal();
}

async function redoChangesToTaskForm() {
  document.getElementById("add-task-heading").style.display = "block";
  document.getElementById('buttons_container').innerHTML = /*html*/ `
    <button id="clear-task-form-button" type="button" onmouseover="makeIconClearButtonBright()" onmouseleave="makeIconClearButtonDark()" onclick="clearForm()" class="btn_bright">Clear <img id="clearButtonImage" src="../assets/img/icons/black_x.svg" alt="" /></button>
    <button id="submit_task_button" type="submit" class="btn_dark_disabled">Create Task <img src="../assets/img/icons/white_check.svg" alt="" /></button>
  `;
  document.getElementById('taskTitle').onkeyup = "borderRedIfTitleEmpty()";
  document.getElementById('categoryButton').removeAttribute('disabled');
}

function checkRequiredFieldsEdit(index) {
  if (document.getElementById("taskTitle").value == "" || document.getElementById("taskDueDate").value == "" || document.getElementById("buttonName").textContent == "Select task Category") {
    borderRedIfTitleEmptyEdit();
    borderRedIfDateEmptyEdit();
    borderRedIfCategoryEmptyEdit();
  } else {
    document.getElementById("save_changes_button").classList.remove("btn_dark_disabled");
    document.getElementById("save_changes_button").classList.add("btn_dark");
    saveTaskChanges(index);
    document.getElementById("save_changes_button").classList.add("btn_dark_disabled");
    document.getElementById("save_changes_button").classList.remove("btn_dark");
  }
}

function borderRedIfTitleEmptyEdit() {
  if (document.getElementById("taskTitle").value == "") {
    document.getElementById("taskTitle").style.borderColor = "#ff8190";
    document.getElementById("errorContainerTitle").classList.remove("hide_error");
    document.getElementById("errorContainerTitle").classList.add("error_container");
  } else {
    document.getElementById("taskTitle").style.borderColor = "#a8a8a8";
    document.getElementById("errorContainerTitle").classList.add("hide_error");
    document.getElementById("errorContainerTitle").classList.remove("error_container");
  }
}

function borderRedIfDateEmptyEdit() {
  turnDateColorBlack();
  if (document.getElementById("taskDueDate").value == "") {
    document.getElementById("taskDueDate").style.borderColor = "#ff8190";
    document.getElementById("errorContainerDate").classList.remove("hide_error");
    document.getElementById("errorContainerDate").classList.add("error_container");
  } else {
    document.getElementById("taskDueDate").style.borderColor = "#a8a8a8";
    document.getElementById("errorContainerDate").classList.add("hide_error");
    document.getElementById("errorContainerDate").classList.remove("error_container");
  }
}

function borderRedIfCategoryEmptyEdit() {
  if (document.getElementById("buttonName").textContent == "Select task Category") {
    document.getElementById("categoryButton").style.borderColor = "#ff8190";
    document.getElementById("errorContainerCategory").classList.remove("hide_error");
    document.getElementById("errorContainerCategory").classList.add("error_container");
  } else {
    document.getElementById("categoryButton").style.borderColor = "#a8a8a8";
    document.getElementById("errorContainerCategory").classList.add("hide_error");
    document.getElementById("errorContainerCategory").classList.remove("error_container");
  }
}

function setPrioButton(index) {
  if (allTasks[index].priority == "urgent") {
    setPrioUrgent();
  } else if (allTasks[index].priority == "medium") {
    setPrioMedium();
  } else {
    setPrioLow();
  }
}

// search function
function renderAllOrMatchingTodos() {
  findMatchingTitles();
  document.getElementById("errorContainer").innerHTML = "";
  if (saveInputValue() == "") {
    updateHTML(allTasks); // Todo
  } else {
    renderErrorOrMatchingDodos();
  }
}

async function findMatchingTitles() {
  await pushMatchingTodos(saveInputValue());
}

function saveInputValue() {
  let search = document.getElementById("searchfield").value;
  return search.toLowerCase();
}

async function pushMatchingTodos(search) {
  matchingTodos = [];
  for (let index = 0; index < allTasks.length; index++) {
    let title = allTasks[index].title;
    let description = allTasks[index].description;
    if (title.toLowerCase().includes(search) || description.toLowerCase().includes(search)) {
      matchingTodos.push(allTasks[index]);
    }
  }
}

function renderErrorOrMatchingDodos() {
  if (matchingTodos.length == 0) {
    renderErrorBoard();
    updateHTML(matchingTodos);
  } else {
    updateHTML(matchingTodos); // ToDo
  }
}

function renderErrorBoard() {
  let errorContent = document.getElementById("errorContainer");
  errorContent.innerHTML += `
  Keine Ergebnisse gefunden.
  `;
}

async function openAddTaskAndSetStatus(status) {
  document.getElementById("body").style.overflow = "hidden";
  let modalBg = document.getElementById("modal-bg");
  modalBg.style.width = "100%";
  modalBg.style.left = 0;
  // clearForm();
  await loadAllTasks();
  await loadContacts();
  renderContactsToAssign();
  renderCategories();
  localStorage.setItem("status", status);
}

async function showSnackbarBoard(message) {
  let snackbarBoard = document.getElementById("snackbar-board");
  snackbarBoard.className = "show";
  snackbarBoard.innerHTML = message;
  setTimeout(function () {
    snackbarBoard.className = snackbarBoard.className.replace("show", "");
  }, 2500);
}
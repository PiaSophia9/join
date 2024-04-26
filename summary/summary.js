/**
 * Initializes the summary page by including HTML, loading all tasks, displaying the logged-in user's name,
 * loading the user's initials, showing the number of urgent tasks, showing the number of all tasks,
 * showing the number of tasks in progress, showing the number of tasks awaiting feedback, unlogging all sidebar links,
 * and logging the "summarySidebar" link.
 */
async function initSummary() {
  await includeHTML();
  await loadAllTasksSummary();
  await loadUserName();
  await loadUserInitials();
  unlogAllSidebarLinks();
  logSidebarLink("summarySidebar");
  displayGreeting();
  showToDo();
  showDone();
  showUrgentTasks();
  showAllTasks();
  showInProgress();
  showAwaitFeedback();
}

/**
 * Loads the username from local storage and sets it as the innerHTML of the element with id "logged_user".
 */
async function loadUserName() {
  let loggedUser = document.getElementById("logged_user");
  let storedName = localStorage.getItem("userName");
  storedName = JSON.parse(storedName);
  if (storedName) {
    loggedUser.innerHTML = storedName;
  } else {
    loggedUser.innerHTML = "";
  }
}

/**
 * Loads all tasks from the remote server and stores them in the local storage.
 */
async function loadAllTasksSummary() {
  let response = await getItem("remoteTasks");
  todos = JSON.parse(response);
}

/**
 * Displays the number of urgent tasks and updates the user interface with the count.
 *
 * @param {Array} todos - The array of tasks to filter urgent tasks from.
 */
function showUrgentTasks() {
  let urgentAmount = document.getElementById("urgent");
  let urgentBoard = todos.filter((t) => t["priority"] == "urgent");
  urgentAmount.innerHTML = urgentBoard.length;
  showUrgentTaskDate(urgentBoard);
}

/**
 * Displays the earliest due date of urgent tasks in the user interface.
 *
 * @param {Array} urgentBoard - The array of urgent tasks.
 */
function showUrgentTaskDate(urgentBoard) {
  let urgentDateElement = document.getElementById("urgentDate");
  let urgentDates = urgentBoard.map((t) => t["dueDate"]);
  let earliestDate = findEarliestDate(urgentDates);
  let formattedDate = formatDate(earliestDate);
  urgentDateElement.innerHTML = formattedDate;
}

/**
 * Finds the earliest date from an array of dates.
 *
 * @param {Array<Date>} dates - An array of dates.
 * @return {Date} The earliest date in the array.
 */
function findEarliestDate(dates) {
  return dates.reduce((earliest, current) => {
    return current < earliest ? current : earliest;
  });
}

/**
 * Formats a given date string into a more readable and standardized format.
 *
 * @param {string} dateString - The date string to be formatted.
 * @return {string} The formatted date string.
 */
function formatDate(dateString) {
  const options = {month: "long", day: "numeric", year: "numeric"};
  const formattedDate = new Date(dateString).toLocaleDateString("en-US", options);
  return formattedDate;
}

/**
 * Displays the number of tasks in the "To Do" status and updates the UI with the count.
 *
 * @param {Array} todos - The array of tasks to filter tasks in "To Do" status from.
 * @return {number} The count of tasks in "To Do" status.
 */
function showToDo() {
  let todoAmount = document.getElementById("todo");
  let todoBoard = todos.filter((t) => t["status"] == "todo");
  todoAmount.innerHTML = todoBoard.length;
}

/**
 * Displays the number of tasks in the "Done" status and updates the UI with the count.
 *
 * @param {Array} todos - The array of tasks to filter tasks in "Done" status from.
 * @return {number} The count of tasks in "Done" status.
 */
function showDone() {
  let doneAmount = document.getElementById("done");
  let doneBoard = todos.filter((t) => t["status"] == "done");
  doneAmount.innerHTML = doneBoard.length;
}
/**
 * Updates the UI to display the total number of tasks in the board.
 *
 * @param {Array} todos - The array of tasks to count the total number of tasks from.
 * @return {number} The total number of tasks in the board.
 */
function showAllTasks() {
  let allTasksAmount = document.getElementById("tasksInBoard");
  allTasksAmount.innerHTML = todos.length;
}

/**
 * Displays the number of tasks in the "In Progress" status and updates the UI with the count.
 *
 * @param {Array} todos - The array of tasks to filter tasks in "In Progress" status from.
 * @return {number} The total number of tasks in "In Progress" status in the board.
 */
function showInProgress() {
  let inProgressAmount = document.getElementById("tasksInProgress");
  let inProgressBoard = todos.filter((t) => t["status"] == "in-progress");
  inProgressAmount.innerHTML = inProgressBoard.length;
}

/**
 * Displays the number of tasks in the "Await Feedback" status and updates the UI with the count.
 *
 * @param {Array} todos - The array of tasks to filter tasks in "Await Feedback" status from.
 * @return {number} The count of tasks in "Await Feedback" status.
 */
function showAwaitFeedback() {
  let awaitingAmount = document.getElementById("awaitingFeedback");
  let awaitingBoard = todos.filter((t) => t["status"] == "await-feedback");
  awaitingAmount.innerHTML = awaitingBoard.length;
}

/**
 * Redirects the user to the board page.
 */
function redirectToBoard() {
  const targetUrl = "../board/board.html";
  window.location.href = targetUrl;
}

/**
 * Changes the icon of the todo item to a white version.
 */
function changeIconTodoWhite() {
  document.getElementById('todoImg').src = "../../assets/img/icons/todo_white.svg";
}

/**
 * Changes the icon of the todo item to the default version.
 */
function changeIconTodoBack() {
  document.getElementById('todoImg').src = "../../assets/img/icons/todo_task.svg";
}

/**
 * Changes the icon of the "Done" task item to a white version.
 */
function changeIconDoneWhite() {
  document.getElementById('doneImg').src = "../../assets/img/icons/done_white.svg";
}

/**
 * Changes the icon of the "Done" task item to the default version.
 */
function changeIconTDoneBack() {
  document.getElementById('doneImg').src = "../../assets/img/icons/done_task.svg";
}

/**
 * Displays a greeting message based on the time of the day.
 */
function displayGreeting() {
  const now = new Date();
  const hour = now.getHours();

  let greeting;
  if (hour >= 5 && hour < 12) {
      greeting = "Good morning";
  } else if (hour >= 12 && hour < 18) {
      greeting = "Good afternoon";
  } else {
      greeting = "Good evening";
  }

  document.getElementById("greetings").textContent = greeting;
}
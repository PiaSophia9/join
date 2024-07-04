/**
 * Loads the user's initials from local storage and sets them as the innerHTML of the element with id "user_initials".
 *
 * @return {Promise<string>} The user's initials if they are stored in local storage, otherwise "G".
 */
async function loadUserInitials() {
  let loggedUserInitials = document.getElementById("user_initials");
  let storedInitials = localStorage.getItem("userInitials");

  if (storedInitials) {
    storedInitials = JSON.parse(storedInitials);
    loggedUserInitials.innerHTML = storedInitials;
  } else {
    document.getElementById("user_initials").innerHTML = "G";
  }
}

/**
 * Toggles the visibility of the dropdown menu in the header.
 *
 * @param {Event} event - The event that triggered the function.
 */
function showNavHeader(event) {
  document.getElementById("myDropdown").classList.toggle("show_menu_header");
  event.stopPropagation();
}

/**
 * Handles the click event on the window, toggling visibility of dropdown menus.
 *
 * @param {Event} event - The event that triggered the function.
 */
window.onclick = function (event) {
  if (!event.target.matches(".user_circle")) {
    let dropdowns = document.getElementsByClassName("header_dropdown_content");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show_menu_header")) {
        openDropdown.classList.remove("show_menu_header");
      }
    }
  }
  if (!event.target.matches(".dropbtn") && document.getElementById("categoryDropdown")) {
    document.getElementById("categoryDropdown").classList.remove("show");
  }
  if (!event.target.matches(".dropbtnAssignedContact") && document.getElementById("assignedToDropdown")) {
    document.getElementById("assignedToDropdown").classList.remove("show");
  }
};

/**
 * Logs out the user by removing their information from local storage and redirecting to the login page.
 */
function logOut() {
  localStorage.removeItem("userPassword");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  localStorage.removeItem("userInitials");
  window.location.href = "../../login/login.html";
}

/**
 * Unlogs all sidebar links by removing the "link_sidebar_active" class from the
 * specified elements and adding the "legal_link" class to the policy and legal
 * sidebar elements.
 *
 * @param {type} paramName - description of parameter
 */
function unlogAllSidebarLinks() {
  document.getElementById("summarySidebar").classList.remove("link_sidebar_active");
  document.getElementById("addTaskSidebar").classList.remove("link_sidebar_active");
  document.getElementById("boardSidebar").classList.remove("link_sidebar_active");
  document.getElementById("contactSidebar").classList.remove("link_sidebar_active");
  document.getElementById("policySidebar").classList.add("legal_link");
  document.getElementById("legalSidebar").classList.add("legal_link");
}

/**
 * A function that logs sidebar links based on the linkID provided.
 *
 * @param {string} linkID - The ID of the sidebar link to be logged.
 */
function logSidebarLink(linkID) {
  if (linkID == "policySidebar" || linkID == "legalSidebar") {
    document.getElementById(`${linkID}`).classList.remove("legal_link");
    document.getElementById(`${linkID}`).classList.add("legal_link_active");
  } else {
    document.getElementById(`${linkID}`).classList.add("link_sidebar_active");
  }
}

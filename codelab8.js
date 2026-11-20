
// CSE 170 Coding Lab 8
// Advanced JavaScript - Username Availability Checker

// Get HTML elements
const usernameInput = document.getElementById("username");
const warning = document.getElementById("warning");
const nextSteps = document.getElementById("next-steps");
const inputBox = document.getElementById("input-box");
const suggestions = document.getElementById("suggestions");
const form = document.getElementById("signup-form");
const message = document.getElementById("message");

// List of unavailable usernames
const unavailableNames = ["guest", "admin", "test"];

// Keep track of typing and availability
let hasTyped = false;
let checkID = 0;
let validUsername = "";

// Simulate a backend request
function fakeUsernameCheck(username) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      const isTaken = unavailableNames.includes(
        username.toLowerCase()
      );

      resolve(!isTaken);
    }, 500);
  });
}

// TASK 2A
// Show that the username is being checked
function showChecking() {
  warning.textContent = "Checking username availability...";

  // Make warning visible
  warning.classList.remove("hidden");

  // Set warning color to black
  warning.classList.remove("error", "success");
  warning.classList.add("checking");

  // Remove red input border
  inputBox.classList.remove("input-error");

  // Hide next steps while checking
  nextSteps.classList.add("hidden");

  // Hide suggestions
  suggestions.classList.add("hidden");
}

// TASK 2B
// Show warning if username is unavailable
async function showWarningUnavailable(username, requestID) {
  if (username === undefined) {
    username = usernameInput.value.trim();
  }

  if (requestID === undefined) {
    requestID = checkID;
  }

  const available = await fakeUsernameCheck(username);

  // Ignore outdated checks
  if (requestID !== checkID) {
    return;
  }

  if (!available) {

    // Update warning text
    warning.textContent = "This username is unavailable. Try again.";

    // Make warning visible
    warning.classList.remove("hidden");

    // Change warning color to red
    warning.classList.remove("checking", "success");
    warning.classList.add("error");

    // Change input border to red
    inputBox.classList.add("input-error");

    // Hide next steps
    nextSteps.classList.add("hidden");

    validUsername = "";

    // Display username suggestions
    showSuggestions(username);

  } else {

    // Username is available
    warning.textContent = "Username is available!";

    warning.classList.remove("hidden");
    warning.classList.remove("checking", "error");
    warning.classList.add("success");

    // Remove red border
    inputBox.classList.remove("input-error");

    // Hide suggestions
    suggestions.classList.add("hidden");

    // Save available username
    validUsername = username;

    // Show next steps
    nextSteps.classList.remove("hidden");
  }
}

// TASK 2C
// Show warning when username is empty
function showWarningEmpty() {

  // Update warning text
  warning.textContent = "You can use letters, numbers or symbols.";

  // Make warning visible
  warning.classList.remove("hidden");

  // Change warning color to red
  warning.classList.remove("checking", "success");
  warning.classList.add("error");

  // Add red border
  inputBox.classList.add("input-error");

  // Hide next steps
  nextSteps.classList.add("hidden");

  // Hide suggestions
  suggestions.classList.add("hidden");

  validUsername = "";
}

// BONUS 3
// Suggest available usernames
function showSuggestions(username) {

  suggestions.innerHTML = "";

  const heading = document.createElement("p");
  heading.textContent = "Try one of these usernames:";

  suggestions.appendChild(heading);

  const possibleNames = [
    username + "123",
    username + "2026",
    username + "_user"
  ];

  possibleNames.forEach(function(name) {

    const button = document.createElement("button");

    button.type = "button";
    button.textContent = name;
    button.classList.add("suggestion-button");

    // Insert suggested username into input
    button.addEventListener("click", function() {

      usernameInput.value = name;

      checkName();
    });

    suggestions.appendChild(button);
  });

  suggestions.classList.remove("hidden");
}

// TASK 1 AND TASK 3
// Main function to check the username
function checkName() {

  hasTyped = true;
  checkID++;

  const currentID = checkID;

  const username = usernameInput.value.trim();

  // Hide next steps whenever input changes
  nextSteps.classList.add("hidden");

  validUsername = "";

  // If username is empty
  if (username.length === 0) {

    showWarningEmpty();

    return;
  }

  // Immediately show checking message
  showChecking();

  // Check username availability
  return showWarningUnavailable(username, currentID);
}

// Run checkName whenever the user types
usernameInput.addEventListener("input", checkName);

// Handle form submission
form.addEventListener("submit", function(event) {

  event.preventDefault();

  const username = usernameInput.value.trim();

  if (username !== validUsername || !hasTyped) {
    message.textContent = "Please choose an available username.";
    return;
  }

  const password = document.getElementById("password").value;

  const confirmPassword = document.getElementById(
    "confirm-password"
  ).value;

  if (password.length === 0 || confirmPassword.length === 0) {

    message.textContent = "Please fill out both password fields.";

  } else if (password !== confirmPassword) {

    message.textContent = "Passwords do not match.";

  } else {

    message.textContent = "Success! Your username is available.";
  }
});

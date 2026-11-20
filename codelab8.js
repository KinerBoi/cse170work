
const usernameInput = document.getElementById("username");
const warning = document.getElementById("warning");
const nextSteps = document.getElementById("next-steps");
const inputBox = document.getElementById("input-box");
const suggestions = document.getElementById("suggestions");
const form = document.getElementById("signup-form");
const message = document.getElementById("message");

let checkCounter = 0;
let availableUsername = "";

// Simulate a server checking username availability.
function fakeUsernameCheck(username) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      const taken = ["guest", "admin", "test"];
      resolve(!taken.includes(username.toLowerCase()));
    }, 500);
  });
}

// Make warning visible.
function makeWarningVisible() {
  warning.classList.remove("hidden");
  warning.hidden = false;
  warning.style.display = "block";
  warning.style.visibility = "visible";
}

// Task 2a: Show checking message.
function showChecking() {
  warning.textContent = "Checking username availability...";
  makeWarningVisible();

  warning.classList.remove("error", "success");
  warning.classList.add("checking");

  inputBox.classList.remove("input-error");
  suggestions.classList.add("hidden");

  hideNextSteps();
}

// Task 2c: Show empty username warning.
function showWarningEmpty() {
  warning.textContent = "You can use letters, numbers or symbols.";
  makeWarningVisible();

  warning.classList.remove("checking", "success");
  warning.classList.add("error");

  inputBox.classList.add("input-error");
  suggestions.classList.add("hidden");

  hideNextSteps();
}

// Hide the next steps.
function hideNextSteps() {
  nextSteps.classList.add("hidden");
  nextSteps.style.display = "none";
  availableUsername = "";
}

// Task 3: Show the next steps.
function showNextSteps() {
  nextSteps.classList.remove("hidden");
  nextSteps.style.display = "block";
}

// Bonus: Suggest alternative usernames.
function showSuggestions(name) {
  suggestions.replaceChildren();

  const heading = document.createElement("p");
  heading.textContent = "Try one of these usernames:";
  suggestions.appendChild(heading);

  const options = [
    name + "123",
    name + "2026",
    name + "_user"
  ];

  options.forEach(function(choice) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "suggestion-button";
    button.textContent = choice;

    button.addEventListener("click", function() {
      usernameInput.value = choice;
      checkName();
    });

    suggestions.appendChild(button);
  });

  suggestions.classList.remove("hidden");
}

// Task 2b: Check whether username is unavailable.
function showWarningUnavailable() {
  const username = usernameInput.value.trim();
  const requestId = checkCounter;

  return fakeUsernameCheck(username).then(function(available) {

    // Ignore outdated checks.
    if (
      requestId !== checkCounter ||
      usernameInput.value.trim() !== username
    ) {
      return false;
    }

    if (!available) {
      warning.textContent = "This username is unavailable. Try again.";
      makeWarningVisible();

      warning.classList.remove("checking", "success");
      warning.classList.add("error");

      inputBox.classList.add("input-error");

      hideNextSteps();
      showSuggestions(username);

      return false;
    }

    warning.textContent = "Username is available!";
    makeWarningVisible();

    warning.classList.remove("checking", "error");
    warning.classList.add("success");

    inputBox.classList.remove("input-error");
    suggestions.classList.add("hidden");

    availableUsername = username;
    return true;
  });
}

// Task 1 and Task 3: Main username checking function.
function checkName() {
  checkCounter += 1;
  message.textContent = "";

  hideNextSteps();

  const username = usernameInput.value.trim();

  if (username.length === 0) {
    showWarningEmpty();
    return;
  }

  showChecking();

  return showWarningUnavailable().then(function(available) {
    if (available) {
      showNextSteps();
    }
  });
}

// Check whenever the user types.
usernameInput.addEventListener("input", checkName);

// Handle form submission.
form.addEventListener("submit", function(event) {
  event.preventDefault();

  if (
    !availableUsername ||
    usernameInput.value.trim() !== availableUsername
  ) {
    message.textContent = "Please choose an available username.";
    return;
  }

  const password = document.getElementById("password").value;
  const confirmation = document.getElementById("confirm-password").value;

  if (!password || !confirmation) {
    message.textContent = "Please fill out both password fields.";
  } else if (password !== confirmation) {
    message.textContent = "Passwords do not match.";
  } else {
    message.textContent =
      "Username is available (demo only; no account created).";
  }
});


const usernameInput = document.getElementById("username");
const warning = document.getElementById("warning");
const nextSteps = document.getElementById("next-steps");
const inputBox = document.getElementById("input-box");
const suggestions = document.getElementById("suggestions");
const form = document.getElementById("signup-form");
const message = document.getElementById("message");

let checkCounter = 0;
let availableUsername = "";

// Simulate checking username availability.
function fakeUsernameCheck(username) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      const taken = ["guest", "admin", "test"];
      resolve(!taken.includes(username.toLowerCase()));
    }, 500);
  });
}

// Hide the remaining form.
function hideNextSteps() {
  nextSteps.classList.add("hidden");
  availableUsername = "";
}

// FIX 1: Show checking warning.
function showChecking() {
  warning.textContent = "Checking username availability...";

  warning.classList.remove("hidden");
  warning.hidden = false;
  warning.style.display = "block";

  warning.classList.remove("error", "success");
  warning.classList.add("checking");

  inputBox.classList.remove("input-error");
  suggestions.classList.add("hidden");

  hideNextSteps();
}

// FIX 2: Show unavailable username warning.
function showWarningUnavailable() {
  warning.textContent = "This username is unavailable. Try again.";

  warning.classList.remove("hidden");
  warning.hidden = false;
  warning.style.display = "block";

  warning.classList.remove("checking", "success");
  warning.classList.add("error");

  inputBox.classList.add("input-error");

  hideNextSteps();
}

// FIX 3: Show empty username warning.
function showWarningEmpty() {
  warning.textContent = "You can use letters, numbers or symbols.";

  warning.classList.remove("hidden");
  warning.hidden = false;
  warning.style.display = "block";

  warning.classList.remove("checking", "success");
  warning.classList.add("error");

  inputBox.classList.add("input-error");
  suggestions.classList.add("hidden");

  hideNextSteps();
}

// Show the rest of the form.
function showNextSteps() {
  nextSteps.classList.remove("hidden");
}

// Bonus: Suggest alternate usernames.
function showSuggestions(username) {
  suggestions.replaceChildren();

  const heading = document.createElement("p");
  heading.textContent = "Try one of these usernames:";
  suggestions.appendChild(heading);

  const options = [
    username + "123",
    username + "2026",
    username + "_user"
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

// FIX 4: Main checking function.
function checkName() {
  checkCounter += 1;

  const requestID = checkCounter;
  const username = usernameInput.value.trim();

  message.textContent = "";
  hideNextSteps();

  if (username.length === 0) {
    showWarningEmpty();
    return;
  }

  showChecking();

  return fakeUsernameCheck(username).then(function(available) {
    // Ignore outdated username checks.
    if (
      requestID !== checkCounter ||
      usernameInput.value.trim() !== username
    ) {
      return;
    }

    if (!available) {
      showWarningUnavailable();
      showSuggestions(username);
    } else {
      warning.textContent = "Username is available!";

      warning.classList.remove(
        "hidden", "checking", "error"
      );
      warning.classList.add("success");
      warning.style.display = "block";

      inputBox.classList.remove("input-error");
      suggestions.classList.add("hidden");

      availableUsername = username;
      showNextSteps();
    }
  });
}

// Event listener for typing.
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
  const confirmation =
    document.getElementById("confirm-password").value;

  if (!password || !confirmation) {
    message.textContent = "Please fill out both password fields.";
  } else if (password !== confirmation) {
    message.textContent = "Passwords do not match.";
  } else {
    message.textContent =
      "Username is available (demo only; no account created).";
  }
});

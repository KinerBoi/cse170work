
// CSE 170 Coding Lab 8: Advanced JavaScript

// Simulated backend check. These usernames are already taken.
const takenUsernames = new Set(['guest', 'admin', 'test']);

const usernameInput = document.querySelector('#username');
const usernameField = document.querySelector('.username-field');
const warning = document.querySelector('#warning');
const nextSteps = document.querySelector('#next-steps');
const suggestions = document.querySelector('#suggestions');
const nextButton = document.querySelector('#next-button');
const form = document.querySelector('#signup-form');
const formMessage = document.querySelector('#form-message');

let checkNumber = 0;
let hasTyped = false;
let availableUsername = null;

// Simulates the latency of a server request.
function fakeUsernameCheck(username) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(!takenUsernames.has(username.toLowerCase()));
    }, 650);
  });
}

// Update the warning message and color.
function setWarning(message, type) {
  warning.textContent = message;
  warning.className = `warning ${type}`;

  usernameField.classList.toggle(
    'error',
    type === 'error-text'
  );
}

// Hide the next steps.
function hideNextSteps() {
  nextSteps.classList.add('hidden');
  nextButton.disabled = true;
  availableUsername = null;
}

// Display checking message.
function showChecking() {
  setWarning(
    'Checking username availability…',
    'checking'
  );

  hideNextSteps();
  suggestions.classList.add('hidden');
}

// Display warning when username is empty.
function showWarningEmpty() {
  setWarning(
    'You can use letters, numbers or symbols.',
    'error-text'
  );

  hideNextSteps();
  suggestions.classList.add('hidden');
}

// Suggest alternative usernames.
function showSuggestions(username) {
  suggestions.replaceChildren();

  const heading = document.createElement('span');
  heading.textContent = 'Try one of these usernames: ';
  suggestions.append(heading);

  const options = [
    `${username}123`,
    `${username}2026`,
    `${username}_user`
  ];

  for (const option of options) {
    const button = document.createElement('button');

    button.type = 'button';
    button.textContent = option;

    button.addEventListener('click', () => {
      usernameInput.value = option;

      usernameInput.dispatchEvent(
        new Event('input', { bubbles: true })
      );

      usernameInput.focus();
    });

    suggestions.append(button);
  }

  suggestions.classList.remove('hidden');
}

// Check if username is unavailable.
async function showWarningUnavailable(username, requestNumber) {
  const available = await fakeUsernameCheck(username);

  // Ignore old checks if the user has typed something new.
  if (
    requestNumber !== checkNumber ||
    usernameInput.value.trim() !== username
  ) {
    return;
  }

  if (!available) {
    setWarning(
      'This username isn’t allowed. Try again.',
      'error-text'
    );

    hideNextSteps();
    showSuggestions(username);
  } else {
    setWarning(
      'Username is available!',
      'success'
    );

    suggestions.classList.add('hidden');

    availableUsername = username;
    nextSteps.classList.remove('hidden');
    nextButton.disabled = false;
  }
}

// Check username whenever the input changes.
usernameInput.addEventListener('input', () => {
  hasTyped = true;
  checkNumber += 1;

  formMessage.textContent = '';

  const username = usernameInput.value.trim();

  if (username.length === 0) {
    showWarningEmpty();
    return;
  }

  showChecking();
  showWarningUnavailable(username, checkNumber);
});

// Handle form submission.
form.addEventListener('submit', event => {
  event.preventDefault();

  const username = usernameInput.value.trim();

  if (
    !hasTyped ||
    !username ||
    username !== availableUsername
  ) {
    return;
  }

  const password = document.querySelector('#password').value;
  const confirmation = document.querySelector('#confirm-password').value;

  if (!password || !confirmation) {
    formMessage.textContent =
      'Please fill out both password fields.';
  } else if (password !== confirmation) {
    formMessage.textContent =
      'Passwords do not match.';
  } else {
    formMessage.textContent =
      `Success! Username ${username} is available. (Demo only; no account was created.)`;
  }
});

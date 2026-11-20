
 // CSE 170 Coding Lab 8 - Username Availability
 // Required functions: showChecking, showWarningUnavailable,
 // showWarningEmpty, checkName.

 const usernameInput = document.getElementById("username");
 const warning = document.getElementById("warning");
 const nextSteps = document.getElementById("next-steps");
 const inputBox = document.getElementById("input-box");
 const suggestions = document.getElementById("suggestions");
 const form = document.getElementById("signup-form");
 const message = document.getElementById("message");

 let checkCounter = 0;
 let availableUsername = "";

 // Delay simulates asking a server whether a name is taken.
 function fakeUsernameCheck(username) {
   return new Promise(function (resolve) {
     setTimeout(function () {
       const taken = ["guest", "admin", "test"];
       resolve(!taken.includes(username.toLowerCase()));
     }, 500);
   });
 }

 function hideNextSteps() {
   nextSteps.classList.add("hidden");
   availableUsername = "";
 }

 // Show checking message immediately.
 function showChecking() {
   warning.textContent = "Checking username availability...";
   warning.classList.remove("hidden", "error", "success");
   warning.classList.add("checking");

   inputBox.classList.remove("input-error");
   suggestions.classList.add("hidden");

   hideNextSteps();
 }

 // Show warning for an empty username.
 function showWarningEmpty() {
   warning.textContent = "You can use letters, numbers or symbols.";
   warning.classList.remove("hidden", "checking", "success");
   warning.classList.add("error");

   inputBox.classList.add("input-error");
   suggestions.classList.add("hidden");

   hideNextSteps();
 }

 // Bonus: Suggest alternative usernames.
 function showSuggestions(username) {
   suggestions.replaceChildren();

   const label = document.createElement("p");
   label.textContent = "Try one of these usernames:";
   suggestions.appendChild(label);

   const options = [
     username + "123",
     username + "2026",
     username + "_user"
   ];

   options.forEach(function (option) {
     const button = document.createElement("button");
     button.type = "button";
     button.className = "suggestion-button";
     button.textContent = option;

     button.addEventListener("click", function () {
       usernameInput.value = option;
       checkName();
     });

     suggestions.appendChild(button);
   });

   suggestions.classList.remove("hidden");
 }

 // Check whether the username is unavailable.
 async function showWarningUnavailable(username, requestId) {
   if (username === undefined) {
     username = usernameInput.value.trim();
   }

   if (requestId === undefined) {
     requestId = checkCounter;
   }

   const available = await fakeUsernameCheck(username);

   // Ignore outdated requests.
   if (
     requestId !== checkCounter ||
     usernameInput.value.trim() !== username
   ) {
     return;
   }

   if (!available) {
     warning.textContent = "This username is unavailable. Try again.";
     warning.classList.remove("hidden", "checking", "success");
     warning.classList.add("error");

     inputBox.classList.add("input-error");
     hideNextSteps();

     showSuggestions(username);
   } else {
     warning.textContent = "Username is available!";
     warning.classList.remove("hidden", "checking", "error");
     warning.classList.add("success");

     inputBox.classList.remove("input-error");
     suggestions.classList.add("hidden");

     availableUsername = username;
     nextSteps.classList.remove("hidden");
   }
 }

 // Main username validation function.
 function checkName() {
   checkCounter += 1;

   const username = usernameInput.value.trim();
   const requestId = checkCounter;

   message.textContent = "";
   hideNextSteps();

   if (username.length === 0) {
     showWarningEmpty();
     return;
   }

   showChecking();
   return showWarningUnavailable(username, requestId);
 }

 // Required event listener for typing.
 usernameInput.addEventListener("input", checkName);

 // Handle form submission.
 form.addEventListener("submit", function (event) {
   event.preventDefault();

   if (
     usernameInput.value.trim() !== availableUsername ||
     !availableUsername
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
       "Username available (demo only; no account created).";
   }
 });

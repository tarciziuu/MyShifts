const lname = document.getElementById("lname");
const fname = document.getElementById("fname");
const email = document.getElementById("email");
const username = document.getElementById("username");
const pwd = document.getElementById("pwd");
const age = document.getElementById("age");
const registerBtn = document.getElementById("register");

const users = JSON.parse(localStorage.getItem("users")) || [];

function validation(event) {
  const errors = [];

  clearError("fname__error");
  clearError("lname__error");
  clearError("email__error");
  clearError("username__error");
  clearError("pwd__error");
  clearError("age__error");

  if (fname.value.length < 2) {
    document.getElementById("fname__error").textContent =
      "Must contain at least 2 letters";
    errors.push("fname");
    return;
  }
  if (lname.value.length < 2) {
    document.getElementById("lname__error").textContent =
      "Must contain at least 2 letters";
    errors.push("lname");
    return;
  }
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailPattern.test(email.value)) {
    document.getElementById("email__error").textContent =
      "Invalid email format";
    errors.push("email");
    return;
  }
  if (username.value.length < 6) {
    document.getElementById("username__error").textContent =
      "Must contain at least 6 characters";
    errors.push("username");
    return;
  }
  const pwdPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/;
  if (!pwdPattern.test(pwd.value)) {
    document.getElementById("pwd__error").textContent =
      "Password must contain letters, numbers, a character that is neither a letter nor a number and at least 6 characters long";
    errors.push("pwd");
    return;
  }

  if (isNaN(age.value)) {
    document.getElementById("age__error").textContent = "Please enter a number";
    errors.push("age");
    return;
  }
  if (age.value < 18 || age.value > 65) {
    document.getElementById("age__error").textContent =
      "Your age must be between 18 and 65";
    errors.push("age");
    return;
  }

  event.preventDefault();
  const newUser = {
    firstName: fname.value,
    lastName: lname.value,
    email: email.value,
    username: username.value,
    password: pwd.value,
    age: age.value,
  };
  const userExists = users.find((user) => user.username === newUser.username);
  if (userExists) {
    document.getElementById("username__error").textContent =
      "Username not available, choose another username";
    return;
  }
  users.push(newUser);

  saveToLocalStorage(users);

  if (errors.length === 0) {
    alert("Account successfully created!");
    window.location.href = "http://127.0.0.1:5501/ShiftBuilder/src/index.html";
  }
}

function saveToLocalStorage(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function clearError(errorId) {
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = "";
  }
}

registerBtn.addEventListener("click", validation);

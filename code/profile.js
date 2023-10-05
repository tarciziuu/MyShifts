if (localStorage.getItem("loggedUser") === null) {
  window.location.href = "http://127.0.0.1:5501/ShiftBuilder/src/index.html";
}

const loggedInUser = JSON.parse(localStorage.getItem("loggedUser"));
document.getElementById("hello__username").textContent = loggedInUser.username;

const logOut = document.getElementById("log__out");
logOut.addEventListener("click", () => localStorage.removeItem("loggedUser"));

const updateBtn = document.getElementById("update");
const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const email = document.getElementById("email");
const username = document.getElementById("username");
const pwd = document.getElementById("pwd");
const age = document.getElementById("age");
const users = JSON.parse(localStorage.getItem("users")) || [];

for (const user of users) {
  if (user.username === loggedInUser.username) {
    fname.value = user.firstName;
    lname.value = user.lastName;
    email.value = user.email;
    username.value = user.username;
    pwd.value = user.password;
    age.value = user.age;
  }
}

function updateProfile(e) {
  const errors = [];

  clearError("fname__error");
  clearError("lname__error");
  clearError("email__error");
  clearError("username__error");
  clearError("pwd__error");
  clearError("age__error");

  const isUsernameTaken = users.some(
    (user) => user.username === username.value
  );

  if (isUsernameTaken && username.value !== loggedInUser.username) {
    document.getElementById("username__error").textContent =
      "Username is already taken. Please choose a different one.";
    errors.push("username");
    e.preventDefault();
    return;
  }

  for (const user of users) {
    if (user.username === loggedInUser.username) {
      if (fname.value.length < 2) {
        document.getElementById("fname__error").textContent =
          "Must contain at least 2 letters";
        errors.push("fname");
        return;
      } else user.firstName = fname.value;

      if (lname.value.length < 2) {
        document.getElementById("lname__error").textContent =
          "Must contain at least 2 letters";
        errors.push("lname");
        return;
      } else user.lastName = lname.value;

      const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailPattern.test(email.value)) {
        document.getElementById("email__error").textContent =
          "Invalid email format";
        errors.push("email");
        return;
      } else user.email = email.value;

      if (username.value.length < 6) {
        document.getElementById("username__error").textContent =
          "Must contain at least 6 characters";
        errors.push("username");
        return;
      }
      const oldUser = user.username;
      user.username = username.value;
      loggedInUser.username = username.value;

      const shiftsUsers = JSON.parse(localStorage.getItem("usersShifts")) || [];
      shiftsUsers.forEach((userShift) => {
        if (oldUser === userShift.username) userShift.username = username.value;
      });

      localStorage.setItem("usersShifts", JSON.stringify(shiftsUsers));

      const pwdPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/;
      if (!pwdPattern.test(pwd.value)) {
        document.getElementById("pwd__error").textContent =
          "Password must contain letters, numbers, a character that is neither a letter nor a number and at least 6 characters long";
        errors.push("pwd");
        return;
      } else user.password = pwd.value;

      if (isNaN(age.value)) {
        document.getElementById("age__error").textContent =
          "Please enter a number";
        errors.push("age");
        return;
      }
      if (age.value < 18 || age.value > 65) {
        document.getElementById("age__error").textContent =
          "Your age must be between 18 and 65";
        errors.push("age");
        return;
      } else user.age = age.value;
    }
  }
  e.preventDefault();
  localStorage.setItem("loggedUser", JSON.stringify(loggedInUser));

  if (errors.length === 0) {
    alert("Account info successfully updated!");
    window.location.href =
      "http://127.0.0.1:5501/ShiftBuilder/src/pages/home.html";
  }
  localStorage.setItem("users", JSON.stringify(users));
}

function clearError(errorId) {
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = "";
  }
}

updateBtn.addEventListener("click", updateProfile);

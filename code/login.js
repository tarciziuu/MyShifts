const userError = document.getElementById("username__error");
const pwdError = document.getElementById("password__error");

function checkLogin() {
  clearError(userError);
  clearError(pwdError);

  const usernameLogin = document.getElementById("username").value;
  const pwdLogin = document.getElementById("password").value;

  if (usernameLogin.length < 6) {
    userError.textContent = "Username is too short";
    return;
  }
  if (pwdLogin.length < 6) {
    pwdError.textContent = "Password is too short";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const findUser = users.find((user) => user.username === usernameLogin);
  if (!findUser) {
    userError.textContent = "Username not found";
    return;
  }

  if (findUser.password !== pwdLogin) {
    pwdError.textContent = "Incorrect password";
    return;
  }
  const loggedUser = {
    username: usernameLogin,
    password: pwdLogin,
  };
  localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
  window.location.href =
    "http://127.0.0.1:5501/ShiftBuilder/src/pages/home.html";
}

const loginBtn = document.getElementById("login");
loginBtn.addEventListener("click", checkLogin);

function clearError(errorElement) {
  if (errorElement) {
    errorElement.textContent = "";
  }
}

function removeUser() {
  const userToRemove = prompt(
    "Resetting the password will delete all user data.\nIf you want to reset your password please enter your username."
  );
  if (userToRemove) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const usersShifts = JSON.parse(localStorage.getItem("usersShifts") || []);

    const updatedUsers = users.filter((user) => user.username !== userToRemove);
    const updatedUsersShifts = usersShifts.filter(
      (shift) => shift.username !== userToRemove
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("usersShifts", JSON.stringify(updatedUsersShifts));

    alert(`User: ${userToRemove}  has been removed.`);
  }
}
const forgotPwd = document.getElementById("forgot__pwd");
forgotPwd.addEventListener("click", removeUser);

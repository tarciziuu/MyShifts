if (localStorage.getItem("loggedUser") === null) {
  window.location.href = "http://127.0.0.1:5501/ShiftBuilder/src/index.html";
}

const shiftNameError = document.getElementById("shift__name__error");

const loggedInUser = JSON.parse(localStorage.getItem("loggedUser"));
document.getElementById("hello__username").textContent = loggedInUser.username;

const logOut = document.getElementById("log__out");
logOut.addEventListener("click", () => localStorage.removeItem("loggedUser"));

const usersShifts = JSON.parse(localStorage.getItem("usersShifts")) || [];

function addShift(e) {
  e.preventDefault();

  const shiftName = document.getElementById("shift__name");
  const shiftDate = document.getElementById("shift__date");
  const shiftStart = document.getElementById("shift_start");
  const shiftEnd = document.getElementById("shift_end");
  const shiftWage = document.getElementById("shift__wage");
  const workplace = document.getElementById("workplace");
  const comments = document.getElementById("comments");

  const duplicateShiftName = usersShifts.some(
    (shift) =>
      shift.username === loggedInUser.username && shift.name === shiftName.value
  );

  if (duplicateShiftName) {
    shiftNameError.textContent =
      "Please choose another shift name, it's already in use.";
    return;
  }

  const shiftStartParts = shiftStart.value.split(":");
  const shiftEndParts = shiftEnd.value.split(":");

  const startHours = parseInt(shiftStartParts[0]);
  const startMinutes = parseInt(shiftStartParts[1]);
  const endHours = parseInt(shiftEndParts[0]);
  const endMinutes = parseInt(shiftEndParts[1]);

  const totalMinutes =
    endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
  const profit = (0.2 * shiftWage.value * (totalMinutes / 60)).toFixed(2);

  const newShift = {
    username: loggedInUser.username,
    name: shiftName.value,
    date: shiftDate.value,
    start: shiftStart.value,
    end: shiftEnd.value,
    wage: shiftWage.value,
    place: workplace.value,
    comments: comments.value,
    profit: profit,
  };

  usersShifts.push(newShift);

  localStorage.setItem("usersShifts", JSON.stringify(usersShifts));

  shiftNameError.textContent = "";

  const loading = document.getElementById("loading");
  loading.style.display = "block";
  setTimeout(() => {
    loading.style.display = "none";
    window.location.href =
      "http://127.0.0.1:5501/ShiftBuilder/src/pages/home.html";
  }, 2000);
}

const addShiftBtn = document.getElementById("add__shift");
addShiftBtn.addEventListener("click", addShift);

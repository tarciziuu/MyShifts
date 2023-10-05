if (localStorage.getItem("loggedUser") === null) {
  window.location.href = "http://127.0.0.1:5501/ShiftBuilder/src/index.html";
}

let usersShifts = JSON.parse(localStorage.getItem("usersShifts")) || [];

const loggedInUser = JSON.parse(localStorage.getItem("loggedUser"));
document.getElementById("hello__username").textContent = loggedInUser.username;

const logOut = document.getElementById("log__out");
logOut.addEventListener("click", () => localStorage.removeItem("loggedUser"));

function populateTableFromLocalStorage() {
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";

  for (const shift of usersShifts) {
    if (shift.username === loggedInUser.username) {
      const row = document.createElement("tr");

      row.innerHTML = `
          <td>${shift.name}</td>
          <td>${shift.date}</td>
          <td>${shift.start}</td>
          <td>${shift.end}</td>
          <td>${shift.wage}</td>
          <td>${shift.place}</td>
          <td>${shift.profit}</td>
        `;

      tbody.appendChild(row);
    }
  }
}

window.addEventListener("load", () => {
  populateTableFromLocalStorage();
  updateBestMonthProfit();
});

const shiftNameInput = document.getElementById("shift__name__search");
const shiftFilterDateFrom = document.getElementById("shift__search__from");
const shiftFilterDateTo = document.getElementById("shift__search__to");
const shiftFilterBtn = document.getElementById("shift__search__name");
const shiftFilterDateBtn = document.getElementById("shift__search__date");

function filterShiftsName() {
  for (const shift of usersShifts) {
    if (loggedInUser.username === shift.username) {
      const searchInput = shiftNameInput.value.toLowerCase();
      const tableItems = document.querySelectorAll("table tbody tr");

      tableItems.forEach((row) => {
        const shiftName = row
          .querySelector("td:first-child")
          .textContent.toLowerCase();
        const nameMatch = shiftName.includes(searchInput);
        if (nameMatch) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    }
  }
}
function filterShiftsDate() {
  for (const shift of usersShifts) {
    if (loggedInUser.username === shift.username) {
      const fromDate = new Date(shiftFilterDateFrom.value);
      const toDate = new Date(shiftFilterDateTo.value);
      const tableItems = document.querySelectorAll("table tbody tr");

      tableItems.forEach((row) => {
        const shiftDate = new Date(
          row.querySelector("td:nth-child(2)").textContent
        );
        const dateMatch =
          (!isNaN(fromDate) || !isNaN(toDate)) &&
          (!fromDate || shiftDate >= fromDate) &&
          (!toDate || shiftDate <= toDate);

        if (dateMatch) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    }
  }
}

shiftFilterBtn.addEventListener("click", filterShiftsName);
shiftFilterDateBtn.addEventListener("click", filterShiftsDate);

const bestMonth = document.getElementById("best__month");
const bestProfit = document.getElementById("best__profit");

function updateBestMonthProfit() {
  const monthlyEarnings = {};

  for (const shift of usersShifts) {
    if (shift.username === loggedInUser.username) {
      const date = new Date(shift.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!monthlyEarnings[monthKey]) {
        monthlyEarnings[monthKey] = 0;
      }
      monthlyEarnings[monthKey] += parseFloat(shift.profit);
    }
  }
  let maxProfit = -Infinity;
  let bestMonthName = "";

  for (const month in monthlyEarnings) {
    if (monthlyEarnings[month] > maxProfit) {
      maxProfit = monthlyEarnings[month];
      bestMonthName = month;
    }
  }

  bestMonth.textContent = bestMonthName;
  bestProfit.textContent = maxProfit.toFixed(2);
}

function editShifts() {
  let tableBody = document.querySelector("table tbody");

  tableBody.addEventListener("click", function (e) {
    if (e.target.tagName === "TD") {
      e.target.setAttribute("contentEditable", "true");
    }
  });

  tableBody.addEventListener("input", function (e) {
    if (e.target.tagName === "TD") {
      const updatedContent = e.target.textContent;
      const shiftName = e.target.parentElement.cells[0].textContent;
      const existingData =
        JSON.parse(localStorage.getItem("usersShifts")) || [];
      const targetObjectIndex = existingData.findIndex(
        (obj) =>
          obj.name === shiftName && obj.username === loggedInUser.username
      );

      if (targetObjectIndex !== -1) {
        const columnName = e.target.cellIndex;
        const columnNames = [
          "name",
          "date",
          "start",
          "end",
          "wage",
          "place",
          "profit",
        ];

        // Update the data in the usersShifts array
        if (columnName < columnNames.length) {
          existingData[targetObjectIndex][columnNames[columnName]] =
            updatedContent;
        }

        const shift = existingData[targetObjectIndex];
        const shiftStartParts = shift.start.split(":");
        const shiftEndParts = shift.end.split(":");

        const startHours = parseInt(shiftStartParts[0]);
        const startMinutes = parseInt(shiftStartParts[1]);
        const endHours = parseInt(shiftEndParts[0]);
        const endMinutes = parseInt(shiftEndParts[1]);

        const totalMinutes =
          endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
        const profit = (
          0.2 *
          parseFloat(shift.wage) *
          (totalMinutes / 60)
        ).toFixed(2);

        existingData[targetObjectIndex].profit = profit;

        //Update profit cell live
        const profitCell =
          e.target.parentElement.cells[columnNames.indexOf("profit")];
        profitCell.textContent = profit;

        localStorage.setItem("usersShifts", JSON.stringify(existingData));

        usersShifts = JSON.parse(localStorage.getItem("usersShifts"));
        updateBestMonthProfit();
      }
    }
  });
}

editShifts();

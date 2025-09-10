const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper "),
  addEventCloseBtn = document.querySelector(".close "),
  addEventTitle = document.querySelector(".event-name "),
  addEventFrom = document.querySelector(".event-time-from "),
  addEventTo = document.querySelector(".event-time-to "),
  addEventSubmit = document.querySelector(".add-event-btn ");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const categoryColors = {
  ppdb: "border-b-4 border-b-green-500",
  "awal masuk semester": "border-b-4 border-b-blue-500",
  "libur nasional": "border-b-4 border-b-red-500",
  rapor: "border-b-4 border-b-yellow-500",
  tssp: "border-b-4 border-b-purple-500",
  "libur puasa": "border-b-4 border-b-orange-500",
  ulangan: "border-b-4 border-b-cyan-500",
  "libur semester": "border-b-4 border-b-teal-500",
  anbk: "border-b-4 border-b-indigo-500",
  "hari minggu": "border-b-4 border-b-gray-500",
  "hari sabtu": "border-b-4 border-b-gray-500",
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

// using CSV instead of JSON for events
async function fetchEvents() {
  const csv = await fetch("./kegiatan.csv").then((r) => r.text());
  return simpleCSVParser(csv);
}

function simpleCSVParser(csvText) {
  const lines = csvText.trim().split("\n").filter(Boolean);
  const header = lines.shift(); // skip header
  const eventsByDate = {};

  for (const line of lines) {
    const [dateStr, title, time, category] = line
      .split(";")
      .map((s) => s.trim());
    const [year, month, day] = dateStr.split("-").map(Number);

    const key = `${year}-${month}-${day}`;
    if (!eventsByDate[key]) {
      eventsByDate[key] = {
        day,
        month,
        year,
        events: [],
      };
    }

    eventsByDate[key].events.push({ title, time, category });
  }

  return Object.values(eventsByDate);
}

let eventsArr = [];
fetchEvents()
  .then((data) => {
    eventsArr = data;
    getEvents();
    initCalendar();
  })
  .catch((error) => {
    console.error("Failed to initialize events:", error);
  });

//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  // Handle prev-date
  for (let x = day; x > 0; x--) {
    const prevDate = prevDays - x + 1;
    let event = false;
    let eventCategory = "";

    if (Array.isArray(eventsArr)) {
      eventsArr.forEach((eventObj) => {
        if (
          eventObj.day === prevDate &&
          eventObj.month === (month === 0 ? 12 : month) &&
          eventObj.year === (month === 0 ? year - 1 : year)
        ) {
          event = true;
          eventCategory = eventObj.events[0]?.category || "";
        }
      });
    }

    const categoryColor = categoryColors[eventCategory] || "";
    const dayOfWeek = new Date(year, month - 1, prevDate).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 ? "text-error" : ""; // 0 = Minggu, 6 = Sabtu

    if (event) {
      days += `<div class="day prev-date event btn btn-sm btn-ghost ${categoryColor} ${isWeekend}">${prevDate}</div>`;
    } else {
      days += `<div class="day prev-date btn btn-sm btn-ghost ${isWeekend}">${prevDate}</div>`;
    }
  }

  // Handle current month
  for (let i = 1; i <= lastDate; i++) {
    let event = false;
    let eventCategory = "";

    if (Array.isArray(eventsArr)) {
      eventsArr.forEach((eventObj) => {
        if (
          eventObj.day === i &&
          eventObj.month === month + 1 &&
          eventObj.year === year
        ) {
          event = true;
          eventCategory = eventObj.events[0]?.category || "";
        }
      });
    }

    const categoryColor = categoryColors[eventCategory] || "";
    const dayOfWeek = new Date(year, month, i).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 ? "text-error" : ""; // 0 = Minggu, 6 = Sabtu

    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event btn btn-sm btn-secondary dark:btn-info border-b-4 border-b-base-100 dark:border-b-base-content ${categoryColor} ${isWeekend}">${i}</div>`;
      } else {
        days += `<div class="day today active btn btn-sm btn-secondary dark:btn-primary ${isWeekend}">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event btn btn-sm btn-ghost border-b-4 border-b-accent ${categoryColor} ${isWeekend}">${i}</div>`;
      } else {
        days += `<div class="day btn btn-sm btn-ghost ${isWeekend}">${i}</div>`;
      }
    }
  }

  // Handle next-date
  for (let j = 1; j <= nextDays; j++) {
    let event = false;
    let eventCategory = "";

    if (Array.isArray(eventsArr)) {
      eventsArr.forEach((eventObj) => {
        if (
          eventObj.day === j &&
          eventObj.month === (month === 11 ? 1 : month + 2) &&
          eventObj.year === (month === 11 ? year + 1 : year)
        ) {
          event = true;
          eventCategory = eventObj.events[0]?.category || "";
        }
      });
    }

    const categoryColor = categoryColors[eventCategory] || "";
    const dayOfWeek = new Date(year, month + 1, j).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 ? "text-error" : ""; // 0 = Minggu, 6 = Sabtu

    if (event) {
      days += `<div class="day next-date event btn btn-sm btn-ghost ${categoryColor} ${isWeekend}">${j}</div>`;
    } else {
      days += `<div class="day next-date btn btn-sm btn-ghost ${isWeekend}">${j}</div>`;
    }
  }

  daysContainer.innerHTML = days;
  addListner();
}

//function to add month and year on prev and next button
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

//function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      const clickedDay = Number(e.target.innerHTML); // Simpan hari yang diklik
      let clickedMonth = month;
      let clickedYear = year;

      //remove active and btn-soft from all days
      days.forEach((day) => {
        day.classList.remove("active", "btn-soft");
      });

      //if clicked prev-date or next-date switch to that month
      if (e.target.classList.contains("prev-date")) {
        clickedMonth = month === 0 ? 11 : month - 1;
        clickedYear = month === 0 ? year - 1 : year;
        prevMonth();
        //add active and btn-soft to clicked day after month is changed
        setTimeout(() => {
          const updatedDays = document.querySelectorAll(".day");
          updatedDays.forEach((day) => {
            if (
              Number(day.innerHTML) === clickedDay &&
              !day.classList.contains("prev-date") &&
              !day.classList.contains("next-date")
            ) {
              day.classList.add("active", "btn-soft");
              activeDay = clickedDay;
              getActiveDay(clickedDay);
              updateEvents(clickedDay);
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        clickedMonth = month === 11 ? 0 : month + 1;
        clickedYear = month === 11 ? year + 1 : year;
        nextMonth();
        //add active and btn-soft to clicked day after month is changed
        setTimeout(() => {
          const updatedDays = document.querySelectorAll(".day");
          updatedDays.forEach((day) => {
            if (
              Number(day.innerHTML) === clickedDay &&
              !day.classList.contains("prev-date") &&
              !day.classList.contains("next-date")
            ) {
              day.classList.add("active", "btn-soft");
              activeDay = clickedDay;
              getActiveDay(clickedDay);
              updateEvents(clickedDay);
            }
          });
        }, 100);
      } else {
        // For current month
        e.target.classList.add("active", "btn-soft");
        activeDay = clickedDay;
        getActiveDay(clickedDay);
        updateEvents(clickedDay);
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  console.log("here");
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("Invalid Date");
}

//function get active day day name and date and update eventday eventdate
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayNamesIndonesian = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const dayName = dayNamesIndonesian[day.getDay()];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = ", " + date + " " + months[month] + " " + year;
}

//function update events when a day is active
function updateEvents(date) {
  let events = "";
  if (Array.isArray(eventsArr)) {
    eventsArr.forEach((event) => {
      if (
        date === event.day &&
        month + 1 === event.month &&
        year === event.year
      ) {
        if (event.events.length > 1) {
          // Jika ada lebih dari satu event, gunakan <li>
          event.events.forEach((event) => {
            const categoryColor =
              categoryColors[event.category] || "bg-gray-300";
            events += `<li class="event list-disc ml-4">
                <div class="title">
                  <div class="event-title">${event.title}</div>
                </div>
                <div class="event-time">
                  <span class="event-time text-base-content/70">${event.time}</span>
                </div>
            </li>`;
          });
        } else {
          // Jika hanya satu event, gunakan <div>
          const singleEvent = event.events[0];
          const categoryColor =
            categoryColors[singleEvent.category] || "bg-gray-300";
          events += `<div class="event">
              <div class="title">
                <div class="event-title">${singleEvent.title}</div>
              </div>
              <div class="event-time">
                <span class="event-time text-base-content/70">${singleEvent.time}</span>
              </div>
          </div>`;
        }
      }
    });
  }
  if (events === "") {
    events = `<div class="no-event">
            <div>Tidak ada event, tunggu update.</div>
        </div>`;
  }
  eventsContainer.innerHTML = events;
}

//function to save events (no longer needed as we are not using local storage)
function saveEvents() {
  // This function is intentionally left blank as events are fetched from "kegiatan.json"
}

//function to get events from "kegiatan.json"
function getEvents() {
  // Events are already fetched from "kegiatan.json" during initialization
  // No additional logic is needed here
}

function convertTime(time) {
  //convert time to 24 hour format
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}

const grid = document.getElementById("calendarGrid");
const monthLabel = document.getElementById("monthLabel");
const messageText = document.getElementById("messageText");
const subtitle = document.getElementById("subtitle");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const today = new Date();
let viewYear = today.getFullYear();
let viewMonth = today.getMonth();
let messagesData = null;
let selectedDate = formatDate(today);

const subtitles = [
  "今天也要记得喝水哦",
  "微笑一下，运气会变好",
  "把小确幸装进口袋",
  "慢慢来，已经很棒了"
];

subtitle.textContent = subtitles[Math.floor(Math.random() * subtitles.length)];

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatMonth(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  return `${y} 年 ${m} 月`;
}

function buildCalendar(year, month) {
  grid.innerHTML = "";
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startWeekday = first.getDay();

  const daysInMonth = last.getDate();
  const prevLast = new Date(year, month, 0).getDate();

  monthLabel.textContent = formatMonth(first);

  const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.className = "day";

    const dayNum = i - startWeekday + 1;
    if (dayNum < 1) {
      cell.textContent = prevLast + dayNum;
      cell.classList.add("is-other");
    } else if (dayNum > daysInMonth) {
      cell.textContent = dayNum - daysInMonth;
      cell.classList.add("is-other");
    } else {
      cell.textContent = dayNum;
      cell.dataset.date = formatDate(new Date(year, month, dayNum));
      if (
        cell.dataset.date === formatDate(today) &&
        selectedDate === formatDate(today)
      ) {
        cell.classList.add("is-today");
      }
      if (cell.dataset.date === selectedDate) {
        cell.classList.add("is-selected");
      }
    }

    grid.appendChild(cell);
  }
}

function getMessageForKey(key) {
  if (!messagesData) return "";
  const monthDayKey = key.slice(5);

  if (Array.isArray(messagesData)) {
    let match = messagesData.find((item) => item.date === key);
    if (!match) {
      match = messagesData.find((item) => item.date === monthDayKey);
    }
    return match && match.message ? match.message : "";
  }

  if (messagesData && typeof messagesData === "object") {
    return messagesData[key] || messagesData[monthDayKey] || "";
  }

  return "";
}

function showMessageForKey(key) {
  selectedDate = key;
  messageText.textContent = getMessageForKey(key);
  buildCalendar(viewYear, viewMonth);
}

async function loadMessage() {
  try {
    const res = await fetch("messages.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("message fetch failed");
    messagesData = await res.json();
    showMessageForKey(formatDate(today));
  } catch (err) {
    messageText.textContent = "";
  }
}

prevBtn.addEventListener("click", () => {
  viewMonth -= 1;
  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear -= 1;
  }
  buildCalendar(viewYear, viewMonth);
});

nextBtn.addEventListener("click", () => {
  viewMonth += 1;
  if (viewMonth > 11) {
    viewMonth = 0;
    viewYear += 1;
  }
  buildCalendar(viewYear, viewMonth);
});

grid.addEventListener("click", (event) => {
  const cell = event.target.closest(".day");
  if (!cell || !cell.dataset.date) {
    messageText.textContent = "";
    return;
  }
  showMessageForKey(cell.dataset.date);
});

buildCalendar(viewYear, viewMonth);
loadMessage();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}

const grid = document.getElementById("calendarGrid");
const monthLabel = document.getElementById("monthLabel");
const messageText = document.getElementById("messageText");
const titleText = document.getElementById("titleText");
const subtitle = document.getElementById("subtitle");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const quoteView = document.getElementById("quoteView");
const calendarView = document.getElementById("calendarView");
const quoteDate = document.getElementById("quoteDate");
const quoteText = document.getElementById("quoteText");
const togetherText = document.getElementById("togetherText");
const toCalendar = document.getElementById("toCalendar");
const toQuote = document.getElementById("toQuote");

const today = new Date();
let viewYear = today.getFullYear();
let viewMonth = today.getMonth();
let messagesData = null;
let selectedDate = formatDate(today);

const subtitles = [
  "🌤 今天也想对你说一声，我好爱你。",
  "📮 这句情话，是哥哥留给你的小纸条。",
  "💌 无论哪一天，我都在你身边说这句话。",
  "🎧 听说今天心情会很好，因为你看到这句话了。",
  "🌷 日子温柔，都是因为你在。",
  "🍯 这是哥哥偷偷藏进日历的小小亲亲～",
  "🧸 今天也在计划偷偷抱你三次。",
  "🌟 我把心放在了这一句里，你有没有接住？",
  "🌈 你点开页面的这一秒，我心都软掉了。",
  "🥰 点开就奖励亲亲一枚（已经发出）～",
  "😚 小猫咪乖乖看寄语～奖励亲亲一下。",
  "😽 别怕，哥哥今天也会陪着你。",
  "🌷 点开这一页的人，是哥哥最爱的小猫咪。",
  "😚 今天也想牵着你的手，一起走下去。",
  "💌 有你在的每一天，都是纪念日。",
  "🌈 你看！我们已经一起走了这么多天啦～",
  "💗 比起日子，我更想数我们的亲亲和抱抱",
  "🍯 再忙也记得来看看哥哥写的小纸条哦～"
];

const titles = [
	"给馨馨的专属小情书 💌",
	"你今天的小幸福，已送达 🐾",
	"K哥哥的今日心动提醒 💕"
];

titleText.textContent = titles[Math.floor(Math.random() * titles.length)];
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

function formatDisplayDate(key) {
  const [y, m, d] = key.split("-");
  return `${y} 年 ${parseInt(m, 10)} 月 ${parseInt(d, 10)} 日`;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function diffDays(from, to) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((to - from) / msPerDay);
}

function getTogetherDuration(startDate, endDate) {
  const start = startOfDay(startDate);
  const end = startOfDay(endDate);
  if (end < start) return { years: 0, days: 0 };

  let years = end.getFullYear() - start.getFullYear();
  let anchor = new Date(start.getFullYear() + years, start.getMonth(), start.getDate());

  if (anchor > end) {
    years -= 1;
    anchor = new Date(start.getFullYear() + years, start.getMonth(), start.getDate());
  }

  const days = diffDays(anchor, end);
  return { years, days };
}

function updateTogetherText() {
  const start = new Date(2024, 9, 21);
  const duration = getTogetherDuration(start, today);
  togetherText.textContent = `我们已经在一起 ${duration.years} 年 ${duration.days} 天了！🥳💞`;
}

function spawnHeart(x, y) {
  const heart = document.createElement("span");
  heart.className = "tap-heart";
  heart.textContent = "❤";
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  document.body.appendChild(heart);
  heart.addEventListener("animationend", () => heart.remove(), { once: true });
}

function spawnHeartBurst(x, y) {
  const count = 4;
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    const sizeClass = `size-${(i % 3) + 1}`;
    heart.className = `tap-heart ${sizeClass}`;
    heart.textContent = "❤";
    const offsetX = (Math.random() - 0.5) * 34;
    const offsetY = (Math.random() - 0.5) * 18;
    heart.style.left = `${x + offsetX}px`;
    heart.style.top = `${y + offsetY}px`;
    heart.style.animationDelay = "0ms";
    heart.style.animationDuration = "820ms";
    document.body.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove(), { once: true });
  }
}

function registerHeartEffect() {
  document.addEventListener("click", (event) => {
    spawnHeartBurst(event.clientX, event.clientY);
  });

  document.addEventListener(
    "touchstart",
    (event) => {
      if (!event.touches || event.touches.length === 0) return;
      const touch = event.touches[0];
      spawnHeartBurst(touch.clientX, touch.clientY);
    },
    { passive: true }
  );
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

function showQuoteForKey(key) {
  quoteDate.textContent = formatDisplayDate(key);
  quoteText.textContent = getMessageForKey(key);
}

function showQuoteView() {
  quoteView.classList.add("is-active");
  calendarView.classList.remove("is-active");
}

function showCalendarView() {
  calendarView.classList.add("is-active");
  quoteView.classList.remove("is-active");
}

async function loadMessage() {
  try {
    const res = await fetch("messages.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("message fetch failed");
    messagesData = await res.json();
    showMessageForKey(formatDate(today));
    showQuoteForKey(formatDate(today));
  } catch (err) {
    messageText.textContent = "";
    quoteText.textContent = "";
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
  showQuoteForKey(cell.dataset.date);
});

toCalendar.addEventListener("click", () => {
  showCalendarView();
});

toQuote.addEventListener("click", () => {
  showQuoteView();
});

buildCalendar(viewYear, viewMonth);
loadMessage();
showQuoteView();
updateTogetherText();
registerHeartEffect();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}

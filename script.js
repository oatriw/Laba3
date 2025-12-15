// --- Оформлення сторінки по часу доби ---
function getThemeByHour(h) {
  if (h >= 6 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "day";
  if (h >= 18 && h < 22) return "evening";
  return "night";
}

function applyTimeTheme() {
  var now = new Date();
  var h = now.getHours();
  var cls = getThemeByHour(h);

  document.body.classList.remove("morning", "day", "evening", "night");
  document.body.classList.add(cls);

  // (необов'язково) якщо є елемент для відладки — показуємо час і тему
  var dbg = document.getElementById("themeDebug");
  if (dbg) {
    var hh = String(now.getHours()).padStart(2, "0");
    var mm = String(now.getMinutes()).padStart(2, "0");
    var ss = String(now.getSeconds()).padStart(2, "0");
    dbg.textContent = "Час: " + hh + ":" + mm + ":" + ss + " | Тема: " + cls;
  }
}

// щоб точно спрацювало при будь-якому сценарії
document.addEventListener("DOMContentLoaded", applyTimeTheme);
window.addEventListener("load", applyTimeTheme);
window.addEventListener("pageshow", applyTimeTheme);

// --- Слайдшоу ---
var images = ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg"];
var idx = 0;
var timerId = null;

function noCache(url) {
  return url + (url.indexOf("?") >= 0 ? "&" : "?") + "v=" + Date.now();
}

function showNextImage() {
  idx = (idx + 1) % images.length;
  var img = document.getElementById("slideImg");
  if (img) img.src = noCache(images[idx]);
}

function setSlideInterval(seconds) {
  var s = Number(seconds);
  if (!isFinite(s) || s <= 0) {
    alert("Інтервал має бути додатнім числом.");
    return false;
  }

  if (timerId !== null) clearInterval(timerId);
  timerId = setInterval(showNextImage, Math.round(s * 1000));

  var info = document.getElementById("intervalInfo");
  if (info) info.textContent = "Інтервал: " + s + " с";
  return true;
}

function askInterval() {
  var val = prompt("Введіть інтервал зміни зображень (у секундах):", "2");
  if (val === null) return;
  setSlideInterval(val);
}

// --- Таблиця 10x10 ---
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildTable10x10(min, max) {
  var table = document.createElement("table");
  table.className = "rand";

  for (var r = 0; r < 10; r++) {
    var tr = document.createElement("tr");
    for (var c = 0; c < 10; c++) {
      var td = document.createElement("td");
      td.className = ((r + c) % 2 === 0) ? "light" : "dark";
      td.textContent = String(randInt(min, max));
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
}

function generate() {
  var min = parseInt(document.getElementById("minVal").value, 10);
  var max = parseInt(document.getElementById("maxVal").value, 10);

  var msg = document.getElementById("msg");
  msg.textContent = "";

  if (!isFinite(min) || !isFinite(max)) {
    msg.textContent = "Введіть коректні цілі числа для мінімуму і максимуму.";
    return;
  }
  if (min > max) { var t = min; min = max; max = t; }

  var place = document.getElementById("tablePlace");
  place.innerHTML = "";
  place.appendChild(buildTable10x10(min, max));

  msg.textContent = "Згенеровано для діапазону [" + min + "; " + max + "].";
}

// --- ініціалізація ---
window.onload = function () {
  // 1) тема — перевіряємо щосекунди (щоб було "одразу")
  applyTimeTheme();
  setInterval(applyTimeTheme, 1000);

  // 2) перше зображення без кешу
  var img = document.getElementById("slideImg");
  if (img) img.src = noCache(images[idx]);

  // 3) інтервал питаємо одразу
  askInterval();

  document.getElementById("btnAskInterval").onclick = askInterval;
  document.getElementById("btnGen").onclick = generate;

  generate();
};

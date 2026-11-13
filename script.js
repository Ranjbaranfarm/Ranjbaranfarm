const TELEGRAM_USERNAME = "Persila1";

function faToEn(str) {
  if (!str) return "";
  return str.toString().replace(/[۰-۹]/g, function(d) {
    return "۰۱۲۳۴۵۶۷۸۹".indexOf(d);
  }).replace(/[٠-٩]/g, function(d) {
    return "٠١٢٣٤٥٦٧٨٩".indexOf(d);
  });
}

function getWhatsNumber(title) {
  if (title.indexOf("گوساله") !== -1) return "989123175163";
  if (title.indexOf("همکاری") !== -1) return "989358218321";
  return "989123359849";
}

function getLabel(el) {
  var lab = el.closest("label");
  if (lab) {
    var clone = lab.cloneNode(true);
    var f = clone.querySelector("input,textarea,select");
    if (f) f.remove();
    var t = clone.textContent.trim().replace(":", "");
    if (t) return t;
  }
  return el.placeholder || el.name || "مورد";
}

function collectForm(form) {
  var fields = form.querySelectorAll("input, textarea, select");
  var lines = [];
  var mobile = "";
  fields.forEach(function(el) {
    var val = el.value.trim();
    if (!val) return;
    var norm = faToEn(val).trim();
    if (/^09\d{9}$/.test(norm)) mobile = norm;
    lines.push("▪ " + getLabel(el) + ": " + val);
  });
  return { lines: lines, mobile: mobile };
}

function sendToChannel(form, title, channel) {
  var data = collectForm(form);
  var msgBox = form.querySelector("#ok, .ok");
  if (!data.mobile) {
    if (msgBox) {
      msgBox.style.color = "red";
      msgBox.textContent = "لطفا شماره موبایل را درست وارد کنید (مثل 09123359849).";
    }
    return false;
  }
  if (msgBox) msgBox.style.color = "";
  var text = "سلام دامداری برادران رنجبران 🌳\n";
  text += "درخواست جدید: " + title + "\n";
  text += "----------------\n";
  text += data.lines.join("\n");
  var url = "";
  if (channel === "telegram") {
    url = "https://t.me/" + TELEGRAM_USERNAME + "?text=" + encodeURIComponent(text);
  } else {
    var number = getWhatsNumber(title || "");
    url = "https://wa.me/" + number + "?text=" + encodeURIComponent(text);
  }
  window.open(url, "_blank");
  if (msgBox) {
    var name = channel === "telegram" ? "تلگرام" : "واتس‌اپ";
    msgBox.innerHTML = "✅ درخواست " + title + " شما آماده شد و " + name + " باز شد. اگر باز نشد <a href='" + url + "' target='_blank' style='font-weight:900'>اینجا کلیک کنید</a>.";
  }
  form.reset();
  return false;
}

function orderMsg(e, title, channel) {
  e.preventDefault();
  return sendToChannel(e.target, title, channel || "whatsapp");
}

function sendTelegramFrom(formId, title) {
  var form = document.getElementById(formId);
  if (!form) return false;
  return sendToChannel(form, title, "telegram");
}

document.addEventListener("click", function(e) {
  var nav = document.getElementById("nav");
  if (nav && nav.classList.contains("open")) {
    if (!e.target.closest(".header")) nav.classList.remove("open");
  }
});
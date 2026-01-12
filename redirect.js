/*
const TRUST_MIN = 30;
const LIMIT = 5;
const WINDOW = 30 * 1000;
const REDIRECT_DELAY = 600;
const SECRET = "bz68@encoder";

const card = document.getElementById("card-content");
const loading = document.getElementById("loading");
const antibot = document.getElementById("antibot");
const errorBox = document.getElementById("error");
const btn = document.getElementById("continueBtn");
const humanBtn = document.getElementById("humanBtn");
const redirectMsg = document.getElementById("redirect-msg");
const redirectText = document.getElementById("redirect-text");

const TRUST_KEY = "bz_trusted_until";
const RATE_KEY = "bz_redirect_log";

const isGoogleBot = /Googlebot|AdsBot/i.test(navigator.userAgent);

let interacted = false;
["mousemove","touchstart","keydown","scroll"].forEach(e=>{
  addEventListener(e,()=>interacted=true,{once:true});
});

function isBot(){
  if (navigator.webdriver) return true;
  if (!navigator.languages || !navigator.languages.length) return true;
  if (!interacted && performance.now() < 2000) return true;
  if (/Headless|Phantom|Puppeteer|Playwright/i.test(navigator.userAgent)) return true;
  return false;
}

function isTrusted(){
  return Date.now() < (localStorage.getItem(TRUST_KEY) || 0);
}
function markTrusted(){
  localStorage.setItem(TRUST_KEY, Date.now() + TRUST_MIN * 60 * 1000);
}

function logRedirect(){
  const now = Date.now();
  let arr = JSON.parse(localStorage.getItem(RATE_KEY) || "[]")
    .filter(t => now - t < WINDOW);
  arr.push(now);
  localStorage.setItem(RATE_KEY, JSON.stringify(arr));
}
function isRateLimited(){
  const now = Date.now();
  const arr = JSON.parse(localStorage.getItem(RATE_KEY) || "[]");
  return arr.filter(t => now - t < WINDOW).length >= LIMIT;
}

function xor(str, key){
  return [...str].map((c,i)=>
    String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
  ).join("");
}

function decodePayload(hash){
  try{
    const raw = atob(hash.replace(/-/g,'+').replace(/_/g,'/'));
    const json = JSON.parse(xor(raw, SECRET));

    if (!json.u || !json.e) return null;
    if (Date.now() > json.e) return "expired";

    if (/^(javascript|data|vbscript):/i.test(json.u)) return null;

    const u = new URL(json.u);
    if (!["http:","https:"].includes(u.protocol)) return null;

    return u.href;
  }catch{
    return null;
  }
}

if (isGoogleBot){
  card.remove();
  showError("404", "Not found");
  throw "GOOGLEBOT STOP! DUDE?";
}

const payload = location.hash.slice(1);
const safeUrl = decodePayload(payload);

function showError(title,msg){
  errorBox.innerHTML = `<h3>${title}</h3><p>${msg}</p>`;
  errorBox.classList.remove("hidden");
}

if (!safeUrl){
  card.remove();
  showError("Link không hợp lệ", "Liên kết không tồn tại hoặc đã hết hạn");
  window.location.replace("./");
  throw "Invalid link";
}

if (safeUrl === "expired"){
  card.remove();
  showError("Link đã hết hạn", "Liên kết này đã quá thời gian cho phép");
  throw "Expired";
}

function doRedirect(){
  loading.classList.add("hidden");

  if (redirectMsg){
    redirectText.textContent = "Đang chuyển hướng…";
    redirectMsg.classList.remove("hidden");
  }

  setTimeout(()=>location.href = safeUrl, REDIRECT_DELAY);
}

btn.onclick = ()=>{
  btn.disabled = true;
  card.remove();
  if (isBot() || isRateLimited()){
    loading.classList.add("hidden");
    antibot.classList.remove("hidden");
    return;
  }
  loading.classList.remove("hidden");

  setTimeout(()=>{
    if (isTrusted()){
      doRedirect();
      return;
    }

    logRedirect();
    doRedirect();
  }, 1250);
};

humanBtn.onclick = ()=>{
  antibot.classList.add("hidden");
  loading.classList.remove("hidden");
  markTrusted();
  setTimeout(()=>{
    logRedirect();
    doRedirect();
  }, 1250);
};
*/
/* ========= CONFIG ========= */
const TRUST_MIN = 30;
const LIMIT = 5;
const WINDOW = 90 * 1000;
const REDIRECT_DELAY = 600;

/* ========= PARAM ========= */
const params = new URLSearchParams(location.search);
const rawUrl = params.get("url");

/* ========= ELEMENTS ========= */
const card = document.getElementById("card-content");
const loading = document.getElementById("loading");
const antibot = document.getElementById("antibot");
const errorBox = document.getElementById("error");
const btn = document.getElementById("continueBtn");
const humanBtn = document.getElementById("humanBtn");

/* ========= STORAGE ========= */
const TRUST_KEY = "bz_trusted_until";
const RATE_KEY = "bz_redirect_log";

/* ========= GOOGLEBOT ========= */
const isGoogleBot = /Googlebot|AdsBot/i.test(navigator.userAgent);

/* ========= INTERACTION ========= */
let interacted = false;
["mousemove","touchstart","keydown","scroll"].forEach(e=>{
  addEventListener(e,()=>interacted=true,{once:true});
});

/* ========= BOT CHECK ========= */
function isBot(){
  if (navigator.webdriver) return true;
  if (!navigator.languages || !navigator.languages.length) return true;
  if (!interacted && performance.now() < 2000) return true;
  if (/Headless|Phantom|Puppeteer|Playwright/i.test(navigator.userAgent)) return true;
  return false;
}

/* ========= TRUST ========= */
function isTrusted(){
  return Date.now() < (localStorage.getItem(TRUST_KEY) || 0);
}
function markTrusted(){
  localStorage.setItem(TRUST_KEY, Date.now() + TRUST_MIN * 60 * 1000);
}

/* ========= RATE LIMIT ========= */
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

/* ========= URL SANITIZE ========= */
function normalizeUrl(raw){
  try{
    const decoded = decodeURIComponent(raw || "").trim();

    if (/^(javascript|data|vbscript):/i.test(decoded)) return null;

    const u = new URL(decoded);

    if (!["http:", "https:"].includes(u.protocol)) return null;

    return u.href;
  }catch{
    return null;
  }
}

const safeUrl = normalizeUrl(rawUrl);

/* ========= ERROR ========= */
function showError(title, msg){
  errorBox.innerHTML = `<h3>${title}</h3><p>${msg}</p>`;
  errorBox.classList.remove("hidden");
}

/* ========= GOOGLEBOT SAFE ========= */
if (isGoogleBot){
  document.body.innerHTML = `
    <h1>404</h1>
    <p>Not found.</p>
  `;
  throw "Googlebot stop";
}

/* ========= VALIDATE ========= */
if (!safeUrl){
  showError("Link không hợp lệ", "Không thể chuyển hướng tới liên kết này.");
  throw "Invalid URL";
}

/* ========= REDIRECT ========= */
function doRedirect(){
  setTimeout(()=>location.href = safeUrl, REDIRECT_DELAY);
}

/* ========= EVENTS ========= */
btn.onclick = ()=>{
  btn.disabled = true;
  card.remove();
  loading.classList.remove("hidden");

  setTimeout(()=>{
    if (isTrusted()){
      doRedirect();
      return;
    }

    if (isBot() || isRateLimited()){
      loading.classList.add("hidden");
      antibot.classList.remove("hidden");
      return;
    }

    logRedirect();
    doRedirect();
  }, 500);
};

humanBtn.onclick = ()=>{
  antibot.classList.add("hidden");
  loading.classList.remove("hidden");
  markTrusted();
  logRedirect();
  doRedirect();
};
/* ========= CONFIG ========= */
const TRUST_MIN = 30;
const LIMIT = 5;
const WINDOW = 90 * 1000;

/* ========= ELEMENTS ========= */
const params = new URLSearchParams(location.search);
const redirectUrl = params.get("url");

const card = document.getElementById("card-content");
const loading = document.getElementById("loading");
const msg = document.getElementById("redirect-msg");
const msgText = document.getElementById("redirect-text");
const antibot = document.getElementById("antibot");
const errorBox = document.getElementById("error");
const btn = document.getElementById("continueBtn");
const humanBtn = document.getElementById("humanBtn");

/* ========= UTILS ========= */
const TRUST_KEY = "bz_trusted_until";
const RATE_KEY = "bz_redirect_log";

const isMobile = () =>
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

function isTrusted(){
  return Date.now() < (localStorage.getItem(TRUST_KEY)||0);
}
function markTrusted(){
  localStorage.setItem(TRUST_KEY, Date.now()+TRUST_MIN*60*1000);
}

function logRedirect(){
  const now = Date.now();
  let arr = JSON.parse(localStorage.getItem(RATE_KEY)||"[]")
    .filter(t=>now-t<WINDOW);
  arr.push(now);
  localStorage.setItem(RATE_KEY,JSON.stringify(arr));
  return arr.length;
}
function isRateLimited(){
  const now = Date.now();
  const arr = JSON.parse(localStorage.getItem(RATE_KEY)||"[]");
  return arr.filter(t=>now-t<WINDOW).length>=LIMIT;
}

/* ========= BOT CHECK ========= */
let interacted=false;
["mousemove","touchstart","keydown","scroll"].forEach(e=>{
  addEventListener(e,()=>interacted=true,{once:true});
});

function isBot(){
  if(navigator.webdriver) return true;
  if(!navigator.languages || !navigator.languages.length) return true;
  if(!interacted && performance.now()<2000) return true;
  if(/Headless|Phantom|Puppeteer|Playwright/i.test(navigator.userAgent)) return true;
  return false;
}

/* ========= FLOW ========= */
function showError(title,msg){
  errorBox.innerHTML=`<h3>${title}</h3><p>${msg}</p>`;
  errorBox.classList.remove("hidden");
}

function doRedirect(){
  const url=decodeURIComponent(redirectUrl);
  msgText.innerHTML=
    `Đang chuyển hướng đến link, nhấn
     <a href="${url}" rel="noreferrer">vào đây</a>
     nếu nó không tự động chuyển`;
  loading.classList.add("hidden");
  msg.classList.remove("hidden");
  setTimeout(()=>location.href=url,150);
}

btn.onclick=()=>{
  btn.disabled=true;
  card.remove();
  loading.classList.remove("hidden");

  setTimeout(()=>{
    if(isTrusted()){
      doRedirect();
      return;
    }

    if(isBot() || isRateLimited()){
      loading.classList.add("hidden");
      antibot.classList.remove("hidden");
      return;
    }

    logRedirect();
    doRedirect();
  },1000);
};

humanBtn.onclick=()=>{
  antibot.classList.add("hidden");
  loading.classList.remove("hidden");
  markTrusted();
  logRedirect();
  setTimeout(doRedirect,1250);
};

if(!redirectUrl){
  window.location.replace("./");
}
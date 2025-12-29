  const params = new URLSearchParams(location.search);
  const redirectUrl = params.get("url");

  const content = document.getElementById("card-content");
  const loading = document.getElementById("loading");
  const errorBox = document.getElementById("error");
  const antibotBox = document.getElementById("antibot");
  const redirectMsg = document.getElementById("redirect-msg");
  const redirectText = document.getElementById("redirect-text");
  const btn = document.getElementById("continueBtn");
  const humanBtn = document.getElementById("humanBtn");

  let interacted = false;
  let firstClickTime = 0;

  ["mousemove", "touchstart", "keydown"].forEach(e =>
    window.addEventListener(e, () => interacted = true, { once: true })
  );

  function fingerprint() {
    return btoa(
      navigator.userAgent +
      screen.width +
      screen.height +
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
  }

  const RATE_KEY = "bz_redirect_log";
  const LIMIT = 3;
  const WINDOW = 60 * 1000;

  function logRedirect() {
    const now = Date.now();
    const data = JSON.parse(localStorage.getItem(RATE_KEY) || "[]")
      .filter(t => now - t < WINDOW);
    data.push(now);
    localStorage.setItem(RATE_KEY, JSON.stringify(data));
    return data.length;
  }

  function isRateLimited() {
    const data = JSON.parse(localStorage.getItem(RATE_KEY) || "[]");
    const now = Date.now();
    return data.filter(t => now - t < WINDOW).length >= LIMIT;
  }

  function isBot() {
    if (navigator.webdriver) return true;
    if (!navigator.languages || navigator.languages.length === 0) return true;
    if (!interacted) return true;
    if (/Headless|Phantom|Playwright|Puppeteer/i.test(navigator.userAgent)) return true;
    return false;
  }

  function showError(title, msg) {
    errorBox.innerHTML = `
      <h3>${title}</h3>
      <p>${msg}</p>
      <p><a href="./" style="color: #a2a3a6;">&lt; Quay lại</a></p>
    `;
    errorBox.classList.remove("hidden");
  }

  function showRedirectMessage() {
    const url = decodeURIComponent(redirectUrl);
    redirectText.innerHTML = `
      Đang chuyển hướng đến link, nhấn
      <a href="${url}" rel="noreferrer">vào đây</a>
      nếu nó không tự động chuyển
    `;

    loading.classList.add("hidden");
    redirectMsg.classList.remove("hidden");

    setTimeout(() => {
      location.href = url;
    }, 100);
  }

  btn.onclick = () => {
    const now = Date.now();
    if (!firstClickTime) firstClickTime = now;

    btn.disabled = true;
    content.remove();
    loading.classList.remove("hidden");

    setTimeout(() => {
      if (now - firstClickTime < 800) {
        loading.classList.add("hidden");
        antibotBox.classList.remove("hidden");
        return;
      }

      if (isBot() || isRateLimited()) {
        loading.classList.add("hidden");
        antibotBox.classList.remove("hidden");
        return;
      }

      logRedirect();
      showRedirectMessage();
    }, 1000);
  };

  humanBtn.onclick = () => {
    antibotBox.classList.add("hidden");
    loading.classList.remove("hidden");

    logRedirect();

    setTimeout(showRedirectMessage, 1250);
  };
  
  if (!redirectUrl) {
    window.location.replace("./");
  }
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

  ["mousemove", "touchstart", "keydown"].forEach(e =>
    window.addEventListener(e, () => interacted = true, { once: true })
  );

  function isBot() {
    if (navigator.webdriver) return true;
    if (!navigator.languages || navigator.languages.length === 0) return true;
    if (!interacted) return true;
    return false;
  }

  function showError(title, msg) {
    errorBox.innerHTML = `
      <h3>${title}</h3>
      <p>${msg}</p>
      <p><a href="./">&lt; Quay lại</a></p>
    `;
    errorBox.classList.remove("hidden");
  }

  function showRedirectMessage() {
    redirectText.innerHTML = `
      Redirecting you to your link,
      <a href="${decodeURIComponent(redirectUrl)}" rel="noreferrer">
        click here
      </a>
      if it doesn't happen automatically
    `;

    loading.classList.add("hidden");
    redirectMsg.classList.remove("hidden");

    // Redirect sau khi hiện text 0.8s
    setTimeout(() => {
      location.href = decodeURIComponent(redirectUrl);
    }, 800);
  }

  btn.onclick = () => {
    btn.disabled = true;

    content.remove();
    loading.classList.remove("hidden");

    // Spin 3 giây giống F95
    setTimeout(() => {
      if (!redirectUrl) {
        loading.classList.add("hidden");
        showError("Lỗi", "Link không hợp lệ.");
        return;
      }

      if (isBot()) {
        loading.classList.add("hidden");
        antibotBox.classList.remove("hidden");
        return;
      }

      showRedirectMessage();
    }, 3000);
  };

  humanBtn.onclick = () => {
    antibotBox.classList.add("hidden");
    loading.classList.remove("hidden");

    setTimeout(showRedirectMessage, 3500);
  };
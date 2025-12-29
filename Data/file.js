/* ========= REDIRECT ENCODE ========= */
const REDIRECT_SECRET = "bz68@encoder";
const EXPIRE_TIME = 24 * 60 * 60 * 1000;

function xor(str, key){
  return [...str].map((c,i)=>
    String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
  ).join("");
}

function encodeRedirectUrl(url){
  try{
    if (!/^https?:\/\//i.test(url)) return null;

    const payload = JSON.stringify({
      u: url,
      e: Date.now() + EXPIRE_TIME
    });

    const encoded = btoa(xor(payload, REDIRECT_SECRET))
      .replace(/\+/g,'-')
      .replace(/\//g,'_')
      .replace(/=+$/,'');

    return encoded;
  }catch{
    return null;
  }
}

window.onload = function () {
  // Initially hide the loading message
  const loadingMessage = document.getElementById("loading-message");
  loadingMessage.style.display = "none";

  renderAppList();
};

const searchInputElement = document.getElementById("search-input");
const searchButtonElement = document.getElementById("search-button");
const radioButtons = document.querySelectorAll('input[name="category"]');
const appListElement = document.querySelector(".app-list");
const loadingMessage = document.getElementById("loading-message");

searchButtonElement.addEventListener("click", renderAppList);
searchInputElement.addEventListener("input", renderAppList);

radioButtons.forEach(function (radio) {
  radio.addEventListener("change", renderAppList);
});

function renderAppList() {
  // Show the loading message while apps are being loaded
  loadingMessage.style.display = "block";
  
  appListElement.innerHTML = "";

  const searchTerm = searchInputElement.value.toLowerCase();
  const typeFilter = getSelectedRadioValue("category");

  let filteredApps = apps.filter((app) => {
    return (
      app.name?.toLowerCase().includes(searchTerm) &&
      (typeFilter === "" || app.type === typeFilter)
    );
  });

  filteredApps = filteredApps.reverse();

  // Hide the loading message once apps are loaded
  loadingMessage.style.display = "none";

  if (filteredApps.length === 0) {
    const noDataElement = document.createElement("div");
    noDataElement.classList.add("no-data");
    noDataElement.innerText = "Không có dữ liệu";
    appListElement.appendChild(noDataElement);
  } else {
    filteredApps.forEach((app) => {
      const appElement = document.createElement("div");
      appElement.classList.add("App");
      appElement.classList.add("lq");
      appElement.classList.add("gl");
      let osIcon;
      if (app.os === "iOS") {
        osIcon = '<i class="fab fa-apple"></i> iOS';
      } else if (app.os === "Android") {
        osIcon = '<i class="fab fa-android"></i> Android';
      } else if (app.os === "Windows") {
        osIcon = '<i class="fab fa-windows"></i> Windows';
      } else if (app.os === "Linux") {
        osIcon = '<i class="fab fa-linux"></i> Linux';
      } else if (app.os === "MacOS") {
        osIcon = '<i class="fab fa-apple"></i> MacOS';
      } else {
        osIcon = '<i class="fa-solid fa-question"></i> Other';
      }

      let type;
      if (app.type === "Tweak") {
        type = '<i class="fa-solid fa-cube"></i> Tweak';
      } else if (app.type === "iPA") {
        type = '<i class="fa-brands fa-app-store-ios"></i> iPA';
      } else if (app.type === "Link") {
        type = '<i class="fa-solid fa-link"></i> Link';
      } else if (app.type === "APK") {
        type = '<i class="fa-solid fa-box-archive"></i> APK';
      } else if (app.type === "Game") {
        type = '<i class="fa fa-gamepad"></i> Game';
      } else {
        type = '<i class="fa-solid fa-question"></i> Other';
      }

      let version;
      if (app.version === undefined) {
        version = '<i class="fa-solid fa-question"></i> N/A';
      } else {
        version = '<i class="fa-solid fa-wrench"></i> ' + app.version;
      }
      
      let logo = app.logo === undefined ? 'https://iconape.com/wp-content/files/io/12384/png/question-circle.png' : app.logo;
      
      let name = app.name === undefined ? 'N/A' : app.name;
            
      let description = app.description === undefined ? 'N/A' : app.description;

      const encoded = encodeRedirectUrl(app.downloadLink);
      const redirectLink = encoded ? `redirect.html#${encoded}` : "#";

      if (app.type === "Link") {
      appElement.innerHTML = `
        <div class="InfoApp">
          <div class="Info">
            <div class="Icon">
              <img src="${logo}" alt="${name}">
            </div>
            <div class="Name">
              <h1>${name}</h1>
              <div class="scroll-text">${description}</div>
            </div>
          </div>
          <div class="Download">
            <a href="${redirectLink}" target="_blank">
              <button>
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </button>
            </a>
          </div>
        </div>
        <div class="More">
          <div class="Type" style="text-align: left;">${type}</div>
        </div>
      `;
      } else if (app.type === "Game") {
        
      let size = app.size === undefined ? 'N/A' : app.size;

      appElement.innerHTML = `
        <div class="InfoApp">
          <div class="Info">
            <div class="Icon">
              <img src="${logo}" alt="${name}">
            </div>
            <div class="Name">
              <h1>${name}</h1>
              <div class="scroll-text">${description}</div>
            </div>
          </div>
          <div class="Download">
            <a href="${redirectLink}" target="_blank">
              <button>
                <i class="fa-solid fa-download"></i>
              </button>
            </a>
          </div>
        </div>
        <div class="More">
          <div class="Type">${type}</div>
          <div class="OStype">${osIcon}</div>
          <div class="Category">${version}</div>
          <div class="Storage"><i class="fa-solid fa-database"></i> ${size}</div>
        </div>
      `;
      
      appElement.querySelector(".Info")
        .addEventListener("click", () => openGameDetail(app));
    
      appElement.querySelector(".More")
        .addEventListener("click", () => openGameDetail(app));
      } else {

      let size = app.size === undefined ? 'N/A' : app.size;

      appElement.innerHTML = `
        <div class="InfoApp">
          <div class="Info">
            <div class="Icon">
              <img src="${logo}" alt="${name}">
            </div>
            <div class="Name">
              <h1>${name}</h1>
              <div class="scroll-text">${description}</div>
            </div>
          </div>
          <div class="Download">
            <a href="${redirectLink}" target="_blank">
              <button>
                <i class="fa-solid fa-download"></i>
              </button>
            </a>
          </div>
        </div>
        <div class="More">
          <div class="OStype">${osIcon}</div>
          <div class="Type">${type}</div>
          <div class="Category">${version}</div>
          <div class="Storage"><i class="fa-solid fa-database"></i> ${size}</div>
        </div>
      `;
      
      appElement.querySelector(".Info")
        .addEventListener("click", () => openGameDetail(app));
    
      appElement.querySelector(".More")
        .addEventListener("click", () => openGameDetail(app));
      }
      appListElement.appendChild(appElement);
    });
  }
}

function getSelectedRadioValue(name) {
  const selectedRadio = document.querySelector('input[name="' + name + '"]:checked');
  return selectedRadio ? selectedRadio.value : "";
}

var isContentHidden = false;

function toggleContent() {
  var Container = document.querySelector('.Container');
  isContentHidden = !isContentHidden;

  if (isContentHidden) {
    Container.classList.add('Hidden');
  } else {
    Container.classList.remove('Hidden');
  }
}

var isVideoHidden = false;

function toggleVideo() {
  var VideoBG = document.querySelector('.VideoBG');
  isVideoHidden = !isVideoHidden;

  if (isVideoHidden) {
    VideoBG.classList.add('Hidden');
  } else {
    VideoBG.classList.remove('Hidden');
  }
}

function toggleMusic() {
  var x = document.getElementById("myAudio");
  var toggleMusic = document.getElementById("toggleMusic");
  
  var currentTime = new Date();
  var startMinute = currentTime.getMinutes();
  var startSecond = currentTime.getSeconds();

  x.currentTime = startMinute * 60 + startSecond;

  if (x.paused == false) {
    toggleMusic.innerHTML = '<i class="fa-solid fa-play"></i>'
    x.pause();
  } else {
    toggleMusic.innerHTML = '<i class="fa-solid fa-pause"></i>'
    x.play();
  }
}

function openGameDetail(app) {
  document.getElementById("detail-title").innerText = app.name || "N/A";

  document.getElementById("detail-description").innerText =
    app.detailDesc || app.description || "Không có mô tả";

  const gallery = document.getElementById("detail-gallery");
  gallery.innerHTML = "";

  if (app.screenshots && app.screenshots.length > 0) {
    app.screenshots.forEach(img => {
      const image = document.createElement("img");
      image.src = img;
      gallery.appendChild(image);
    });
  } else {
    gallery.innerHTML = "<i>Không có ảnh mô tả</i>";
  }

  document.getElementById("game-detail-overlay").classList.remove("hidden");
}

function closeGameDetail() {
  document.getElementById("game-detail-overlay").classList.add("hidden");
}

  function toggleInput() {
    const search = document.querySelector(".search");
    const input = document.getElementById("search-input");

    search.classList.toggle("active");

    if (search.classList.contains("active")) {
      setTimeout(() => input.focus(), 200);
    } else {
      input.value = "";
    }
  }
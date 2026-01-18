<br>
  
<p align="center">
  <img src="https://raw.githubusercontent.com/ZiolKen/chiuaquangz/main/favicon.ico" alt="Black Zero Logo" width="128"/>
</p>

# <p align="center">Black Zero</p>

<div>
  <img style="width: 100%;" src="https://capsule-render.vercel.app/api?type=waving&height=110&section=header&fontSize=60&fontColor=FFFFFF&fontAlign=50&fontAlignY=40&descSize=18&descAlign=50&descAlignY=70&theme=cobalt" />
</div>

<p align="center">
  <a href="https://github.com/ZiolKen/blackzero/stargazers"><img src="https://img.shields.io/github/stars/ZiolKen/blackzero?style=flat"></a>
  <a href="https://github.com/ZiolKen/blackzero/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ZiolKen/blackzero?style=flat"></a>
  <a href="https://github.com/ZiolKen/blackzero/forks"><img src="https://img.shields.io/github/forks/ZiolKen/blackzero?style=flat"></a>
</p>

Black Zero is a web portal that provides a curated collection of tools, applications, and games for iOS, Android, and PC. It offers a user-friendly, glassmorphism-inspired interface to browse, search, and discover various software.

This project is a static site built with HTML, CSS, and vanilla JavaScript. It includes a web-based panel for managing the application list by interacting with the GitHub API.

---

## Features

-   **Application Directory:** A comprehensive list of apps, games, tweaks, and other utilities.
-   **Category Filtering:** Easily filter content by type, including `iPA`, `APK`, `Tweak`, `Game`, and `Link`.
-   **Search Functionality:** A quick search function to find specific applications by name.
-   **Detailed View:** View extended descriptions and image galleries for each application.
-   **Supporter Showcase:** A "Donate" page that recognizes individuals who have supported the project.
-   **Responsive UI:** A fluid design that works effectively on both desktop and mobile devices.

---

## App Management Panel

The application list is managed through a web-based panel located at `/api/bz68app-zmanager.html`. This panel authenticates using a GitHub Personal Access Token and allows an administrator to add, edit, and delete entries. It interacts directly with the GitHub API to modify the `app.js` data source file in the `ZiolKenn/chiuaquangz` repository.

**Key Panel Functions:**
-   Create, read, update, and delete application entries.
-   Load existing entries into a form for easy editing.
-   Edit an entry's data directly in a raw JSON format.
-   A utility to fix UTF-8 encoding issues and clean up invalid data.

---

## Running Locally

To run this project on your local machine:

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/ziolken/blackzero.git
    cd blackzero
    ```

2.  **Start a local web server:**
    If you have Python 3, you can run its built-in server:
    ```sh
    python -m http.server
    ```
    Alternatively, use a tool like the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for VS Code.

3.  **Access the site:**
    Open your browser and navigate to `http://localhost:8000` (or the address provided by your server).

---

## Credits

-   **Original Code:** Black Zero
-   **UI, CSS, and Feature Recode:** [ZiolKen](https://github.com/ZiolKen)

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Support

If you find this helpful:

[![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/_zkn)
[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/zkn0461)
[![Patreon](https://img.shields.io/badge/Patreon-F96854?style=for-the-badge&logo=patreon&logoColor=white)](https://patreon.com/ZiolKen)

<div>
  <img style="width: 100%;" src="https://capsule-render.vercel.app/api?type=waving&height=110&section=footer&fontSize=60&fontColor=FFFFFF&fontAlign=50&fontAlignY=40&descSize=18&descAlign=50&descAlignY=70&theme=cobalt" />
</div>
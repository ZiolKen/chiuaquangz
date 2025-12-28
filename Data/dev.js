document.addEventListener('DOMContentLoaded', () => {

  const appList = document.querySelector('.app-list');
  const loadingMessage = document.getElementById('loading-message');
  const devPage = document.getElementById('dev-page');
  const categoryRadios = document.querySelectorAll('input[name="category"]');

  // Background full trang
  document.body.style.cssText = `
    background: linear-gradient(to bottom, #001133 0%, #000811 40%, #000000 100%) !important;
    background-attachment: fixed;
    color: #e0e0e0 !important;
    min-height: 100vh;
    margin: 0;
    padding: 0;
  `;

  function renderDevContent() {
    if (loadingMessage) loadingMessage.style.display = 'none';
    if (appList) appList.style.display = 'none';

    const devHTML = `
      <div class="dev-full-container">
        <div class="dev-header">
          <div class="code-bracket">&lt;/&gt;</div>
          <h1 class="dev-title">Thông Tin Từ Developer</h1>
        </div>

        <div class="dev-cards-wrapper">
          <div class="glow-bg"></div>

          <div class="dev-card">
            <div class="card-border-glow"></div>
            <div class="card-icon">
              <i class="fa-solid fa-heart"></i>
            </div>
            <h3>1. Chào mừng bạn!</h3>
            <p>Xin chào và cảm ơn bạn đã truy cập trang web của mình.<br>
               Trang web này mình mới lập chưa lâu.<br>
               Nếu có bất kỳ thắc mắc nào, bạn cứ liên hệ mình nhé!</p>
          </div>

          <div class="dev-card">
            <div class="card-border-glow"></div>
            <div class="card-icon">
              <i class="fa-solid fa-question-circle"></i>
            </div>
            <h3>2. Hỗ trợ lỗi</h3>
            <p>Gặp lỗi sign, lỗi cài đặt, hay bất kỳ vấn đề gì liên quan đến ứng dụng?<br>
               Bạn có thể hỏi mình trực tiếp hoặc nhờ hướng dẫn cách cài iPA qua chứng chỉ.</p>
          </div>

          <div class="dev-card">
            <div class="card-border-glow"></div>
            <div class="card-icon">
              <i class="fa-solid fa-exclamation-triangle"></i>
            </div>
            <h3>3. Lưu ý về chứng chỉ</h3>
            <p>Để cài được iPA, bạn cần có chứng chỉ ký.<br>
               Mình khuyên nên mua chứng chỉ từ những nơi bán uy tín, ổn định lâu dài để tránh bị revoke sớm.</p>
          </div>

          <div class="dev-card">
            <div class="card-border-glow"></div>
            <div class="card-icon">
              <i class="fa-solid fa-shield-alt"></i>
            </div>
            <h3>4. Về mã độc trong iPA</h3>
            <p>iPA trên trang có chứa mã độc không?<br>
               <strong>Đương nhiên là không</strong>.<br>
               Tất cả đều được xuất từ nguồn đáng tin cậy.<br>
               Khi có bản cập nhật mới, mình sẽ up iPA ngay cho các bạn.</p>
          </div>

          <div class="dev-card">
            <div class="card-border-glow"></div>
            <div class="card-icon">
              <i class="fa-solid fa-gift"></i>
            </div>
            <h3>5. Điều khoản sử dụng</h3>
            <p>Dịch vụ tải và sử dụng ứng dụng trên trang web này<br>
               <strong>luôn luôn miễn phí</strong>, không thu phí bất kỳ hình thức nào.</p>
          </div>

          <div class="dev-card">
            <div class="card-border-glow"></div>
            <div class="card-icon">
              <i class="fa-solid fa-envelope"></i>
            </div>
            <h3>6. Liên hệ với mình</h3>
            <p>Bạn có thể liên hệ qua:<br>
               • Gmail: <strong>blackzero@boxfi.uk</strong><br>
               • Facebook Messenger (nhấn vào nút chat ở góc menu)</p>
          </div>

          <div class="dev-card">
            <div class="card-border-glow"></div>
            <div class="card-icon">
              <i class="fa-solid fa-code-branch"></i>
            </div>
            <h3>7. Credit</h3>
  <p>
    • Code gốc được chỉnh sửa bởi <strong><a href="https://youtube.com/@kiyu-uq8xt?si=Iuao89v2EwtWcESq" target="_blank">Black Zero</a></strong><br>
    • UI, Glassmorphism, hiệu ứng CSS & một số tính năng được recode với ❤️ bởi<br>
      <strong><a href="https://ziolken.pages.dev/" target="_blank">ZiolKen</a></strong>
  </p>
</div>

          <div class="dev-thanks">Cảm ơn bạn đã ghé thăm và ủng hộ! ❤️</div>
        </div>

        <div class="spacer"></div>
      </div>

      <style>
        .dev-full-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 20px 15px 140px 15px;
          box-sizing: border-box;
        }

        .dev-header {
          text-align: center;
          margin-bottom: 40px;
          padding-top: 20px;
        }

        .code-bracket {
          font-size: 56px;
          color: #00ffff;
          text-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
          margin-bottom: 10px;
          animation: pulse 2s infinite;
        }

        .dev-title {
          font-size: 36px;
          font-weight: 700;
          background: linear-gradient(135deg, #00ffff, #00ccff, #0099ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }

        .dev-cards-wrapper {
          flex: 1;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
          position: relative;
          padding: 35px;
          background: rgba(10, 15, 30, 0.75);
          backdrop-filter: blur(20px);
          border-radius: 28px;
          border: 1px solid rgba(0, 255, 255, 0.4);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
          overflow: hidden;
        }

        .glow-bg {
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(0, 255, 255, 0.08) 0%, transparent 70%);
          animation: rotate 35s linear infinite;
          pointer-events: none;
        }

        .dev-card {
          position: relative;
          background: rgba(15, 20, 40, 0.8);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 28px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
          transition: all 0.4s ease;
        }

        .card-border-glow {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          padding: 3px;
          background: linear-gradient(135deg, #00ffff, #00ccff);
          mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask-composite: xor;
          pointer-events: none;
        }

        .card-icon {
          font-size: 34px;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #00ffff, #00ccff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .dev-card h3 {
          color: #00ffff;
          font-size: 23px;
          font-weight: 600;
          margin: 0 0 16px 0;
          text-shadow: 0 0 12px rgba(0, 255, 255, 0.6);
        }

        .dev-card p {
          color: #dddddd;
          line-height: 1.8;
          font-size: 16px;
          margin: 0;
        }

        .dev-card strong, .dev-card a {
          color: #00ffff;
          font-weight: 600;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }

        .dev-card a { text-decoration: none; }

        .dev-card:hover {
          transform: translateY(-8px);
          background: rgba(0, 255, 255, 0.08);
          box-shadow: 0 25px 60px rgba(0, 255, 255, 0.25);
        }

        .dev-thanks {
          text-align: center;
          margin-top: 50px;
          font-size: 19px;
          color: #aaaaaa;
          font-style: italic;
        }

        .spacer { flex-grow: 1; min-height: 80px; }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .dev-title { font-size: 32px; }
          .code-bracket { font-size: 48px; }
          .dev-cards-wrapper { padding: 28px 20px; }
          .dev-card { padding: 24px; margin-bottom: 24px; }
          .dev-card h3 { font-size: 21px; }
        }
      </style>
    `;

    devPage.innerHTML = devHTML;
    devPage.style.display = 'block';
  }

  categoryRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'Dev') {
        renderDevContent();
      } else {
        devPage.style.display = 'none';
        devPage.innerHTML = '';
        if (appList) appList.style.display = '';
      }
    });
  });

  const checked = document.querySelector('input[name="category"]:checked');
  if (checked && checked.value === 'Dev') {
    renderDevContent();
  }

});
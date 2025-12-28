// donet.js - Xử lý hiển thị danh sách người ủng hộ
class DonetSupporters {
    constructor() {
        this.supporters = [
            {
                id: 1,
                name: "binhbum",
                amount: 920000,
                avatar: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh7BEvLlT4cGMYBHTOxzPw4wV_3UJ5-DKYYBbDvBq3n-xDgmiyYSxL7Yi9EUuCAfVEpWZVjyfqMIEFG2Yuhv8WkAXAQO_HjPNjJqMRJWkIpCcNiG-PrVNsNRNLW9fNHwAU2o0bE1AzVeSk3AYl6v_N9lXd1EyLXenNDqsOQZneeyJHWNk-wy4WiTViN/s731/1717388034110.jpg",
                position: 1,
                coffeeCount: 184 // 920,000 / 5,000 = 184 cốc cafe
            },
            {
                id: 2,
                name: "Minh Quang",
                amount: 250000,
                avatar: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhXMWtXSCVrJahk-FdiCGSQnfIs_qMofuGCj4vj0iLL5m2hqOenNhCCTIUqYvMsnsQv78m19539bWKPLFgB9yfoditC_kymuRD5pQYXu_3tFP2zk9afBCkoY5IYcWk0WKK9r1RE9whozIEdnoWoz3H1ds8kuujnj6HwxulpsAtYIMfaL47uWfPdOEb_/s736/FB_IMG_1718503028383.jpg",
                position: 2,
                coffeeCount: 50
            },
            {
                id: 3,
                name: "Chill man",
                amount: 50000,
                avatar: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKeiOCtjnuask6Na3cSPPCUyT_XWU7jNWrCIz_ajDvIPRHzyNA7cj2XW7WQkfi1uS-Z4KB-1NKsmky-0sddKhAY2xkY2JogUwzsQZdMVLBFH98SBGG9N8JJIFZProBXfmzmCPEQQhfF8_asj4i5tvkXdAv68t9Q0wEqGyigKj3c5v3AtJBTSkz3_vv/s410/1719229224974.jpg",
                position: 3,
                coffeeCount: 10
            },
            {
                id: 4,
                name: "Nguyễn Minh",
                amount: 40000,
                avatar: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgSdas06b82IX1n-HZpNx42Ka7TUMVlyiulkzveGNfQoOm_bqwlD3tJHxYpiAvZWwxnob4xDP4GGmsRPIpmGWN7Vx34oVjPdTEJ2YfDbtY7SUx67JXimKBQ3rsh8Vbuje6RTzJr2jIdSGlWcaGBWxxQvOMGDj1aq12wYckISCV7XWB7_bo39KQJ3upomt0/s960/received_2172383483096181.jpeg",
                position: 4,
                coffeeCount: 8
            },
            {
                id: 5,
                name: "Nguyễn Linh",
                amount: 30000,
                avatar: "https://via.placeholder.com/50/2d6ae3/ffffff?text=NL",
                position: 5,
                coffeeCount: 6
            },
            {
                id: 6,
                name: "Phan Toàn",
                amount: 45000,
                avatar: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhTLeA42z82IlP44H4ejh7YlS7DNZ3iRMxNzAU3sWYdGdyyb9XnimqwObicUEcjhd1v2QdPnSUUtooK4cAhlhv5amlrEpFvQUvWeUntPWjTeIfZuoM3aGrjW5B4VDsg29ZG9xrfkxKe83iiye8RmX_qZqRctwRW7x2aC5EMpiR27XYSuYr-OAGryhbRQns/s562/FB_IMG_1715995593761.jpg",
                position: 6,
                coffeeCount: 9
            },
            {
                id: 7,
                name: "Thế hải",
                amount: 20000,
                avatar: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjlSdhyNcwuskDBhRlPoLgwOPrexfkNdG22JgX2hVNL12demn4807DNSDT8LWrsNZK9lZ-A40hlRTgwsI22PKrGXTsRKkWLaVjfY3oqP1SzjLB60bpEWLTq0bwcLzwXhppu8D2zaHzLHsviTIlEJ8j0mlFVmcgZnHyUu06VHrwpYG5JrG210saoVC3w3QI/s1080/FB_IMG_1716037109865.jpg",
                position: 7,
                coffeeCount: 4
            },
            {
                id: 8,
                name: "TuấnMP",
                amount: 10000,
                avatar: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiku1LrijtMFlfayL4glMqiNJ81GIZYL4Qn56lmA-d1WjiWv2Pp7ft7LMG82xALW59zezdL5wfJa11CatcRXWFcIkB64Pk7ZZyXnnHsQqQzLCRRRpeb8xH7vLgRkzLWh1J0p5NnkSRLTiKQvGu1u6_A8Onw5kXKQbT5VtUYl9LjSlAbLfKWEbYIbXW_/s1075/1718503815927.jpg",
                position: 8,
                coffeeCount: 2
            },
            {
                id: 9,
                name: "Hiếu Hướng",
                amount: 10000,
                avatar: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgyrYgKVvaxpBKvty2RvzRXUFfA8ifKZqkJUdjQ2c-LY7677GPvxiR2ESRvydaejqKpt6wvNP3kCRbd-W7aq_a6Uji2kbH5L5W6jqT70vEWXsISTb5aeNWFNTwbWdi5Y2lHoGwX2IXyl9Cd7WoTLpb2pW1gjPCKdNY-JS4pHChePkWb8OpMAbQm7lNu34k2/s736/Messenger_creation_D65EEC6D-DD3E-40AF-8D2F-051C66C40A3A.jpeg",
                position: 9,
                coffeeCount: 2
            }
        ];
        this.initialized = false;
        this.coffeePrice = 5000; // Giá 1 cốc cafe: 5,000đ
    }

    init() {
        if (this.initialized) return;
        
        console.log("Initializing Donet Supporters...");
        this.setupDonetListeners();
        this.initialized = true;
    }

    setupDonetListeners() {
        // Lắng nghe sự kiện khi chọn category Donet
        $(document).on('categoryFiltered', (event, category) => {
            if (category === 'Donet') {
                this.displayDonetPage();
            }
        });

        // Xử lý khi radio button Donet được chọn
        $('#donet').on('change', () => {
            if ($('#donet').is(':checked')) {
                this.displayDonetPage();
            }
        });
    }

    displayDonetPage() {
        const appList = $('.app-list');
        const loadingMessage = $('#loading-message');
        
        if (!appList.length) return;

        // Hiển thị loading
        loadingMessage.show();
        
        // Xóa nội dung cũ
        appList.empty();
        
        // Đợi một chút để tạo hiệu ứng
        setTimeout(() => {
            // Tạo HTML cho trang Donet
            const donetHTML = this.createDonetPage();
            appList.html(donetHTML);
            
            // Ẩn loading
            loadingMessage.hide();
            
            // Thêm hiệu ứng
            this.addAnimations();
            
            console.log("Donet page displayed");
        }, 500);
    }

    createDonetPage() {
        // Sắp xếp supporters theo amount giảm dần
        const sortedSupporters = [...this.supporters].sort((a, b) => b.amount - a.amount);
        
        // Tạo HTML cho danh sách supporters
        const supportersListHTML = sortedSupporters.map(supporter => {
            const formattedAmount = this.formatAmountWithCommas(supporter.amount);
            const positionClass = `position-${supporter.position <= 3 ? supporter.position : 'other'}`;
            
            return `
                <li class="supporter-item lq gl" data-id="${supporter.id}">
                    <div class="position ${positionClass}">${supporter.position}</div>
                    <img src="${supporter.avatar}" alt="${supporter.name}" class="avatar" />
                    <div class="supporter-info">
                        <div class="supporter-name">${supporter.name}</div>
                        <div class="amount-info">
                            <span class="amount-label">Đã ủng hộ:</span>
                            <span class="amount">${formattedAmount}đ</span>
                        </div>
                        <div class="coffee-info">
                            <i class="coffee-icon fas fa-coffee"></i>
                            <span class="coffee-count">${supporter.coffeeCount} cốc cafe</span>
                        </div>
                    </div>
                </li>
            `;
        }).join('');

        return `
            <div class="supporters-container lq gl">
                <div class="container-header">
                    <div class="header-icon">
                        <i class="fas fa-mug-hot"></i>
                    </div>
                    <h3>Coffee Supporters</h3>
                    <p>Những người đã mua cafe ủng hộ cho dự án.</p>
                    <div class="coffee-price-note">
                        <i class="fas fa-info-circle"></i>
                        Mỗi cốc cafe = 5,000đ
                    </div>
                </div>
                
                <ul class="supporters-list">
                    ${supportersListHTML}
                </ul>
                
                <!-- Nút ủng hộ -->
                <div class="donate-btn-container">
                    <button class="donate-btn" onclick="window.open('https://m.me/tokomikun', '_blank')">
                        <i class="fas fa-mug-hot"></i>
                        Mua cho tôi cốc cafe
                    </button>
                </div>
            </div>
        `;
    }

    formatAmountWithCommas(amount) {
        // Định dạng số với dấu phẩy ngăn cách hàng nghìn
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    addAnimations() {
        // Thêm hiệu ứng khi cuộn trang
        const supporterItems = $('.supporter-item');
        
        supporterItems.each((index, item) => {
            // Thêm hiệu ứng xuất hiện
            $(item).css({
                'opacity': '0',
                'transform': 'translateY(20px)'
            });
            
            setTimeout(() => {
                $(item).css({
                    'transition': 'all 0.5s ease',
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });
            }, index * 100);
        });
        
        // Hiệu ứng cho nút
        const donateBtn = $('.donate-btn');
        donateBtn.on('mouseenter', function() {
            $(this).css('transform', 'translateY(-2px)');
        });
        
        donateBtn.on('mouseleave', function() {
            $(this).css('transform', 'translateY(0)');
        });
        
        // Hiệu ứng hover cho supporter items
        supporterItems.hover(
            function() {
                $(this).css({
                    'transform': 'translateY(-3px)',
                    'box-shadow': '0 8px 20px rgba(0, 0, 0, 0.12)',
                    'border-color': '#d2691e',
                });
                $(this).find('.coffee-icon').addClass('animate-coffee');
            },
            function() {
                $(this).css({
                    'transform': 'translateY(0)',
                    'box-shadow': 'none',
                    'border-color': 'transparent',
                });
                $(this).find('.coffee-icon').removeClass('animate-coffee');
            }
        );
        
        // Hiệu ứng cho icon cafe
        $('.coffee-icon').hover(
            function() {
                $(this).css('transform', 'scale(1.2)');
            },
            function() {
                $(this).css('transform', 'scale(1)');
            }
        );
    }

    addSupporter(name, amount, avatar = null) {
        const coffeeCount = Math.floor(amount / this.coffeePrice);
        const newPosition = this.supporters.length + 1;
        const newSupporter = {
            id: newPosition,
            name: name,
            amount: amount,
            avatar: avatar || `https://via.placeholder.com/50/d2691e/ffffff?text=${name.charAt(0).toUpperCase()}`,
            position: newPosition,
            coffeeCount: coffeeCount
        };
        
        this.supporters.push(newSupporter);
        console.log(`Added new supporter: ${name} (${coffeeCount} cốc cafe)`);
        
        // Sắp xếp lại danh sách
        this.supporters.sort((a, b) => b.amount - a.amount);
        
        // Cập nhật lại position
        this.supporters.forEach((supporter, index) => {
            supporter.position = index + 1;
        });
        
        // Cập nhật giao diện nếu đang hiển thị
        const currentCategory = $('input[name="category"]:checked').val();
        if (currentCategory === 'Donet') {
            this.displayDonetPage();
        }
    }

    getTopSupporters(limit = 5) {
        return [...this.supporters]
            .sort((a, b) => b.amount - a.amount)
            .slice(0, limit);
    }

    getTotalAmount() {
        return this.supporters.reduce((sum, supporter) => sum + supporter.amount, 0);
    }
}

// Khởi tạo Donet Supporters
const donetSupporters = new DonetSupporters();

// Khởi tạo khi DOM sẵn sàng
$(document).ready(function() {
    // Đợi một chút để đảm bảo các script khác đã load
    setTimeout(() => {
        donetSupporters.init();
        
        // Kiểm tra nếu đang ở tab Donet
        if ($('#donet').is(':checked')) {
            donetSupporters.displayDonetPage();
        }
    }, 500);
});

// Thêm hàm global để truy cập từ các file khác
window.donetSupporters = donetSupporters;

// Hàm tiện ích để thêm supporter mới
function addNewSupporter(name, amount, avatar) {
    donetSupporters.addSupporter(name, amount, avatar);
}

// Hàm để lấy top supporters
function getTopSupporters(limit = 5) {
    return donetSupporters.getTopSupporters(limit);
}

// Hàm định dạng số với dấu phẩy
function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
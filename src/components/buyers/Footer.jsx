import React from 'react';
import '../../styles/components/buyer/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            {/* Chăm sóc khách hàng */}
            <div className="footer-column">
              <h3 className="footer-title">Chăm sóc khách hàng</h3>
              <ul className="footer-links">
                <li><a href="#">Trung tâm hỗ trợ</a></li>
                <li><a href="#">Shopee Blog</a></li>
                <li><a href="#">Shopee Mall</a></li>
                <li><a href="#">Hướng dẫn mua hàng</a></li>
                <li><a href="#">Hướng dẫn bán hàng</a></li>
                <li><a href="#">Thanh toán</a></li>
                <li><a href="#">Shopee Xu</a></li>
                <li><a href="#">Vận chuyển</a></li>
                <li><a href="#">Trả hàng & Hoàn tiền</a></li>
                <li><a href="#">Chăm sóc khách hàng</a></li>
                <li><a href="#">Chính sách bảo hành</a></li>
              </ul>
            </div>

            {/* Về Shopee */}
            <div className="footer-column">
              <h3 className="footer-title">Về Shopee</h3>
              <ul className="footer-links">
                <li><a href="#">Giới thiệu về Shopee Việt Nam</a></li>
                <li><a href="#">Tuyển dụng</a></li>
                <li><a href="#">Điều khoản Shopee</a></li>
                <li><a href="#">Chính sách bảo mật</a></li>
                <li><a href="#">Chính hãng</a></li>
                <li><a href="#">Kênh người bán</a></li>
                <li><a href="#">Flash Sales</a></li>
                <li><a href="#">Chương trình Tiếp thị liên kết Shopee</a></li>
                <li><a href="#">Liên hệ với truyền thông</a></li>
              </ul>
            </div>

            {/* Thanh toán */}
            <div className="footer-column">
              <h3 className="footer-title">Thanh toán</h3>
              <div className="payment-methods">
                <div className="payment-item">💳 Visa</div>
                <div className="payment-item">💳 Mastercard</div>
                <div className="payment-item">💳 JCB</div>
                <div className="payment-item">💳 AMEX</div>
                <div className="payment-item">🏦 COD</div>
                <div className="payment-item">💰 Trả góp</div>
                <div className="payment-item">📱 ShopeePay</div>
                <div className="payment-item">🏧 Internet Banking</div>
              </div>
            </div>

            {/* Đơn vị vận chuyển */}
            <div className="footer-column">
              <h3 className="footer-title">Đơn vị vận chuyển</h3>
              <div className="shipping-methods">
                <div className="shipping-item">🚚 Shopee Express</div>
                <div className="shipping-item">📦 Giao hàng tiết kiệm</div>
                <div className="shipping-item">🚛 GHN</div>
                <div className="shipping-item">🚐 Viettel Post</div>
                <div className="shipping-item">📮 Vietnam Post</div>
                <div className="shipping-item">🏃‍♂️ J&T Express</div>
                <div className="shipping-item">🚚 Grab Express</div>
                <div className="shipping-item">🚗 Ninja Van</div>
              </div>
            </div>

            {/* Theo dõi chúng tôi */}
            <div className="footer-column">
              <h3 className="footer-title">Theo dõi chúng tôi trên</h3>
              <ul className="footer-links">
                <li><a href="#">📘 Facebook</a></li>
                <li><a href="#">📷 Instagram</a></li>
                <li><a href="#">🔗 LinkedIn</a></li>
              </ul>
              
              <h3 className="footer-title" style={{marginTop: '20px'}}>Tải ứng dụng Shopee ngay thôi</h3>
              <div className="app-download">
                <div className="qr-code">
                  <div className="qr-placeholder">📱 QR Code</div>
                </div>
                <div className="download-links">
                  <a href="#" className="download-btn">
                    📱 App Store
                  </a>
                  <a href="#" className="download-btn">
                    🤖 Google Play
                  </a>
                  <a href="#" className="download-btn">
                    🍎 App Gallery
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>© 2024 Shopee. Tất cả các quyền được bảo lưu.</p>
            </div>
            <div className="location">
              <p>Quốc gia & Khu vực: Singapore | Indonesia | Thái Lan | Malaysia | Việt Nam | Philippines | Brazil | México | Colombia | Chile | Đài Loan</p>
            </div>
          </div>
          
          <div className="footer-info">
            <div className="company-info">
              <h4>Công ty TNHH Shopee</h4>
              <p>Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 29 đường Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình, Thành phố Hà Nội, Việt Nam. Tổng đài hỗ trợ: 19001221 - Email: cskh@hotro.shopee.vn</p>
              <p>Chịu Trách Nhiệm Quản Lý Nội Dung: Nguyễn Đức Trí - Điện thoại liên hệ: 024 73081221 (ext 4678)</p>
              <p>Mã số doanh nghiệp: 0106773786 do Sở Kế hoạch & Đầu tư TP Hà Nội cấp lần đầu ngày 10/02/2015</p>
              <p>© 2015 - Bản quyền thuộc về Công ty TNHH Shopee</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
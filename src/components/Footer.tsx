import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-brand-card border-t border-brand-primary/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
                <span className="text-white font-serif text-xl font-bold">F</span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-brand-primary">Fruit Haven</span>
            </Link>
            <p className="text-zinc-500 leading-relaxed">
              Mang đến những loại trái cây hữu cơ tươi ngon nhất, rực rỡ nhất từ các nhà vườn địa phương trực tiếp đến bàn ăn của bạn. Chất lượng bạn có thể cảm nhận, thiên nhiên bạn có thể tin tưởng.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-brand-primary/10 flex items-center justify-center text-brand-primary/60 hover:bg-brand-primary hover:text-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-brand-primary/10 flex items-center justify-center text-brand-primary/60 hover:bg-brand-primary hover:text-white transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-brand-primary/10 flex items-center justify-center text-brand-primary/60 hover:bg-brand-primary hover:text-white transition-all">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-bold text-brand-primary mb-6 uppercase tracking-widest text-xs">Liên Kết Nhanh</h4>
            <ul className="space-y-4">
              <li><Link to="/search" className="text-zinc-500 hover:text-brand-primary transition-colors">Tất Cả Sản Phẩm</Link></li>
              <li><Link to="/news" className="text-zinc-500 hover:text-brand-primary transition-colors">Tin Tức & Blog</Link></li>
              <li><Link to="/about" className="text-zinc-500 hover:text-brand-primary transition-colors">Về Chúng Tôi</Link></li>
              <li><Link to="/register" className="text-zinc-500 hover:text-brand-primary transition-colors">Đăng Ký Thành Viên</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-serif font-bold text-brand-primary mb-6 uppercase tracking-widest text-xs">Hỗ Trợ</h4>
            <ul className="space-y-4">
              <li><button onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))} className="text-zinc-500 hover:text-brand-primary transition-colors text-left">Tư vấn trực tuyến</button></li>
              <li><Link to="/track-order" className="text-zinc-500 hover:text-brand-primary transition-colors font-bold">Theo Dõi Đơn Hàng</Link></li>
              <li><Link to="/shipping-policy" className="text-zinc-500 hover:text-brand-primary transition-colors">Chính Sách Vận Chuyển</Link></li>
              <li><Link to="/refund-policy" className="text-zinc-500 hover:text-brand-primary transition-colors">Đổi Trả & Hoàn Tiền</Link></li>
              <li><Link to="/faq" className="text-zinc-500 hover:text-brand-primary transition-colors">Câu Hỏi Thường Gặp</Link></li>
              <li><Link to="/privacy-policy" className="text-zinc-500 hover:text-brand-primary transition-colors">Chính Sách Bảo Mật</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-serif font-bold text-brand-primary mb-6 uppercase tracking-widest text-xs">Hệ Thống Chi Nhánh</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-zinc-500">
                <MapPin size={18} className="text-brand-primary flex-shrink-0 mt-1" />
                <div className="text-xs space-y-2">
                  <p><span className="font-bold text-brand-primary">HẢI PHÒNG (Chính):</span> TDP 6, Hòa Bình</p>
                  <p><span className="font-bold text-brand-primary">HÀ NỘI:</span> 15 Duy Tân, Cầu Giấy</p>
                  <p><span className="font-bold text-brand-primary">HỒ CHÍ MINH:</span> 285 CMT8, Quận 10</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-zinc-500">
                <Phone size={18} className="text-brand-primary flex-shrink-0" />
                <span className="text-xs">0397 225 824 - 0898 281 880</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-500">
                <Mail size={18} className="text-brand-primary flex-shrink-0" />
                <span className="text-xs">fruithaven@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-brand-primary/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-400">
          <p>© 2026 Fruit Haven. Bảo lưu mọi quyền.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-primary transition-colors">Điều Khoản Dịch Vụ</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Cài Đặt Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

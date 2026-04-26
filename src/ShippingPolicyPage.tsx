import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, MapPin, Zap, ShieldCheck, Info, Clock } from 'lucide-react';

export default function ShippingPolicyPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-32 bg-brand-background min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-brand-primary/70 hover:text-brand-primary transition-colors mb-10"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Quay lại</span>
        </button>

        <div className="space-y-16">
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <span className="inline-block px-4 py-1.5 bg-brand-primary/5 text-xs font-bold uppercase tracking-widest text-brand-primary rounded-full">
              Dịch Vụ Khách Hàng
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-primary leading-tight">
              Chính Sách <br />
              <span className="italic text-brand-primary/70">Vận Chuyển & Giao Hàng</span>
            </h1>
          </motion.div>

          {/* Quick Summary Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-brand-card p-6 rounded-3xl border border-brand-primary/5 text-center space-y-2">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mx-auto">
                <Zap size={20} />
              </div>
              <p className="text-xs font-bold uppercase tracking-tighter text-brand-primary/40">Nội thành HP</p>
              <p className="text-2xl font-serif font-bold text-brand-primary">Trong 24h</p>
            </div>
            <div className="bg-brand-card p-6 rounded-3xl border border-brand-primary/5 text-center space-y-2">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mx-auto">
                <Truck size={20} />
              </div>
              <p className="text-xs font-bold uppercase tracking-tighter text-brand-primary/40">Miễn phí ship</p>
              <p className="text-2xl font-serif font-bold text-brand-primary">Đơn {'>'} 500k</p>
            </div>
            <div className="bg-brand-card p-6 rounded-3xl border border-brand-primary/5 text-center space-y-2">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mx-auto">
                <ShieldCheck size={20} />
              </div>
              <p className="text-xs font-bold uppercase tracking-tighter text-brand-primary/40">Đảm bảo</p>
              <p className="text-2xl font-serif font-bold text-brand-primary">Tươi Ngon</p>
            </div>
          </motion.div>

          <div className="bg-brand-card rounded-[48px] p-10 md:p-16 border border-brand-primary/5 shadow-2xl shadow-brand-primary/5 space-y-12">
            {/* Section 1 */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-4 text-brand-primary">
                <MapPin size={32} />
                <h2 className="text-2xl font-serif font-bold">1. Phạm vi giao hàng</h2>
              </div>
              <div className="text-zinc-600 space-y-4 leading-relaxed">
                <p>Fruit Haven tự hào cung cấp dịch vụ giao hàng tận nơi trên toàn quốc, với quy trình đóng gói chuyên dụng cho trái cây tươi:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><span className="font-bold text-brand-primary">Khu vực Hải Phòng:</span> Giao hàng hỏa tốc trong tất cả các quận nội thành.</li>
                  <li><span className="font-bold text-brand-primary">Các tỉnh thành khác:</span> Giao hàng qua đối tác vận chuyển chuyên nghiệp (GHTK, Viettel Post) với thùng xốp bảo quản lạnh.</li>
                </ul>
              </div>
            </motion.div>

            {/* Section 2 */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-4 text-brand-primary">
                <Clock size={32} />
                <h2 className="text-2xl font-serif font-bold">2. Thời gian giao hàng</h2>
              </div>
              <div className="text-zinc-600 space-y-4 leading-relaxed">
                <p>Chúng tôi luôn nỗ lực để sản phẩm đến tay khách hàng nhanh nhất nhằm đảm bảo độ tươi ngon:</p>
                <ul className="space-y-3">
                  <li><span className="font-bold text-brand-primary">Đơn hàng nội thành HP:</span> Giao trong vòng 2-4 giờ kể từ khi xác nhận đơn (đặt trước 16h).</li>
                  <li><span className="font-bold text-brand-primary">Đơn hàng tỉnh:</span> Từ 1-3 ngày làm việc tùy vào khoảng cách địa lý.</li>
                </ul>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                  <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800 italic">Thời gian giao hàng có thể thay đổi do điều kiện thời tiết hoặc các sự cố khách quan từ đơn vị vận chuyển.</p>
                </div>
              </div>
            </motion.div>

            {/* Section 3 */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-4 text-brand-primary">
                <Truck size={32} />
                <h2 className="text-2xl font-serif font-bold">3. Biểu phí vận chuyển</h2>
              </div>
              <div className="text-zinc-600 space-y-4 leading-relaxed">
                <div className="p-8 bg-brand-primary/5 rounded-[32px] border border-brand-primary/10">
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center border-b border-brand-primary/5 pb-2">
                      <span>Đơn hàng trên 500.000đ</span>
                      <span className="font-bold text-brand-primary">MIỄN PHÍ</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-brand-primary/5 pb-2">
                      <span>Nội thành Hải Phòng</span>
                      <span className="font-bold text-brand-primary">20.000đ - 30.000đ</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Các khu vực khác</span>
                      <span className="font-bold text-brand-primary">Theo phí bưu điện</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
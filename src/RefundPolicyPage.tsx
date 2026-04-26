import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, RotateCcw, Clock, CreditCard, AlertCircle } from 'lucide-react';

export default function RefundPolicyPage() {
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
              <span className="italic text-brand-primary/70">Đổi Trả & Hoàn Tiền</span>
            </h1>
          </motion.div>

          {/* Quick Summary Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-brand-card p-6 rounded-3xl border border-brand-primary/5 text-center space-y-2">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mx-auto">
                <AlertCircle size={20} />
              </div>
              <p className="text-xs font-bold uppercase tracking-tighter text-brand-primary/40">Thông báo trong</p>
              <p className="text-2xl font-serif font-bold text-brand-primary">48 Giờ</p>
            </div>
            <div className="bg-brand-card p-6 rounded-3xl border border-brand-primary/5 text-center space-y-2">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mx-auto">
                <RotateCcw size={20} />
              </div>
              <p className="text-xs font-bold uppercase tracking-tighter text-brand-primary/40">Gửi trả trong</p>
              <p className="text-2xl font-serif font-bold text-brand-primary">14 Ngày</p>
            </div>
            <div className="bg-brand-card p-6 rounded-3xl border border-brand-primary/5 text-center space-y-2">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mx-auto">
                <CreditCard size={20} />
              </div>
              <p className="text-xs font-bold uppercase tracking-tighter text-brand-primary/40">Hoàn tiền trong</p>
              <p className="text-2xl font-serif font-bold text-brand-primary">07 Ngày</p>
            </div>
          </motion.div>

          <div className="bg-brand-card rounded-[48px] p-10 md:p-16 border border-brand-primary/5 shadow-2xl shadow-brand-primary/5 space-y-12">
            {/* Section 1 */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-4 text-brand-primary">
                <ShieldCheck size={32} />
                <h2 className="text-2xl font-serif font-bold">1. Điều kiện đổi trả</h2>
              </div>
              <div className="text-zinc-600 space-y-4 leading-relaxed">
                <p>Để đảm bảo quyền lợi, Quý khách vui lòng kiểm tra kỹ tình trạng hàng hóa và có thể yêu cầu đổi/trả ngay tại thời điểm giao nhận nếu:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Giao hàng không chính xác về chủng loại hoặc mã sản phẩm so với yêu cầu đã xác nhận.</li>
                  <li>Số lượng sản phẩm thực tế nhận được ít hơn so với thông tin trong đơn hàng.</li>
                  <li>Phát hiện các hư hỏng vật lý bên ngoài như rách bao bì, vỡ nát hoặc móp méo.</li>
                </ul>
                <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex gap-3">
                  <AlertCircle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800 italic">Quý khách vui lòng cung cấp video/hình ảnh mở hộp hoặc hóa đơn liên quan để chứng minh sự thiếu sót.</p>
                </div>
              </div>
            </motion.div>

            {/* Section 2 */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-4 text-brand-primary">
                <Clock size={32} />
                <h2 className="text-2xl font-serif font-bold">2. Quy định về thời gian</h2>
              </div>
              <div className="text-zinc-600 space-y-4 leading-relaxed">
                <ul className="space-y-3">
                  <li><span className="font-bold text-brand-primary">Thời gian thông báo đổi trả:</span> trong vòng 48h kể từ khi nhận sản phẩm (đối với hàng thiếu phụ kiện hoặc bể vỡ).</li>
                  <li><span className="font-bold text-brand-primary">Thời gian gửi chuyển trả sản phẩm:</span> trong vòng 14 ngày kể từ khi nhận sản phẩm.</li>
                  <li><span className="font-bold text-brand-primary">Địa điểm đổi trả:</span> Quý khách có thể mang trực tiếp đến cửa hàng Fruit Haven hoặc gửi qua đường bưu điện.</li>
                </ul>
                <p>Mọi thắc mắc hoặc khiếu nại về chất lượng, vui lòng liên hệ hotline chăm sóc khách hàng để được xử lý nhanh nhất.</p>
              </div>
            </motion.div>

            {/* Section 3 */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-4 text-brand-primary">
                <CreditCard size={32} />
                <h2 className="text-2xl font-serif font-bold">3. Hình thức đổi trả</h2>
              </div>
              <div className="text-zinc-600 space-y-4 leading-relaxed">
                <div className="p-8 bg-brand-primary/5 rounded-[32px] border border-brand-primary/10">
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <RotateCcw size={20} className="shrink-0 mt-1 text-brand-primary" />
                      <span>Chúng tôi thực hiện đổi sản phẩm đúng loại khách hàng đã đặt cho các trường hợp giao sai hàng hoặc hàng không đạt cam kết.</span>
                    </li>
                    <li className="flex gap-3">
                      <RotateCcw size={20} className="shrink-0 mt-1 text-brand-primary" />
                      <span>Trường hợp hết hàng, chúng tôi hỗ trợ đổi sang sản phẩm khác có giá trị tương đương hoặc hoàn tiền theo yêu cầu.</span>
                    </li>
                  </ul>
                </div>
                <p>Việc hoàn phí sẽ được thực hiện qua chuyển khoản hoặc phương thức thỏa thuận <span className="font-bold text-brand-primary underline decoration-brand-primary/30">trong vòng 07 ngày làm việc</span> kể từ khi nhận được yêu cầu hợp lệ.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

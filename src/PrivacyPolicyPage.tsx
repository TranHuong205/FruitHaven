import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, Database, ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.section 
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

        <div className="space-y-12">
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h1 className="text-5xl font-serif font-bold text-brand-primary">Chính Sách <span className="italic text-brand-primary/70">Bảo Mật</span></h1>
            <p className="text-zinc-500">Cập nhật lần cuối: 27/03/2026</p>
          </motion.div>

          <div className="bg-brand-card rounded-[48px] p-10 md:p-16 border border-brand-primary/5 shadow-2xl shadow-brand-primary/5 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-brand-primary">
                <Database size={28} />
                <h2 className="text-2xl font-serif font-bold">1. Thu thập thông tin</h2>
              </div>
              <p className="text-zinc-600 leading-relaxed">
                Chúng tôi thu thập thông tin cá nhân khi bạn đăng ký tài khoản, đặt hàng hoặc liên hệ với chúng tôi. Thông tin bao gồm: Họ tên, email, số điện thoại và địa chỉ giao hàng.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-brand-primary">
                <Eye size={28} />
                <h2 className="text-2xl font-serif font-bold">2. Sử dụng thông tin</h2>
              </div>
              <p className="text-zinc-600 leading-relaxed">
                Thông tin của bạn được sử dụng để xử lý đơn hàng, cung cấp dịch vụ hỗ trợ khách hàng và gửi thông báo về các ưu đãi đặc biệt (nếu bạn đồng ý).
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-brand-primary">
                <Lock size={28} />
                <h2 className="text-2xl font-serif font-bold">3. Bảo mật dữ liệu</h2>
              </div>
              <p className="text-zinc-600 leading-relaxed">
                Fruit Haven áp dụng các biện pháp mã hóa SSL chuẩn công nghiệp để bảo vệ dữ liệu cá nhân của bạn trong quá trình truyền tải và lưu trữ.
              </p>
            </div>

            <div className="p-6 bg-brand-primary/5 rounded-3xl border border-brand-primary/10 flex gap-4">
              <ShieldCheck className="text-brand-primary shrink-0" size={24} />
              <p className="text-sm text-brand-primary/80 italic">
                Chúng tôi cam kết không bán hoặc chia sẻ thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích tiếp thị mà không có sự đồng ý của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
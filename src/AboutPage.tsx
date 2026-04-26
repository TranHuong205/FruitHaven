import React, { useEffect } from 'react';
import { motion } from 'motion/react';

export default function AboutPage() {
  useEffect(() => {
    document.title = 'Câu chuyện của chúng tôi | Fruit Haven';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Tìm hiểu về hành trình nuôi dưỡng sự tươi ngon từ năm 2026 của Fruit Haven và sứ mệnh nông nghiệp bền vững.');
  }, []);

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-32 bg-brand-background min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200" 
                alt="Trang Trại Của Chúng Tôi" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-brand-primary p-8 rounded-[32px] text-white shadow-xl hidden md:block">
              <p className="text-2xl font-serif font-bold uppercase">Khởi nguồn</p>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80 text-center">Tươi Ngon</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-brand-primary/60 block">
              Câu Chuyện Của Chúng Tôi
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-primary leading-tight">
              Nuôi Dưỡng <span className="italic">Sự Tươi Ngon</span> <br />
              Từ Năm 2026.
            </h1>
            <p className="text-zinc-500 leading-relaxed text-lg">
              Bắt đầu từ một vườn cây gia đình nhỏ, chúng tôi đã phát triển thành một cộng đồng những người nông dân hữu cơ tận tâm. Hiện nay, Fruit Haven tự hào có mặt tại 3 thành phố lớn: Hải Phòng (Trụ sở chính), Hà Nội và TP. Hồ Chí Minh, mang những gì tốt nhất của thiên nhiên đến ngôi nhà của bạn.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <h4 className="font-serif font-bold text-brand-primary text-xl mb-2">100% Hữu Cơ</h4>
                <p className="text-sm text-zinc-400">Không thuốc trừ sâu hay phân bón tổng hợp.</p>
              </div>
              <div>
                <h4 className="font-serif font-bold text-brand-primary text-xl mb-2">Nguồn Gốc Địa Phương</h4>
                <p className="text-sm text-zinc-400">Hỗ trợ nông dân và cộng đồng địa phương.</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-brand-card rounded-3xl border border-brand-primary/5">
            <h3 className="text-xl font-serif font-bold text-brand-primary mb-4">Sứ Mệnh</h3>
            <p className="text-sm text-zinc-500">Cung cấp nguồn dinh dưỡng sạch nhất từ thiên nhiên đến bàn ăn của mọi gia đình Việt.</p>
          </div>
          <div className="p-8 bg-brand-card rounded-3xl border border-brand-primary/5">
            <h3 className="text-xl font-serif font-bold text-brand-primary mb-4">Tầm Nhìn</h3>
            <p className="text-sm text-zinc-500">Trở thành biểu tượng của nông nghiệp bền vững và chuỗi cung ứng trái cây hữu cơ hàng đầu.</p>
          </div>
          <div className="p-8 bg-brand-card rounded-3xl border border-brand-primary/5">
            <h3 className="text-xl font-serif font-bold text-brand-primary mb-4">Giá Trị Cốt Lõi</h3>
            <p className="text-sm text-zinc-500">Trung thực trong canh tác, tận tâm trong phục vụ và bền vững trong phát triển.</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
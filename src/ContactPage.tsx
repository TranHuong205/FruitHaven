import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, ExternalLink } from 'lucide-react';

interface ContactPageProps {
  addToast: (message: string) => void;
}

export default function ContactPage({ addToast }: ContactPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    document.title = 'Liên hệ với chúng tôi | Fruit Haven';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Kết nối với hệ thống chi nhánh Fruit Haven tại Hải Phòng, Hà Nội, TP. HCM để được hỗ trợ hỏa tốc.');
  }, []);

  // Dữ liệu chi nhánh
  const branches = [
    {
      city: "HẢI PHÒNG",
      isMain: true,
      address: "TDP 6, Phường Hòa Bình, TP. Hải Phòng",
      phone: "0397 225 824",
      mapUrl: "https://www.google.com/maps/dir/?api=1&destination=Hòa+Bình,+Dương+Kinh,+Hải+Phòng"
    },
    {
      city: "HÀ NỘI",
      isMain: false,
      address: "Số 15, Phố Duy Tân, Cầu Giấy, Hà Nội",
      phone: "0898 281 880",
      mapUrl: "https://www.google.com/maps/dir/?api=1&destination=Duy+Tân,+Cầu+Giấy,+Hà Nội"
    },
    {
      city: "HỒ CHÍ MINH",
      isMain: false,
      address: "285 Cách Mạng Tháng Tám, Quận 10, TP. HCM",
      phone: "0397 225 824",
      mapUrl: "https://www.google.com/maps/dir/?api=1&destination=285+Cách+Mạng+Tháng+Tám,+Quận+10,+TP+HCM"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Giả lập quá trình gửi dữ liệu trong 1.5 giây
    setTimeout(() => {
      addToast("Tin nhắn của bạn đã được gửi thành công!");
      setIsSubmitting(false);
      setShowFireworks(true);
      (e.target as HTMLFormElement).reset(); // Xóa sạch form sau khi gửi

      // Tắt hiệu ứng pháo hoa sau 2 giây
      setTimeout(() => setShowFireworks(false), 2000);
    }, 1500);
  };

  // Tạo dữ liệu cho 30 hạt pháo hoa với các hướng ngẫu nhiên
  const particles = useMemo(() => Array.from({ length: 30 }), []);

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-32 bg-brand-background min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary/60 mb-4 block">
            Kết Nối Với Chúng Tôi
          </span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-primary">
            Liên <span className="italic">Hệ</span>.
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Thông tin liên hệ */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold text-brand-primary leading-tight">
                FRUIT HAVEN - <br />
                <span className="italic text-brand-primary/70">Trái Cây Tươi Sạch</span>
              </h2>
              <p className="text-zinc-500 text-lg leading-relaxed">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với Fruit Haven qua bất kỳ kênh nào dưới đây.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="p-8 bg-brand-primary/5 rounded-[32px] border border-brand-primary/10">
                <h3 className="text-xl font-serif font-bold text-brand-primary mb-6 flex items-center gap-2">
                  <MapPin size={24} /> Hệ thống chi nhánh
                </h3>
                <div className="space-y-8">
                  {branches.map((branch, idx) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-brand-primary/20">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-brand-primary">{branch.city}</h4>
                        {branch.isMain && (
                          <span className="px-2 py-0.5 bg-brand-primary text-white text-[8px] font-bold uppercase tracking-widest rounded-full">Trụ sở chính</span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-500 mb-2">{branch.address}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-medium text-zinc-400 flex items-center gap-1">
                          <Phone size={12} /> {branch.phone}
                        </span>
                        <a 
                          href={branch.mapUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:underline flex items-center gap-1"
                        >
                          Chỉ đường <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shrink-0 shadow-sm">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-primary mb-1">Tổng đài CSKH</h4>
                    <p className="text-sm text-zinc-500">0397 225 824</p>
                    <p className="text-sm text-zinc-500">1900 66xx (Sắp ra mắt)</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shrink-0 shadow-sm">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-primary mb-1">Hợp tác & Khiếu nại</h4>
                    <p className="text-sm text-zinc-500">fruithaven@gmail.com</p>
                    <p className="text-sm text-zinc-500">gautructv2000@gmail.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shrink-0 shadow-sm">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-primary mb-1">Phục vụ khách hàng</h4>
                    <p className="text-sm text-zinc-500">Thứ 2 - Chủ Nhật</p>
                    <p className="text-sm text-zinc-500">Mở cửa: 07:00 - 22:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form liên hệ */}
          <div className="bg-brand-card p-10 rounded-[48px] border border-brand-primary/5 shadow-2xl shadow-brand-primary/5">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Tên của bạn</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Nguyễn Văn A" 
                    className="w-full px-6 py-4 bg-brand-background border border-brand-primary/10 rounded-3xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Số điện thoại</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="0397..." 
                    className="w-full px-6 py-4 bg-brand-background border border-brand-primary/10 rounded-3xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Địa chỉ Email</label>
                <input 
                  type="email" 
                  required 
                  placeholder="example@gmail.com" 
                  className="w-full px-6 py-4 bg-brand-background border border-brand-primary/10 rounded-3xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Lời nhắn</label>
                <textarea 
                  required 
                  placeholder="Bạn muốn nhắn nhủ điều gì đến Fruit Haven?" 
                  rows={5} 
                  className="w-full px-6 py-4 bg-brand-background border border-brand-primary/10 rounded-[32px] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none"
                ></textarea>
              </div>
              <button 
                disabled={isSubmitting}
                type="submit" 
                className="w-full py-5 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi Yêu Cầu"}
                {!isSubmitting && <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              </button>
            </form>
          </div>
        </div>

        {/* Google Maps Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 rounded-[48px] overflow-hidden shadow-2xl shadow-brand-primary/5 border border-brand-primary/5 h-[450px]"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d59616.438510808525!2d106.64335800000001!3d20.8404415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a7af27918b951%3A0x673199d21469796!2zSMOyYSBCw6xuaCwgRMawxqFuZyBLaW5oLCBI4bqjaSBQaMOYbmcsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1711545600000!5m2!1svi!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Vị trí Fruit Haven"
          ></iframe>
        </motion.div>
      </div>

      {/* Hiệu ứng pháo hoa nhẹ */}
      <AnimatePresence>
        {showFireworks && (
          <div className="fixed inset-0 pointer-events-none z-[300] flex items-center justify-center">
            {particles.map((_, i) => {
              const angle = (i / 30) * Math.PI * 2;
              const velocity = 100 + Math.random() * 250;
              const colors = ['#4F6F52', '#F8C794', '#FF8080', '#A8E6CF']; // Màu sắc thương hiệu và trái cây
              
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos(angle) * velocity,
                    y: Math.sin(angle) * velocity,
                    opacity: [1, 1, 0]
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
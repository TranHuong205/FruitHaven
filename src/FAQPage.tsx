import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, HelpCircle, Search, X } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Trái cây của Fruit Haven có nguồn gốc từ đâu?",
    answer: "Trái cây của chúng tôi được tuyển chọn trực tiếp từ các nhà vườn đạt chuẩn hữu cơ tại Hải Phòng, Đà Lạt và một số loại trái cây nhập khẩu cao cấp có chứng chỉ GlobalGAP."
  },
  {
    question: "Làm sao để tôi biết trái cây vẫn còn tươi khi giao đến?",
    answer: "Chúng tôi áp dụng quy trình 'Hái sáng - Giao chiều'. Đối với các đơn hàng xa, Fruit Haven sử dụng thùng xốp cách nhiệt và đá khô chuyên dụng để duy trì nhiệt độ tối ưu."
  },
  {
    question: "Tôi có thể kiểm tra hàng trước khi thanh toán không?",
    answer: "Hoàn toàn có thể. Fruit Haven khuyến khích khách hàng kiểm tra kỹ chủng loại và độ tươi ngon của sản phẩm ngay khi nhận hàng trước khi thanh toán cho shipper."
  },
  {
    question: "Chính sách đổi trả của cửa hàng như thế nào?",
    answer: "Nếu sản phẩm bị dập nát, hư hỏng do vận chuyển hoặc không đúng mô tả, bạn có thể yêu cầu đổi trả trong vòng 48h. Vui lòng giữ lại hóa đơn và chụp ảnh sản phẩm lỗi."
  },
  {
    question: "Fruit Haven có giao hàng vào ngày lễ không?",
    answer: "Chúng tôi hoạt động tất cả các ngày trong tuần, kể cả ngày lễ và Chủ Nhật (từ 08:00 - 21:00) để đảm bảo bạn luôn có trái cây tươi thưởng thức."
  }
];

export default function FAQPage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(
    faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-32 bg-brand-background min-h-screen"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-brand-primary/70 hover:text-brand-primary transition-colors mb-10"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Quay lại</span>
        </button>

        <div className="text-center mb-16 space-y-4">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mx-auto mb-6">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-5xl font-serif font-bold text-brand-primary leading-tight">
            Câu Hỏi <br />
            <span className="italic text-brand-primary/70">Thường Gặp</span>
          </h1>
          <p className="text-zinc-500">Mọi thứ bạn cần biết về sản phẩm và dịch vụ của chúng tôi.</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12 max-w-xl mx-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary/40" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setOpenIndex(null); // Đóng các mục đang mở khi tìm kiếm để tránh nhầm lẫn
            }}
            className="w-full pl-14 pr-12 py-4 bg-brand-card border border-brand-primary/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-brand-primary placeholder:text-brand-primary/30"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setOpenIndex(null);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-brand-primary/40 hover:text-brand-primary transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className="bg-brand-card rounded-[32px] border border-brand-primary/5 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left transition-colors hover:bg-brand-primary/5"
                >
                  <span className="text-lg font-bold text-brand-primary pr-8 leading-tight">
                    {faq.question}
                  </span>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                    isOpen ? "bg-brand-primary text-white rotate-180" : "bg-brand-primary/10 text-brand-primary"
                  )}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-8 pb-8 pt-2 text-zinc-500 leading-relaxed">
                        <div className="h-px bg-brand-primary/10 mb-6 w-12" />
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-brand-primary/5 rounded-[40px] border border-dashed border-brand-primary/20"
            >
              <p className="text-zinc-500 italic">Không tìm thấy câu hỏi nào phù hợp với "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-brand-primary font-bold uppercase tracking-widest text-xs hover:underline"
              >
                Xóa tìm kiếm
              </button>
            </motion.div>
          )}
        </div>

        <div className="mt-20 p-10 bg-brand-primary text-white rounded-[40px] text-center space-y-6 shadow-xl shadow-brand-primary/20">
          <h3 className="text-2xl font-serif font-bold">Vẫn còn thắc mắc?</h3>
          <p className="opacity-80 text-sm max-w-sm mx-auto">
            Đội ngũ hỗ trợ của Fruit Haven luôn sẵn sàng giúp đỡ bạn qua các kênh liên lạc trực tiếp.
          </p>
          <button 
            onClick={() => navigate('/contact')}
            className="px-8 py-4 bg-white text-brand-primary rounded-full font-bold uppercase tracking-widest text-xs hover:bg-orange-50 transition-all"
          >
            Liên hệ ngay
          </button>
        </div>
      </div>
    </motion.section>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
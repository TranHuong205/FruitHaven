import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, ArrowRight, Truck, ArrowLeft } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      // Đảm bảo mã đơn hàng có dấu # nếu người dùng quên nhập
      const cleanId = orderId.trim().startsWith('#') ? orderId.trim() : `#${orderId.trim()}`;
      navigate(`/order/${encodeURIComponent(cleanId)}`);
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-32 bg-brand-background min-h-screen flex items-center justify-center px-4"
    >
      <div className="max-w-md w-full bg-brand-card p-8 md:p-12 rounded-[48px] card-shadow border border-brand-primary/5 text-center">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-brand-primary/60 hover:text-brand-primary transition-colors mb-8 mx-auto text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Quay lại cửa hàng
        </button>

        <div className="w-20 h-20 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-8">
          <Truck size={40} />
        </div>
        
        <h1 className="text-4xl font-serif font-bold text-brand-primary mb-4">Theo dõi đơn hàng</h1>
        <p className="text-zinc-500 mb-10 italic leading-relaxed">Nhập mã đơn hàng (ví dụ: #FH-123456) để cập nhật hành trình tươi sạch của bạn. Mã đơn hàng được gửi trong email xác nhận hoặc hiển thị sau khi đặt hàng.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Package className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary/40" size={20} />
            <input 
              type="text" 
              placeholder="Mã đơn hàng (VD: #FH-123456)" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
              className="w-full pl-14 pr-6 py-4 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>
          <button type="submit" className="w-full py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg flex items-center justify-center gap-2 group">
            Tra cứu ngay
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </motion.section>
  );
}
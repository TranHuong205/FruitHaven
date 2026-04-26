import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, ShieldAlert } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="py-32 bg-brand-background min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-8"
      >
        <AlertTriangle size={48} />
      </motion.div>
      <h1 className="text-6xl font-serif font-bold text-brand-primary mb-4">404</h1>
      <h2 className="text-2xl font-serif font-bold text-brand-primary mb-6">Trang không tồn tại</h2>
      <p className="text-zinc-500 mb-10 max-w-md italic">Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang yêu cầu. Có thể đường dẫn đã bị hỏng hoặc đã bị xóa.</p>
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-primary/90 transition-all shadow-lg"
      >
        <Home size={18} /> Quay lại trang chủ
      </button>
    </div>
  );
}

export function AccessDeniedPage() {
  const navigate = useNavigate();
  return (
    <div className="py-32 bg-brand-background min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <motion.div 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-8"
      >
        <ShieldAlert size={48} />
      </motion.div>
      <h2 className="text-3xl font-serif font-bold text-brand-primary mb-4">Truy cập bị chặn</h2>
      <p className="text-zinc-500 mb-10 max-w-sm">Bạn không có đủ quyền hạn để truy cập vào khu vực quản trị này.</p>
      <button 
        onClick={() => navigate('/')}
        className="px-8 py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest text-xs shadow-lg"
      >
        Quay lại trang chủ
      </button>
    </div>
  );
}
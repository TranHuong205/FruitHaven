import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Chrome, Facebook } from 'lucide-react';
import { User } from './types';
import { checkIsAdmin } from './lib/auth';
import { hashPassword } from './lib/security';

interface LoginPageProps {
  onLogin: (user: User, remember: boolean) => void;
  registeredUsers: User[];
  addToast: (message: string) => void;
}

export default function LoginPage({ onLogin, registeredUsers, addToast }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Loại bỏ khoảng trắng thừa ở email và so sánh không phân biệt hoa thường
    const cleanEmail = email.trim().toLowerCase();
    const userMatch = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (userMatch) {
      const isPlainMatch = userMatch.password === password;
      const hashedInput = await hashPassword(password);
      const isHashMatch = userMatch.password === hashedInput;

      if (isPlainMatch || isHashMatch) {
        // Nếu khớp (kể cả qua mã băm), ta sử dụng mật khẩu thuần túy để cập nhật lại hệ thống
        const updatedUser = { ...userMatch, password: password };
        onLogin(updatedUser, rememberMe);
        addToast(`Chào mừng trở lại, ${userMatch.name}!`);
        
        // Ưu tiên quay lại trang cũ (ví dụ: /checkout) nếu có, 
        // nếu không mới chuyển vào Profile hoặc Admin
        const destination = location.state?.from?.pathname || (checkIsAdmin(userMatch) ? '/admin' : '/profile');
        navigate(destination, { replace: true });
      } else {
        addToast("Mật khẩu không chính xác. Vui lòng thử lại!");
      }
    } else {
      addToast("Tài khoản chưa được đăng ký. Vui lòng tạo tài khoản mới!");
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-32 bg-brand-background min-h-screen flex items-center justify-center px-4"
    >
      <div className="max-w-md w-full bg-brand-card p-8 md:p-12 rounded-[48px] card-shadow border border-brand-primary/5">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif font-bold text-brand-primary mb-2">Chào mừng trở lại</h2>
          <p className="text-zinc-500 italic">Đăng nhập để tiếp tục hành trình tươi sạch.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Email</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary/40" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-14 pr-6 py-4 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary/40" size={20} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-4 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-primary/40 hover:text-brand-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-brand-primary/20 text-brand-primary focus:ring-brand-primary/20 cursor-pointer" 
              />
              <span className="text-xs font-medium text-zinc-500 group-hover:text-brand-primary transition-colors">Ghi nhớ tôi</span>
            </label>
            <button 
              type="button" 
              onClick={() => addToast("Chức năng khôi phục mật khẩu đang được bảo trì. Vui lòng liên hệ hỗ trợ!")}
              className="text-xs font-bold text-brand-primary hover:underline"
            >Quên mật khẩu?</button>
          </div>

          <button type="submit" className="w-full py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 group">
            Đăng nhập
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-primary/10"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-brand-card px-4 text-zinc-400 font-bold tracking-widest">Hoặc đăng nhập với</span></div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-3 border border-brand-primary/10 rounded-full hover:bg-brand-primary/5 transition-all text-sm font-bold text-brand-primary/70">
            <Chrome size={18} /> Google
          </button>
          <button className="flex items-center justify-center gap-2 py-3 border border-brand-primary/10 rounded-full hover:bg-brand-primary/5 transition-all text-sm font-bold text-brand-primary/70">
            <Facebook size={18} /> Facebook
          </button>
        </div>

        <p className="text-center mt-8 text-sm text-zinc-500">
          Chưa có tài khoản? <Link to="/register" className="text-brand-primary font-bold hover:underline">Đăng ký ngay</Link>
        </p>
      </div>
    </motion.section>
  );
}
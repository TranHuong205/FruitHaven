import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ArrowRight, Phone, Eye, EyeOff, ShieldCheck, Chrome, Facebook, Camera } from 'lucide-react';
import { User } from './types';

interface RegisterPageProps {
  onRegister: (user: User) => void;
}

export default function RegisterPage({ onRegister }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (!agreeTerms) {
      setError('Bạn cần đồng ý với điều khoản sử dụng!');
      return;
    }

    // Giả lập quá trình đăng ký tài khoản
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      avatar: avatar,
      address: '',
      birthday: '',
      gender: 'Nam'
    };
    onRegister(newUser);
    navigate('/login');
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-32 bg-brand-background min-h-screen flex items-center justify-center px-4"
    >
      <div className="max-w-md w-full bg-brand-card p-8 md:p-12 rounded-[48px] card-shadow border border-brand-primary/5">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-serif font-bold text-brand-primary mb-2">Tạo tài khoản</h2>
          <p className="text-zinc-500 italic">Gia nhập cộng đồng sống sạch cùng Fruit Haven.</p>
        </div>

        {/* Avatar Upload Selection */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-24 h-24 rounded-full border-4 border-brand-primary/10 overflow-hidden bg-brand-background flex items-center justify-center text-brand-primary/20 transition-all group-hover:border-brand-primary/30 group-hover:bg-brand-primary/5">
              {avatar ? (
                <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={40} />
              )}
            </div>
            <button 
              className="absolute bottom-0 right-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <Camera size={14} />
            </button>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/40 mt-3">
            Ảnh đại diện (tùy chọn)
          </p>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2">
            <ShieldCheck size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Họ và tên</label>
            <div className="relative">
              <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary/40" size={18} />
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nguyễn Văn A"
                className="w-full pl-14 pr-6 py-3.5 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Email</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary/40" size={18} />
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your@email.com"
                className="w-full pl-14 pr-6 py-3.5 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Số điện thoại</label>
            <div className="relative">
              <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary/40" size={18} />
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="090..."
                className="w-full pl-14 pr-6 py-3.5 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary/40" size={18} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-3.5 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-primary/40 hover:text-brand-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Xác nhận mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary/40" size={18} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-3.5 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
              />
            </div>
          </div>

          <div className="px-2 py-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-brand-primary/20 text-brand-primary focus:ring-brand-primary/20" 
              />
              <span className="text-[11px] leading-relaxed text-zinc-500">
                Tôi đồng ý với <Link to="/privacy-policy" className="text-brand-primary font-bold hover:underline">Điều khoản dịch vụ</Link> và <Link to="/privacy-policy" className="text-brand-primary font-bold hover:underline">Chính sách bảo mật</Link> của Fruit Haven.
              </span>
            </label>
          </div>

          <button type="submit" className="w-full mt-4 py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 group">
            Đăng ký tài khoản
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-primary/10"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-brand-card px-4 text-zinc-400 font-bold tracking-widest">Hoặc kết nối qua</span></div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-3 border border-brand-primary/10 rounded-full hover:bg-brand-primary/5 transition-all text-xs font-bold text-brand-primary/70">
            <Chrome size={16} /> Google
          </button>
          <button className="flex items-center justify-center gap-2 py-3 border border-brand-primary/10 rounded-full hover:bg-brand-primary/5 transition-all text-xs font-bold text-brand-primary/70">
            <Facebook size={16} /> Facebook
          </button>
        </div>

        <p className="text-center mt-8 text-sm text-zinc-500">
          Đã có tài khoản? <Link to="/login" className="text-brand-primary font-bold hover:underline">Đăng nhập ngay</Link>
        </p>
      </div>
    </motion.section>
  );
}
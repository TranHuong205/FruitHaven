import { ShoppingCart, Search, Menu, X, CreditCard, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User as UserIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { User } from '../types';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  user: User | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearFilters?: () => void;
}

export default function Navbar({ cartCount, onCartClick, user, searchQuery, onSearchChange, onClearFilters }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (searchQuery.trim() === '') return;
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsMenuOpen(false);
  };

  const handleHomeDoubleClick = () => {
    // 1. Xóa sạch bộ lọc và tìm kiếm
    if (onClearFilters) onClearFilters();
    
    // 2. Quay về trang chủ (nếu đang ở trang khác)
    navigate('/');
    
    // 3. Cuộn lên đầu trang ngay lập tức (không dùng smooth để giống Refresh)
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    // 4. Đóng menu mobile nếu đang mở
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-background/80 backdrop-blur-md border-b border-brand-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" onDoubleClick={handleHomeDoubleClick} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
              <span className="text-white font-serif text-xl font-bold">F</span>
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-brand-primary">Fruit Haven</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" onDoubleClick={handleHomeDoubleClick} className="text-sm font-medium text-brand-primary/70 hover:text-brand-primary transition-colors">Trang Chủ</Link>
            <Link to="/search" className="text-sm font-medium text-brand-primary/70 hover:text-brand-primary transition-colors">Cửa Hàng</Link>
            <Link to="/track-order" className="text-sm font-medium text-brand-primary/70 hover:text-brand-primary transition-colors flex items-center gap-1.5">
              <Package size={14} className="text-brand-primary/40" />
              Tra cứu đơn hàng
            </Link>
            <Link to="/about" className="text-sm font-medium text-brand-primary/70 hover:text-brand-primary transition-colors">Về Chúng Tôi</Link>
            <Link to="/contact" className="text-sm font-medium text-brand-primary/70 hover:text-brand-primary transition-colors">Liên Hệ</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Ô tìm kiếm cho Desktop */}
            <form 
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex relative items-center"
            >
              <button
                type="button"
                onClick={() => {
                  if (!isSearchExpanded) {
                    setIsSearchExpanded(true);
                    setTimeout(() => searchInputRef.current?.focus(), 100);
                  } else if (searchQuery.trim() !== '') {
                    handleSearchSubmit();
                  }
                }}
                className="absolute left-3 z-10 text-brand-primary/40 hover:text-brand-primary transition-colors focus:outline-none"
              >
                <Search size={16} />
              </button>
              <motion.input 
                ref={searchInputRef}
                initial={false}
                animate={{ 
                  width: isSearchExpanded ? 240 : 38,
                }}
                type="text"
                placeholder={isSearchExpanded ? "Tìm sản phẩm..." : ""}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onBlur={() => {
                  if (searchQuery.trim() === '') setIsSearchExpanded(false);
                }}
                className="pl-10 pr-4 py-2 bg-brand-primary/5 border border-brand-primary/10 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all cursor-pointer"
              />
            </form>

            {user ? (
              <Link to="/profile" className="flex items-center gap-2 group">
                {user.avatar ? (
                  <img src={user.avatar} className="w-8 h-8 rounded-full border border-brand-primary/10" alt={user.name} />
                ) : (
                  <div className="w-8 h-8 rounded-full border border-brand-primary/10 bg-brand-primary/5 flex items-center justify-center text-brand-primary text-[10px] font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden lg:block text-xs font-bold uppercase tracking-widest text-brand-primary group-hover:underline">
                  {user.name.split(' ')[0]}
                </span>
              </Link>
            ) : (
              <Link to="/login" className="p-2 text-brand-primary/70 hover:text-brand-primary transition-colors">
                <UserIcon size={20} />
              </Link>
            )}
            <button 
              onClick={onCartClick}
              className="p-2 text-brand-primary/70 hover:text-brand-primary transition-colors relative"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
            <button 
              className="md:hidden p-2 text-brand-primary/70 hover:text-brand-primary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-background border-b border-brand-primary/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {/* Ô tìm kiếm cho Mobile */}
              <form onSubmit={handleSearchSubmit} className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/40" size={18} />
                <input 
                  type="text"
                  placeholder="Tìm kiếm trái cây..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-brand-primary/5 border border-brand-primary/10 rounded-full text-sm focus:outline-none"
                />
              </form>

              <Link to="/" onDoubleClick={handleHomeDoubleClick} className="block text-lg font-serif text-brand-primary">Trang Chủ</Link>
              <Link to="/search" onClick={() => setIsMenuOpen(false)} className="block text-lg font-serif text-brand-primary">Cửa Hàng</Link>
              <Link to="/track-order" onClick={() => setIsMenuOpen(false)} className="block text-lg font-serif text-brand-primary">Tra cứu đơn hàng</Link>
              <Link to="/about" className="block text-lg font-serif text-brand-primary">Câu Chuyện</Link>
              <Link to="/news" className="block text-lg font-serif text-brand-primary">Tin Tức</Link>
              <Link to="/contact" className="block text-lg font-serif text-brand-primary">Liên Hệ</Link>
              {!user && <Link to="/profile" className="block text-lg font-serif text-brand-primary">Đơn hàng của tôi</Link>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

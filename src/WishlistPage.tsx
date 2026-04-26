import React, { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { Fruit, User } from './types';
import ProductCard from './components/ProductCard';

interface WishlistPageProps {
  fruits: Fruit[];
  user: User | null;
  onToggleWishlist: (fruitId: string) => void;
  onAddToCart: (fruit: Fruit, quantity?: number) => void;
}

export default function WishlistPage({ fruits, user, onToggleWishlist, onAddToCart }: WishlistPageProps) {
  const navigate = useNavigate();

  // Lọc danh sách sản phẩm yêu thích từ danh sách ID trong user.wishlist
  const favoriteFruits = useMemo(() => {
    if (!user || !user.wishlist) return [];
    return fruits.filter(f => user.wishlist?.includes(f.id));
  }, [fruits, user?.wishlist]);

  // Nếu chưa đăng nhập, tự động chuyển về trang login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-32 bg-brand-background min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-brand-primary/70 hover:text-brand-primary transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Quay lại</span>
            </button>
            <h1 className="text-5xl font-serif font-bold text-brand-primary">
              Sản Phẩm <span className="italic">Yêu Thích</span>
            </h1>
          </div>
          <div className="bg-brand-primary/5 px-6 py-4 rounded-3xl border border-brand-primary/10">
            <p className="text-brand-primary font-bold text-2xl">{favoriteFruits.length}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-primary/40">Sản phẩm đã lưu</p>
          </div>
        </div>

        {favoriteFruits.length === 0 ? (
          <div className="text-center py-32 bg-brand-card rounded-[48px] border border-dashed border-brand-primary/20">
            <div className="w-20 h-20 bg-brand-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-primary/20">
              <Heart size={40} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">Danh sách đang trống</h2>
            <p className="text-zinc-500 mb-10 max-w-sm mx-auto italic">Hãy thêm những loại trái cây bạn yêu thích để dễ dàng theo dõi và mua sắm sau này.</p>
            <Link to="/search" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-primary/90 transition-all shadow-lg">
              <ShoppingBag size={18} /> Khám phá ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {favoriteFruits.map((fruit) => (
                <ProductCard 
                  key={fruit.id} 
                  fruit={fruit} 
                  onAddToCart={onAddToCart} 
                  isFavorite={true}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.section>
  );
}
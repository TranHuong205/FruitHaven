import { motion } from 'motion/react';
import { Zap, ArrowRight } from 'lucide-react';
import { Fruit } from '../types';
import ProductCard from './ProductCard';
import CountdownTimer from './CountdownTimer';
import { Link } from 'react-router-dom';

interface FlashSaleSectionProps {
  fruits: (Fruit & { salePrice?: number })[];
  onAddToCart: (fruit: Fruit) => void;
  userWishlist: string[];
  onToggleWishlist: (id: string) => void;
  onQuickView: (fruit: Fruit) => void;
}

export default function FlashSaleSection({ fruits, onAddToCart, userWishlist, onToggleWishlist, onQuickView }: FlashSaleSectionProps) {
  // Lấy các sản phẩm có salePrice (Giả lập deal hot)
  const flashSaleProducts = fruits
    .filter(f => f.salePrice && (!f.flashSaleExpiry || new Date(f.flashSaleExpiry) > new Date()))
    .slice(0, 4);

  if (flashSaleProducts.length === 0) return null;

  // Lấy thời gian hết hạn xa nhất trong danh sách sản phẩm đang hiển thị
  const latestExpiry = flashSaleProducts.reduce((latest, f) => {
    if (!f.flashSaleExpiry) return latest;
    return new Date(f.flashSaleExpiry) > new Date(latest) ? f.flashSaleExpiry : latest;
  }, new Date().toISOString());

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Trang trí nền */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-200">
                <Zap size={24} className="fill-current" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-red-500">Giờ Vàng Giá Sốc</span>
            </div>
            <h2 className="text-5xl font-serif font-bold text-brand-primary leading-tight">
              Flash Sale <br />
              <span className="italic text-brand-primary/70">Đang Diễn Ra</span>.
            </h2>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
             <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Kết thúc sau:</p>
             <CountdownTimer targetDate={latestExpiry} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {flashSaleProducts.map((fruit) => (
            <ProductCard 
              key={fruit.id} 
              fruit={fruit} 
              onAddToCart={onAddToCart}
              isFavorite={userWishlist.includes(fruit.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickView={onQuickView}
              isFlashSale={true}
            />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link to="/search?sort=price-asc">
            <button className="px-10 py-4 bg-brand-primary/5 text-brand-primary rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-primary hover:text-white transition-all flex items-center gap-2 group">
              Xem tất cả ưu đãi <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { Fruit, Category } from './types';
import ProductCard from './components/ProductCard';
import { cn } from './lib/utils';

interface CategoriesPageProps {
  fruits: Fruit[];
  categories: Category[];
  onAddToCart: (fruit: Fruit, quantity?: number) => void;
  userWishlist: string[];
  onToggleWishlist: (id: string) => void;
  onQuickView?: (fruit: Fruit) => void;
  comparisonIds?: string[];
  onToggleComparison?: (id: string) => void;
}

export default function CategoriesPage({ 
  fruits, categories, onAddToCart, userWishlist, onToggleWishlist, onQuickView, comparisonIds = [], onToggleComparison 
}: CategoriesPageProps) {
  const { categoryName } = useParams<{ categoryName?: string }>();
  const navigate = useNavigate();
  
  // Giải mã tên danh mục từ URL (ví dụ: Họ%20Cam%20Chanh -> Họ Cam Chanh)
  const decodedCategory = categoryName ? decodeURIComponent(categoryName) : 'Tất cả';
  const [activeCategory, setActiveCategory] = useState<Category>(decodedCategory);
  const [displayLimit, setDisplayLimit] = useState(8);

  useEffect(() => {
    setActiveCategory(decodedCategory);
  }, [decodedCategory]);

  useEffect(() => {
    setDisplayLimit(8);
  }, [activeCategory]);

  // Cập nhật Meta Tags động cho danh mục
  useEffect(() => {
    document.title = activeCategory === 'Tất cả' 
      ? 'Tất cả sản phẩm - Trái cây tươi sạch | Fruit Haven'
      : `Danh mục ${activeCategory} - Trái cây sạch | Fruit Haven`;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', `Khám phá bộ sưu tập ${activeCategory} tươi ngon, đạt chuẩn hữu cơ tại Fruit Haven.`);
  }, [activeCategory]);

  const filteredFruits = useMemo(() => {
    return activeCategory === 'Tất cả' 
      ? fruits 
      : fruits.filter(f => f.category === activeCategory);
  }, [fruits, activeCategory]);

  const currentFruits = useMemo(() => {
    return filteredFruits.slice(0, displayLimit);
  }, [filteredFruits, displayLimit]);

  const hasMore = displayLimit < filteredFruits.length;

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    navigate(`/categories/${encodeURIComponent(cat)}`);
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-32 bg-brand-background min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-brand-primary/70 hover:text-brand-primary transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Về trang chủ</span>
            </button>
            <h1 className="text-5xl font-serif font-bold text-brand-primary">
              Danh Mục <span className="italic">Sản Phẩm</span>
            </h1>
          </div>
          <div className="bg-brand-primary/5 px-6 py-4 rounded-3xl border border-brand-primary/10 flex items-center gap-3">
             <LayoutGrid size={20} className="text-brand-primary/40" />
             <div>
                <p className="text-brand-primary font-bold text-xl">{filteredFruits.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/40">Sản phẩm</p>
             </div>
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={cn(
                "px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300",
                activeCategory === category
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                  : "bg-white text-brand-primary/60 border border-brand-primary/10 hover:bg-brand-primary/5"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 min-h-[600px]">
          <AnimatePresence mode="popLayout">
            {currentFruits.map((fruit) => (
              <ProductCard 
                key={fruit.id} 
                fruit={fruit} 
                onAddToCart={onAddToCart} 
                isFavorite={userWishlist.includes(fruit.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
                isComparing={comparisonIds.includes(fruit.id)}
                onToggleComparison={onToggleComparison}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center pt-8 border-t border-brand-primary/5">
            <button 
              onClick={() => setDisplayLimit(prev => prev + 8)}
              className="px-12 py-4 bg-white text-brand-primary border border-brand-primary/10 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-primary hover:text-white transition-all shadow-sm"
            >
              Xem thêm {activeCategory !== 'Tất cả' ? activeCategory : 'sản phẩm'}
            </button>
          </div>
        )}
      </div>
    </motion.section>
  );
}
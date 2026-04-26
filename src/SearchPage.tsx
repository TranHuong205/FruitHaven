import React, { useState, useMemo, useEffect, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowLeft, ChevronLeft, ChevronRight, Star, ShoppingBag, Filter, X } from 'lucide-react';
import { Fruit } from './types';
import ProductCard from './components/ProductCard';
import { cn } from './lib/utils';

interface SearchPageProps {
  fruits: Fruit[];
  onAddToCart: (fruit: Fruit, quantity?: number) => void;
  userWishlist: string[];
  onToggleWishlist: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
  onQuickView?: (fruit: Fruit) => void;
  comparisonIds?: string[];
  onToggleComparison?: (id: string) => void;
}

type SortOption = 'default' | 'price-asc' | 'price-desc';

export default function SearchPage({ 
  fruits, onAddToCart, userWishlist, onToggleWishlist, searchQuery, onSearchChange, categories, onQuickView, comparisonIds = [], onToggleComparison 
}: SearchPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryFromUrl = searchParams.get('q') || '';
  const categoryFromUrl = searchParams.get('category') || 'Tất cả';
  const sortFromUrl = (searchParams.get('sort') as SortOption) || 'default';
  const ratingFromUrl = Number(searchParams.get('rating')) || 0;
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [minRating, setMinRating] = useState(ratingFromUrl);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [sortBy, setSortBy] = useState<SortOption>(sortFromUrl);
  const [displayLimit, setDisplayLimit] = useState(8);

  // Đồng bộ từ khóa từ URL vào state của App nếu cần
  useEffect(() => {
    if (queryFromUrl && queryFromUrl !== searchQuery) {
      onSearchChange(queryFromUrl);
    }
  }, [queryFromUrl, searchQuery, onSearchChange]);

  // Đồng bộ ngược từ URL vào state khi nhấn Back/Forward browser
  useEffect(() => {
    const s = (searchParams.get('sort') as SortOption) || 'default';
    const r = Number(searchParams.get('rating')) || 0;
    const c = searchParams.get('category') || 'Tất cả';
    if (s !== sortBy) setSortBy(s);
    if (r !== minRating) setMinRating(r);
    if (c !== selectedCategory) setSelectedCategory(c);
  }, [searchParams]);

  useEffect(() => {
    setDisplayLimit(8);
  }, [deferredSearchQuery, sortBy, selectedCategory, minRating, priceRange]);

  // Cập nhật Meta Tags động cho trang tìm kiếm
  useEffect(() => {
    if (deferredSearchQuery) {
      document.title = `Tìm kiếm: "${deferredSearchQuery}" | Fruit Haven`;
    } else {
      document.title = 'Tìm kiếm sản phẩm | Fruit Haven';
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', `Kết quả tìm kiếm cho "${deferredSearchQuery}" tại Fruit Haven.`);
  }, [deferredSearchQuery]);

  const filteredResults = useMemo(() => {
    const cleanQuery = deferredSearchQuery.trim().toLowerCase();
    let results = fruits.filter(f => {
      const matchesSearch = cleanQuery === '' || 
                           f.name.toLowerCase().includes(cleanQuery) || 
                           f.description.toLowerCase().includes(cleanQuery);
      
      const matchesCategory = selectedCategory === 'Tất cả' || f.category === selectedCategory;
      
      const avgRating = f.reviews && f.reviews.length > 0
        ? f.reviews.reduce((acc, rev) => acc + rev.rating, 0) / f.reviews.length
        : 0;
      const matchesRating = avgRating >= minRating;
      
      const matchesPrice = f.price >= priceRange[0] && f.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesRating && matchesPrice;
    });

    if (sortBy === 'price-asc') results = [...results].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') results = [...results].sort((a, b) => b.price - a.price);

    return results;
  }, [fruits, deferredSearchQuery, sortBy, selectedCategory, minRating, priceRange]);

  const currentFruits = useMemo(() => {
    return filteredResults.slice(0, displayLimit);
  }, [filteredResults, displayLimit]);

  const hasMore = displayLimit < filteredResults.length;

  const updateSearchParams = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'Tất cả' || value === 'default' || value === '0') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    updateSearchParams('category', cat);
  };

  const clearAllFilters = () => {
    onSearchChange('');
    setSelectedCategory('Tất cả');
    setMinRating(0);
    setPriceRange([0, 500000]);
    setSortBy('default');
    setSearchParams({});
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
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-brand-primary/70 hover:text-brand-primary transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Quay lại</span>
            </button>
            <h1 className="text-5xl font-serif font-bold text-brand-primary">
              Kết Quả <span className="italic">Tìm Kiếm</span>
            </h1>
            <p className="mt-2 text-zinc-500 italic">
              Tìm thấy {filteredResults.length} sản phẩm cho từ khóa "{searchQuery}"
            </p>
          </div>

          {/* Sorting & Filter Summary */}
          <div className="relative w-full md:w-64">
            <select 
              value={sortBy}
              onChange={(e) => {
                const val = e.target.value as SortOption;
                setSortBy(val);
                updateSearchParams('sort', val);
              }}
              className="w-full pl-6 pr-10 py-3 bg-white border border-brand-primary/10 rounded-full focus:outline-none appearance-none text-sm font-medium text-brand-primary/60 cursor-pointer shadow-sm"
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
            </select>
            <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary/40 pointer-events-none" size={18} />
          </div>
        </div>

        {/* Advanced Filters Bar */}
        <div className="bg-white p-6 rounded-[32px] border border-brand-primary/10 mb-12 shadow-sm space-y-8">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-brand-primary/40">
              <Filter size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Bộ lọc:</span>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                    selectedCategory === cat 
                      ? "bg-brand-primary text-white shadow-md" 
                      : "bg-brand-background text-brand-primary/60 hover:bg-brand-primary/5"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Rating Filter */}
            <div className="flex items-center gap-2 border-l border-brand-primary/10 pl-6">
              {[0, 4, 3, 2].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setMinRating(r);
                    updateSearchParams('rating', r.toString());
                  }}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all",
                    minRating === r ? "bg-brand-primary text-white" : "text-brand-primary/40 hover:text-brand-primary"
                  )}
                >
                  {r === 0 ? 'Tất cả' : <>{r}+ <Star size={10} className="fill-current" /></>}
                </button>
              ))}
            </div>

            {(searchQuery || selectedCategory !== 'Tất cả' || minRating !== 0) && (
              <button 
                onClick={clearAllFilters}
                className="ml-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:underline"
              >
                <X size={14} /> Xóa tất cả
              </button>
            )}
          </div>
        </div>

        {filteredResults.length === 0 ? (
          <div className="text-center py-32 bg-brand-card rounded-[48px] border border-dashed border-brand-primary/20">
            <div className="w-20 h-20 bg-brand-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-primary/20">
              <Search size={40} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">Rất tiếc, không tìm thấy kết quả</h2>
            <p className="text-zinc-500 mb-10 max-w-sm mx-auto italic">Hãy thử tìm kiếm với từ khóa khác hoặc quay lại cửa hàng để xem các sản phẩm mới nhất.</p>
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-primary/90 transition-all shadow-lg"
            >
              <ShoppingBag size={18} /> Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <>
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

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-8 border-t border-brand-primary/5">
                <button 
                  onClick={() => setDisplayLimit(prev => prev + 8)} 
                  className="px-12 py-4 bg-white text-brand-primary border border-brand-primary/10 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                >
                  Tải thêm kết quả
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.section>
  );
}
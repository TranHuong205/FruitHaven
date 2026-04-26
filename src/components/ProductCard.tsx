import { motion } from 'motion/react';
import { Plus, ShoppingCart, Star, Heart, Eye, ArrowLeftRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Fruit } from '../types';
import { cn } from '../lib/utils';

interface ProductCardProps {
  fruit: Fruit & { salePrice?: number };
  onAddToCart: (fruit: Fruit) => void;
  isFavorite?: boolean;
  onToggleWishlist?: (fruitId: string) => void;
  onQuickView?: (fruit: Fruit) => void;
  isComparing?: boolean;
  onToggleComparison?: (id: string) => void;
  isFlashSale?: boolean;
}

export default function ProductCard({ fruit, onAddToCart, isFavorite, onToggleWishlist, onQuickView, isComparing, onToggleComparison, isFlashSale }: ProductCardProps) {
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền lên Link
    e.preventDefault(); // Ngăn chặn hành vi mặc định của nút nếu nó nằm trong Link
    if (isOutOfStock) return;
    onAddToCart(fruit);
  };

  const isOutOfStock = (fruit.stock ?? 0) <= 0;
  const isLowStock = !isOutOfStock && (fruit.stock ?? 0) < 10;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleWishlist?.(fruit.id);
  };

  // Tính điểm đánh giá trung bình
  const averageRating = fruit.reviews && fruit.reviews.length > 0
    ? Math.round((fruit.reviews.reduce((acc, rev) => acc + rev.rating, 0) / fruit.reviews.length) * 10) / 10
    : 0;

  // Định nghĩa các variants tập trung để quản lý hiệu ứng mượt mà hơn
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9 },
    hover: {
      y: -8,
      transition: { duration: 0.4, ease: "easeOut" as const }
    }
  };

  const badgeVariants = {
    hover: {
      x: [0, -2, 2, -2, 2, 0],
      transition: { duration: 0.4, ease: "easeInOut" as const }
    }
  };

  const imageVariants = {
    hover: { scale: 1.1, transition: { duration: 0.7, ease: "easeOut" as const } }
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 16 },
    hover: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" as const }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
    >
      <Link 
        to={`/product/${fruit.id}`} 
        className="group block bg-brand-card rounded-[32px] p-6 card-shadow border border-brand-primary/5 hover:border-brand-primary/20 transition-all duration-300"
      >
      <div className={cn("relative mb-6 aspect-[4/5] rounded-[24px] overflow-hidden", fruit.color)}>
        <motion.img 
          variants={imageVariants}
          src={fruit.image} 
          alt={fruit.name} 
          className={cn("w-full h-full object-cover transition-all duration-700", isOutOfStock && "grayscale opacity-60")}
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-brand-primary rounded-full">
            {fruit.category}
          </span>
        </div>

        {/* Stock Badges */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <motion.span 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-5 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl"
            >
              Hết hàng
            </motion.span>
          </div>
        )}
        {isLowStock && (
          <div className="absolute top-12 left-4 z-10">
            <span className="px-3 py-1 bg-orange-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-orange-500/30">
              Chỉ còn {fruit.stock} {fruit.unit}
            </span>
          </div>
        )}
        
        {/* Nút Yêu Thích */}
        <button
          onClick={handleWishlistClick}
          className={cn(
            "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 z-20 shadow-sm border",
            isFavorite 
              ? "bg-red-500 text-white border-red-500" 
              : "bg-white/90 text-brand-primary/40 border-brand-primary/5 hover:text-red-500 hover:bg-white"
          )}
        >
          <Heart size={18} className={cn(isFavorite && "fill-current")} />
        </button>

        {/* Nút Xem Nhanh */}
        <motion.button
          variants={buttonVariants}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onQuickView?.(fruit);
          }}
          className="absolute bottom-4 left-4 w-12 h-12 bg-white text-brand-primary rounded-full flex items-center justify-center shadow-lg z-10 hover:bg-brand-primary hover:text-white transition-colors"
          title="Xem nhanh"
        >
          <Eye size={22} />
        </motion.button>

        {/* Nút So Sánh */}
        <motion.button
          variants={buttonVariants}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onToggleComparison?.(fruit.id);
          }}
          className={cn(
            "absolute top-16 left-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 z-20 shadow-sm border",
            isComparing ? "bg-brand-primary text-white border-brand-primary" : "bg-white/90 text-brand-primary/40 border-brand-primary/5 hover:text-brand-primary hover:bg-white"
          )}
          title="So sánh sản phẩm"
        >
          <ArrowLeftRight size={18} />
        </motion.button>

        {averageRating > 0 && (
          <motion.div 
            variants={badgeVariants}
            className="absolute top-16 right-4 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1 shadow-sm border border-brand-primary/5 z-10"
          >
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-bold text-brand-primary">
              {averageRating}
            </span>
          </motion.div>
        )}
        <motion.button
          variants={buttonVariants}
          onClick={handleAddToCartClick}
          disabled={isOutOfStock}
          className={cn(
            "absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10 transition-all",
            isOutOfStock ? "bg-zinc-300 text-zinc-500 cursor-not-allowed" : "bg-brand-primary text-white"
          )}
        >
          <Plus size={24} />
        </motion.button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-serif font-bold text-brand-primary">{fruit.name}</h3>
          <div className="text-right">
            {isFlashSale && fruit.salePrice ? (
              <>
                <p className="text-lg font-bold text-red-500">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fruit.salePrice)}</p>
                <p className="text-[10px] text-zinc-400 line-through font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fruit.price)}</p>
              </>
            ) : (
              <span className="text-lg font-medium text-brand-primary/80">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fruit.price)}
              </span>
            )}
          </div>
        </div>
        
        {/* Rating Display */}
        <div className="flex items-center gap-1.5">
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={12} className={cn(averageRating >= i ? "fill-current" : "text-zinc-200")} />
            ))}
          </div>
          {averageRating > 0 ? (
            <span className="text-[10px] font-bold text-brand-primary">
              {averageRating} ({fruit.reviews?.length})
            </span>
          ) : (
            <span className="text-[10px] font-medium text-zinc-400 italic">Chưa có đánh giá</span>
          )}
        </div>

        <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
          {fruit.description}
        </p>
        <div className="pt-4 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Mỗi {fruit.unit}</span>
          <button
            onClick={handleAddToCartClick}
            disabled={isOutOfStock}
            className={cn(
              "text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors",
              isOutOfStock ? "text-zinc-300 cursor-not-allowed" : "text-brand-primary hover:underline underline-offset-4"
            )}
          >
            {isOutOfStock ? "Đã hết hàng" : "Thêm Vào Giỏ"}
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
      </Link>
    </motion.div>
  );
}

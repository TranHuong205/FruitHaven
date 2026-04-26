import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Star, Heart, ArrowRight } from 'lucide-react';
import { Fruit } from '../types';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface QuickViewModalProps {
  fruit: Fruit | null;
  onClose: () => void;
  onAddToCart: (fruit: Fruit, quantity?: number) => void;
  isFavorite: boolean;
  onToggleWishlist: (id: string) => void;
}

export default function QuickViewModal({ fruit, onClose, onAddToCart, isFavorite, onToggleWishlist }: QuickViewModalProps) {
  const navigate = useNavigate();
  
  if (!fruit) return null;

  const averageRating = fruit.reviews && fruit.reviews.length > 0
    ? Math.round((fruit.reviews.reduce((acc, rev) => acc + rev.rating, 0) / fruit.reviews.length) * 10) / 10
    : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-[40px] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-zinc-400 hover:text-brand-primary transition-colors"
          >
            <X size={24} />
          </button>

          {/* Image Side */}
          <div className={cn("w-full md:w-1/2 aspect-square md:aspect-auto relative", fruit.color)}>
            <img 
              src={fruit.image} 
              alt={fruit.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-6">
              <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-brand-primary rounded-full">
                {fruit.category}
              </span>
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full md:w-1/2 p-10 md:p-12 space-y-8 flex flex-col justify-center">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h2 className="text-4xl font-serif font-bold text-brand-primary">{fruit.name}</h2>
                <button
                  onClick={() => onToggleWishlist(fruit.id)}
                  className={cn(
                    "p-3 rounded-full transition-all border",
                    isFavorite 
                      ? "bg-red-500 text-white border-red-500" 
                      : "bg-brand-primary/5 text-brand-primary border-brand-primary/10 hover:bg-red-50 hover:text-red-500"
                  )}
                >
                  <Heart size={20} className={cn(isFavorite && "fill-current")} />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-serif font-bold text-brand-primary">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fruit.price)}
                </span>
                <span className="text-sm text-zinc-500 font-medium">/ {fruit.unit}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className={cn(averageRating >= s ? "fill-current" : "text-zinc-200")} />
                  ))}
                </div>
                <span className="text-xs font-bold text-brand-primary">{averageRating} ({fruit.reviews?.length || 0} đánh giá)</span>
              </div>
            </div>

            <p className="text-zinc-500 text-sm leading-relaxed line-clamp-4 italic">
              "{fruit.description}"
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => {
                  onAddToCart(fruit);
                  onClose();
                }}
                className="flex-1 px-8 py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-primary/90 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} /> Thêm vào giỏ
              </button>
              <button 
                onClick={() => {
                  navigate(`/product/${fruit.id}`);
                  onClose();
                }}
                className="flex-1 px-8 py-4 bg-brand-primary/5 text-brand-primary rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-primary/10 transition-all flex items-center justify-center gap-2"
              >
                Chi tiết <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
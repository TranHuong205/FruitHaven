import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag, Trash2, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types';
import { cn } from '../lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function CartDrawer({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-background shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-brand-primary/10 flex justify-between items-center bg-brand-card">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} className="text-brand-primary" />
                <h2 className="text-2xl font-serif font-bold text-brand-primary">Giỏ Hàng</h2>
                <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full">
                  {items.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <Link to="/checkout" onClick={onClose} className="hidden xs:block">
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-md">
                      <CreditCard size={14} />
                      Thanh toán
                    </button>
                  </Link>
                )}
                <button 
                  onClick={onClose}
                  className="p-2 text-brand-primary/50 hover:text-brand-primary transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-brand-primary/5 rounded-full flex items-center justify-center text-brand-primary/20">
                    <ShoppingBag size={40} />
                  </div>
                  <p className="text-lg font-serif text-brand-primary/60 italic">Giỏ hàng của bạn đang trống.</p>
                  <button 
                    onClick={onClose}
                    className="text-sm font-bold uppercase tracking-widest text-brand-primary hover:underline"
                  >
                    Bắt đầu mua sắm
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    layout
                    key={item.id} 
                    className="flex gap-4 group"
                  >
                    <div className={cn("w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0", item.color)}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-lg font-serif font-bold text-brand-primary truncate">{item.name}</h4>
                          <button 
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1 text-zinc-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-zinc-400 uppercase tracking-widest">
                          {item.isBundle ? (
                            <span className="text-red-500 font-bold">Combo Tiết Kiệm</span>
                          ) : (
                            `Mỗi ${item.unit}`
                          )}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 bg-brand-primary/5 rounded-full px-3 py-1">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="text-brand-primary/60 hover:text-brand-primary transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold text-brand-primary w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="text-brand-primary/60 hover:text-brand-primary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-lg font-serif font-bold text-brand-primary">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer / Summary */}
            {items.length > 0 && (
              <div className="p-6 bg-brand-card border-t border-brand-primary/10 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-zinc-500">
                    <span>Tạm tính</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-zinc-500">
                    <span>Phí vận chuyển</span>
                    <span className="text-brand-primary font-medium">Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-xl font-serif font-bold text-brand-primary pt-2 border-t border-brand-primary/5">
                    <span>Tổng cộng</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
                  </div>
                </div>
                <Link to="/checkout" onClick={onClose} className="block w-full">
                  <button className="w-full py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20">
                    Thanh Toán Ngay
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

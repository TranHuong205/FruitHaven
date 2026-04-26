import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Minus, ShoppingCart, Star, CreditCard, ArrowRight, AlertCircle, MessageCircleReply, Heart } from 'lucide-react';
import { Fruit, Review, User } from './types';
import { cn } from './lib/utils';
import { useState, useMemo, useEffect } from 'react';
import ProductCard from './components/ProductCard';

interface ProductDetailPageProps {
  fruits: Fruit[];
  onAddToCart: (fruit: Fruit, quantity?: number) => void;
  onAddReview: (fruitId: string, review: Review) => void;
  user: User | null;
  onToggleWishlist: (fruitId: string) => void;
  recentlyViewedIds: string[];
  onViewProduct: (id: string) => void;
  orders: any[];
  onThankReply: (fruitId: string, reviewId: string) => void;
}
export default function ProductDetailPage({ fruits, onAddToCart, onAddReview, user, onToggleWishlist, recentlyViewedIds, onViewProduct, orders, onThankReply }: ProductDetailPageProps) {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const fruit = fruits.find(f => f.id === productId);

  // Ghi nhận sản phẩm vừa xem khi truy cập
  useEffect(() => {
    if (productId) {
      onViewProduct(productId);
    }
  }, [productId, onViewProduct]);

  // Cập nhật Meta Tags động cho từng sản phẩm
  useEffect(() => {
    if (fruit) {
      document.title = `${fruit.name} - Trái cây tươi sạch | Fruit Haven`;
      
      const updateMeta = (selector: string, content: string) => {
        const el = document.querySelector(selector);
        if (el) el.setAttribute('content', content);
      };

      updateMeta('meta[name="description"]', fruit.description);
      updateMeta('meta[property="og:title"]', `${fruit.name} | Fruit Haven`);
      updateMeta('meta[property="og:description"]', fruit.description);
      updateMeta('meta[property="og:image"]', fruit.image);
    }
  }, [fruit]);

  // Lấy các sản phẩm liên quan (cùng danh mục, loại trừ sản phẩm hiện tại)
  const relatedProducts = useMemo(() => {
    if (!fruit) return [];
    return fruits
      .filter(f => f.category === fruit.category && f.id !== fruit.id)
      .slice(0, 4); // Lấy tối đa 4 sản phẩm
  }, [fruits, fruit]);

  // Lấy danh sách sản phẩm vừa xem từ ID (loại trừ sản phẩm hiện tại)
  const recentlyViewedProducts = useMemo(() => {
    return recentlyViewedIds
      .filter(id => id !== productId)
      .map(id => fruits.find(f => f.id === id))
      .filter((f): f is Fruit => !!f)
      .slice(0, 4);
  }, [recentlyViewedIds, fruits, productId]);

  // Kiểm tra người dùng đã mua sản phẩm này và đơn hàng đã hoàn tất chưa
  const hasPurchased = useMemo(() => {
    if (!user) return false;
    return orders.some(order => 
      order.email?.toLowerCase() === user.email.toLowerCase() &&
      order.status === 'Đã giao' &&
      order.items?.some((item: any) => item.id === productId)
    );
  }, [orders, user, productId]);

  // Tính toán trung bình cộng số sao (làm tròn 1 chữ số thập phân)
  const approvedReviews = fruit?.reviews?.filter(r => r.status === 'approved') || [];
  const averageRating = approvedReviews.length > 0
    ? Math.round((approvedReviews.reduce((acc, rev) => acc + rev.rating, 0) / approvedReviews.length) * 10) / 10
    : 0;

  if (!fruit) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-24 text-center bg-brand-background min-h-[calc(100vh-200px)] flex flex-col items-center justify-center"
      >
        <h2 className="text-4xl font-serif font-bold text-brand-primary mb-4">Sản phẩm không tìm thấy</h2>
        <p className="text-lg text-zinc-500 mb-8">Rất tiếc, chúng tôi không thể tìm thấy sản phẩm bạn đang tìm kiếm.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-brand-primary text-white rounded-full font-medium hover:bg-brand-primary/90 transition-all flex items-center gap-2 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Quay lại cửa hàng
        </button>
      </motion.div>
    );
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddMultipleToCart = () => {
    onAddToCart(fruit, quantity);
    setQuantity(1);
  };

  const handleBuyNow = () => {
    onAddToCart(fruit, quantity);
    navigate('/checkout');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    const newReview: Review = {
      id: Math.random().toString(36).substring(2, 9),
      userName: user?.name || 'Khách hàng',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    onAddReview(fruit.id, newReview);
    setRating(0);
    setComment('');
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-24 bg-brand-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)} // Go back to previous page
          className="flex items-center gap-2 text-brand-primary/70 hover:text-brand-primary transition-colors mb-10"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Quay lại</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Product Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn("relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-xl", fruit.color)}
          >
            <img 
              src={fruit.image} 
              alt={fruit.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-6 left-6">
              <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-xs font-bold uppercase tracking-widest text-brand-primary rounded-full">
                {fruit.category}
              </span>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            <h1 className="text-6xl font-serif font-bold text-brand-primary leading-tight">{fruit.name}</h1>
            <p className="text-xl text-zinc-600 leading-relaxed">{fruit.description}</p>
            
            <div className="flex items-center gap-4">
              <span className="text-4xl font-serif font-bold text-brand-primary">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fruit.price)}
              </span>
              <span className="text-lg text-zinc-500">/ {fruit.unit}</span>
            </div>

            <div className="flex items-center gap-6 pt-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-3 bg-brand-primary/5 rounded-full px-4 py-2">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className="text-brand-primary/60 hover:text-brand-primary transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="text-lg font-bold text-brand-primary w-6 text-center">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className="text-brand-primary/60 hover:text-brand-primary transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={handleAddMultipleToCart}
                className="flex-grow px-8 py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-3"
              >
                <ShoppingCart size={20} />
                Thêm vào giỏ
              </button>

              {/* Buy Now Button */}
              <button 
                onClick={handleBuyNow}
                className="px-8 py-4 bg-orange-500 text-white rounded-full font-bold uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-3"
              >
                <CreditCard size={20} />
                Mua ngay
              </button>
            </div>

            {/* Additional Info (Optional) */}
            <div className="pt-8 border-t border-brand-primary/10 space-y-4 text-zinc-600">
              <h3 className="text-xl font-serif font-bold text-brand-primary">Thông tin thêm</h3>
              <p className="text-sm">
                Sản phẩm được hái thủ công và giao hàng tươi mới mỗi ngày. Bảo quản nơi khô ráo, thoáng mát.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24 pt-24 border-t border-brand-primary/10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Review Summary & Form */}
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-serif font-bold text-brand-primary mb-2">Đánh giá sản phẩm</h3>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={18} className={cn(averageRating >= i ? "fill-current" : "text-zinc-200")} />
                    ))}
                  </div>
                  {averageRating > 0 && (
                    <span className="text-brand-primary font-bold">{averageRating}</span>
                  )}
                    <span className="text-zinc-500 text-sm font-medium">({approvedReviews.length} đánh giá)</span>
                </div>
              </div>

              {hasPurchased ? (
                <form onSubmit={handleSubmitReview} className="bg-brand-card p-8 rounded-[32px] border border-brand-primary/5 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-primary/60">Xếp hạng của bạn</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star 
                          size={24} 
                          className={cn(
                            "transition-colors",
                            (hoverRating || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-zinc-200"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-primary/60">Nhận xét</label>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn..."
                    rows={4}
                    required
                    className="w-full px-6 py-4 bg-brand-background border border-brand-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none text-sm"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={rating === 0}
                  className="w-full py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-primary/20"
                >
                  Gửi đánh giá
                </button>
              </form>
              ) : (
                <div className="bg-brand-primary/5 p-8 rounded-[32px] border border-dashed border-brand-primary/20 space-y-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary mx-auto shadow-sm">
                    <AlertCircle size={24} />
                  </div>
                  <div className="text-center space-y-2">
                    <h4 className="font-serif font-bold text-brand-primary">Chưa thể đánh giá</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed italic px-4">
                      {user 
                        ? "Chỉ những khách hàng đã mua và nhận sản phẩm này mới có thể viết đánh giá để đảm bảo tính khách quan." 
                        : "Vui lòng đăng nhập và mua sản phẩm này để có thể viết đánh giá."}
                    </p>
                    {!user && (
                      <Link to="/login" className="inline-block text-xs font-bold uppercase tracking-widest text-brand-primary hover:underline pt-2">
                        Đăng nhập ngay
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-8">
              {approvedReviews.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-brand-primary/5 rounded-[40px] border border-dashed border-brand-primary/20">
                  <p className="text-zinc-500 italic">Chưa có đánh giá nào được phê duyệt cho sản phẩm này.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {approvedReviews.map((rev) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={rev.id} 
                      className="p-8 bg-brand-card rounded-[32px] border border-brand-primary/5 space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary font-bold">
                            {rev.userName[0]}
                          </div>
                          <div>
                            <h4 className="font-bold text-brand-primary">{rev.userName}</h4>
                            <div className="flex text-yellow-400">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={12} className={cn(rev.rating >= s ? "fill-current" : "text-zinc-200")} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-zinc-400 font-medium">{rev.date}</span>
                      </div>
                      <p className="text-zinc-600 italic leading-relaxed">"{rev.comment}"</p>

                      {rev.reply && (
                        <div className="mt-4 p-6 bg-brand-primary/5 rounded-2xl border-l-4 border-brand-primary space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                              <MessageCircleReply size={14} /> Phản hồi từ {rev.reply.author} • {rev.reply.date}
                            </div>
                            <button 
                              onClick={() => onThankReply(fruit.id, rev.id)}
                              className={cn(
                                "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                                rev.reply.thankedBy?.includes(user?.email || '') 
                                  ? "bg-brand-primary text-white" 
                                  : "bg-white text-brand-primary hover:bg-brand-primary hover:text-white border border-brand-primary/10"
                              )}
                            >
                              <Heart size={12} className={cn(rev.reply.thankedBy?.includes(user?.email || '') && "fill-current")} />
                              {rev.reply.thankedBy?.length || 0} Cảm ơn
                            </button>
                          </div>
                          <p className="text-sm text-zinc-600 italic">
                            {rev.reply.comment}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-24 border-t border-brand-primary/10">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-4xl font-serif font-bold text-brand-primary">
                Sản phẩm <span className="italic">liên quan</span>
              </h3>
              <Link to="/search" className="text-sm font-bold uppercase tracking-widest text-brand-primary hover:underline flex items-center gap-2">
                Xem tất cả <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((item) => (
                <ProductCard 
                  key={item.id} 
                  fruit={item} 
                  onAddToCart={onAddToCart} 
                  isFavorite={user?.wishlist?.includes(item.id) || false}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Section */}
        {recentlyViewedProducts.length > 0 && (
          <div className="mt-24 pt-24 border-t border-brand-primary/10">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-4xl font-serif font-bold text-brand-primary">
                Sản phẩm <span className="italic">vừa xem</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recentlyViewedProducts.map((item) => (
                <ProductCard 
                  key={item.id} 
                  fruit={item} 
                  onAddToCart={onAddToCart} 
                  isFavorite={user?.wishlist?.includes(item.id) || false}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
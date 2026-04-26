import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Quote, MessageCircleReply, Heart } from 'lucide-react';
import { Fruit, User } from './types';
import { cn } from './lib/utils';

interface AllReviewsPageProps {
  fruits: Fruit[];
  onThankReply: (fruitId: string, reviewId: string) => void;
  user: User | null;
}

export default function AllReviewsPage({ fruits, onThankReply, user }: AllReviewsPageProps) {
  const navigate = useNavigate();

  const allReviews = useMemo(() => {
    return fruits.flatMap(fruit => 
      (fruit.reviews || []).map(review => ({
        ...review,
        fruitId: fruit.id,
        fruitName: fruit.name,
        fruitImage: fruit.image,
        fruitColor: fruit.color
      }))
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [fruits]);

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-32 bg-brand-background min-h-screen"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Tất Cả <span className="italic">Đánh Giá</span>
            </h1>
          </div>
          <div className="bg-brand-primary/5 px-6 py-4 rounded-3xl border border-brand-primary/10">
            <p className="text-brand-primary font-bold text-2xl">{allReviews.length}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-primary/40">Tổng số phản hồi</p>
          </div>
        </div>

        {allReviews.length === 0 ? (
          <div className="text-center py-20 bg-brand-card rounded-[48px] border border-dashed border-brand-primary/20">
            <p className="text-zinc-500 italic">Chưa có đánh giá nào được ghi nhận.</p>
            <Link to="/" className="mt-4 inline-block text-brand-primary font-bold hover:underline">Tiếp tục mua sắm</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-brand-card p-8 rounded-[40px] border border-brand-primary/5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <Quote className="absolute -top-4 -right-4 text-brand-primary/5 group-hover:text-brand-primary/10 transition-colors" size={120} />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary font-bold">
                        {review.userName[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-primary">{review.userName}</h4>
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} className={cn(review.rating >= s ? "fill-current" : "text-zinc-100")} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-zinc-400 font-medium">{review.date}</span>
                  </div>

                  <p className="text-zinc-600 italic leading-relaxed">"{review.comment}"</p>

                  {review.reply && (
                    <div className="p-4 bg-brand-primary/5 rounded-2xl border-l-2 border-brand-primary space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-brand-primary">
                          <MessageCircleReply size={12} /> {review.reply.author} phản hồi
                        </div>
                        <button 
                          onClick={() => onThankReply(review.fruitId, review.id)}
                          className={cn(
                            "flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase transition-all",
                            review.reply.thankedBy?.includes(user?.email || '')
                              ? "bg-brand-primary text-white"
                              : "bg-white text-brand-primary border border-brand-primary/10"
                          )}
                        >
                          <Heart size={10} className={cn(review.reply.thankedBy?.includes(user?.email || '') && "fill-current")} />
                          {review.reply.thankedBy?.length || 0}
                        </button>
                      </div>
                      <p className="text-xs text-zinc-600 italic line-clamp-2">
                        {review.reply.comment}
                      </p>
                    </div>
                  )}

                  <Link to={`/product/${review.fruitId}`} className="flex items-center gap-3 p-3 bg-brand-background rounded-2xl border border-brand-primary/5 hover:border-brand-primary/20 transition-all">
                    <div className={cn("w-10 h-10 rounded-xl overflow-hidden flex-shrink-0", review.fruitColor)}>
                      <img src={review.fruitImage} alt={review.fruitName} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-brand-primary/60 uppercase tracking-tight">Sản phẩm: {review.fruitName}</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
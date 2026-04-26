import { motion } from 'motion/react';

export default function ProductSkeleton() {
  return (
    <div className="bg-brand-card rounded-[32px] p-6 card-shadow border border-brand-primary/5">
      {/* Ảnh giả lập với hiệu ứng Shimmer */}
      <div className="relative mb-6 aspect-[4/5] rounded-[24px] bg-zinc-100 overflow-hidden">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          {/* Tên sản phẩm */}
          <div className="h-6 w-32 bg-zinc-100 rounded-full animate-pulse" />
          {/* Giá tiền */}
          <div className="h-6 w-16 bg-zinc-100 rounded-full animate-pulse" />
        </div>
        {/* Sao đánh giá */}
        <div className="h-3 w-20 bg-zinc-100 rounded-full animate-pulse" />
        
        {/* Mô tả */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-zinc-100 rounded-full animate-pulse" />
          <div className="h-3 w-2/3 bg-zinc-100 rounded-full animate-pulse" />
        </div>

        {/* Footer card */}
        <div className="pt-4 flex justify-between items-center border-t border-brand-primary/5">
          <div className="h-3 w-12 bg-zinc-100 rounded-full animate-pulse" />
          <div className="h-4 w-24 bg-zinc-100 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
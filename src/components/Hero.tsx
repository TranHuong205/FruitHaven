import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-brand-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase text-brand-primary/60 border border-brand-primary/20 rounded-full">
              Tươi Ngon Từ Nhà Vườn
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[0.9] tracking-tight text-brand-primary mb-8">
              Tinh Túy <br />
              <span className="italic text-brand-primary/70">Từ</span> <br />
              Thiên Nhiên.
            </h1>
            <p className="text-lg text-zinc-600 max-w-md mb-10 leading-relaxed">
              Trải nghiệm hương vị rực rỡ của các loại trái cây hữu cơ được hái tận tay, giao trực tiếp đến cửa nhà bạn. Từ những quả cam mọng nước đến những loại quả nhiệt đới kỳ lạ.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/search" className="px-8 py-4 bg-brand-primary text-white rounded-full font-medium hover:bg-brand-primary/90 transition-all flex items-center gap-2 group">
                Mua Sắm Ngay
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about">
                <button className="px-8 py-4 border border-brand-primary/20 text-brand-primary rounded-full font-medium hover:bg-brand-primary/5 transition-all">
                  Câu Chuyện Của Chúng Tôi
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative z-10 w-full max-w-md mx-auto aspect-[3/4] rounded-full overflow-hidden border-[12px] border-white shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=1200" 
                alt="Fresh Fruits" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Decorative Elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-60"
            />
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-100 rounded-full blur-3xl opacity-60"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

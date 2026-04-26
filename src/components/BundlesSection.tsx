import { motion } from 'motion/react';
import { Package, ShoppingCart, Sparkles, Plus } from 'lucide-react';
import { Bundle } from '../types';
import { BUNDLES } from '../constants';
import { cn } from '../lib/utils';

interface BundlesSectionProps {
  bundles: Bundle[];
  onAddBundle: (bundle: Bundle) => void;
}

export default function BundlesSection({ bundles, onAddBundle }: BundlesSectionProps) {
  return (
    <section className="py-24 bg-brand-background relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/5 text-brand-primary rounded-full border border-brand-primary/10">
            <Package size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Tiết kiệm hơn</span>
          </div>
          <h2 className="text-5xl font-serif font-bold text-brand-primary leading-tight">
            Combo Trái Cây <span className="italic text-brand-primary/70">Tuyển Chọn</span>.
          </h2>
        </div>

        <div className="max-w-5xl mx-auto space-y-12">
          {bundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} onAddBundle={onAddBundle} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BundleCard({ bundle, onAddBundle }: { bundle: Bundle; onAddBundle: (bundle: Bundle) => void }) {
  const discountPercent = Math.round((1 - bundle.price / bundle.originalPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-[48px] overflow-hidden border border-brand-primary/5 shadow-sm hover:shadow-2xl transition-all duration-500"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className={cn("relative aspect-square md:aspect-auto overflow-hidden", bundle.color)}>
          <img src={bundle.image} alt={bundle.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute top-6 left-6">
            <span className="px-4 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg animate-bounce">
              Tiết kiệm {discountPercent}%
            </span>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-6 flex flex-col justify-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-brand-primary/60">
              <Sparkles size={16} className="fill-current" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Combo Đặc Biệt</span>
            </div>
            <h3 className="text-3xl font-serif font-bold text-brand-primary leading-tight">{bundle.name}</h3>
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed italic">"{bundle.description}"</p>
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-serif font-bold text-brand-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bundle.price)}</span>
              <span className="text-sm text-zinc-400 line-through">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bundle.originalPrice)}</span>
            </div>
          </div>
          <button onClick={() => onAddBundle(bundle)} className="w-full md:w-auto px-10 py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-primary/90 transition-all shadow-lg flex items-center justify-center gap-3">
            <ShoppingCart size={18} /> Mua Combo Ngay
          </button>
        </div>
      </div>
    </motion.div>
  );
}
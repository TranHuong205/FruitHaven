import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { NewsItem } from './types';

interface NewsPageProps {
  news: NewsItem[];
}

export default function NewsPage({ news }: NewsPageProps) {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-32 bg-brand-background min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary/60 mb-4 block">
            Blog & Tin Tức
          </span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-primary">
            Kiến Thức <span className="italic">Xanh</span>.
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {news.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={`/news/${item.id}`} 
                className="block bg-brand-card rounded-[40px] overflow-hidden card-shadow border border-brand-primary/5 group transition-all"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-brand-primary rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
                    <div className="flex items-center gap-1"><Calendar size={14} /> {item.date}</div>
                    <div className="flex items-center gap-1"><User size={14} /> {item.author}</div>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-brand-primary group-hover:text-brand-primary/70 transition-colors line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">{item.excerpt}</p>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-primary group-hover:gap-3 transition-all pt-2">
                    Đọc Tiếp <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
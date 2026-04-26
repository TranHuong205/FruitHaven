import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { NewsItem } from './types';

interface NewsDetailPageProps {
  news: NewsItem[];
}

export default function NewsDetailPage({ news }: NewsDetailPageProps) {
  const { newsId } = useParams();
  const navigate = useNavigate();
  const item = news.find(n => n.id === newsId);
  const relatedPosts = news.filter(n => n.id !== newsId).slice(0, 2);

  // Cập nhật Meta Tags động cho bài viết
  useEffect(() => {
    if (item) {
      document.title = `${item.title} | Fruit Haven Blog`;
      
      const updateMeta = (selector: string, content: string) => {
        const el = document.querySelector(selector);
        if (el) el.setAttribute('content', content);
      };

      updateMeta('meta[name="description"]', item.excerpt);
      updateMeta('meta[property="og:title"]', item.title);
      updateMeta('meta[property="og:description"]', item.excerpt);
      updateMeta('meta[property="og:image"]', item.image);
    }
  }, [item]);

  if (!item) {
    return (
      <div className="py-32 text-center bg-brand-background min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-serif font-bold text-brand-primary mb-4">Bài viết không tồn tại</h2>
        <button onClick={() => navigate('/news')} className="text-brand-primary font-bold hover:underline">Quay lại tin tức</button>
      </div>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-32 bg-brand-background min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-brand-primary/70 hover:text-brand-primary transition-colors mb-10"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Quay lại</span>
        </button>

        <article className="space-y-10">
          <div className="space-y-6 text-center">
            <span className="inline-block px-4 py-1.5 bg-brand-primary/5 text-xs font-bold uppercase tracking-widest text-brand-primary rounded-full">
              {item.category}
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-primary leading-tight">
              {item.title}
            </h1>
            <div className="flex items-center justify-center gap-8 text-sm font-medium text-zinc-400">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-brand-primary/40" />
                {item.date}
              </div>
              <div className="flex items-center gap-2">
                <User size={18} className="text-brand-primary/40" />
                {item.author}
              </div>
            </div>
          </div>

          <div className="aspect-video rounded-[48px] overflow-hidden shadow-2xl">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none text-zinc-600 leading-relaxed space-y-6 pt-10">
            <p className="text-xl font-medium text-brand-primary italic">
              {item.excerpt}
            </p>
            <div className="whitespace-pre-line">
              {item.content}
            </div>
          </div>

          <div className="pt-16 border-t border-brand-primary/10 flex items-center gap-4">
            <Tag size={20} className="text-brand-primary" />
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-brand-primary/5 rounded-full text-xs font-medium text-brand-primary">#TraiCayHuuCo</span>
              <span className="px-3 py-1 bg-brand-primary/5 rounded-full text-xs font-medium text-brand-primary">#SucKhoe</span>
              <span className="px-3 py-1 bg-brand-primary/5 rounded-full text-xs font-medium text-brand-primary">#FruitHaven</span>
            </div>
          </div>
        </article>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-24 pt-24 border-t border-brand-primary/10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-serif font-bold text-brand-primary">
                Bài viết <span className="italic">liên quan</span>
              </h3>
              <Link to="/news" className="text-xs font-bold uppercase tracking-widest text-brand-primary hover:underline flex items-center gap-2">
                Xem tất cả <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((post) => (
                <Link 
                  key={post.id} 
                  to={`/news/${post.id}`}
                  className="group bg-brand-card rounded-[40px] overflow-hidden border border-brand-primary/5 hover:border-brand-primary/20 transition-all flex flex-col"
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/40 block">
                      {post.category}
                    </span>
                    <h4 className="text-xl font-serif font-bold text-brand-primary group-hover:text-brand-primary/70 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
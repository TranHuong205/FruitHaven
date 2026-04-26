import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  TrendingUp, 
  DollarSign, 
  Search,
  Zap,
  X,
  Save,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Camera,
  Image as ImageIcon,
  Star,
  MessageSquare,
  User as UserIcon,
  FileText,
  Tags,
  Ticket
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { db } from './lib/firebaseClient';
import { doc, updateDoc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { checkIsAdmin, isSuperAdmin } from './lib/auth';
import { Fruit, User, Category, NewsItem, Coupon, Review, Bundle } from './types';
import { compressImage } from './lib/security';
import { cn } from './lib/utils';

interface AdminPageProps {
  user: User | null;
  fruits: Fruit[];
  setFruits: React.Dispatch<React.SetStateAction<Fruit[]>>;
  news: NewsItem[];
  setNews: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onUpdateUser: (user: User) => void;
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  bundles: Bundle[];
  setBundles: React.Dispatch<React.SetStateAction<Bundle[]>>;
  addToast: (message: string) => void;
}

const FRUIT_COLORS = [
  { name: 'Cam', value: 'bg-orange-50' },
  { name: 'Xanh dương', value: 'bg-blue-50' },
  { name: 'Vàng', value: 'bg-yellow-50' },
  { name: 'Đỏ', value: 'bg-red-50' },
  { name: 'Hồng', value: 'bg-pink-50' },
  { name: 'Tím', value: 'bg-purple-50' },
  { name: 'Xanh lá', value: 'bg-green-50' },
];

export default function AdminPage({ 
  user, 
  fruits, 
  setFruits, 
  news, 
  setNews, 
  categories, 
  setCategories, 
  coupons, 
  setCoupons, 
  users, 
  setUsers, 
  onUpdateUser, 
  orders, 
  setOrders, 
  bundles,
  setBundles,
  addToast 
}: AdminPageProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'users' | 'orders' | 'news' | 'reviews' | 'categories' | 'coupons' | 'flash-sales' | 'bundles'>(() => {
    const lastTab = localStorage.getItem('fruit-haven-admin-tab');
    return (lastTab as any) || 'dashboard';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userFileInputRef = useRef<HTMLInputElement>(null);
  const newsFileInputRef = useRef<HTMLInputElement>(null);
  const bundleFileInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [editingFruit, setEditingFruit] = useState<Partial<Fruit> | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isBundleModalOpen, setIsBundleModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);
  const [editingCategory, setEditingCategory] = useState<{ original: Category; name: string } | null>(null);
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [editingBundle, setEditingBundle] = useState<Partial<Bundle> | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ fruitId: string; reviewId: string; comment: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('fruit-haven-admin-tab', activeTab);
  }, [activeTab]);

  // Kiểm tra quyền Admin
  const isAdmin = user && checkIsAdmin(user);

  if (!isAdmin) {
    return (
      <div className="py-32 text-center bg-brand-background min-h-screen flex flex-col items-center justify-center px-4">
        <AlertCircle size={64} className="text-red-500 mb-6" />
        <h2 className="text-4xl font-serif font-bold text-brand-primary mb-4">Truy cập bị từ chối</h2>
        <p className="text-zinc-500 mb-8">Bạn không có quyền truy cập vào trang quản trị này.</p>
        <button onClick={() => navigate('/')} className="px-8 py-4 bg-brand-primary text-white rounded-full font-bold">Quay lại trang chủ</button>
      </div>
    );
  }

  // Tính toán thống kê
  const stats = useMemo(() => ({
    totalRevenue: orders.filter(o => o.status === 'Đã giao').reduce((sum, o) => sum + o.total, 0),
    totalOrders: orders.length,
    totalUsers: users.length,
    totalProducts: fruits.length
  }), [fruits, users, orders]);

  // Lọc sản phẩm đang có giá sale
  const flashSaleFruits = useMemo(() => {
    return fruits.filter(f => 
      f.salePrice && f.salePrice > 0 && 
      (!f.flashSaleExpiry || new Date(f.flashSaleExpiry) > new Date())
    );
  }, [fruits]);

  // Xử lý dữ liệu biểu đồ cho 7 ngày gần nhất
  const chartData = useMemo(() => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    return last7Days.map(date => {
      const dateStr = date.toLocaleDateString('vi-VN');
      const dailyRevenue = orders
        .filter(o => o.date === dateStr && o.status === 'Đã giao')
        .reduce((sum, o) => sum + o.total, 0);

      return {
        name: days[date.getDay()],
        revenue: dailyRevenue,
        fullDate: dateStr
      };
    });
  }, [orders]);

  // Lọc sản phẩm sắp hết hàng (< 10 đơn vị)
  const lowStockFruits = useMemo(() => {
    return fruits.filter(f => (f.stock ?? 0) < 10 && (f.stock ?? 0) > 0);
  }, [fruits]);

  // Tổng hợp tất cả reviews từ các sản phẩm để quản lý
  const allReviews = useMemo(() => {
    return fruits.flatMap(fruit => 
      (fruit.reviews || []).map((review: Review) => ({
        ...review,
        status: review.status || 'pending',
        fruitId: fruit.id,
        fruitName: fruit.name,
        thanksCount: review.reply?.thankedBy?.length || 0
      }))
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [fruits]);

  const filteredFruits = fruits.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredNews = news.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportOrdersToCSV = () => {
    if (orders.length === 0) {
      addToast("Không có đơn hàng để xuất!");
      return;
    }

    const headers = ["ID Don hang", "Khach hang", "Email", "Tong tien", "Trang thai", "Ngay dat"];
    const csvRows = orders.map(order => [
      order.id,
      `"${order.customerName}"`,
      order.email,
      order.total,
      order.status,
      order.created_at || order.date
    ]);

    const csvContent = [headers, ...csvRows].map(row => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `FruitHaven_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    addToast("Đã xuất tệp CSV đơn hàng!");
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setFruits(prev => prev.filter(f => f.id !== id));
      addToast("Đã xóa sản phẩm thành công!");
    }
  };

  const handleUpdateReviewStatus = (fruitId: string, reviewId: string, newStatus: 'approved' | 'rejected') => {
    setFruits(prev => prev.map((f: Fruit) => {
      if (f.id === fruitId) {
        return {
          ...f,
          reviews: f.reviews?.map(r => 
            r.id === reviewId ? { ...r, status: newStatus } : r
          )
        };
      }
      return f;
    }));
    addToast(`Đã ${newStatus === 'approved' ? 'duyệt' : 'từ chối'} đánh giá!`);
  };

  const handleDeleteReview = (fruitId: string, reviewId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
      setFruits(prev => prev.map((f: Fruit) => 
        f.id === fruitId 
          ? { ...f, reviews: f.reviews?.filter(r => r.id !== reviewId) } 
          : f
      ));
      addToast("Đã xóa đánh giá thành công!");
    }
  };

  const handleSaveReviewReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo) return;

    setFruits(prev => prev.map((f: Fruit) => {
      if (f.id === replyingTo.fruitId) {
        return {
          ...f,
          reviews: f.reviews?.map(r => {
            if (r.id === replyingTo!.reviewId) {
              return {
                ...r,
                reply: {
                  comment: replyingTo.comment,
                  date: new Date().toISOString().split('T')[0],
                  author: user?.name || 'Admin'
                }
              };
            }
            return r;
          })
        };
      }
      return f;
    }));

    addToast("Đã lưu phản hồi đánh giá!");
    setReplyingTo(null);
  };

  const handleDeleteNews = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
      try {
        await deleteDoc(doc(db, 'news', id));
        setNews(prev => prev.filter(n => n.id !== id));
        addToast("Đã xóa bài viết thành công!");
      } catch (error: any) {
        addToast(`Lỗi khi xóa: ${error.message}`);
      }
    }
  };

  const handleDeleteCategory = (cat: Category) => {
    if (cat === 'Tất cả') {
      addToast("Không thể xóa danh mục mặc định!");
      return;
    }
    const hasProducts = fruits.some(f => f.category === cat);
    if (hasProducts) {
      addToast(`Không thể xóa! Danh mục "${cat}" đang chứa ${fruits.filter(f => f.category === cat).length} sản phẩm.`);
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat}"?`)) {
      setCategories(prev => prev.filter(c => c !== cat));
      addToast(`Đã xóa danh mục ${cat} thành công!`);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
      try {
        await deleteDoc(doc(db, 'coupons', id));
        setCoupons(prev => prev.filter(c => c.id !== id));
        addToast("Đã xóa mã giảm giá thành công!");
      } catch (error) {
        console.error("Firebase Coupon Error:", error);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setEditingFruit(prev => ({ ...prev!, image: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        // Ảnh tin tức cần độ phân giải cao hơn (1200px) để hiển thị banner đẹp
        const compressed = await compressImage(reader.result as string, 1200, 1200);
        setEditingNews(prev => ({ ...prev!, image: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setEditingUser(prev => ({ ...prev!, avatar: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string, carrier?: string, tracking?: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        carrier: carrier || null,
        trackingNumber: tracking || null 
      });
    } catch (error) {
      console.error("Lỗi cập nhật đơn hàng:", error);
    }

    setOrders(prev => prev.map((o: any) => {
      if (o.id === orderId) {
        const updatedOrder = { 
          ...o, 
          status: newStatus,
          carrier: carrier || o.carrier,
          trackingNumber: tracking || o.trackingNumber
        };
        // Mô phỏng việc gửi Push Notification (Trong thực tế việc này do Backend xử lý)
        console.log(`[Push Notification] Gửi tới ${o.email}: Đơn hàng ${orderId} hiện là ${newStatus}`);
        addToast(`Đã cập nhật đơn hàng ${orderId} sang: ${newStatus} & Gửi thông báo!`);
        return updatedOrder;
      }
      return o;
    }));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFruit) return;

    setIsSavingProduct(true);
    try {
      // 1. Chuẩn bị dữ liệu để lưu (Tách ID ra để xử lý riêng)
      const { id, ...dataToSave } = editingFruit;
      
      const payload: any = {
        ...dataToSave,
        reviews: editingFruit.reviews || [],
        color: editingFruit.color || 'bg-green-50',
        stock: editingFruit.stock ?? 50
      };

      // Nếu là cập nhật, ta mới gửi ID kèm theo
      if (id) {
        payload.id = id;
      }

      let savedFruit: Fruit = { ...payload } as Fruit;

      // 2. Đồng bộ lên Firebase
      const docId = id || `f-${Math.random().toString(36).substring(2, 9)}`;
      const fruitDocRef = doc(db, 'fruits', docId);
      
      const firebasePayload = { ...payload };
      if (!id) firebasePayload.id = docId;

      await setDoc(fruitDocRef, firebasePayload, { merge: true });
      savedFruit = { ...firebasePayload } as Fruit;

      // 3. Cập nhật state cục bộ
      if (id) {
        // Update
        setFruits(prev => prev.map((f: Fruit) => f.id === id ? savedFruit : f));
        addToast(`Đã cập nhật: ${savedFruit.name}`);
      } else {
        // Create
        setFruits(prev => [savedFruit, ...prev]);
        addToast(`Đã thêm mới: ${savedFruit.name}`);
      }

      setIsModalOpen(false);
      setEditingFruit(null);
    } catch (err: any) {
      console.error("Lỗi lưu sản phẩm:", err);
      addToast(`Lỗi: ${err.message || "Không thể lưu sản phẩm"}`);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;

    const docId = editingNews.id || `n-${Math.random().toString(36).substring(2, 7)}`;
    const postData = {
      ...editingNews,
      id: docId,
      date: editingNews.date || new Date().toISOString().split('T')[0],
      author: editingNews.author || user?.name || 'Admin'
    } as NewsItem;

    try {
      await setDoc(doc(db, 'news', docId), postData, { merge: true });
      
      if (editingNews.id) {
        setNews(prev => prev.map((n: NewsItem) => n.id === editingNews.id ? postData : n));
        addToast(`Đã cập nhật bài viết: ${postData.title}`);
      } else {
        setNews(prev => [postData, ...prev]);
        addToast(`Đã đăng bài viết mới thành công!`);
      }
    } catch (error: any) {
      addToast(`Lỗi đồng bộ: ${error.message}`);
    }
    setIsNewsModalOpen(false);
    setEditingNews(null);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    const newName = editingCategory.name.trim();
    if (!newName) return;

    if (editingCategory.original) {
      // Cập nhật tên danh mục cho cả danh sách và các sản phẩm liên quan
      setCategories(prev => prev.map((c: Category) => c === editingCategory.original ? (newName as Category) : c));
      setFruits(prev => prev.map((f: Fruit) => f.category === editingCategory.original ? { ...f, category: newName as Category } : f));
      addToast(`Đã cập nhật danh mục thành: ${newName}`);
    } else {
      // Thêm mới
      if (categories.includes(newName as Category)) {
        addToast("Danh mục này đã tồn tại!");
        return;
      }
      setCategories(prev => [...prev, newName as Category]);
      addToast(`Đã thêm danh mục mới: ${newName}`);
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;

    const docId = editingCoupon.id || `c-${Math.random().toString(36).substring(2, 7)}`;
    const finalCoupon = {
      ...editingCoupon,
      id: docId,
      code: editingCoupon.code?.toUpperCase() || ''
    } as Coupon;

    try {
      await setDoc(doc(db, 'coupons', docId), finalCoupon, { merge: true });
      
      if (editingCoupon.id) {
        setCoupons(prev => prev.map((c: Coupon) => c.id === editingCoupon.id ? finalCoupon : c));
      } else {
        setCoupons(prev => [finalCoupon, ...prev]);
      }
      addToast("Đã lưu mã giảm giá thành công!");
    } catch (error) {
      console.error("Firebase Coupon Error:", error);
    }
    setIsCouponModalOpen(false);
    setEditingCoupon(null);
    addToast("Đã lưu mã giảm giá thành công!");
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updatedUser = { ...users.find(u => u.id === editingUser.id), ...editingUser } as User;
    
    if (user && updatedUser.id === user.id) {
      onUpdateUser(updatedUser);
    } else {
      setUsers(prev => prev.map((u: User) => u.id === updatedUser.id ? updatedUser : u));
    }
    
    addToast(`Đã cập nhật thông tin tài khoản ${updatedUser.name}!`);
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBundle) return;

    const docId = editingBundle.id || `b-${Math.random().toString(36).substring(2, 7)}`;
    const bundleData = {
      ...editingBundle,
      id: docId,
      productIds: editingBundle.productIds || [],
      isBundle: true
    } as Bundle;

    try {
      await setDoc(doc(db, 'bundles', docId), bundleData, { merge: true });
      if (editingBundle.id) {
        setBundles(prev => prev.map(b => b.id === editingBundle.id ? bundleData : b));
      } else {
        setBundles(prev => [bundleData, ...prev]);
      }
      addToast("Lưu Combo tiết kiệm thành công!");
    } catch (error: any) {
      addToast(`Lỗi: ${error.message}`);
    }
    setIsBundleModalOpen(false);
    setEditingBundle(null);
  };

  const handleBundleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        // Ảnh Combo cũng cần độ phân giải cao (1200px)
        const compressed = await compressImage(reader.result as string, 1200, 1200);
        setEditingBundle(prev => prev ? { ...prev, image: compressed } : { image: compressed } as any);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background pt-24 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-brand-primary/10 hidden md:block">
        <div className="p-8 space-y-8 h-full">
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all", activeTab === 'dashboard' ? "bg-brand-primary text-white shadow-lg" : "text-zinc-400 hover:bg-brand-primary/5")}
            >
              <LayoutDashboard size={20} /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all", activeTab === 'products' ? "bg-brand-primary text-white shadow-lg" : "text-zinc-400 hover:bg-brand-primary/5")}
            >
              <Package size={20} /> Sản phẩm
            </button>
            <button 
                onClick={() => setActiveTab('flash-sales')}
                className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all", activeTab === 'flash-sales' ? "bg-brand-primary text-white shadow-lg" : "text-zinc-400 hover:bg-brand-primary/5")}
              >
                <Zap size={20} /> Flash Sale
              </button>
              <button 
              onClick={() => setActiveTab('users')}
              className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all", activeTab === 'users' ? "bg-brand-primary text-white shadow-lg" : "text-zinc-400 hover:bg-brand-primary/5")}
            >
              <Users size={20} /> Người dùng
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all", activeTab === 'orders' ? "bg-brand-primary text-white shadow-lg" : "text-zinc-400 hover:bg-brand-primary/5")}
            >
              <ShoppingBag size={20} /> Đơn hàng
            </button>
            <button 
              onClick={() => setActiveTab('news')}
              className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all", activeTab === 'news' ? "bg-brand-primary text-white shadow-lg" : "text-zinc-400 hover:bg-brand-primary/5")}
            >
              <ImageIcon size={20} /> Tin tức
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all", activeTab === 'reviews' ? "bg-brand-primary text-white shadow-lg" : "text-zinc-400 hover:bg-brand-primary/5")}
            >
              <Star size={20} /> Đánh giá
            </button>
            <button 
              onClick={() => setActiveTab('coupons')}
              className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all", activeTab === 'coupons' ? "bg-brand-primary text-white shadow-lg" : "text-zinc-400 hover:bg-brand-primary/5")}
            >
              <Ticket size={20} /> Mã giảm giá
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all", activeTab === 'categories' ? "bg-brand-primary text-white shadow-lg" : "text-zinc-400 hover:bg-brand-primary/5")}
            >
              <Tags size={20} /> Danh mục
            </button>
            <button 
              onClick={() => setActiveTab('bundles')}
              className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all", activeTab === 'bundles' ? "bg-brand-primary text-white shadow-lg" : "text-zinc-400 hover:bg-brand-primary/5")}
            >
              <ShoppingBag size={20} /> Combos tiết kiệm
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-serif font-bold text-brand-primary">
                {{
                  'dashboard': 'Dashboard',
                  'products': 'Sản phẩm',
                  'flash-sales': 'Flash Sale',
                  'users': 'Người dùng',
                  'orders': 'Đơn hàng',
                  'news': 'Tin tức',
                  'reviews': 'Đánh giá',
                  'coupons': 'Mã giảm giá',
                  'categories': 'Danh mục',
                  'bundles': 'Combos tiết kiệm'
                }[activeTab] || activeTab}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-zinc-400 italic">Quản lý hệ thống Fruit Haven</p>
                {activeTab === 'products' && lowStockFruits.length > 0 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full animate-pulse">
                    <AlertCircle size={10} /> {lowStockFruits.length} mặt hàng sắp hết
                  </span>
                )}
              </div>
            </div>
            {activeTab === 'products' && (
              <button 
                onClick={() => { 
                  setEditingFruit({ 
                    name: '', 
                    price: 0, 
                    category: 'Nhiệt Đới', 
                    unit: 'kg', 
                    description: '', 
                    image: '', 
                    color: 'bg-green-50', 
                    stock: 50 
                  }); 
                  setIsModalOpen(true); 
                }}
                className="px-6 py-3 bg-brand-primary text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
              >
                <Plus size={18} /> Thêm sản phẩm
              </button>
            )}
            {activeTab === 'flash-sales' && (
              <button 
                onClick={() => { 
                  setEditingFruit({ 
                    name: '', 
                    price: 0, 
                    salePrice: 0, 
                    flashSaleExpiry: '',
                    category: 'Nhiệt Đới', 
                    unit: 'kg', 
                    description: '', 
                    image: '', 
                    color: 'bg-red-50', 
                    stock: 50 
                  }); 
                  setIsModalOpen(true); 
                }}
                className="px-6 py-3 bg-red-500 text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-red-600 transition-all shadow-lg shadow-red-200"
              >
                <Zap size={18} /> Thêm sản phẩm Sale
              </button>
            )}
            {activeTab === 'orders' && (
              <button 
                onClick={exportOrdersToCSV}
                className="px-6 py-3 bg-white text-brand-primary border border-brand-primary/20 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-brand-primary/5 transition-all shadow-sm"
              >
                <Download size={18} /> Xuất CSV
              </button>
            )}
            {activeTab === 'coupons' && (
              <button 
                onClick={() => { 
                  setEditingCoupon({ 
                    code: '', 
                    discountType: 'percentage', 
                    value: 0, 
                    description: '', 
                    expiry: new Date().toLocaleDateString('vi-VN') 
                  }); 
                  setIsCouponModalOpen(true); 
                }}
                className="px-6 py-3 bg-brand-primary text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
              >
                <Plus size={18} /> Thêm Coupon
              </button>
            )}
            {activeTab === 'bundles' && (
              <button 
                onClick={() => { 
                  setEditingBundle({ 
                    name: '', 
                    price: 0, 
                    originalPrice: 0, 
                    description: '', 
                    image: '', 
                    productIds: [],
                    isBundle: true,
                    unit: 'Combo',
                    color: 'bg-green-50'
                  }); 
                  setIsBundleModalOpen(true); 
                }}
                className="px-6 py-3 bg-brand-primary text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
              >
                <Plus size={18} /> Thêm Combo
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard title="Doanh thu" value={`${stats.totalRevenue.toLocaleString()}đ`} icon={<DollarSign />} color="bg-green-500" />
                  <StatCard title="Đơn hàng" value={stats.totalOrders} icon={<ShoppingBag />} color="bg-orange-500" />
                  <StatCard title="Khách hàng" value={stats.totalUsers} icon={<Users />} color="bg-blue-500" />
                  <StatCard title="Sản phẩm" value={stats.totalProducts} icon={<Package />} color="bg-purple-500" />
                </motion.div>

                {/* Cảnh báo tồn kho thấp */}
                {lowStockFruits.length > 0 && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-red-50 border border-red-100 p-6 rounded-[32px] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                        <AlertCircle size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-red-900">Cảnh báo nhập hàng!</h4>
                        <p className="text-sm text-red-700">Có {lowStockFruits.length} sản phẩm sắp hết hàng trong kho.</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveTab('products')} className="px-6 py-2 bg-white text-red-600 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-red-50 transition-colors">
                      Kiểm tra ngay
                    </button>
                  </motion.div>
                )}

                {/* Biểu đồ doanh thu */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-8 rounded-[40px] border border-brand-primary/10 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                      <TrendingUp size={20} />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-brand-primary">Xu hướng doanh thu (7 ngày qua)</h3>
                  </div>
                  
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4F6F52" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#4F6F52" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          formatter={(value: any) => [new Intl.NumberFormat('vi-VN').format(Number(value)) + 'đ', 'Doanh thu']}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#4F6F52" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'flash-sales' && (
              <motion.div key="flash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-white p-8 rounded-[40px] border border-brand-primary/10 shadow-sm flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                        <Zap size={24} fill="currentColor" />
                      </div>
                      <div>
                        <h3 className="text-xl font-serif font-bold text-brand-primary">Sản phẩm đang khuyến mãi</h3>
                        <p className="text-sm text-zinc-400">Có {flashSaleFruits.length} sản phẩm đang chạy Flash Sale</p>
                      </div>
                   </div>
                </div>

                <div className="bg-white rounded-[32px] overflow-hidden border border-brand-primary/10">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-widest">
                        <th className="px-6 py-4">Sản phẩm</th>
                        <th className="px-6 py-4">Giá gốc</th>
                        <th className="px-6 py-4">Giá Sale</th>
                        <th className="px-6 py-4">Giảm</th>
                        <th className="px-6 py-4">Hết hạn sau</th>
                        <th className="px-6 py-4">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-primary/5">
                      {flashSaleFruits.map(fruit => (
                        <tr key={fruit.id} className="hover:bg-brand-primary/5 transition-colors">
                          <td className="px-6 py-4 font-bold text-brand-primary">{fruit.name}</td>
                          <td className="px-6 py-4 text-sm text-zinc-400 line-through">{fruit.price.toLocaleString()}đ</td>
                          <td className="px-6 py-4 font-bold text-red-500">{fruit.salePrice?.toLocaleString()}đ</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-black rounded-lg">
                              -{Math.round((1 - (fruit.salePrice || 0) / fruit.price) * 100)}%
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button onClick={() => { setEditingFruit(fruit); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div key="prod" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {/* Product Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-3xl border border-brand-primary/10 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Tổng sản phẩm</p>
                      <h4 className="text-2xl font-bold text-brand-primary">{fruits.length}</h4>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-3xl border border-brand-primary/10 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                      <Zap size={24} fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Đang khuyến mãi</p>
                      <h4 className="text-2xl font-bold text-red-500">{flashSaleFruits.length}</h4>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-brand-primary/10 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-red-50/50 transition-colors" onClick={() => setSearchQuery('sắp hết')}>
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Sắp hết hàng</p>
                      <h4 className="text-2xl font-bold text-orange-500">{lowStockFruits.length}</h4>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Tìm sản phẩm để quản lý..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white border border-brand-primary/10 rounded-3xl focus:outline-none"
                  />
                </div>

                <div className="bg-white rounded-[32px] overflow-hidden border border-brand-primary/10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-widest">
                        <th className="px-6 py-4">Sản phẩm</th>
                        <th className="px-6 py-4">Danh mục</th>
                        <th className="px-6 py-4">Kho hàng</th>
                        <th className="px-6 py-4">Giá</th>
                        <th className="px-6 py-4">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-primary/5">
                      {filteredFruits.map(fruit => (
                        <tr key={fruit.id} className="hover:bg-brand-primary/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={fruit.image} className="w-10 h-10 rounded-lg object-cover bg-zinc-100" />
                              <span className="font-bold text-brand-primary">{fruit.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-zinc-500">{fruit.category}</td>
                          <td className="px-6 py-4 text-sm">
                            <div className={cn(
                              "flex items-center gap-2 font-bold",
                              (fruit.stock || 0) < 10 ? "text-red-500" : "text-brand-primary"
                            )}>
                              {(fruit.stock || 0) < 10 && <AlertCircle size={14} className="animate-bounce" />}
                              {fruit.stock ?? 50} {fruit.unit}
                              {(fruit.stock || 0) === 0 && <span className="text-[10px] uppercase bg-red-500 text-white px-2 py-0.5 rounded ml-1">Hết</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-brand-primary">{fruit.price.toLocaleString()}đ</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => { setEditingFruit(fruit); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Edit size={18} /></button>
                              <button onClick={() => handleDeleteProduct(fruit.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[32px] overflow-hidden border border-brand-primary/10">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-widest">
                      <th className="px-6 py-4">Đơn hàng</th>
                      <th className="px-6 py-4">Khách hàng</th>
                      <th className="px-6 py-4">Tổng tiền</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-primary/5">
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 font-bold text-brand-primary">{order.id}</td>
                        <td className="px-6 py-4 text-sm">
                          <p className="font-bold text-brand-primary">{order.customerName}</p>
                          <p className="text-zinc-400 text-xs">{order.email}</p>
                        </td>
                        <td className="px-6 py-4 font-bold">{order.total.toLocaleString()}đ</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                            order.status === 'Đã giao' ? "bg-green-100 text-green-600" : 
                            order.status === 'Đang giao' ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"
                          )}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <select 
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="w-full text-xs font-bold bg-brand-background border border-brand-primary/10 rounded-lg p-1"
                            >
                              <option value="Đang xử lý">Đang xử lý</option>
                              <option value="Đang giao">Đang giao</option>
                              <option value="Đã giao">Đã giao</option>
                            </select>
                            
                            {order.status === 'Đang giao' && (
                              <div className="flex gap-2">
                                <select 
                                  value={order.carrier || ''}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, 'Đang giao', e.target.value as any)}
                                  className="text-[10px] bg-white border rounded p-1"
                                >
                                  <option value="">Chọn hãng</option>
                                  <option value="GHTK">GHTK</option>
                                  <option value="GHN">GHN</option>
                                </select>
                                <input 
                                  type="text"
                                  placeholder="Mã vận đơn"
                                  defaultValue={order.trackingNumber}
                                  onBlur={(e) => handleUpdateOrderStatus(order.id, 'Đang giao', order.carrier, e.target.value)}
                                  className="text-[10px] bg-white border rounded p-1 w-20"
                                />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === 'news' && (
              <motion.div key="news" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm bài viết..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white border border-brand-primary/10 rounded-3xl focus:outline-none"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-serif font-bold text-brand-primary">Danh sách bài viết</h3>
                  <button 
                    onClick={() => {
                      setEditingNews({
                        title: '',
                        category: 'Tin Tức',
                        excerpt: '',
                        content: '',
                        image: ''
                      });
                      setIsNewsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-brand-primary text-white rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-md hover:bg-brand-primary/90"
                  >
                    <Plus size={16} /> Viết bài mới
                  </button>
                </div>
                <div className="bg-white rounded-[32px] overflow-hidden border border-brand-primary/10">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-widest">
                        <th className="px-6 py-4">Bài viết</th>
                        <th className="px-6 py-4">Chuyên mục</th>
                        <th className="px-6 py-4">Ngày đăng</th>
                        <th className="px-6 py-4">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-primary/5">
                      {filteredNews.map(post => (
                        <tr key={post.id} className="hover:bg-brand-primary/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary">
                                <FileText size={18} />
                              </div>
                              <span className="font-bold text-brand-primary text-sm line-clamp-1">{post.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-zinc-500">{post.category}</td>
                          <td className="px-6 py-4 text-xs text-zinc-400">{post.date}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => { setEditingNews(post); setIsNewsModalOpen(true); }}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteNews(post.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[32px] overflow-hidden border border-brand-primary/10">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-widest">
                      <th className="px-6 py-4">Khách hàng</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Vai trò</th>
                      <th className="px-6 py-4">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-primary/5">
                    {filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td className="px-6 py-4 flex items-center gap-3 font-bold text-brand-primary">
                          {u.avatar ? <img src={u.avatar} className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">{u.name[0]}</div>}
                          {u.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-500">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            u.role === 'admin' ? "bg-red-100 text-red-600" : 
                            u.role === 'staff' ? "bg-blue-100 text-blue-600" : 
                            "bg-zinc-100 text-zinc-500"
                          )}>
                            {u.role === 'admin' ? 'Quản trị viên' : u.role === 'staff' ? 'Nhân viên' : 'Khách hàng'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => { setEditingUser(u); setIsUserModalOpen(true); }}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[32px] overflow-hidden border border-brand-primary/10">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-widest">
                      <th className="px-6 py-4">Sản phẩm</th>
                      <th className="px-6 py-4">Khách hàng</th>
                      <th className="px-6 py-4">Sao</th>
                      <th className="px-6 py-4">Nội dung</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-primary/5">
                    {allReviews.map(review => (
                      <tr key={review.id} className="hover:bg-brand-primary/5 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-brand-primary">{review.fruitName}</td>
                        <td className="px-6 py-4 text-sm">
                          <p className="font-bold">{review.userName}</p>
                          <p className="text-zinc-400 text-[10px]">{review.date}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={12} className={cn(s <= review.rating ? "fill-current" : "text-zinc-200")} />
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-500 max-w-xs truncate italic">
                          <div className="flex flex-col gap-1">
                            <span>"{review.comment}"</span>
                            {review.reply && (
                              <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                                <MessageSquare size={10} /> Đã phản hồi ({review.thanksCount} cảm ơn)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {review.status !== 'approved' && (
                              <button 
                                onClick={() => handleUpdateReviewStatus(review.fruitId, review.id, 'approved')}
                                className="p-2 text-green-500 hover:bg-green-50 rounded-lg"
                                title="Duyệt đánh giá"
                              >
                                <CheckCircle2 size={18} />
                              </button>
                            )}
                            {review.status !== 'rejected' && (
                              <button 
                                onClick={() => handleUpdateReviewStatus(review.fruitId, review.id, 'rejected')}
                                className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"
                                title="Từ chối đánh giá"
                              >
                                <X size={18} />
                              </button>
                            )}
                            <button 
                              onClick={() => setReplyingTo({ fruitId: review.fruitId, reviewId: review.id, comment: review.reply?.comment || '' })}
                              className={cn("p-2 rounded-lg transition-all", review.reply ? "text-green-500 hover:bg-green-50" : "text-blue-500 hover:bg-blue-50")}
                              title={review.reply ? "Sửa phản hồi" : "Trả lời đánh giá"}
                            >
                              <MessageSquare size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteReview(review.fruitId, review.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === 'coupons' && (
              <motion.div key="coupons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[32px] overflow-hidden border border-brand-primary/10">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-widest">
                      <th className="px-6 py-4">Mã</th>
                      <th className="px-6 py-4">Loại giảm</th>
                      <th className="px-6 py-4">Giá trị</th>
                      <th className="px-6 py-4">HSD</th>
                      <th className="px-6 py-4">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-primary/5">
                    {coupons.map(coupon => (
                      <tr key={coupon.id} className="hover:bg-brand-primary/5 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-brand-primary">{coupon.code}</td>
                        <td className="px-6 py-4 text-xs font-medium text-zinc-500">
                          {coupon.discountType === 'percentage' ? 'Phần trăm' : 'Số tiền cố định'}
                        </td>
                        <td className="px-6 py-4 font-bold">
                          {coupon.discountType === 'percentage' ? `${coupon.value}%` : `${coupon.value.toLocaleString()}đ`}
                        </td>
                        <td className="px-6 py-4 text-xs text-zinc-400">{coupon.expiry}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingCoupon(coupon); setIsCouponModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                            <button onClick={() => handleDeleteCoupon(coupon.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === 'categories' && (
              <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-serif font-bold text-brand-primary">Quản lý danh mục</h3>
                  <button 
                    onClick={() => { setEditingCategory({ original: '' as Category, name: '' }); setIsCategoryModalOpen(true); }}
                    className="px-4 py-2 bg-brand-primary text-white rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-md hover:bg-brand-primary/90"
                  >
                    <Plus size={16} /> Thêm danh mục
                  </button>
                </div>
                <div className="bg-white rounded-[32px] overflow-hidden border border-brand-primary/10">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-widest">
                        <th className="px-6 py-4">Tên danh mục</th>
                        <th className="px-6 py-4">Số lượng sản phẩm</th>
                        <th className="px-6 py-4">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-primary/5">
                      {categories.map(cat => (
                        <tr key={cat} className="hover:bg-brand-primary/5 transition-colors">
                          <td className="px-6 py-4 font-bold text-brand-primary">{cat}</td>
                          <td className="px-6 py-4 text-sm text-zinc-500">
                            {fruits.filter(f => f.category === cat).length} sản phẩm
                          </td>
                          <td className="px-6 py-4">
                            {cat !== 'Tất cả' && (
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => { setEditingCategory({ original: cat, name: cat }); setIsCategoryModalOpen(true); }}
                                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                  <Edit size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteCategory(cat)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'bundles' && (
              <motion.div key="bundles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-white rounded-[32px] overflow-hidden border border-brand-primary/10">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-widest">
                        <th className="px-6 py-4">Combo</th>
                        <th className="px-6 py-4">Sản phẩm</th>
                        <th className="px-6 py-4">Giá gốc</th>
                        <th className="px-6 py-4">Giá tiết kiệm</th>
                        <th className="px-6 py-4">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-primary/5">
                      {bundles.map(bundle => (
                        <tr key={bundle.id} className="hover:bg-brand-primary/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={bundle.image} className="w-10 h-10 object-cover rounded-lg" />
                              <span className="font-bold text-brand-primary text-sm">{bundle.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {bundle.productIds.map(pid => {
                                const prod = fruits.find(f => f.id === pid);
                                return prod ? (
                                  <span key={pid} className="px-2 py-0.5 bg-brand-primary/5 text-brand-primary text-[10px] rounded-full">
                                    {prod.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-zinc-400 line-through">{bundle.originalPrice.toLocaleString()}đ</td>
                          <td className="px-6 py-4 font-bold text-brand-primary">{bundle.price.toLocaleString()}đ</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => { setEditingBundle(bundle); setIsBundleModalOpen(true); }}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={async () => {
                                  if (window.confirm('Xóa Combo này?')) {
                                    await deleteDoc(doc(db, 'bundles', bundle.id));
                                    setBundles(prev => prev.filter(b => b.id !== bundle.id));
                                    addToast("Đã xóa Combo thành công!");
                                  }
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modal Add/Edit Product */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSaveProduct} className="p-8 md:p-12 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-3xl font-serif font-bold text-brand-primary">{editingFruit?.id ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-400 hover:text-brand-primary"><X size={24} /></button>
                </div>

                {/* Image Upload Area */}
                <div className="space-y-2 text-center">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "mx-auto w-40 h-40 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden",
                      editingFruit?.image ? "border-brand-primary/20" : "border-zinc-200 hover:border-brand-primary/40",
                      editingFruit?.color
                    )}
                  >
                    {editingFruit?.image ? (
                      <img src={editingFruit.image} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Camera size={32} className="text-zinc-300 mb-2" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Chọn ảnh</span>
                      </>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  <p className="text-[10px] text-zinc-400 italic">Khuyên dùng ảnh tỉ lệ 4:5</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Tên sản phẩm</label>
                    <input 
                      type="text" required value={editingFruit?.name} 
                      onChange={e => setEditingFruit({...editingFruit!, name: e.target.value})}
                      className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Danh mục</label>
                    <select 
                      value={editingFruit?.category} 
                      onChange={e => setEditingFruit({...editingFruit!, category: e.target.value as Category})}
                      className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none appearance-none"
                    >
                      {categories.filter(c => c !== 'Tất cả').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Giá (VND)</label>
                    <input 
                      type="number" required value={editingFruit?.price} 
                      onChange={e => setEditingFruit({...editingFruit!, price: Number(e.target.value)})}
                      className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Đơn vị (kg/quả/...)</label>
                    <input 
                      type="text" required value={editingFruit?.unit} 
                      onChange={e => setEditingFruit({...editingFruit!, unit: e.target.value})}
                      className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Số lượng kho</label>
                    <input 
                      type="number" required value={editingFruit?.stock || 0} 
                      onChange={e => setEditingFruit({...editingFruit!, stock: Number(e.target.value)})}
                      className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center px-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-red-500">Giá Sale (Để 0 nếu không sale)</label>
                      {/* Tự động tính % giảm giá khi có đủ Giá gốc và Giá Sale hợp lệ */}
                      {editingFruit?.price && editingFruit?.salePrice && editingFruit.salePrice > 0 && editingFruit.salePrice < editingFruit.price && (
                        <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-lg animate-pulse">
                          GIẢM {Math.round((1 - editingFruit.salePrice / editingFruit.price) * 100)}%
                        </span>
                      )}
                    </div>
                    <input 
                      type="number" value={editingFruit?.salePrice || 0} 
                      onChange={e => setEditingFruit({...editingFruit!, salePrice: Number(e.target.value)})}
                      className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Thời gian kết thúc Sale</label>
                    <input 
                      type="datetime-local" 
                      value={editingFruit?.flashSaleExpiry ? editingFruit.flashSaleExpiry.slice(0, 16) : ''} 
                      onChange={e => setEditingFruit({...editingFruit!, flashSaleExpiry: e.target.value})}
                      className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Màu nền card</label>
                  <div className="flex flex-wrap gap-3 p-4 bg-brand-background rounded-3xl border border-brand-primary/10">
                    {FRUIT_COLORS.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setEditingFruit({...editingFruit!, color: color.value})}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all",
                          color.value,
                          editingFruit?.color === color.value ? "border-brand-primary scale-110" : "border-transparent"
                        )}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Mô tả</label>
                  <textarea 
                    required rows={3} value={editingFruit?.description} 
                    onChange={e => setEditingFruit({...editingFruit!, description: e.target.value})}
                    className="w-full px-6 py-4 bg-brand-background border border-brand-primary/10 rounded-[32px] focus:outline-none resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSavingProduct}
                  className={cn(
                    "w-full py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all",
                    isSavingProduct ? "opacity-70 cursor-not-allowed" : "hover:bg-brand-primary/90"
                  )}
                >
                  {isSavingProduct ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                  <span>{isSavingProduct ? 'Đang lưu...' : 'Lưu sản phẩm'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Add/Edit Coupon */}
      <AnimatePresence>
        {isCouponModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCouponModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSaveCoupon} className="p-8 md:p-10 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-serif font-bold text-brand-primary">{editingCoupon?.id ? 'Sửa Coupon' : 'Thêm Coupon'}</h3>
                  <button type="button" onClick={() => setIsCouponModalOpen(false)} className="p-2 text-zinc-400 hover:text-brand-primary"><X size={24} /></button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Mã CODE</label>
                    <input type="text" required value={editingCoupon?.code} onChange={e => setEditingCoupon({...editingCoupon!, code: e.target.value.toUpperCase()})} className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none uppercase font-mono" placeholder="GIAMGIA50" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Loại giảm</label>
                      <select value={editingCoupon?.discountType} onChange={e => setEditingCoupon({...editingCoupon!, discountType: e.target.value as any})} className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none">
                        <option value="percentage">Phần trăm (%)</option>
                        <option value="fixed">Số tiền (đ)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Giá trị</label>
                      <input type="number" required value={editingCoupon?.value} onChange={e => setEditingCoupon({...editingCoupon!, value: Number(e.target.value)})} className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Đơn tối thiểu</label>
                    <input type="number" value={editingCoupon?.minOrder} onChange={e => setEditingCoupon({...editingCoupon!, minOrder: Number(e.target.value)})} className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none" placeholder="0" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Hạn sử dụng</label>
                    <input type="text" value={editingCoupon?.expiry} onChange={e => setEditingCoupon({...editingCoupon!, expiry: e.target.value})} className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none" placeholder="31/12/2026" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Mô tả</label>
                    <textarea rows={2} value={editingCoupon?.description} onChange={e => setEditingCoupon({...editingCoupon!, description: e.target.value})} className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-3xl focus:outline-none resize-none text-sm" />
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
                  <Save size={18} /> Lưu mã giảm giá
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Add/Edit News */}
      <AnimatePresence>
        {isNewsModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsNewsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSaveNews} className="p-8 md:p-12 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-serif font-bold text-brand-primary">{editingNews?.id ? 'Sửa bài viết' : 'Viết bài mới'}</h3>
                  <button type="button" onClick={() => setIsNewsModalOpen(false)} className="p-2 text-zinc-400 hover:text-brand-primary"><X size={24} /></button>
                </div>

                <div className="space-y-4">
                  <div 
                    onClick={() => newsFileInputRef.current?.click()}
                    className="w-full aspect-video rounded-3xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-zinc-50 hover:bg-zinc-100 transition-all"
                  >
                    {editingNews?.image ? (
                      <img src={editingNews.image} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <ImageIcon size={40} className="text-zinc-300 mx-auto mb-2" />
                        <span className="text-xs font-bold text-zinc-400 uppercase">Ảnh đại diện bài viết</span>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={newsFileInputRef} onChange={handleNewsImageUpload} accept="image/*" className="hidden" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Tiêu đề</label>
                      <input type="text" required value={editingNews?.title} onChange={e => setEditingNews({...editingNews!, title: e.target.value})} className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Chuyên mục</label>
                      <select value={editingNews?.category} onChange={e => setEditingNews({...editingNews!, category: e.target.value})} className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none">
                        <option value="Tin Tức">Tin Tức</option>
                        <option value="Mẹo Hay">Mẹo Hay</option>
                        <option value="Sức Khỏe">Sức Khỏe</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Ngày đăng</label>
                      <input 
                        type="date" 
                        required 
                        value={editingNews?.date || new Date().toISOString().split('T')[0]} 
                        onChange={e => setEditingNews({...editingNews!, date: e.target.value})} 
                        className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Tóm tắt ngắn</label>
                    <input type="text" required value={editingNews?.excerpt} onChange={e => setEditingNews({...editingNews!, excerpt: e.target.value})} className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Nội dung chi tiết</label>
                    <textarea required rows={6} value={editingNews?.content} onChange={e => setEditingNews({...editingNews!, content: e.target.value})} className="w-full px-6 py-4 bg-brand-background border border-brand-primary/10 rounded-[32px] focus:outline-none resize-none" />
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
                  <Save size={18} /> {editingNews?.id ? 'Cập nhật bài viết' : 'Đăng bài ngay'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Add/Edit Bundle */}
      <AnimatePresence>
        {isBundleModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBundleModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSaveBundle} className="p-8 md:p-12 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-serif font-bold text-brand-primary">{editingBundle?.id ? 'Sửa Combo' : 'Thêm Combo mới'}</h3>
                  <button type="button" onClick={() => setIsBundleModalOpen(false)} className="p-2 text-zinc-400 hover:text-brand-primary"><X size={24} /></button>
                </div>

                <div className="space-y-4">
                  <div 
                    onClick={() => bundleFileInputRef.current?.click()}
                    className="w-full aspect-video rounded-3xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-zinc-50 hover:bg-zinc-100 transition-all"
                  >
                    {editingBundle?.image ? (
                      <img src={editingBundle.image} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <ImageIcon size={40} className="text-zinc-300 mx-auto mb-2" />
                        <span className="text-xs font-bold text-zinc-400 uppercase">Ảnh đại diện Combo</span>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={bundleFileInputRef} onChange={handleBundleImageUpload} accept="image/*" className="hidden" />

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Tên Combo</label>
                    <input type="text" required value={editingBundle?.name} onChange={e => setEditingBundle({...editingBundle!, name: e.target.value})} className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Giá gốc (Tổng)</label>
                      <input type="number" required value={editingBundle?.originalPrice} onChange={e => setEditingBundle({...editingBundle!, originalPrice: Number(e.target.value)})} className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Giá Combo (Đã giảm)</label>
                      <input type="number" required value={editingBundle?.price} onChange={e => setEditingBundle({...editingBundle!, price: Number(e.target.value)})} className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Chọn sản phẩm trong Combo</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 overflow-y-auto max-h-40 p-2 border border-brand-primary/5 rounded-2xl bg-brand-background">
                      {fruits.map(f => (
                        <label key={f.id} className="flex items-center gap-2 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-brand-primary/10">
                          <input 
                            type="checkbox" 
                            checked={editingBundle?.productIds?.includes(f.id)} 
                            onChange={(e) => {
                              const currentIds = editingBundle?.productIds || [];
                              if (e.target.checked) {
                                setEditingBundle({...editingBundle!, productIds: [...currentIds, f.id]});
                              } else {
                                setEditingBundle({...editingBundle!, productIds: currentIds.filter(id => id !== f.id)});
                              }
                            }}
                            className="rounded border-zinc-200 text-brand-primary focus:ring-brand-primary"
                          />
                          <span className="text-xs font-medium text-zinc-600 truncate">{f.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Mô tả Combo</label>
                    <textarea rows={3} value={editingBundle?.description} onChange={e => setEditingBundle({...editingBundle!, description: e.target.value})} className="w-full px-6 py-4 bg-brand-background border border-brand-primary/10 rounded-[32px] focus:outline-none resize-none" />
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
                  <Save size={18} /> {editingBundle?.id ? 'Cập nhật Combo' : 'Tạo Combo ngay'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Add/Edit Category */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCategoryModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSaveCategory} className="p-8 space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-3xl font-serif font-bold text-brand-primary">
                    {editingCategory?.original ? 'Sửa danh mục' : 'Thêm danh mục mới'}
                  </h3>
                  <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="p-2 text-zinc-400 hover:text-brand-primary"><X size={24} /></button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Tên danh mục</label>
                    <input 
                      type="text" required value={editingCategory?.name} 
                      onChange={e => setEditingCategory({...editingCategory!, name: e.target.value})}
                      className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg">
                  <Save size={18} /> Lưu danh mục
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Edit User */}
      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsUserModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSaveUser} className="p-8 space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-3xl font-serif font-bold text-brand-primary">Sửa tài khoản</h3>
                  <button type="button" onClick={() => setIsUserModalOpen(false)} className="p-2 text-zinc-400 hover:text-brand-primary"><X size={24} /></button>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="relative group cursor-pointer" onClick={() => userFileInputRef.current?.click()}>
                    <div className="w-24 h-24 rounded-full border-4 border-brand-primary/10 overflow-hidden bg-brand-background flex items-center justify-center text-brand-primary/20 group-hover:bg-brand-primary/5 transition-colors">
                      {editingUser?.avatar ? (
                        <img src={editingUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={40} />
                      )}
                    </div>
                    <button 
                      className="absolute bottom-0 right-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <Camera size={14} />
                    </button>
                  </div>
                  <input type="file" ref={userFileInputRef} onChange={handleUserImageUpload} accept="image/*" className="hidden" />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Họ và tên</label>
                    <input 
                      type="text" required value={editingUser?.name} 
                      onChange={e => setEditingUser({...editingUser!, name: e.target.value})}
                      className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none"
                    />
                  </div>
                  <p className="text-center text-xs text-zinc-400 italic">Email: {editingUser?.email}</p>
                  
                  {isSuperAdmin(user) && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Phân quyền tài khoản</label>
                      <select 
                        value={editingUser?.role || 'user'} 
                        onChange={e => setEditingUser({...editingUser!, role: e.target.value as any})}
                        className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm font-medium"
                      >
                        <option value="user">Khách hàng (User)</option>
                        <option value="staff">Nhân viên (Staff)</option>
                        <option value="admin">Quản trị viên (Admin)</option>
                      </select>
                      <p className="text-[9px] text-zinc-400 px-4 italic">Lưu ý: Chỉ Super Admin mới có quyền thay đổi vai trò.</p>
                    </div>
                  )}
                </div>

                <button type="submit" className="w-full py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg">
                  <Save size={18} /> Lưu thay đổi
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Trả lời Đánh giá */}
      <AnimatePresence>
        {replyingTo && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setReplyingTo(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSaveReviewReply} className="p-8 md:p-10 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-serif font-bold text-brand-primary">Phản hồi đánh giá</h3>
                  <button type="button" onClick={() => setReplyingTo(null)} className="p-2 text-zinc-400 hover:text-brand-primary"><X size={24} /></button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-brand-primary/5 rounded-2xl text-sm italic text-zinc-600 border border-brand-primary/10">
                    "{allReviews.find(r => r.id === replyingTo.reviewId)?.comment}"
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Nội dung phản hồi</label>
                    <textarea 
                      required rows={4} value={replyingTo?.comment} 
                      onChange={e => setReplyingTo(prev => prev ? {
                        fruitId: prev.fruitId,
                        reviewId: prev.reviewId,
                        comment: e.target.value
                      } : null)}
                      className="w-full px-6 py-4 bg-brand-background border border-brand-primary/10 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none text-sm"
                      placeholder="Nhập nội dung phản hồi của bạn..."
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
                  <Save size={18} /> Lưu phản hồi
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-brand-primary/10 shadow-sm flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{title}</p>
        <p className="text-xl font-serif font-bold text-brand-primary">{value}</p>
      </div>
    </div>
  );
}
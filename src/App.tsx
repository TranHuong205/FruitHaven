import { useState, useMemo, useEffect, useCallback, useDeferredValue } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search, SlidersHorizontal, Mail, CheckCircle2, Star, Quote, ChevronLeft, ChevronRight, Calendar, User as UserIcon, ArrowRight, ArrowLeftRight, X as CloseIcon, BarChart } from 'lucide-react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'; // Import BrowserRouter, Routes, Route, Link
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductSkeleton from './components/ProductSkeleton';
import CartDrawer from './components/CartDrawer';
import BundlesSection from './components/BundlesSection';
import FlashSaleSection from './components/FlashSaleSection';
import QuickViewModal from './components/QuickViewModal';
import Footer from './components/Footer';
import { FRUITS, CATEGORIES, NEWS, COUPONS, BUNDLES } from './constants';
import { Fruit, CartItem, Category, User, Review, NewsItem, Coupon, Bundle, PointTransaction, Order } from './types';
import ProductDetailPage from './ProductDetailPage';
import AboutPage from './AboutPage';
import LoginPage from './LoginPage';
import ProfilePage from './ProfilePage';
import CheckoutPage from './CheckoutPage';
import RegisterPage from './RegisterPage';
import AllReviewsPage from './AllReviewsPage';
import NewsPage from './NewsPage';
import NewsDetailPage from './NewsDetailPage';
import ContactPage from './ContactPage';
import RefundPolicyPage from './RefundPolicyPage';
import ShippingPolicyPage from './ShippingPolicyPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import FAQPage from './FAQPage';
import AddressManagementPage from './AddressManagementPage';
import TrackOrderPage from './TrackOrderPage';
import OrderDetailPage from './OrderDetailPage';
import ScrollToTop from './components/ScrollToTop';
import AdminPage from './AdminPage';
import { NotFoundPage, AccessDeniedPage } from './ErrorPages';
import PrivateRoute from './components/PrivateRoute';
import WishlistPage from './WishlistPage';
import CategoriesPage from './CategoriesPage';
import { useLocation } from 'react-router-dom';
import SearchPage from './SearchPage';
import ChatWidget from './components/ChatWidget';
import { db, auth } from './lib/firebaseClient';
import { collection, query, getDocs, where, orderBy, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ADMIN_EMAILS, checkIsAdmin } from './lib/auth';
import { cn } from './lib/utils';

// Khai báo kiểu cho gtag để TypeScript nhận diện được trên đối tượng window
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

// VAPID Public Key (Bạn sẽ lấy từ web-push library hoặc dịch vụ như Firebase/OneSignal)
const VAPID_PUBLIC_KEY = 'BEl62vp9ihSrx6S-F89R6G_4D1QZ2A6j_L_26xM0f8b8u5A6_...'; // Hãy thay bằng key thật không có dấu ...

function urlBase64ToUint8Array(base64String: string) {
  try {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
  } catch (e) { return new Uint8Array(); }
}

type SortOption = 'default' | 'price-asc' | 'price-desc';

export default function App() {
  const location = useLocation();
  const [fruitList, setFruitList] = useState<Fruit[]>(() => {
    const saved = localStorage.getItem('fruit-haven-list');
    return saved ? JSON.parse(saved) : FRUITS;
  });
  const [newsList, setNewsList] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('fruit-haven-news');
    return saved ? JSON.parse(saved) : NEWS;
  });
  const [categoryList, setCategoryList] = useState<Category[]>(() => {
    const saved = localStorage.getItem('fruit-haven-categories');
    return saved ? JSON.parse(saved) : CATEGORIES;
  });
  const [couponList, setCouponList] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('fruit-haven-coupons');
    return saved ? JSON.parse(saved) : COUPONS;
  });
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('fruit-haven-recent');
    return saved ? JSON.parse(saved) : [];
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('fruit-haven-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  // Sử dụng Deferred Value để không chặn UI khi gõ tìm kiếm
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [quickViewProduct, setQuickViewProduct] = useState<Fruit | null>(null);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const [displayLimit, setDisplayLimit] = useState(8);

  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [minRating, setMinRating] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; message: string }[]>([]);
  const [user, setUser] = useState<User | null>(() => {
    try {
      // Kiểm tra cả hai loại bộ nhớ
      const savedUser = localStorage.getItem('fruit-haven-user') || sessionStorage.getItem('fruit-haven-user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Lỗi khi tải thông tin người dùng:", e);
      return null;
    }
  });
  const [orders, setOrders] = useState<any[]>(() => {
    const savedOrders = localStorage.getItem('fruit-haven-orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });
  const [pointTransactions, setPointTransactions] = useState<PointTransaction[]>(() => {
    const saved = localStorage.getItem('fruit-haven-point-history');
    return saved ? JSON.parse(saved) : [];
  });
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('fruit-haven-registered-users');
      let users: User[] = saved ? JSON.parse(saved) : [];

      const adminPassword = 'admin@123';

      // Đảm bảo tất cả email admin trong cấu hình đều có tài khoản và mật khẩu chuẩn
      ADMIN_EMAILS.forEach((adminEmail, index) => {
        const adminIndex = users.findIndex(u => u.email.toLowerCase() === adminEmail.toLowerCase());
        if (adminIndex === -1) {
          users.push({
            id: `admin-${index}`,
            name: index === 0 ? 'Quản trị viên' : `Admin ${index + 1}`,
            email: adminEmail,
            password: adminPassword,
            avatar: '',
            points: 500, // Tặng sẵn điểm cho Admin demo
            address: 'Hải Phòng',
          });
        } else if (users[adminIndex].password !== adminPassword) {
          users[adminIndex].password = adminPassword;
        }
      });

      return users;
    } catch (e) {
      console.error("Lỗi khi tải người dùng:", e);
      return [];
    }
  });

  const [bundleList, setBundleList] = useState<Bundle[]>(() => {
    const saved = localStorage.getItem('fruit-haven-bundles');
    return saved ? JSON.parse(saved) : BUNDLES;
  });

  // Fetch dữ liệu thực tế từ Firebase khi vào App
  useEffect(() => {
    const fetchData = async () => {
      setIsPageLoading(true);
      
      try {
        // Fetch Sản phẩm từ Cloud
        const fruitSnap = await getDocs(query(collection(db, 'fruits'), orderBy('name')));
        const cloudFruits = fruitSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Fruit));
        console.log("Cloud count:", cloudFruits.length);

        // Lấy dữ liệu từ Local và Constants
        const savedLocal = localStorage.getItem('fruit-haven-list');
        const localFruits: Fruit[] = savedLocal ? JSON.parse(savedLocal) : [];
        
        // Tạo tập hợp ID đã có trên Cloud để tránh trùng
        const cloudIds = new Set(cloudFruits.map(f => f.id));
        const mergedFruits = [...cloudFruits];
        const syncStack: Promise<any>[] = [];

        // 1. Kiểm tra sản phẩm từ Local Storage
        localFruits.forEach(f => {
          if (!cloudIds.has(f.id)) {
            mergedFruits.push(f);
            cloudIds.add(f.id);
            syncStack.push(setDoc(doc(db, 'fruits', f.id), f));
          }
        });

        // 2. Nếu danh sách vẫn quá ít (dưới 8 sp), bổ sung từ danh sách mặc định
        if (mergedFruits.length < 8) {
          FRUITS.forEach(f => {
            if (!cloudIds.has(f.id)) {
              mergedFruits.push(f);
              cloudIds.add(f.id);
              syncStack.push(setDoc(doc(db, 'fruits', f.id), f));
            }
          });
        }

        // Thực hiện đồng bộ các sản phẩm còn thiếu lên Cloud
        if (syncStack.length > 0) {
          console.log(`Syncing ${syncStack.length} missing products to Cloud...`);
          await Promise.all(syncStack);
        }

        setFruitList(mergedFruits.sort((a, b) => a.name.localeCompare(b.name)));

        // Fetch Tin tức
        const newsSnap = await getDocs(query(collection(db, 'news'), orderBy('date', 'desc')));
        const newsData = newsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));

        if (newsData.length > 0) {
          setNewsList(newsData);
        }

        // Fetch Coupons
        const couponSnap = await getDocs(collection(db, 'coupons'));
        const couponData = couponSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon));
        if (couponData.length > 0) {
          setCouponList(couponData);
        }

        // Fetch Bundles (Combos)
        const bundleSnap = await getDocs(collection(db, 'bundles'));
        const cloudBundles = bundleSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bundle));
        
        if (cloudBundles.length > 0) {
          setBundleList(cloudBundles);
        } else {
          // Seed default bundles if cloud is empty
          const bundlePromises = BUNDLES.map(b => setDoc(doc(db, 'bundles', b.id), b));
          await Promise.all(bundlePromises);
          setBundleList(BUNDLES);
        }

        // Fetch Users
        const userSnap = await getDocs(collection(db, 'users'));
        const firebaseUsers = userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        if (firebaseUsers.length > 0) {
          setRegisteredUsers(prev => {
            const combined = [...firebaseUsers];
            const firebaseEmails = new Set(firebaseUsers.map(u => u.email.toLowerCase()));
            prev.forEach(u => {
              if (!firebaseEmails.has(u.email.toLowerCase())) combined.push(u);
            });
            return combined;
          });
        }
      } catch (error) {
        console.error("Firebase fetch error:", error);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchData();
  }, []);

  // Theo dõi Page Views cho Google Analytics khi route thay đổi
  useEffect(() => {
    // Reset Meta Tags về mặc định khi ở trang chủ
    if (location.pathname === '/') {
      document.title = 'Fruit Haven | Trái Cây Tươi Sạch Mỗi Ngày';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', 'Fruit Haven - Cửa hàng cung cấp trái cây hữu cơ tươi ngon, nguồn gốc rõ ràng, giao hàng nhanh chóng.');
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) ogImage.setAttribute('content', '/og-image.jpg');
    }

    if (window.gtag) {
      window.gtag('config', 'G-XXXXXXXXXX', { // Thay G-XXXXXXXXXX bằng ID đo lường GA4 của bạn
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  // Logic Đăng ký Push Notifications
  useEffect(() => {
    const subscribeToPush = async () => {
      if (!user || !('serviceWorker' in navigator) || !('PushManager' in window)) return;

      try {
        const registration = await navigator.serviceWorker.ready;
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
          });

          // Lưu subscription vào profile người dùng trên Firebase
          try {
            await updateDoc(doc(db, 'users', user.id), {
              push_subscription: JSON.stringify(subscription)
            });
          } catch (err) {
            console.error("Lỗi cập nhật subscription:", err);
          }
        }
      } catch (err) {
        console.error("Lỗi đăng ký Push:", err);
      }
    };
    subscribeToPush();
  }, [user]);

  // Fetch đơn hàng từ Firebase (Khách thấy đơn mình, Admin thấy tất cả)
  useEffect(() => {
    if (!user) return;

    const fetchOrdersData = async () => {
      try {
        let q = query(collection(db, 'orders'), orderBy('created_at', 'desc'));
        
        // Nếu không phải admin, chỉ lấy đơn hàng của chính mình (Logic filter ở Client side for demo, or Server side rules)
        if (!checkIsAdmin(user)) {
          q = query(collection(db, 'orders'), where('email', '==', user.email), orderBy('created_at', 'desc'));
        }

        const querySnapshot = await getDocs(q);
        const cloudOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setOrders(prev => {
          const localOrders = prev.filter((o: any) => o.isLocal);
          const cloudIds = new Set(cloudOrders.map((o: any) => o.id));
          const uniqueLocal = localOrders.filter((o: any) => !cloudIds.has(o.id));
          return [...cloudOrders, ...uniqueLocal] as Order[];
        });
      } catch (error) {
        console.error("Lỗi fetch đơn hàng:", error);
      }
    };
    
    fetchOrdersData();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('fruit-haven-registered-users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Lưu đơn hàng vào localStorage
  useEffect(() => {
    localStorage.setItem('fruit-haven-orders', JSON.stringify(orders));
  }, [orders]);

  // Tự động lưu danh sách sản phẩm khi có thay đổi (kho hàng, review, thêm mới)
  useEffect(() => {
    localStorage.setItem('fruit-haven-list', JSON.stringify(fruitList));
  }, [fruitList]);

  useEffect(() => {
    localStorage.setItem('fruit-haven-news', JSON.stringify(newsList));
  }, [newsList]);

  useEffect(() => {
    localStorage.setItem('fruit-haven-categories', JSON.stringify(categoryList));
  }, [categoryList]);

  useEffect(() => {
    localStorage.setItem('fruit-haven-coupons', JSON.stringify(couponList));
  }, [couponList]);

  useEffect(() => {
    localStorage.setItem('fruit-haven-point-history', JSON.stringify(pointTransactions));
  }, [pointTransactions]);

  // Reset về trang 1 khi thay đổi bộ lọc
  useEffect(() => {
    setDisplayLimit(8);
  }, [searchQuery, selectedCategory, minRating, priceRange, sortBy]);

  useEffect(() => {
    localStorage.setItem('fruit-haven-recent', JSON.stringify(recentlyViewedIds));
  }, [recentlyViewedIds]);

  // Hiệu ứng giả lập tải sản phẩm mượt mà khi người dùng tương tác với bộ lọc
  useEffect(() => {
    // Chỉ kích hoạt hiệu ứng loading khi thay đổi danh mục hoặc đánh giá
    // Không kích hoạt khi đang gõ search để tránh lag
    if (selectedCategory !== 'Tất cả' || minRating !== 0) {
      setIsProductsLoading(true);
      const timer = setTimeout(() => setIsProductsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [selectedCategory, minRating]);

  const addToast = (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleCreateOrder = async (orderData: any) => {
    try {
      const orderId = `#FH-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderItems = orderData.items as CartItem[];

      // Tính toán điểm thưởng mới (1k = 1 điểm tích lũy)
      const earnedPoints = Math.floor(orderData.total / 1000);
      const usedPoints = orderData.usedPoints || 0;

      // Tạo bản ghi lịch sử điểm mới
      const newPointRecords: PointTransaction[] = [];
      const currentDate = new Date().toISOString();

      if (usedPoints > 0) {
        newPointRecords.push({
          id: `pt-sp-${Math.random().toString(36).substring(2, 7)}`,
          amount: -usedPoints,
          type: 'spend',
          description: `Sử dụng điểm cho đơn hàng ${orderId}`,
          date: currentDate
        });
      }

      if (earnedPoints > 0) {
        newPointRecords.push({
          id: `pt-er-${Math.random().toString(36).substring(2, 7)}`,
          amount: earnedPoints,
          type: 'earn',
          description: `Tích lũy từ đơn hàng ${orderId}`,
          date: currentDate
        });
      }

      // 1. Gửi dữ liệu đơn hàng lên Firebase
      try {
        // Cập nhật điểm người dùng trên Cloud
        if (user && user.id) {
          const newPoints = (user.points || 0) - usedPoints + earnedPoints;
          await updateDoc(doc(db, 'users', user.id), { 
            points: newPoints 
          });
        }

        await setDoc(doc(db, 'orders', orderId), {
          id: orderId,
          userId: user?.id || null,
          customerName: orderData.customerName,
          email: orderData.email,
          phone: orderData.phone,
          total: orderData.total,
          address: orderData.address,
          paymentMethod: orderData.paymentMethod,
          status: 'Đang xử lý',
          items: orderItems,
          created_at: new Date().toISOString()
        });

        console.log("✅ Đơn hàng thành công lên Firebase:", orderId);
        
        // 2. Cập nhật kho hàng trên Firebase
        await Promise.all(orderItems.map(async (item) => {
          const currentFruit = fruitList.find(f => f.id === item.id);
          if (currentFruit) {
            const newStock = Math.max(0, (currentFruit.stock ?? 50) - item.quantity);
            return updateDoc(doc(db, 'fruits', item.id), { stock: newStock });
          }
        }));
      } catch (error: any) {
        console.warn("Firebase Order Error:", error.message);
        addToast("Lưu ý: Đơn hàng chỉ lưu cục bộ do lỗi kết nối Database.");
      }

      if (user) {
        handleUpdateUser({
          ...user,
          points: (user.points || 0) - usedPoints + earnedPoints,
          name: orderData.customerName,
          phone: orderData.phone,
          address: orderData.address
        });
      }
      setPointTransactions(prev => [...newPointRecords, ...prev]);

      // 3. Luôn cập nhật state cục bộ để UI phản hồi ngay lập tức
      const normalizedOrder = { 
        ...orderData, 
        id: orderId, 
        created_at: new Date().toISOString(), 
        status: 'Đang xử lý',
        isLocal: !user 
      };
      setOrders(prev => [normalizedOrder, ...prev]);
      
      setFruitList(prev => prev.map(fruit => {
        const itemInOrder = orderItems.find(i => i.id === fruit.id);
        return itemInOrder ? { ...fruit, stock: (fruit.stock ?? 50) - itemInOrder.quantity } : fruit;
      }));

      return orderId;
    } catch (err) {
      console.error("Lỗi hệ thống:", err);
      addToast("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
      return null;
    }
  };

  const handleAddReview = (fruitId: string, review: Review) => {
    setFruitList(prev => prev.map(f => 
      f.id === fruitId ? { ...f, reviews: [{ ...review, status: 'pending' }, ...(f.reviews || [])] } : f
    ));
    addToast(`Cảm ơn bạn đã đánh giá! Đang chờ quản trị viên phê duyệt.`);
  };

  const handleThankReply = (fruitId: string, reviewId: string) => {
    if (!user) {
      addToast("Vui lòng đăng nhập để gửi lời cảm ơn!");
      return;
    }

    setFruitList(prev => prev.map(f => {
      if (f.id === fruitId) {
        return {
          ...f,
          reviews: f.reviews?.map(r => {
            if (r.id === reviewId && r.reply) {
              const thankedBy = r.reply.thankedBy || [];
              // Ngăn người dùng cảm ơn nhiều lần
              if (thankedBy.includes(user.email)) {
                addToast("Bạn đã gửi lời cảm ơn trước đó rồi!");
                return r;
              }
              addToast("Đã gửi lời cảm ơn đến Admin!");
              return { ...r, reply: { ...r.reply, thankedBy: [...thankedBy, user.email] } };
            }
            return r;
          })
        };
      }
      return f;
    }));
  };

  const handleLogin = (loggedUser: User, remember: boolean) => {
    setUser(loggedUser);
    
    // Cập nhật lại danh sách người dùng để đồng bộ thông tin (ví dụ: chuyển mật khẩu từ băm sang thuần túy)
    setRegisteredUsers((prev: User[]) => prev.map((u: User) => u.id === loggedUser.id ? loggedUser : u));

    if (remember) {
      localStorage.setItem('fruit-haven-user', JSON.stringify(loggedUser));
    } else {
      sessionStorage.setItem('fruit-haven-user', JSON.stringify(loggedUser));
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fruit-haven-user');
    sessionStorage.removeItem('fruit-haven-user');
    addToast("Bạn đã đăng xuất.");
  };

  const handleRegister = async (newUser: User) => {
    const isExisted = registeredUsers.some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
    if (isExisted) {
      addToast("Email này đã được đăng ký!");
      return;
    }

    try {
      await setDoc(doc(db, 'users', newUser.id), newUser);
      setRegisteredUsers(prev => [...prev, newUser]);
      addToast("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
    } catch (error: any) {
      console.error("Lỗi đăng ký Firebase:", error);
      addToast(`Lỗi: ${error.message}`);
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    // Chỉ cập nhật session nếu là chính người dùng đó đang đăng nhập
    if (user && user.id === updatedUser.id) {
      // Xác định đang dùng localStorage hay sessionStorage để cập nhật đúng chỗ
      const isPersistent = !!localStorage.getItem('fruit-haven-user');
      const storage = isPersistent ? localStorage : sessionStorage;
      storage.setItem('fruit-haven-user', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
    }

    // Cập nhật danh sách người dùng đăng ký (dùng cho Admin và mock database)
    setRegisteredUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    // Đồng bộ lên Firebase
    try {
      await setDoc(doc(db, 'users', updatedUser.id), updatedUser, { merge: true });
    } catch (err) {
      console.error("Lỗi đồng bộ Firebase User:", err);
    }
  };

  const handleToggleWishlist = (fruitId: string) => {
    if (!user) {
      addToast("Vui lòng đăng nhập để sử dụng tính năng yêu thích!");
      return;
    }

    const isFavorite = user.wishlist?.includes(fruitId);
    const newWishlist = isFavorite
      ? user.wishlist?.filter(id => id !== fruitId) || []
      : [...(user.wishlist || []), fruitId];

    const updatedUser = { ...user, wishlist: newWishlist };
    setUser(updatedUser);
    
    // Cập nhật session để không mất yêu thích khi F5
    const storage = localStorage.getItem('fruit-haven-user') ? localStorage : sessionStorage;
    storage.setItem('fruit-haven-user', JSON.stringify(updatedUser));

    // Cập nhật danh sách người dùng đã đăng ký để đồng bộ localStorage
    setRegisteredUsers((prev: User[]) => prev.map((u: User) => u.id === user.id ? updatedUser : u));
    addToast(isFavorite ? "Đã xóa khỏi danh sách yêu thích" : "Đã thêm vào danh sách yêu thích!");
  };

  const handleToggleComparison = (id: string) => {
    setComparisonIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 4) {
        addToast("Bạn chỉ có thể so sánh tối đa 4 sản phẩm!");
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleViewProduct = useCallback((id: string) => {
    setRecentlyViewedIds(prev => {
      if (prev[0] === id) return prev; // Tránh cập nhật nếu đang xem cùng một sản phẩm
      const filtered = prev.filter(itemId => itemId !== id);
      return [id, ...filtered].slice(0, 10); // Lưu tối đa 10 sản phẩm
    });
  }, []);

  const handleClearWishlist = () => {
    if (!user) return;

    const updatedUser = { ...user, wishlist: [] };
    setUser(updatedUser);

    const storage = localStorage.getItem('fruit-haven-user') ? localStorage : sessionStorage;
    storage.setItem('fruit-haven-user', JSON.stringify(updatedUser));
    
    setRegisteredUsers((prev: User[]) => prev.map((u: User) => u.id === user.id ? updatedUser : u));
    addToast("Đã làm trống danh sách yêu thích!");
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev: any[]) => prev.map((o: any) => o.id === orderId ? { ...o, status: 'Đã hủy' } : o));
    addToast(`Đã hủy đơn hàng ${orderId} thành công.`);
  };

  const handleClearFilters = () => {
    setIsProductsLoading(true);
    // Dùng setTimeout để tạo cảm giác hệ thống đang xử lý dữ liệu sạch
    setTimeout(() => {
      setSelectedCategory('Tất cả');
      setSearchQuery('');
      setSortBy('default');
      setMinRating(0);
      setPriceRange([0, 500000]);
      setIsProductsLoading(false);
      addToast("Đã xóa toàn bộ bộ lọc.");
    }, 300);
  };

  const filteredFruits = useMemo(() => {
    const filtered = fruitList.filter((fruit) => {
      // So sánh danh mục
      const matchesCategory = selectedCategory === 'Tất cả' || fruit.category === selectedCategory;
      
      // Kiểm tra tìm kiếm (an toàn hơn với Optional Chaining để tránh crash)
      const cleanQuery = deferredSearchQuery.trim().toLowerCase();
      const matchesSearch = cleanQuery === '' || 
                            (fruit.name && fruit.name.toLowerCase().includes(cleanQuery)) ||
                            (fruit.description && fruit.description.toLowerCase().includes(cleanQuery));
      
      const approvedReviews = fruit.reviews?.filter(r => r.status === 'approved') || [];
      const averageRating = approvedReviews.length > 0
        ? approvedReviews.reduce((acc, rev) => acc + rev.rating, 0) / approvedReviews.length
        : 0;

      // Nếu minRating > 0, chỉ những sản phẩm có đánh giá đã duyệt mới được tính
      const matchesRating = minRating === 0 || averageRating >= minRating;

      const matchesPrice = fruit.price >= priceRange[0] && fruit.price <= priceRange[1];

      // Thay vì ẩn hoàn toàn sản phẩm hết hàng, hãy để UI xử lý việc disable nút mua
      // return matchesCategory && matchesSearch && matchesRating && matchesPrice && fruit.stock !== 0;

      return matchesCategory && matchesSearch && matchesRating && matchesPrice;
    });

    if (sortBy === 'price-asc') {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [selectedCategory, deferredSearchQuery, sortBy, minRating, priceRange, fruitList]);

  // Lấy danh sách sản phẩm dựa trên giới hạn hiển thị hiện tại
  const paginatedFruits = useMemo(() => {
    return filteredFruits.slice(0, displayLimit);
  }, [filteredFruits, displayLimit]);

  const hasMore = displayLimit < filteredFruits.length;

  const latestReviews = useMemo(() => {
    const allReviews = fruitList.flatMap((fruit: Fruit) => 
      (fruit.reviews || [])
        .filter((r: Review) => r.status === 'approved')
        .map((review: Review) => ({
          ...review,
          fruitName: fruit.name,
          fruitImage: fruit.image,
          fruitColor: fruit.color
        }))
    );
    return allReviews.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [fruitList]);

  const latestNewsForHome = useMemo(() => {
    return [...newsList]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }, [newsList]);

  const nextReview = () => setReviewIndex((prev: number) => (prev + 1) % latestReviews.length);
  const prevReview = () => setReviewIndex((prev: number) => (prev - 1 + latestReviews.length) % latestReviews.length);

  const totalReviewsCount = useMemo(() => 
    fruitList.reduce((acc: number, fruit: Fruit) => 
      acc + (fruit.reviews?.filter((r: Review) => r.status === 'approved').length || 0)
    , 0)
  , [fruitList]);

  const handleAddToCart = (item: Fruit | Bundle, quantity: number = 1) => {
    setCartItems((prev: CartItem[]) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((cartItem: CartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
        );
      }
      return [...prev, { ...item, quantity: quantity } as CartItem];
    });
    addToast(`Đã thêm ${item.name} vào giỏ hàng!`);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev: CartItem[]) =>
      prev.map((item: CartItem) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev: CartItem[]) => prev.filter((item: CartItem) => item.id !== id));
  };

  const cartCount = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

  return (
      <>
      <ScrollToTop setIsPageLoading={setIsPageLoading} />
      <div className="min-h-screen flex flex-col">
        <Navbar 
          cartCount={cartCount} 
          onCartClick={() => setIsCartOpen(true)} 
          user={user}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearFilters={handleClearFilters}
        />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                
                <FlashSaleSection 
                  fruits={fruitList}
                  onAddToCart={handleAddToCart}
                  userWishlist={user?.wishlist || []}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickView={setQuickViewProduct}
                />

                <BundlesSection bundles={bundleList} onAddBundle={handleAddToCart as any} />

                {/* Shop Section */}
                <section id="shop" className="py-24 bg-brand-card">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                      <div className="max-w-2xl">
                        <span className="text-xs font-bold uppercase tracking-widest text-brand-primary/60 mb-4 block">
                          Bộ Sưu Tập Của Chúng Tôi
                        </span>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-brand-primary leading-tight">
                          Trái Cây <br />
                          <span className="italic text-brand-primary/70">Theo Mùa</span> Tuyển Chọn.
                        </h2>
                      </div>
                      
                      {/* Search & Filter Controls */}
                      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative flex-grow sm:flex-grow-0">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                          <input 
                            type="text"
                            placeholder="Tìm kiếm trái cây..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-64 pl-12 pr-4 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                          />
                        </div>
                        <div className="relative flex-grow sm:flex-grow-0">
                          <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="w-full sm:w-56 pl-6 pr-10 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all appearance-none text-sm font-medium text-brand-primary/60 cursor-pointer"
                          >
                            <option value="default">Sắp xếp: Mặc định</option>
                            <option value="price-asc">Giá: Thấp đến Cao</option>
                            <option value="price-desc">Giá: Cao đến Thấp</option>
                          </select>
                          <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary/40 pointer-events-none" size={18} />
                        </div>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap items-center gap-3 mb-12">
                      {categoryList.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={cn(
                            "px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300",
                            selectedCategory === category
                              ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                              : "bg-brand-background text-brand-primary/60 hover:bg-brand-primary/5 border border-brand-primary/10"
                          )}
                        >
                          {category}
                        </button>
                      ))}

                      {(selectedCategory !== 'Tất cả' || searchQuery !== '' || sortBy !== 'default' || minRating !== 0) && (
                        <button
                          onClick={handleClearFilters}
                          className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-500 hover:underline transition-all ml-2"
                        >
                          Xóa bộ lọc
                        </button>
                      )}
                    </div>

                    {/* Rating Filter */}
                    <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-2 no-scrollbar">
                      <span className="text-xs font-bold uppercase tracking-widest text-brand-primary/40 whitespace-nowrap">Đánh giá:</span>
                      {[0, 4, 3, 2].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setMinRating(rating)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border",
                            minRating === rating
                              ? "bg-brand-primary text-white border-brand-primary"
                              : "bg-white text-brand-primary/60 border-brand-primary/10 hover:border-brand-primary/30"
                          )}
                        >
                          {rating === 0 ? 'Tất cả' : (
                            <>
                              {rating}+ <Star size={12} className={cn(minRating === rating ? "fill-white" : "fill-yellow-400 text-yellow-400")} />
                            </>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {isProductsLoading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                          <ProductSkeleton key={i} />
                        ))
                      ) : (
                        <AnimatePresence mode="popLayout">
                          {paginatedFruits.map((fruit: Fruit) => (
                            <ProductCard 
                              key={fruit.id} 
                              fruit={fruit} 
                              onAddToCart={handleAddToCart} 
                              isFavorite={user?.wishlist?.includes(fruit.id) || false}
                              onToggleWishlist={handleToggleWishlist}
                              onQuickView={setQuickViewProduct}
                              isComparing={comparisonIds.includes(fruit.id)}
                              onToggleComparison={handleToggleComparison}
                            />
                          ))}
                        </AnimatePresence>
                      )}
                    </div>

                    {/* Load More Button */}
                    {!isProductsLoading && hasMore && (
                      <div className="flex justify-center mt-16 pt-12 border-t border-brand-primary/5">
                        <button
                          onClick={() => setDisplayLimit(prev => prev + 8)}
                          className="px-12 py-4 bg-white text-brand-primary border border-brand-primary/10 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-primary hover:text-white transition-all shadow-sm hover:shadow-lg active:scale-95 flex items-center gap-2"
                        >
                          Xem thêm sản phẩm
                          <ChevronRight size={16} className="rotate-90" />
                        </button>
                      </div>
                    )}

                    {/* Empty State */}
                    {!isProductsLoading && filteredFruits.length === 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20 text-center"
                      >
                        <p className="text-2xl font-serif italic text-brand-primary/40">
                          Không tìm thấy trái cây nào phù hợp.
                        </p>
                        <button 
                          onClick={handleClearFilters}
                          className="mt-6 text-brand-primary font-bold uppercase tracking-widest hover:underline"
                        >
                          Xóa Tất Cả Bộ Lọc
                        </button>
                      </motion.div>
                    )}
                  </div>
                </section>

                {/* Review Carousel Section */}
                {latestReviews.length > 0 && (
                  <section className="py-24 bg-brand-primary/5 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-brand-primary/60 mb-4 block">
                        Phản Hồi Từ Khách Hàng
                      </span>
                      <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-primary mb-16">
                        Những <span className="italic">Trải Nghiệm</span> Tuyệt Vời.
                      </h2>

                      <div className="relative max-w-4xl mx-auto">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={reviewIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                            className="bg-white rounded-[48px] p-8 md:p-16 shadow-xl shadow-brand-primary/5 border border-brand-primary/5 relative"
                          >
                            <Quote className="absolute top-10 left-10 text-brand-primary/10" size={80} />
                            
                            <div className="relative z-10 space-y-8">
                              <div className="flex justify-center text-yellow-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} size={24} className={cn(latestReviews[reviewIndex].rating >= star ? "fill-current" : "text-zinc-100")} />
                                ))}
                              </div>
                              
                              <p className="text-2xl md:text-3xl font-serif italic text-brand-primary/80 leading-relaxed">
                                "{latestReviews[reviewIndex].comment}"
                              </p>

                              <div className="flex flex-col items-center gap-4">
                                <div className="text-center">
                                  <h4 className="text-lg font-bold text-brand-primary">{latestReviews[reviewIndex].userName}</h4>
                                  <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">{latestReviews[reviewIndex].date}</p>
                                </div>
                                
                                <div className="flex items-center gap-3 px-4 py-2 bg-brand-primary/5 rounded-full">
                                  <div className={cn("w-8 h-8 rounded-full overflow-hidden", latestReviews[reviewIndex].fruitColor)}>
                                    <img src={latestReviews[reviewIndex].fruitImage} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <span className="text-xs font-bold text-brand-primary/60 uppercase tracking-tighter">
                                    Về: {latestReviews[reviewIndex].fruitName}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>

                        {/* Carousel Controls */}
                        <div className="flex justify-center gap-4 mt-10">
                          <button 
                            onClick={prevReview}
                            className="p-4 rounded-full bg-white text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-md group"
                          >
                            <ChevronLeft size={24} className="group-active:-translate-x-1 transition-transform" />
                          </button>
                          <button 
                            onClick={nextReview}
                            className="p-4 rounded-full bg-white text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-md group"
                          >
                            <ChevronRight size={24} className="group-active:translate-x-1 transition-transform" />
                          </button>
                        </div>

                        <div className="mt-12">
                          <Link to="/all-reviews" className="text-sm font-bold uppercase tracking-widest text-brand-primary hover:underline underline-offset-8">
                            Xem tất cả phản hồi khách hàng ({totalReviewsCount})
                          </Link>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Latest News Section */}
                {latestNewsForHome.length > 0 && (
                  <section className="py-24 bg-brand-background">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div className="max-w-2xl">
                          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary/60 mb-4 block">
                            Blog & Chia Sẻ
                          </span>
                          <h2 className="text-5xl font-serif font-bold text-brand-primary">
                            Tin Tức <span className="italic text-brand-primary/70">Mới Nhất</span>.
                          </h2>
                        </div>
                        <Link to="/news" className="text-sm font-bold uppercase tracking-widest text-brand-primary hover:underline flex items-center gap-2 group">
                          Xem tất cả bài viết <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {latestNewsForHome.map((item, index) => (
                          <motion.article
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Link to={`/news/${item.id}`} className="block bg-white rounded-[40px] overflow-hidden border border-brand-primary/5 shadow-sm hover:shadow-xl transition-all flex flex-col h-full group">
                              <div className="relative aspect-video overflow-hidden">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 left-4">
                                  <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-brand-primary rounded-full">
                                    {item.category}
                                  </span>
                                </div>
                              </div>
                              <div className="p-8 flex-grow space-y-4">
                                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                  <div className="flex items-center gap-1"><Calendar size={14} /> {item.date}</div>
                                  <div className="flex items-center gap-1"><UserIcon size={14} /> {item.author}</div>
                                </div>
                                <h3 className="text-xl font-serif font-bold text-brand-primary group-hover:text-brand-primary/70 transition-colors line-clamp-2">
                                  {item.title}
                                </h3>
                                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">{item.excerpt}</p>
                              </div>
                            </Link>
                          </motion.article>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* Contact Section */}
                <section id="contact" className="py-24 bg-brand-background">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-brand-card rounded-[48px] p-8 md:p-16 card-shadow border border-brand-primary/5 grid grid-cols-1 lg:grid-cols-2 gap-16">
                      <div className="space-y-8">
                        <h2 className="text-5xl font-serif font-bold text-brand-primary leading-tight">
                          Liên Hệ <span className="italic">Với Chúng Tôi</span>.
                        </h2>
                        <p className="text-zinc-500 text-lg">
                          Bạn có câu hỏi về các lựa chọn theo mùa hoặc giao hàng? Chúng tôi rất muốn nghe từ bạn.
                        </p>
                        <div className="space-y-6 pt-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-brand-primary/5 rounded-full flex items-center justify-center text-brand-primary">
                              <Mail size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Gửi Email</p>
                              <p className="text-brand-primary font-medium">hello@fruithaven.com</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input type="text" placeholder="Tên" className="w-full px-6 py-4 bg-brand-background border border-brand-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                          <input type="text" placeholder="Họ" className="w-full px-6 py-4 bg-brand-background border border-brand-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                        </div>
                        <input type="email" placeholder="Địa chỉ Email" className="w-full px-6 py-4 bg-brand-background border border-brand-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                        <textarea placeholder="Tin nhắn của bạn" rows={4} className="w-full px-6 py-4 bg-brand-background border border-brand-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none"></textarea>
                        <button className="w-full py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20">
                          Gửi Tin Nhắn
                        </button>
                      </form>
                    </div>
                  </div>
                </section>

                {/* Newsletter Section */}
                <section className="py-24 bg-brand-background">
                  <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-primary mb-6">
                      Tham Gia Cộng Đồng <span className="italic">Tươi Sạch</span>.
                    </h2>
                    <p className="text-zinc-500 mb-10 max-w-lg mx-auto">
                      Đăng ký để nhận cập nhật theo mùa, ưu đãi độc quyền và mẹo thưởng thức quà tặng từ thiên nhiên.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                      <input 
                        type="email" 
                        placeholder="Nhập email của bạn" 
                        className="flex-grow px-6 py-4 bg-white border border-brand-primary/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                        required
                      />
                      <button className="px-8 py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20">
                        Đăng Ký
                      </button>
                    </form>
                  </div>
                </section>
              </>
            } />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} registeredUsers={registeredUsers} addToast={addToast} />} />
            <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />
            <Route path="/all-reviews" element={<AllReviewsPage fruits={fruitList} onThankReply={handleThankReply} user={user} />} />
            <Route path="/news" element={<NewsPage news={newsList} />} />
            <Route path="/news/:newsId" element={<NewsDetailPage news={newsList} />} />
            <Route path="/contact" element={<ContactPage addToast={addToast} />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/profile/addresses" element={<AddressManagementPage user={user} onUpdateUser={handleUpdateUser} />} />
            <Route 
              path="/search" 
              element={
                <SearchPage 
                  fruits={fruitList} 
                  onAddToCart={handleAddToCart} 
                  userWishlist={user?.wishlist || []} 
                  onToggleWishlist={handleToggleWishlist}
                  searchQuery={searchQuery}
                  onQuickView={setQuickViewProduct}
                  onSearchChange={setSearchQuery}
                  comparisonIds={comparisonIds}
                  onToggleComparison={handleToggleComparison}
                  categories={categoryList}
                />
              } 
            />
            <Route path="/wishlist" element={<WishlistPage fruits={fruitList} user={user} onToggleWishlist={handleToggleWishlist} onAddToCart={handleAddToCart} />} />
            <Route path="/categories" element={<CategoriesPage fruits={fruitList} categories={categoryList} onAddToCart={handleAddToCart} userWishlist={user?.wishlist || []} onToggleWishlist={handleToggleWishlist} onQuickView={setQuickViewProduct} comparisonIds={comparisonIds} onToggleComparison={handleToggleComparison} />} />
            <Route path="/categories/:categoryName" element={<CategoriesPage fruits={fruitList} categories={categoryList} onAddToCart={handleAddToCart} userWishlist={user?.wishlist || []} onToggleWishlist={handleToggleWishlist} onQuickView={setQuickViewProduct} comparisonIds={comparisonIds} onToggleComparison={handleToggleComparison} />} />
            <Route path="/order/:orderId" element={<OrderDetailPage onAddToCart={handleAddToCart} addToast={addToast} orders={orders} />} />
            <Route path="/profile" element={<ProfilePage user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} fruits={fruitList} onToggleWishlist={handleToggleWishlist} onClearWishlist={handleClearWishlist} orders={orders} onCancelOrder={handleCancelOrder} pointTransactions={pointTransactions} />} />
            <Route 
              path="/admin" 
              element={
                <PrivateRoute user={user} requireAdmin>
                  <AdminPage 
                    user={user} 
                    fruits={fruitList} 
                    setFruits={setFruitList} 
                    news={newsList}
                    setNews={setNewsList}
                    categories={categoryList}
                    setCategories={setCategoryList}
                    coupons={couponList}
                    setCoupons={setCouponList}
                    users={registeredUsers} 
                    setUsers={setRegisteredUsers}
                    onUpdateUser={handleUpdateUser}
                    orders={orders}
                    setOrders={setOrders}
                    bundles={bundleList}
                    setBundles={setBundleList}
                    addToast={addToast}
                  />
                </PrivateRoute>
              } 
            />
            <Route path="/access-denied" element={<AccessDeniedPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route 
              path="/product/:productId" 
              element={<ProductDetailPage 
                fruits={fruitList} 
                onAddToCart={handleAddToCart} 
                onAddReview={handleAddReview}
                user={user}
                onToggleWishlist={handleToggleWishlist}
                recentlyViewedIds={recentlyViewedIds}
                onViewProduct={handleViewProduct}
                orders={orders}
                onThankReply={handleThankReply}
              />} 
            />
            <Route 
              path="/checkout" 
              element={<CheckoutPage 
                items={cartItems} 
                onOrderSuccess={handleCreateOrder}
                onClearCart={() => setCartItems([])}
                addToast={addToast} 
                user={user}
                coupons={couponList}
              />} 
            />
          </Routes>
        </main>

        <Footer />

        <CartDrawer 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />

        <ChatWidget user={user} />

        {/* Toasts Container */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 pointer-events-none">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                className="bg-brand-primary text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 pointer-events-auto"
              >
                <CheckCircle2 size={18} />
                <span className="text-sm font-bold uppercase tracking-widest">{toast.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Top Progress Bar */}
        <AnimatePresence>
          {isPageLoading && (
            <motion.div
              initial={{ width: 0, opacity: 1 }}
              animate={{ width: '100%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="fixed top-0 left-0 h-1 bg-brand-primary z-[301] shadow-sm shadow-brand-primary/40"
            />
          )}
        </AnimatePresence>
      </div>
      </>
  );
}

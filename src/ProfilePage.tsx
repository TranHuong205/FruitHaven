import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Package, Settings, Heart, Save, X, Phone, MapPin, ChevronRight, ShoppingCart, Trash2, AlertCircle, Gift, Ticket, Key, Camera, Calendar as CalendarIcon, UserCircle, Plus, Minus, LayoutDashboard, Coins, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from './lib/utils';
import { User as UserType, Fruit, PointTransaction } from './types';
import { checkIsAdmin } from './lib/auth';
import { compressImage } from './lib/security';
import Cropper, { Area } from 'react-easy-crop';

// Hàm hỗ trợ xử lý cắt ảnh bằng Canvas
const getCroppedImg = (imageSrc: string, pixelCrop: Area): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject();
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    image.onerror = reject;
  });
};

interface ProfilePageProps {
  user: UserType | null;
  onLogout: () => void;
  onUpdateUser: (user: UserType) => void;
  fruits: Fruit[];
  onToggleWishlist: (fruitId: string) => void;
  onClearWishlist: () => void;
  orders: any[];
  onCancelOrder: (orderId: string) => void;
  pointTransactions?: PointTransaction[];
}

export default function ProfilePage({ 
  user, onLogout, onUpdateUser, fruits, onToggleWishlist, onClearWishlist, orders, onCancelOrder, pointTransactions = [] 
}: ProfilePageProps) {
  const navigate = useNavigate();
  const currentUser = user;
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'rewards' | 'security'>('orders');
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    birthday: currentUser?.birthday || '',
    gender: currentUser?.gender || 'Nam'
  });

  // Luôn cập nhật form khi dữ liệu user từ App.tsx thay đổi hoặc khi thoát chế độ sửa
  useEffect(() => {
    if (currentUser && !isEditing) {
      setEditForm({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        birthday: currentUser.birthday || '',
        gender: currentUser.gender || 'Nam'
      });
    }
  }, [currentUser, isEditing]);

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; fruitId: string | null }>({
    isOpen: false,
    fruitId: null
  });

  const [isClearAllOpen, setIsClearAllOpen] = useState(false);

  const handleSave = async () => {
    if (user) {
      setIsSaving(true);
      const updatedData = { ...user, ...editForm };
      
      // Gọi hàm cập nhật ở App.tsx
      await onUpdateUser(updatedData);
      
      // Cập nhật lại editForm ngay lập tức với dữ liệu mới nhất
      // Điều này ngăn chặn useEffect chạy với prop 'user' cũ gây ra hiện tượng revert
      setEditForm({
        name: updatedData.name,
        phone: updatedData.phone || '',
        address: updatedData.address || '',
        birthday: updatedData.birthday || '',
        gender: updatedData.gender || 'Nam'
      });

      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async () => {
    if (imageToCrop && croppedAreaPixels && user) {
      try {
        const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
        const compressedImage = await compressImage(croppedImage);
        onUpdateUser({ ...user, avatar: compressedImage });
        setIsCropping(false);
        setImageToCrop(null);
      } catch (e) {
        console.error("Lỗi khi cắt ảnh:", e);
      }
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm.fruitId) {
      onToggleWishlist(deleteConfirm.fruitId);
      setDeleteConfirm({ isOpen: false, fruitId: null });
    }
  };

  const handleCancelRequest = (orderId: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${orderId}?`)) {
      onCancelOrder(orderId);
    }
  };

  const [orderFilter, setOrderFilter] = useState('Tất cả');

  // Lấy đơn hàng thực tế của người dùng từ prop orders dựa trên email
  const userOrders = useMemo(() => {
    if (user) {
      return orders.filter(order => order.email?.toLowerCase() === user.email.toLowerCase() || order.isLocal);
    }
    return orders.filter(order => order.isLocal);
  }, [orders, user]);

  const totalSpent = useMemo(() => {
    return userOrders
      .filter(order => order.status === 'Đã giao')
      .reduce((sum, order) => sum + order.total, 0);
  }, [userOrders]);

  const membershipTier = useMemo(() => {
    if (totalSpent >= 10000000) return { 
      name: 'Kim Cương', 
      color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      nextTier: null,
      target: 0,
      min: 10000000
    };
    if (totalSpent >= 5000000) return { 
      name: 'Vàng', 
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      nextTier: 'Kim Cương',
      target: 10000000,
      min: 5000000
    };
    if (totalSpent >= 1000000) return { 
      name: 'Bạc', 
      color: 'bg-slate-100 text-slate-600 border-slate-200',
      nextTier: 'Vàng',
      target: 5000000,
      min: 1000000
    };
    return { 
      name: 'Thành viên mới', 
      color: 'bg-zinc-100 text-zinc-500 border-zinc-200',
      nextTier: 'Bạc',
      target: 1000000,
      min: 0
    };
  }, [totalSpent]);

  const progressInfo = useMemo(() => {
    if (!membershipTier.nextTier) return null;
    const remaining = membershipTier.target - totalSpent;
    const range = membershipTier.target - membershipTier.min;
    const currentProgress = totalSpent - membershipTier.min;
    const percentage = Math.min(100, Math.max(0, (currentProgress / range) * 100));
    
    return { remaining, percentage };
  }, [totalSpent, membershipTier]);

  const filteredOrders = useMemo(() => {
    if (orderFilter === 'Tất cả') return userOrders;
    return userOrders.filter(order => order.status === orderFilter);
  }, [orderFilter, userOrders]);

  // Lấy danh sách sản phẩm yêu thích thực tế từ ID lưu trong user.wishlist
  const favoriteFruits = useMemo(() => {
    return fruits.filter(f => user?.wishlist?.includes(f.id));
  }, [fruits, user?.wishlist]);

  // Mock data cho Voucher
  const mockVouchers = [
    { id: 'V1', code: 'FRUIT10', discount: '10%', title: 'Giảm 10% đơn từ 200k', expiry: '30/06/2026' },
    { id: 'V2', code: 'FREESHIP', discount: 'Free', title: 'Miễn phí vận chuyển nội thành', expiry: '15/04/2026' }
  ];

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic đổi mật khẩu thực tế sẽ ở đây
    alert("Mật khẩu của bạn đã được cập nhật thành công!");
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const orderStatuses = ['Tất cả', 'Đang giao', 'Đã giao', 'Đã hủy'];

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-32 bg-brand-background min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-card rounded-[48px] overflow-hidden card-shadow border border-brand-primary/5">
          {/* Header Profile */}
          <div className="bg-brand-primary/5 p-10 md:p-16 flex flex-col md:flex-row items-center gap-8">
            <div className="relative cursor-pointer group" onClick={user ? handleAvatarClick : undefined}>
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover group-hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-white flex items-center justify-center text-brand-primary text-4xl font-serif font-bold group-hover:bg-zinc-50 transition-colors uppercase">
                  {user ? user.name[0] : 'G'}
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              {user && (
                <>
                  <button 
                    className="absolute bottom-1 right-1 w-10 h-10 bg-brand-primary text-white rounded-full border-4 border-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  >
                    <Camera size={16} />
                  </button>
                  <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                </>
              )}
            </div>
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-4xl font-serif font-bold text-brand-primary">{user ? user.name : 'Khách vãng lai'}</h2>
              <p className="text-zinc-500">{user ? user.email : 'Dữ liệu lưu cục bộ trên trình duyệt'}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className={cn("inline-block px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border", membershipTier.color)}>
                  Hạng {membershipTier.name}
                </span>
                <span className="inline-block px-4 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-brand-primary/10 flex items-center gap-2">
                  <Coins size={12} /> {user?.points?.toLocaleString() || 0} Điểm thưởng
                </span>
                <span className="inline-block px-4 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-orange-200">
                  Tổng chi tiêu: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalSpent)}
                </span>
              </div>

              {progressInfo && (
                <div className="mt-4 max-w-xs mx-auto md:mx-0">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 mb-1.5">
                    <span>Tiến trình lên hạng {membershipTier.nextTier}</span>
                    <span>{Math.round(progressInfo.percentage)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-brand-primary/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressInfo.percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-brand-primary"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400 italic mt-1.5 text-center md:text-left">
                    Bạn cần chi tiêu thêm {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(progressInfo.remaining)} để lên hạng {membershipTier.nextTier}.
                  </p>
                </div>
              )}
            </div>
            <div className="md:ml-auto flex flex-col items-center md:items-end gap-3">
              {user && checkIsAdmin(user) && (
                <Link 
                  to="/admin"
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-full text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all mb-1"
                >
                  <LayoutDashboard size={14} /> Trang Quản Trị
                </Link>
              )}
              {user ? (
                <button 
                  onClick={() => { onLogout(); navigate('/'); }}
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                >
                  <LogOut size={18} /> Đăng xuất
                </button>
              ) : (
              <button 
                onClick={() => navigate('/login')}
                className="md:ml-auto flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-primary hover:underline transition-colors"
              >
                <Key size={18} /> Đăng nhập
              </button>
              )}
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="p-10 border-b border-brand-primary/5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-serif font-bold text-brand-primary">Thông tin cá nhân</h3>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-primary hover:underline"
                >
                  <Settings size={18} />
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-4">
                  <button 
                      onClick={() => { 
                        setIsEditing(false); 
                        setEditForm({ 
                          ...editForm, 
                          name: user?.name || '', 
                          phone: user?.phone || '', 
                          address: user?.address || '' 
                        }); 
                      }}
                      disabled={isSaving}
                    className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600"
                  >
                    <X size={18} />
                    Hủy
                  </button>
                  <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className={cn(
                        "flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-primary",
                        isSaving && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <Save size={18} />
                      {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-primary/40">
                  <UserCircle size={14} /> Họ và tên
                </label>
                {isEditing ? (
                  <input 
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2 bg-brand-background border border-brand-primary/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                ) : (
                  <p className="text-brand-primary font-medium">{user?.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-primary/40">
                  <Phone size={14} /> Số điện thoại
                </label>
                {isEditing ? (
                  <input 
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-brand-background border border-brand-primary/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                ) : (
                  <p className="text-brand-primary font-medium">{user?.phone || 'Chưa cập nhật'}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-primary/40">
                  <MapPin size={14} /> Địa chỉ giao hàng
                </label>
                {isEditing ? (
                  <input 
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full px-4 py-2 bg-brand-background border border-brand-primary/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                ) : (
                  <p className="text-brand-primary font-medium">{user?.address || 'Chưa cập nhật'}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-primary/40">
                  <CalendarIcon size={14} /> Ngày sinh
                </label>
                {isEditing ? (
                  <input 
                    type="date"
                    value={editForm.birthday}
                    onChange={(e) => setEditForm({ ...editForm, birthday: e.target.value })}
                    className="w-full px-4 py-2 bg-brand-background border border-brand-primary/10 rounded-xl focus:outline-none"
                  />
                ) : (
                    <p className="text-brand-primary font-medium">{user ? editForm.birthday : '--/--/----'}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-primary/40">
                  <UserCircle size={14} /> Giới tính
                </label>
                {isEditing ? (
                  <select 
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    className="w-full px-4 py-2 bg-brand-background border border-brand-primary/10 rounded-xl focus:outline-none"
                  >
                    <option>Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                  </select>
                ) : (
                  <p className="text-brand-primary font-medium">{editForm.gender}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tabs / Quick Actions */}
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              onClick={() => setActiveTab('orders')}
              className={cn(
                "p-6 rounded-3xl border transition-all group cursor-pointer",
                activeTab === 'orders' 
                  ? "bg-brand-primary/5 border-brand-primary/20 shadow-inner" 
                  : "bg-brand-background border-brand-primary/5 hover:border-brand-primary/20"
              )}
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all", activeTab === 'orders' ? "bg-brand-primary text-white" : "bg-brand-primary/5 text-brand-primary group-hover:bg-brand-primary group-hover:text-white")}>
                <Package size={24} />
              </div>
              <h3 className="font-serif font-bold text-brand-primary text-xl mb-1">Đơn hàng</h3>
              <p className="text-sm text-zinc-400 italic">Theo dõi {userOrders.length} đơn hàng của bạn.</p>
            </div>
            
            <div 
              onClick={() => setActiveTab('wishlist')}
              className={cn(
                "p-6 rounded-3xl border transition-all group cursor-pointer",
                activeTab === 'wishlist' 
                  ? "bg-brand-primary/5 border-brand-primary/20 shadow-inner" 
                  : "bg-brand-background border-brand-primary/5 hover:border-brand-primary/20"
              )}
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all", activeTab === 'wishlist' ? "bg-brand-primary text-white" : "bg-brand-primary/5 text-brand-primary group-hover:bg-brand-primary group-hover:text-white")}>
                <Heart size={24} />
              </div>
              <h3 className="font-serif font-bold text-brand-primary text-xl mb-1">Yêu thích</h3>
              <p className="text-sm text-zinc-400 italic">Những loại trái cây bạn thích nhất.</p>
            </div>

            <div 
              onClick={() => setActiveTab('rewards')}
              className={cn(
                "p-6 rounded-3xl border transition-all group cursor-pointer",
                activeTab === 'rewards' 
                  ? "bg-brand-primary/5 border-brand-primary/20 shadow-inner" 
                  : "bg-brand-background border-brand-primary/5 hover:border-brand-primary/20"
              )}
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all", activeTab === 'rewards' ? "bg-brand-primary text-white" : "bg-brand-primary/5 text-brand-primary group-hover:bg-brand-primary group-hover:text-white")}>
                <Ticket size={24} />
              </div>
              <h3 className="font-serif font-bold text-brand-primary text-xl mb-1">Ưu đãi</h3>
              <p className="text-sm text-zinc-400 italic">1 điểm = 1đ giảm giá đơn hàng.</p>
            </div>

            <div 
              onClick={() => setActiveTab('security')}
              className={cn(
                "p-6 rounded-3xl border transition-all group cursor-pointer",
                activeTab === 'security' 
                  ? "bg-brand-primary/5 border-brand-primary/20 shadow-inner" 
                  : "bg-brand-background border-brand-primary/5 hover:border-brand-primary/20"
              )}
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all", activeTab === 'security' ? "bg-brand-primary text-white" : "bg-brand-primary/5 text-brand-primary group-hover:bg-brand-primary group-hover:text-white")}>
                <Key size={24} />
              </div>
              <h3 className="font-serif font-bold text-brand-primary text-xl mb-1">Bảo mật</h3>
              <p className="text-sm text-zinc-400 italic">Quản lý mật khẩu của bạn.</p>
            </div>
          </div>

          {/* Address Management Card */}
          {user && (
            <Link to="/profile/addresses" className="block p-10 pt-0">
              <div className="p-6 bg-brand-background rounded-3xl border border-brand-primary/5 hover:border-brand-primary/20 transition-all group cursor-pointer">
                <div className="w-12 h-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary mb-4 group-hover:bg-brand-primary group-hover:text-white transition-all">
                  <MapPin size={24} />
                </div>
                <h3 className="font-serif font-bold text-brand-primary text-xl mb-1">Địa chỉ nhận hàng</h3>
                <p className="text-sm text-zinc-400 italic">Quản lý các địa chỉ giao hàng của bạn.</p>
              </div>
            </Link>
          )}

          {/* Recent History Mock */}
          <div className="px-10 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-t border-brand-primary/5 pt-10">
              <h4 className="text-xs font-bold uppercase tracking-widest text-brand-primary/40">
                {activeTab === 'orders' ? 'Lịch sử đơn hàng' : 
                 activeTab === 'wishlist' ? `Sản phẩm yêu thích (${favoriteFruits.length})` :
                 activeTab === 'rewards' ? 'Kho Voucher của bạn' :
                 'Đổi mật khẩu tài khoản'}
              </h4>
              
              {activeTab === 'wishlist' && favoriteFruits.length > 0 && (
                <button 
                  onClick={() => setIsClearAllOpen(true)}
                  className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:underline flex items-center gap-2"
                >
                  <Trash2 size={14} /> Xóa tất cả
                </button>
              )}

              {activeTab === 'orders' && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {orderStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border whitespace-nowrap",
                      orderFilter === status
                        ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                        : "bg-white text-brand-primary/60 border-brand-primary/10 hover:border-brand-primary/30"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
              )}
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {activeTab === 'orders' ? (
                  filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={order.id} 
                      onClick={() => navigate(`/order/${order.id.replace('#', '%23')}`)}
                      className="bg-brand-background rounded-[24px] p-5 border border-brand-primary/5 flex items-center justify-between group hover:border-brand-primary/20 transition-all cursor-pointer"
                    >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-brand-primary">{order.id}</p>
                        <p className="text-xs text-zinc-400">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString('vi-VN') : order.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="font-bold text-brand-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</p>
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-full border",
                          order.status === 'Đã giao' ? "text-green-600 bg-green-50 border-green-100" : 
                          order.status === 'Đang giao' ? "text-orange-600 bg-orange-50 border-orange-100" :
                          "text-red-600 bg-red-50 border-red-100"
                        )}>{order.status}</span>
                      </div>
                      {order.status === 'Đang xử lý' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleCancelRequest(order.id); }}
                          className="text-[10px] font-bold uppercase text-red-500 hover:underline"
                        >
                          Hủy đơn
                        </button>
                      )}
                      <ChevronRight size={18} className="text-zinc-300 group-hover:text-brand-primary transition-colors" />
                    </div>
                    </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-brand-background rounded-[32px] p-8 text-center border border-dashed border-brand-primary/20"
                    >
                      <p className="text-zinc-400 italic">Không tìm thấy đơn hàng nào ở trạng thái này.</p>
                    </motion.div>
                  )
                ) : activeTab === 'wishlist' ? (
                  favoriteFruits.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {favoriteFruits.map((fruit) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          key={fruit.id}
                          className="bg-brand-background rounded-[24px] p-4 border border-brand-primary/5 flex items-center gap-4 group hover:border-brand-primary/20 transition-all"
                        >
                          <Link to={`/product/${fruit.id}`} className={cn("w-16 h-16 rounded-xl overflow-hidden flex-shrink-0", fruit.color)}>
                            <img src={fruit.image} alt={fruit.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${fruit.id}`}>
                              <h4 className="font-bold text-brand-primary truncate hover:underline">{fruit.name}</h4>
                            </Link>
                            <p className="text-sm font-medium text-brand-primary/60">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fruit.price)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                setDeleteConfirm({ isOpen: true, fruitId: fruit.id });
                              }}
                              className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                              title="Xóa khỏi yêu thích"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button 
                              onClick={() => navigate(`/product/${fruit.id}`)}
                              className="w-10 h-10 bg-brand-primary/5 text-brand-primary rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all"
                            >
                              <ChevronRight size={18} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-brand-background rounded-[32px] p-12 text-center border border-dashed border-brand-primary/20"
                    >
                      <p className="text-zinc-400 italic mb-4">Bạn chưa yêu thích sản phẩm nào.</p>
                      <Link to="/search" className="text-sm font-bold uppercase tracking-widest text-brand-primary hover:underline">Khám phá ngay</Link>
                    </motion.div>
                  )
                ) : activeTab === 'rewards' ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {mockVouchers.map(v => (
                        <div key={v.id} className="p-6 bg-white rounded-3xl border-2 border-dashed border-brand-primary/20 flex gap-4 items-center relative overflow-hidden">
                          {/* Voucher UI - Giữ nguyên như cũ */}
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/40 px-2">Lịch sử điểm thưởng</h5>
                      {pointTransactions.length > 0 ? (
                        <div className="bg-white rounded-[32px] border border-brand-primary/5 overflow-hidden">
                          {pointTransactions.map((tx, idx) => (
                            <div key={tx.id} className={cn("p-4 flex items-center justify-between hover:bg-brand-primary/5 transition-colors", idx !== pointTransactions.length - 1 && "border-b border-brand-primary/5")}>
                              <div className="flex items-center gap-4">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm", tx.type === 'earn' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600")}>
                                  {tx.type === 'earn' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-brand-primary">{tx.description}</p>
                                  <p className="text-[10px] text-zinc-400">{new Date(tx.date).toLocaleString('vi-VN')}</p>
                                </div>
                              </div>
                              <span className={cn("font-serif font-bold", tx.type === 'earn' ? "text-green-600" : "text-red-600")}>
                                {tx.type === 'earn' ? '+' : ''}{tx.amount.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 bg-brand-primary/5 rounded-[32px] text-center border border-dashed border-brand-primary/10">
                          <p className="text-zinc-400 italic text-sm">Chưa có giao dịch điểm nào được ghi lại.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordChange} className="max-w-md mx-auto space-y-4 py-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Mật khẩu hiện tại</label>
                      <input 
                        type="password" 
                        required
                        value={passwordForm.current}
                        onChange={e => setPasswordForm({...passwordForm, current: e.target.value})}
                        className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Mật khẩu mới</label>
                      <input 
                        type="password" 
                        required
                        value={passwordForm.new}
                        onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
                        className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 ml-4">Xác nhận mật khẩu mới</label>
                      <input 
                        type="password" 
                        required
                        value={passwordForm.confirm}
                        onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                        className="w-full px-6 py-3 bg-brand-background border border-brand-primary/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-3 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
                    >
                      Cập nhật mật khẩu
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm({ isOpen: false, fruitId: null })}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[40px] p-8 md:p-10 max-w-sm w-full shadow-2xl text-center border border-brand-primary/5"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-3xl font-serif font-bold text-brand-primary mb-3">Xác nhận xóa?</h3>
              <p className="text-zinc-500 mb-10 leading-relaxed italic">
                Bạn có chắc chắn muốn loại bỏ sản phẩm này khỏi danh sách yêu thích của mình không?
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setDeleteConfirm({ isOpen: false, fruitId: null })}
                  className="flex-1 py-4 bg-zinc-100 text-zinc-500 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-4 bg-red-500 text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-red-600 shadow-lg shadow-red-200 transition-all"
                >
                  Xác nhận
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal xác nhận xóa tất cả */}
      <AnimatePresence>
        {isClearAllOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsClearAllOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[40px] p-8 md:p-10 max-w-sm w-full shadow-2xl text-center border border-brand-primary/5"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} />
              </div>
              <h3 className="text-3xl font-serif font-bold text-brand-primary mb-3">Xóa tất cả?</h3>
              <p className="text-zinc-500 mb-10 leading-relaxed italic">
                Bạn có chắc chắn muốn làm trống danh sách yêu thích không? Hành động này không thể hoàn tác.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsClearAllOpen(false)}
                  className="flex-1 py-4 bg-zinc-100 text-zinc-500 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={() => { onClearWishlist(); setIsClearAllOpen(false); }}
                  className="flex-1 py-4 bg-red-500 text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-red-600 shadow-lg shadow-red-200 transition-all"
                >
                  Xác nhận
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal cắt ảnh đại diện */}
      <AnimatePresence>
        {isCropping && imageToCrop && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCropping(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[40px] overflow-hidden w-full max-w-xl shadow-2xl border border-brand-primary/5"
            >
              <div className="p-8 border-b border-brand-primary/5">
                <h3 className="text-2xl font-serif font-bold text-brand-primary">Chỉnh sửa ảnh đại diện</h3>
              </div>
              
              <div className="relative h-80 w-full bg-zinc-900">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="round"
                  showGrid={false}
                />
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <Minus size={16} className="text-zinc-400" />
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                  <Plus size={16} className="text-zinc-400" />
                </div>

                <div className="flex gap-4">
                  <button onClick={() => { setIsCropping(false); setImageToCrop(null); }} className="flex-1 py-4 bg-zinc-100 text-zinc-500 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-all">Hủy bỏ</button>
                  <button onClick={handleCropSave} className="flex-1 py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20 transition-all">Cắt & Lưu</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Package, Truck, CreditCard, MapPin, Calendar, CheckCircle2, Clock, Settings, AlertCircle, RefreshCw, ExternalLink, Box } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './lib/firebaseClient';
import { getTrackingInfo } from './lib/shipping';
import { ShippingLog } from './types';
import { cn, handleFirestoreError } from './lib/utils';

// Mock dữ liệu chi tiết cho các đơn hàng
const ORDER_DETAILS_MOCK: Record<string, any> = {
  '#FH-8294': {
    date: '25 Th03, 2026',
    status: 'Đã giao',
    address: '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    items: [
      { id: '1', name: 'Cam Sicily', price: 120000, quantity: 2, image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80&w=800', color: 'bg-orange-50', unit: 'kg' },
      { id: '2', name: 'Việt Quất Rừng', price: 150000, quantity: 1, image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&q=80&w=800', color: 'bg-blue-50', unit: '250g' }
    ]
  },
  '#FH-9102': {
    date: '27 Th03, 2026',
    status: 'Đang giao',
    address: '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    items: [
      { id: '3', name: 'Xoài Cát Hòa Lộc', price: 85000, quantity: 1, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800', color: 'bg-yellow-50', unit: 'quả' },
      { id: '5', name: 'Thanh Long Thái', price: 35000, quantity: 1, image: 'https://icdn.dantri.com.vn/dansinh/2024/08/27/thanh-long-1724776610022.jpg', color: 'bg-pink-50', unit: 'kg' }
    ]
  },
  '#FH-7731': {
    date: '20 Th03, 2026',
    status: 'Đã hủy',
    address: '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    items: [
      { id: '4', name: 'Dâu Tây Ruby', price: 180000, quantity: 3, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=800', color: 'bg-red-50', unit: '500g' }
    ]
  }
};

interface OrderDetailPageProps {
  onAddToCart: (fruit: any) => void;
  addToast: (message: string) => void;
  orders: any[];
}

export default function OrderDetailPage({ onAddToCart, addToast, orders }: OrderDetailPageProps) {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const [shippingLogs, setShippingLogs] = useState<ShippingLog[]>([]);
  const [isLoadingTracking, setIsLoadingTracking] = useState(false);
  const [remoteOrder, setRemoteOrder] = useState<any>(null);
  const [isFetchingRemote, setIsFetchingRemote] = useState(false);

  // Tìm đơn hàng trong danh sách thực tế, nếu không thấy sẽ thử tìm trong dữ liệu giả lập
  const order = React.useMemo(() => {
    if (!orderId) return null;
    return remoteOrder || orders.find(o => o.id === orderId) || ORDER_DETAILS_MOCK[orderId];
  }, [orders, orderId, remoteOrder]);

  useEffect(() => {
    const fetchRemoteOrder = async () => {
      if (!orderId) return;
      
      // Nếu đã có order cục bộ hoặc mock, không cần fetch
      const localExists = orders.find(o => o.id === orderId) || ORDER_DETAILS_MOCK[orderId];
      if (localExists) return;

      setIsFetchingRemote(true);
      try {
        const docRef = doc(db, 'orders', orderId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setRemoteOrder(docSnap.data());
        }
      } catch (error) {
        console.error("Lỗi khi tra cứu đơn hàng từ máy chủ:", error);
      } finally {
        setIsFetchingRemote(false);
      }
    };

    fetchRemoteOrder();
  }, [orderId, orders]);

  useEffect(() => {
    const fetchTracking = async () => {
      if (order?.carrier && order?.trackingNumber) {
        setIsLoadingTracking(true);
        const logs = await getTrackingInfo(order.carrier, order.trackingNumber);
        setShippingLogs(logs);
        setIsLoadingTracking(false);
      }
    };
    fetchTracking();
  }, [order?.trackingNumber, order?.carrier]);

  const steps = [
    { label: 'Đã đặt hàng', icon: Calendar },
    { label: 'Đang xử lý', icon: Settings },
    { label: 'Đang giao', icon: Truck },
    { label: 'Hoàn tất', icon: CheckCircle2 },
  ];

  const handleReorder = () => {
    // Duyệt qua các items trong đơn hàng cũ và thêm vào giỏ
    order.items.forEach((item: any) => {
      onAddToCart(item);
    });
    addToast(`Đã thêm toàn bộ sản phẩm từ đơn hàng ${orderId} vào giỏ hàng!`);
  };

  if (isFetchingRemote) {
    return (
      <div className="py-32 text-center bg-brand-background min-h-screen flex flex-col items-center justify-center">
        <RefreshCw className="animate-spin text-brand-primary mb-4" size={48} />
        <h2 className="text-xl font-serif font-bold text-brand-primary">Đang tra cứu đơn hàng...</h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-32 text-center bg-brand-background min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-serif font-bold text-brand-primary mb-4">Không tìm thấy đơn hàng</h2>
        <button onClick={() => navigate('/profile')} className="text-brand-primary font-bold hover:underline">Quay lại trang cá nhân</button>
      </div>
    );
  }

  // Logic tính toán bước hiện tại
  let currentStep = 1; // Mặc định là đang xử lý
  if (order.status === 'Đã giao') currentStep = 3;
  else if (order.status === 'Đang giao') currentStep = 2;
  else if (order.status === 'Đã hủy') currentStep = -1;

  const subtotal = order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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

        <div className="bg-brand-card rounded-[48px] overflow-hidden card-shadow border border-brand-primary/5">
          {/* Order Header */}
          <div className="p-10 md:p-16 bg-brand-primary/5 border-b border-brand-primary/10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Package className="text-brand-primary" size={24} />
                  <h1 className="text-3xl font-serif font-bold text-brand-primary">Chi tiết đơn hàng {orderId}</h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-zinc-500 font-medium">
                  <div className="flex items-center gap-1.5"><Calendar size={14} /> {order.date}</div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                    order.status === 'Đã giao' ? "text-green-600 bg-green-50 border-green-100" : 
                    order.status === 'Đang giao' ? "text-orange-600 bg-orange-50 border-orange-100" :
                    "text-red-600 bg-red-50 border-red-100"
                  )}>{order.status}</span>
                </div>
              </div>
              <button 
                onClick={handleReorder}
                className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
              >
                <RefreshCw size={16} /> Đặt lại đơn hàng
              </button>
            </div>
          </div>

          <div className="p-10 md:p-16 space-y-12">
            {/* Shipping Carrier Section */}
            {order.trackingNumber && (
              <div className="bg-brand-primary/5 p-8 rounded-[32px] border border-brand-primary/10 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-primary shadow-sm">
                      <Box size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Đơn vị vận chuyển</p>
                      <p className="font-bold text-brand-primary">{order.carrier} - {order.trackingNumber}</p>
                    </div>
                  </div>
                  <a 
                    href={order.carrier === 'GHTK' ? `https://giaohangtietkiem.vn/tra-cuu-van-don?code=${order.trackingNumber}` : `https://ghn.vn/blogs/trang-thai-don-hang?order_code=${order.trackingNumber}`}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 bg-white text-brand-primary border border-brand-primary/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                  >
                    Tra cứu tại hãng <ExternalLink size={12} />
                  </a>
                </div>

                <div className="space-y-4 pt-4 border-t border-brand-primary/5">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-primary/40 flex items-center gap-2">
                    <RefreshCw size={12} className={cn(isLoadingTracking && "animate-spin")} /> Nhật ký vận chuyển
                  </p>
                  <div className="space-y-6 relative ml-3 border-l border-brand-primary/10 pl-6">
                    {shippingLogs.map((log, i) => (
                      <div key={i} className="relative">
                        <div className={cn("absolute -left-[31px] top-0 w-3 h-3 rounded-full border-2 border-white", i === 0 ? "bg-brand-primary scale-125 shadow-lg" : "bg-zinc-200")} />
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className={cn("text-xs font-bold", i === 0 ? "text-brand-primary" : "text-zinc-500")}>{log.status}</span>
                            <span className="text-[10px] text-zinc-400 font-medium">{log.time}</span>
                          </div>
                          <p className="text-sm text-zinc-600">{log.desc} tại <span className="font-medium">{log.location}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Section */}
            <div className="space-y-8 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary/40">Hành trình đơn hàng</h3>
              
              {order.status === 'Đã hủy' ? (
                <div className="flex items-center gap-4 p-6 bg-red-50 rounded-3xl border border-red-100 text-red-600">
                  <AlertCircle size={24} />
                  <p className="font-medium">Đơn hàng này đã bị hủy. Vui lòng liên hệ CSKH nếu bạn cần hỗ trợ thêm.</p>
                </div>
              ) : (
                <div className="relative pt-4 pb-8">
                  {/* Progress Line Background */}
                  <div className="absolute top-9 left-0 w-full h-0.5 bg-brand-primary/10 -z-0" />
                  
                  {/* Active Progress Line */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
                    className="absolute top-9 left-0 h-0.5 bg-brand-primary -z-0"
                  />

                  <div className="relative z-10 flex justify-between">
                    {steps.map((step, idx) => {
                      const isCompleted = idx <= currentStep;
                      const isActive = idx === currentStep;
                      const StepIcon = step.icon;

                      return (
                        <div key={idx} className="flex flex-col items-center gap-4">
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: isCompleted ? 1 : 0.9, opacity: 1 }}
                            className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-500 bg-white shadow-sm",
                              isCompleted ? "border-brand-primary text-brand-primary" : "border-zinc-100 text-zinc-300"
                            )}
                          >
                            <StepIcon size={20} className={cn(isActive && "animate-pulse")} />
                          </motion.div>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider text-center max-w-[80px]",
                            isCompleted ? "text-brand-primary" : "text-zinc-300"
                          )}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Shipping & Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary/40 flex items-center gap-2">
                  <MapPin size={14} /> Địa chỉ nhận hàng
                </h3>
                <p className="text-brand-primary font-medium leading-relaxed">{order.address}</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary/40 flex items-center gap-2">
                  <CreditCard size={14} /> Phương thức thanh toán
                </h3>
                <p className="text-brand-primary font-medium">{order.paymentMethod}</p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary/40">Sản phẩm đã mua</h3>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-6 p-4 bg-brand-background rounded-3xl border border-brand-primary/5">
                    <div className={cn("w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0", item.color)}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-brand-primary">{item.name}</h4>
                      <p className="text-sm text-zinc-500">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-primary">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-medium">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)} / đơn vị
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="pt-8 border-t border-brand-primary/10 space-y-3">
              <div className="flex justify-between text-zinc-500 text-sm">
                <span>Tạm tính</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-500 text-sm">
                <span>Phí vận chuyển</span>
                <span className="text-green-600 font-medium">Miễn phí</span>
              </div>
              <div className="flex justify-between text-2xl font-serif font-bold text-brand-primary pt-3">
                <span>Tổng cộng</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-6 flex justify-center">
              <button className="flex items-center gap-2 px-8 py-4 bg-brand-primary/5 text-brand-primary rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-primary hover:text-white transition-all">
                <Truck size={16} /> Theo dõi hành trình đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
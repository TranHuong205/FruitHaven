import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, CheckCircle, Ticket, Tag, Package, ShoppingBag, Copy, QrCode, X, ChevronRight, Info, Wallet, Smartphone, RefreshCw, ShieldCheck, Coins } from 'lucide-react';
import { CartItem, User, Coupon } from './types';
import { cn } from './lib/utils';

// Cấu hình ngân hàng nhận thanh toán (Bạn hãy thay đổi thông tin này)
const BANK_CONFIG = {
  BANK_ID: 'MB', // Mã ngân hàng (MB, VCB, ICB, v.v.)
  ACCOUNT_NO: '0397225824', // Số tài khoản của bạn
  ACCOUNT_NAME: 'NGUYEN VAN A' // Tên chủ tài khoản (Viết hoa không dấu)
};

interface CheckoutPageProps {
  items: CartItem[];
  onOrderSuccess: (orderData: any) => Promise<string | null>;
  onClearCart: () => void;
  addToast: (msg: string) => void;
  user: User | null;
  coupons: Coupon[];
}

export default function CheckoutPage({ items, onOrderSuccess, onClearCart, addToast, user, coupons }: CheckoutPageProps) {
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK' | 'VNPAY' | 'MOMO' | 'ZALOPAY'>('COD');
  const [lastOrderInfo, setLastOrderInfo] = useState<{ id: string; total: number; method: string } | null>(null);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Logic Voucher
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Tự động tính toán số tiền giảm giá (Percentage hoặc Fixed Amount)
  const discount = React.useMemo(() => {
    if (!appliedCoupon) return 0;
    
    // Kiểm tra lại điều kiện đơn hàng tối thiểu
    if (appliedCoupon.minOrder && subtotal < appliedCoupon.minOrder) return 0;

    if (appliedCoupon.discountType === 'percentage') {
      return (subtotal * appliedCoupon.value) / 100;
    }
    // Với số tiền cố định, đảm bảo không giảm quá tổng hóa đơn
    return Math.min(appliedCoupon.value, subtotal);
  }, [appliedCoupon, subtotal]);

  // Logic Loyalty Points
  const [usePoints, setUsePoints] = useState(false);
  const userPoints = user?.points || 0;
  
  // Quy đổi: 1 điểm = 1đ
  const POINT_VALUE = 1;
  const maxPointsRedeemable = Math.min(userPoints, Math.floor((subtotal - discount) / POINT_VALUE));
  const pointsDiscount = usePoints ? maxPointsRedeemable * POINT_VALUE : 0;

  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  // Tự động cập nhật thông tin giao hàng khi thông tin user thay đổi
  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address || ''
      }));
    }
  }, [user]);

  if (items.length === 0 && !isOrdered) {
    return (
      <div className="py-32 text-center bg-brand-background min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-serif font-bold text-brand-primary mb-4">Giỏ hàng của bạn đang trống</h2>
        <Link to="/" className="text-brand-primary font-bold hover:underline">Quay lại cửa hàng</Link>
      </div>
    );
  }

  const handleApplyVoucher = () => {
    const code = voucherCode.trim().toUpperCase();
    const coupon = coupons.find(c => c.code === code);

    if (coupon) {
      applyCoupon(coupon);
    } else {
      addToast("Mã giảm giá không chính xác.");
    }
  };

  const applyCoupon = (coupon: Coupon) => {
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      addToast(`Đơn hàng chưa đạt mức tối thiểu ${new Intl.NumberFormat('vi-VN').format(coupon.minOrder)}đ`);
      return;
    }
    setAppliedCoupon(coupon);
    setVoucherCode(coupon.code);
    addToast(`Đã áp dụng mã ${coupon.code}!`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setVoucherCode('');
    addToast("Đã gỡ mã giảm giá.");
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (items.length === 0) {
        addToast("Giỏ hàng của bạn đang trống!");
        return;
      }
      
      // Nếu là thanh toán điện tử, hiển thị màn hình chuyển hướng mô phỏng SDK
      const isEWallet = ['VNPAY', 'MOMO', 'ZALOPAY'].includes(paymentMethod);
      if (isEWallet) {
        setIsRedirecting(true);
      }

      setIsSubmitting(true);
      const orderData = {
        customerName: shippingInfo.name,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        subtotal: subtotal,
        discount: discount,
        pointsDiscount: pointsDiscount,
        usedPoints: usePoints ? maxPointsRedeemable : 0,
        paymentMethod: paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 
                       paymentMethod === 'BANK' ? 'Chuyển khoản (VietQR)' :
                       paymentMethod === 'VNPAY' ? 'Cổng VNPay' :
                       paymentMethod === 'MOMO' ? 'Ví MoMo' : 'Ví ZaloPay',
        total: subtotal - discount - pointsDiscount,
        items: items,
        address: shippingInfo.address
      };

      const orderId = await onOrderSuccess(orderData);

      if (orderId) {
        // Nếu là ví điện tử, đợi 2.5s để mô phỏng SDK phản hồi kết quả thành công
        if (isEWallet) {
          setTimeout(() => {
            setIsRedirecting(false);
            setLastOrderInfo({ id: orderId, total: orderData.total, method: orderData.paymentMethod });
            setIsOrdered(true);
            onClearCart();
            addToast(`Thanh toán qua ${paymentMethod} thành công!`);
          }, 2500);
        } else {
          setLastOrderInfo({ id: orderId, total: orderData.total, method: orderData.paymentMethod });
          setIsOrdered(true);
          onClearCart();
          addToast("Đặt hàng thành công! Chúng tôi sẽ liên hệ sớm.");
        }
      } else {
        // Trường hợp handleCreateOrder trả về null (lỗi Supabase hoặc validate)
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      addToast("Có lỗi xảy ra khi xử lý đơn hàng.");
      setIsRedirecting(false);
      setIsSubmitting(false);
    }
  };

  // Màn hình mô phỏng Payment Gateway Redirect
  if (isRedirecting) {
    return (
      <div className="fixed inset-0 z-[300] bg-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full space-y-8"
        >
          <div className="relative">
            <div className={cn(
              "w-24 h-24 rounded-[32px] mx-auto flex items-center justify-center text-white shadow-2xl animate-pulse",
              paymentMethod === 'MOMO' ? "bg-[#A50064]" : paymentMethod === 'ZALOPAY' ? "bg-[#0081E0]" : "bg-blue-600"
            )}>
              {paymentMethod === 'VNPAY' ? <Smartphone size={48} /> : <Wallet size={48} />}
            </div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-zinc-100"
            >
              <RefreshCw size={20} className="text-brand-primary" />
            </motion.div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-brand-primary">Đang kết nối tới {paymentMethod}...</h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Vui lòng không tắt trình duyệt. Chúng tôi đang chuyển hướng bạn đến cổng thanh toán an toàn để hoàn tất đơn hàng.
            </p>
          </div>

          <div className="pt-8 flex flex-col items-center gap-4 border-t border-zinc-100">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <ShieldCheck size={14} className="text-green-500" /> Thanh toán bảo mật SSL
            </div>
            <img src="https://img.vietqr.io/image/pay-logo.png" alt="Payment Partners" className="h-6 opacity-50 grayscale" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (isOrdered) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-32 text-center bg-brand-background min-h-screen flex flex-col items-center justify-center px-4"
      >
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-4xl font-serif font-bold text-brand-primary mb-4">Cảm ơn bạn đã đặt hàng!</h2>
        <div className="bg-white p-8 rounded-[32px] border border-brand-primary/10 shadow-sm mb-10 space-y-4 max-w-sm w-full">
          <div className="flex justify-between items-center pb-4 border-b border-brand-primary/5">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Mã đơn hàng</span>
            <span className="font-bold text-brand-primary">{lastOrderInfo?.id}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-brand-primary/5">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Phương thức</span>
            <span className="font-bold text-brand-primary text-xs">{lastOrderInfo?.method}</span>
          </div>

          {/* Hiển thị Thanh toán cho từng phương thức */}
          {paymentMethod !== 'COD' && lastOrderInfo && (
            <div className="py-6 border-b border-brand-primary/5 space-y-4">
              {paymentMethod === 'BANK' ? (
                <>
                  <div className="text-center space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60 flex items-center justify-center gap-2">
                      <QrCode size={12} /> Quét mã VietQR để thanh toán
                    </p>
                  </div>
                  <div className="aspect-square w-full max-w-[200px] mx-auto bg-white p-3 border-2 border-brand-primary/10 rounded-3xl overflow-hidden shadow-sm">
                    <img 
                      src={`https://img.vietqr.io/image/${BANK_CONFIG.BANK_ID}-${BANK_CONFIG.ACCOUNT_NO}-compact2.png?amount=${lastOrderInfo.total}&addInfo=${encodeURIComponent(`Thanh toan don hang ${lastOrderInfo.id}`)}&accountName=${encodeURIComponent(BANK_CONFIG.ACCOUNT_NAME)}`}
                      alt="VietQR Payment"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-4 bg-brand-primary/5 rounded-2xl space-y-3 text-center">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">Số tài khoản:</span>
                    <p className="font-mono font-bold text-brand-primary text-sm">{BANK_CONFIG.ACCOUNT_NO}</p>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-6 py-4">
                  <div className="flex flex-col items-center gap-3">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl animate-bounce",
                      paymentMethod === 'VNPAY' ? "bg-blue-600" : paymentMethod === 'MOMO' ? "bg-[#A50064]" : "bg-[#0081E0]"
                    )}>
                      {paymentMethod === 'VNPAY' ? <Smartphone size={32} /> : <Wallet size={32} />}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-brand-primary uppercase tracking-widest">Thanh toán {paymentMethod}</p>
                      <p className="text-[10px] text-zinc-400 italic">Hệ thống đang kết nối an toàn...</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-[10px] text-zinc-500 leading-relaxed">
                    {paymentMethod === 'VNPAY' ? "Vui lòng chọn ngân hàng hoặc ví VNPay trong bước tiếp theo." : 
                     paymentMethod === 'MOMO' ? "Yêu cầu thanh toán sẽ được gửi đến ứng dụng MoMo của bạn." : 
                     "Vui lòng xác nhận thanh toán trên ứng dụng ZaloPay."}
                  </div>

                  <button 
                    onClick={() => addToast(`Đang chuyển hướng đến cổng ${paymentMethod}...`)}
                    className={cn(
                      "w-full py-4 rounded-full font-bold uppercase tracking-widest text-[10px] text-white shadow-lg transition-all active:scale-95 hover:brightness-110",
                      paymentMethod === 'VNPAY' ? "bg-blue-600 shadow-blue-200" : 
                      paymentMethod === 'MOMO' ? "bg-[#A50064] shadow-pink-200" : 
                      "bg-[#0081E0] shadow-blue-200"
                    )}
                  >
                    Thanh toán ngay với {paymentMethod}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Tổng thanh toán</span>
            <span className="text-xl font-serif font-bold text-brand-primary">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(lastOrderInfo?.total || 0)}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate(`/order/${lastOrderInfo?.id.replace('#', '%23')}`)}
            className="px-8 py-4 bg-brand-primary/10 text-brand-primary rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-primary hover:text-white transition-all flex items-center gap-2"
          >
            <Package size={18} /> Chi tiết đơn hàng
          </button>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/20"
          >
            <ShoppingBag size={18} /> Tiếp tục mua sắm
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="py-32 bg-brand-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form Thông Tin */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-3xl font-serif font-bold text-brand-primary mb-8">Thông tin giao hàng</h2>
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Họ và tên"
                  value={shippingInfo.name}
                  onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                  required 
                  className="w-full px-6 py-4 bg-brand-card border border-brand-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20" 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="email" 
                    placeholder="Địa chỉ Email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                    required 
                    className="w-full px-6 py-4 bg-brand-card border border-brand-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20" 
                  />
                  <input 
                    type="tel" 
                    placeholder="Số điện thoại"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    required 
                    className="w-full px-6 py-4 bg-brand-card border border-brand-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20" 
                  />
                </div>
              </div>
              <input 
                type="text" 
                placeholder="Địa chỉ nhận hàng"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                required 
                className="w-full px-6 py-4 bg-brand-card border border-brand-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20" 
              />
              <textarea placeholder="Ghi chú đơn hàng (tùy chọn)" rows={4} className="w-full px-6 py-4 bg-brand-card border border-brand-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none"></textarea>
              
              <div className="pt-4">
                <h3 className="font-bold text-brand-primary mb-4 flex items-center gap-2">
                  <CreditCard size={20} /> Phương thức thanh toán
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={cn(
                      "p-4 border rounded-2xl flex items-center justify-between transition-all text-left group",
                      paymentMethod === 'COD' ? "border-brand-primary bg-brand-primary/5" : "border-brand-primary/10 bg-brand-card hover:bg-brand-primary/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Truck size={18} className={cn(paymentMethod === 'COD' ? "text-brand-primary" : "text-zinc-400 group-hover:text-brand-primary")} />
                      <span className="font-medium text-brand-primary">Thanh toán khi nhận hàng (COD)</span>
                    </div>
                    <div className={cn("w-4 h-4 rounded-full border-2", paymentMethod === 'COD' ? "border-brand-primary bg-brand-primary" : "border-zinc-300")} />
                  </button>

                  {[
                    { id: 'BANK', label: 'Chuyển khoản (VietQR)', icon: <QrCode size={18} /> },
                    { id: 'VNPAY', label: 'Cổng VNPay', icon: <Smartphone size={18} /> },
                    { id: 'MOMO', label: 'Ví điện tử MoMo', icon: <Wallet size={18} /> },
                    { id: 'ZALOPAY', label: 'Ví điện tử ZaloPay', icon: <Wallet size={18} /> },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={cn(
                        "p-4 border rounded-2xl flex items-center justify-between transition-all text-left group",
                        paymentMethod === method.id ? "border-brand-primary bg-brand-primary/5" : "border-brand-primary/10 bg-brand-card hover:bg-brand-primary/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(paymentMethod === method.id ? "text-brand-primary" : "text-zinc-400 group-hover:text-brand-primary")}>
                          {method.icon}
                        </div>
                        <span className="font-medium text-brand-primary">{method.label}</span>
                      </div>
                      <div className={cn("w-4 h-4 rounded-full border-2", paymentMethod === method.id ? "border-brand-primary bg-brand-primary" : "border-zinc-300")} />
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={cn(
                  "w-full py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2",
                  isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-brand-primary/90"
                )}
              >
                {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
              </button>
            </form>
          </motion.div>

          {/* Tóm tắt đơn hàng */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-brand-card p-8 rounded-[32px] border border-brand-primary/10 h-fit">
            <h3 className="text-2xl font-serif font-bold text-brand-primary mb-6">Tóm tắt đơn hàng</h3>
            
            {/* Coupon Section */}
            <div className="mb-8 space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/40" size={16} />
                  <input 
                    type="text" 
                    placeholder="Nhập mã giảm giá"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-brand-background border border-brand-primary/10 rounded-2xl focus:outline-none text-sm uppercase font-bold"
                  />
                  {appliedCoupon && (
                    <button 
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-500 p-1 transition-colors"
                      title="Gỡ mã giảm giá"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <button 
                  onClick={handleApplyVoucher}
                  className="px-6 py-3 bg-brand-primary text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all"
                >
                  Áp dụng
                </button>
              </div>

              {/* List of available coupons */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-2">Mã giảm giá dành cho bạn</p>
                <div className="flex flex-col gap-2">
                  {coupons.map((coupon) => {
                    const isEligible = !coupon.minOrder || subtotal >= coupon.minOrder;
                    const isApplied = appliedCoupon?.id === coupon.id;

                    return (
                      <button
                        key={coupon.id}
                        onClick={() => applyCoupon(coupon)}
                        disabled={!isEligible}
                        className={cn(
                          "text-left p-3 rounded-2xl border transition-all flex items-center justify-between group",
                          isApplied 
                            ? "border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary" 
                            : isEligible 
                              ? "border-brand-primary/10 bg-white hover:border-brand-primary/30" 
                              : "border-zinc-100 bg-zinc-50 opacity-60 cursor-not-allowed"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                            isApplied ? "bg-brand-primary text-white" : "bg-brand-primary/5 text-brand-primary"
                          )}>
                            <Ticket size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-brand-primary">{coupon.code}</p>
                            <p className="text-[10px] text-zinc-500 line-clamp-1">{coupon.description}</p>
                          </div>
                        </div>
                        {isEligible ? (
                          <ChevronRight size={14} className={cn("transition-colors", isApplied ? "text-brand-primary" : "text-zinc-300 group-hover:text-brand-primary")} />
                        ) : (
                          <Info size={14} className="text-zinc-300" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Loyalty Points Section */}
            {userPoints > 0 && (
              <div className="mb-8 p-4 bg-brand-primary/5 rounded-3xl border border-brand-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg">
                      <Coins size={16} />
                    </div>
                    <span className="text-sm font-bold text-brand-primary">Điểm tích lũy: {userPoints.toLocaleString()}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setUsePoints(!usePoints)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                      usePoints ? "bg-brand-primary text-white" : "bg-white text-brand-primary border border-brand-primary/20"
                    )}
                  >
                    {usePoints ? "Đang dùng" : "Sử dụng"}
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500 italic ml-10">
                  Sử dụng tối đa {maxPointsRedeemable.toLocaleString()} điểm để giảm { (maxPointsRedeemable * POINT_VALUE).toLocaleString() }đ cho đơn hàng này.
                </p>
              </div>
            )}

            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar border-t border-brand-primary/5 pt-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className={cn("w-16 h-16 rounded-xl overflow-hidden flex-shrink-0", item.color)}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-brand-primary text-sm">{item.name}</h4>
                    <p className="text-xs text-zinc-500">x{item.quantity}</p>
                  </div>
                  <span className="font-bold text-brand-primary text-sm">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 pt-6 border-t border-brand-primary/10">
              <div className="flex justify-between text-zinc-500">
                <span>Tạm tính</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <div className="flex flex-col">
                    <span>Giảm giá</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-green-100 px-2 py-0.5 rounded w-fit">{appliedCoupon?.code}</span>
                  </div>
                  <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-500">
                <span>Phí vận chuyển</span>
                <span className="text-green-600 font-medium">Miễn phí</span>
              </div>
                {pointsDiscount > 0 && (
                  <div className="flex justify-between text-brand-primary font-medium">
                    <span>Điểm tích lũy</span>
                    <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pointsDiscount)}</span>
                  </div>
                )}
              <div className="flex justify-between text-2xl font-serif font-bold text-brand-primary pt-3 border-t border-brand-primary/5">
                <span>Tổng cộng</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal - discount - pointsDiscount)}</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-brand-primary/5 rounded-2xl flex items-start gap-3">
              <Truck className="text-brand-primary flex-shrink-0" size={20} />
              <p className="text-xs text-brand-primary/70 italic">
                Thời gian giao hàng dự kiến: 1-2 ngày làm việc trong khu vực nội thành.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
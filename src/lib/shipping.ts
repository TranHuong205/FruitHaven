import { ShippingLog } from '../types';

export const getTrackingInfo = async (carrier: string, trackingNumber: string): Promise<ShippingLog[]> => {
  // Trong thực tế, bạn sẽ gọi đến API Backend của mình:
  // const response = await fetch(`/api/shipping/track?carrier=${carrier}&id=${trackingNumber}`);
  // return response.json();

  await new Promise(resolve => setTimeout(resolve, 800)); // Giả lập độ trễ mạng

  const now = new Date();
  const dateStr = (daysAgo: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return d.toLocaleString('vi-VN');
  };

  if (carrier === 'GHTK') {
    return [
      { status: 'ĐÃ GIAO HÀNG', location: 'Quận Dương Kinh, Hải Phòng', time: dateStr(0), desc: 'Người nhận đã nhận hàng thành công' },
      { status: 'ĐANG GIAO HÀNG', location: 'Bưu cục Hải Phòng', time: dateStr(0.2), desc: 'Shipper đang trên đường giao đến bạn' },
      { status: 'NHẬP KHO', location: 'Kho tổng Miền Bắc', time: dateStr(1), desc: 'Đơn hàng đã nhập kho phân loại' },
      { status: 'ĐÃ LẤY HÀNG', location: 'Kho Fruit Haven', time: dateStr(2), desc: 'Hãng vận chuyển đã lấy hàng từ cửa hàng' },
    ];
  }

  return [
    { status: 'CHỜ LẤY HÀNG', location: 'Cửa hàng', time: dateStr(0), desc: 'Cửa hàng đang đóng gói và chờ hãng vận chuyển' }
  ];
};
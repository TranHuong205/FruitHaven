import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopProps {
  setIsPageLoading: (loading: boolean) => void;
}

export default function ScrollToTop({ setIsPageLoading }: ScrollToTopProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    setIsPageLoading(true);

    // Cuộn lên đầu trang mượt mà
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

    // Đợi hiệu ứng cuộn hoàn tất trước khi đóng loading overlay (khoảng 600ms)
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
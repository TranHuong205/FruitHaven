import { Navigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import { checkIsAdmin } from '../lib/auth';

interface PrivateRouteProps {
  children: React.ReactNode;
  user: User | null;
  requireAdmin?: boolean;
}

export default function PrivateRoute({ children, user, requireAdmin }: PrivateRouteProps) {
  const location = useLocation();

  if (!user) {
    // Lưu lại trang đang truy cập để sau khi đăng nhập có thể quay lại
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !checkIsAdmin(user)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}

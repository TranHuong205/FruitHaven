import { User } from "../types";

export const ADMIN_EMAILS = ['adminfruithaven@gmail.com', 'gautructv2000@gmail.com'];

export const checkIsAdmin = (user: User | null | undefined): boolean => {
  if (!user) return false;
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) return true;
  return user.role === 'admin' || user.role === 'staff';
};

/**
 * Kiểm tra xem người dùng có quyền quản trị tối cao (Super Admin) hay không
 */
export const isSuperAdmin = (user: User | null | undefined): boolean => {
  if (!user) return false;
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) return true;
  return user.role === 'admin';
};
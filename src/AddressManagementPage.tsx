import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Save, X, Edit } from 'lucide-react';
import { User } from './types';
import { cn } from './lib/utils';

interface AddressManagementPageProps {
  user: User | null;
  onUpdateUser: (user: User) => void;
}

export default function AddressManagementPage({ user, onUpdateUser }: AddressManagementPageProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editAddress, setEditAddress] = useState(user?.address || '');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSave = () => {
    onUpdateUser({ ...user, address: editAddress });
    setIsEditing(false);
  };

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

        <div className="bg-brand-card rounded-[48px] p-10 md:p-16 border border-brand-primary/5 shadow-2xl shadow-brand-primary/5 space-y-12">
          <div className="flex items-center gap-4 text-brand-primary">
            <MapPin size={32} />
            <h1 className="text-3xl font-serif font-bold">Quản lý địa chỉ nhận hàng</h1>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold text-brand-primary">Địa chỉ hiện tại</h2>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-primary hover:underline"
                >
                  <Edit size={18} />
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-4">
                  <button 
                    onClick={() => { setIsEditing(false); setEditAddress(user.address || ''); }}
                    className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600"
                  >
                    <X size={18} />
                    Hủy
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-primary"
                  >
                    <Save size={18} />
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <textarea
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                rows={4}
                className="w-full px-6 py-4 bg-brand-background border border-brand-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none text-sm"
              ></textarea>
            ) : (
              <div className="p-6 bg-brand-background rounded-3xl border border-brand-primary/5">
                <p className="text-brand-primary font-medium leading-relaxed">
                  {user.address || 'Bạn chưa thiết lập địa chỉ giao hàng.'}
                </p>
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-brand-primary/10 text-center">
            <p className="text-zinc-500 text-sm italic">
              Địa chỉ này sẽ được sử dụng làm địa chỉ mặc định cho các đơn hàng của bạn.
            </p>
            {/* Có thể thêm nút "Thêm địa chỉ mới" ở đây nếu muốn hỗ trợ nhiều địa chỉ */}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
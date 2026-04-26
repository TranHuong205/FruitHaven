# Fruit Haven - Trái Cây Hữu Cơ Tươi Sạch

Chào mừng bạn đến với Fruit Haven! Đây là ứng dụng thương mại điện tử chuyên cung cấp trái cây hữu cơ chất lượng cao.

## Công nghệ sử dụng
- **Frontend:** React + Vite + Tailwind CSS + Lucide Icons + Motion (Framer Motion).
- **Backend/Database:** Firebase Firestore & Firebase Auth.
- **AI:** Google Gemini API (Trợ lý ảo tư vấn khách hàng).

## Hướng dẫn triển khai (Vercel / GitHub)

Để triển khai ứng dụng này lên Vercel mà không gặp lỗi kết nối, bạn cần thực hiện các bước sau:

### 1. Thiết lập biến môi trường (Environment Variables)
Trên bảng điều khiển của Vercel (Project Settings > Environment Variables), hãy thêm các biến sau:

| Tên biến | Mô tả |
| :--- | :--- |
| `GEMINI_API_KEY` | API Key từ Google AI Studio |
| `VITE_FIREBASE_API_KEY` | Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Project ID của Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage Bucket của Firebase |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_FIREBASE_FIRESTORE_DATABASE_ID` | Firestore Database ID (Mặc định là `(default)`) |
| `VITE_APP_URL` | URL của trang web sau khi deploy |

> **Mẹo:** Bạn có thể sao chép các giá trị này từ tệp `firebase-applet-config.json` nếu có, hoặc từ phần Cài đặt dự án trong Firebase Console.

### 2. Cài đặt và Chạy cục bộ
1. Clone dự án về máy.
2. Chạy `npm install` để cài đặt dependencies.
3. Tạo tệp `.env` dựa trên `.env.example` và điền thông tin của bạn.
4. Chạy `npm run dev` để bắt đầu phát triển.
5. Chạy `npm run build` để đóng gói ứng dụng cho sản xuất.

### 3. Firebase Security Rules
Đừng quên triển khai các quy tắc bảo mật trong tệp `firestore.rules` lên Firebase Console để đảm bảo ứng dụng hoạt động đúng (đặc biệt là tính năng Chat và Giỏ hàng).

---
Chúc bạn kinh doanh hồng phát với Fruit Haven!

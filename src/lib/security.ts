/**
 * Băm mật khẩu bằng thuật toán SHA-256
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Nén ảnh để giảm dung lượng lưu trữ nhưng vẫn giữ chất lượng tốt
 * Mặc định tăng lên 800px cho ảnh sản phẩm sắc nét
 */
export function compressImage(base64Str: string, maxWidth = 800, maxHeight = 800): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Nếu ảnh nhỏ hơn giới hạn, giữ nguyên kích thước
      if (width <= maxWidth && height <= maxHeight) {
        canvas.width = width;
        canvas.height = height;
      } else {
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
      }

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Sử dụng thuật toán làm mượt ảnh khi thay đổi kích thước
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
      }
      
      // Tăng chất lượng nén lên 90% (0.9)
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
  });
}
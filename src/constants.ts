import { Fruit, Category, NewsItem, Coupon, Bundle } from './types';

export const FRUITS: Fruit[] = [
  {
    id: '1',
    name: 'Cam Sicily',
    category: 'Họ Cam Chanh',
    price: 120000,
    image: 'https://nebula.wsimg.com/b008525901e27c75a621426a1a9678df?AccessKeyId=CDBF849EA216B819FEB0&disposition=0&alloworigin=1',
    description: 'Cam chín mọng, ngọt thanh từ vùng Sicily. Hoàn hảo để ép nước tươi.',
    unit: 'kg',
    color: 'bg-orange-50',
    stock: 50,
    reviews: [
      { id: 'r1', userName: 'An Nguyễn', rating: 5, comment: 'Cam rất ngọt và mọng nước!', date: '2026-03-20' },
      { id: 'r2', userName: 'Minh Trần', rating: 4, comment: 'Chất lượng tốt, giao hàng nhanh.', date: '2026-03-18' }
    ]
  },
  {
    id: '2',
    name: 'Việt Quất Rừng',
    category: 'Dâu & Quả Mọng',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&q=80&w=800',
    description: 'Việt quất rừng hái tay, giàu chất chống oxy hóa và hương vị chua ngọt đậm đà.',
    unit: '250g',
    color: 'bg-blue-50',
    stock: 50,
    reviews: [
      { id: 'r2-1', userName: 'Linh Phạm', rating: 5, comment: 'Quả rất tươi, không bị dập nát.', date: '2026-03-22' },
      { id: 'r2-2', userName: 'Hoàng Anh', rating: 5, comment: 'Việt quất chua ngọt hài hòa, rất ngon và bổ dưỡng.', date: '2026-03-28' },
      { id: 'r2-3', userName: 'Minh Thư', rating: 4, comment: 'Đóng gói cẩn thận, giao hàng nhanh chóng.', date: '2026-03-29' },
      { id: 'r2-4', userName: 'Quốc Bảo', rating: 5, comment: 'Rất thích loại việt quất này, ăn kèm sữa chua thì tuyệt vời.', date: '2026-03-30' }
    ]
  },
  {
    id: '3',
    name: 'Xoài Cát Hòa Lộc',
    category: 'Nhiệt Đới',
    price: 85000,
    image: 'https://unica.vn/media/imagesck/1627927882_cach-lam-thach-xoai-4.jpg?v=1627927882',
    description: 'Xoài cát chín vàng, thịt mịn không xơ với vị ngọt thanh như mật ong.',
    unit: 'quả',
    color: 'bg-yellow-50',
    stock: 50,
    reviews: [
      { id: 'r3-1', userName: 'Hải Nam', rating: 5, comment: 'Xoài rất thơm, ngọt lịm đúng chuẩn Hòa Lộc.', date: '2026-03-24' },
      { id: 'r3-2', userName: 'Ngọc Diệp', rating: 5, comment: 'Giao hàng nhanh, quả chín tới rất vừa ăn.', date: '2026-03-25' },
      { id: 'r3-3', userName: 'Tuấn Trần', rating: 4, comment: 'Thịt xoài mịn, không có xơ, cả nhà đều thích.', date: '2026-03-26' }
    ]
  },
  {
    id: '4',
    name: 'Dâu Tây Ruby',
    category: 'Dâu & Quả Mọng',
    price: 180000,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=800',
    description: 'Dâu tây đỏ mọng, hình trái tim với hương thơm quyến rũ và vị ngọt lịm.',
    unit: '500g',
    color: 'bg-red-50',
    stock: 50,
    reviews: [
      { id: 'r4-1', userName: 'Minh Anh', rating: 5, comment: 'Dâu rất ngọt và thơm, giao hàng nhanh.', date: '2026-03-22' },
      { id: 'r4-2', userName: 'Thu Trang', rating: 5, comment: 'Quả to, đều và rất tươi. Sẽ ủng hộ tiếp.', date: '2026-03-24' },
      { id: 'r4-3', userName: 'Đức Huy', rating: 4, comment: 'Dâu ngon, đóng gói rất đẹp mắt.', date: '2026-03-25' }
    ]
  },
  {
    id: '5',
    name: 'Thanh Long Thái',
    category: 'Nhiệt Đới',
    price: 65000,
    image: 'https://icdn.dantri.com.vn/dansinh/2024/08/27/thanh-long-1724776610022.jpg',
    description: 'Thanh long ruột trắng thanh mát với lớp vỏ hồng rực rỡ.',
    unit: 'kg',
    color: 'bg-pink-50',
    stock: 50,
    reviews: [
      { id: 'r5-1', userName: 'Thế Vinh', rating: 5, comment: 'Thanh long rất ngọt và tươi, vỏ mỏng.', date: '2026-03-25' },
      { id: 'r5-2', userName: 'Lan Hương', rating: 5, comment: 'Giao hàng nhanh, quả to đều.', date: '2026-03-26' },
      { id: 'r5-3', userName: 'Minh Quân', rating: 4, comment: 'Ăn thanh mát, giải nhiệt rất tốt.', date: '2026-03-27' }
    ]
  },
  {
    id: '6',
    name: 'Dứa Mật Honey Glow',
    category: 'Nhiệt Đới',
    price: 95000,
    image: 'https://soyte.hatinh.gov.vn/upload/1000030/20171026/d695b82555068e81897d2e46af0d0b55105d608t1588l0.jpg',
    description: 'Dứa mật siêu ngọt, ít axit với màu vàng óng ả đẹp mắt.',
    unit: 'quả',
    color: 'bg-yellow-50',
    stock: 50,
    reviews: [
      { id: 'r6-1', userName: 'Quốc Bảo', rating: 5, comment: 'Dứa cực kỳ ngọt, thơm nức mũi luôn.', date: '2026-03-24' },
      { id: 'r6-2', userName: 'Minh Tú', rating: 5, comment: 'Màu vàng đẹp, ăn không hề bị rát lưỡi.', date: '2026-03-26' },
      { id: 'r6-3', userName: 'Ngọc Lan', rating: 4, comment: 'Quả to, mọng nước, rất đáng tiền.', date: '2026-03-28' }
    ]
  },
  {
    id: '7',
    name: 'Chanh Vàng Meyer',
    category: 'Họ Cam Chanh',
    price: 55000,
    image: 'https://caygiongnongnghiep.com.vn/wp-content/uploads/2021/03/137.jpg',
    description: 'Sự kết hợp giữa chanh và quýt, ngọt hơn và thơm hơn chanh thường.',
    unit: '500g',
    color: 'bg-yellow-50',
    stock: 50,
    reviews: [
      { id: 'r7-1', userName: 'Minh Hoàng', rating: 5, comment: 'Chanh rất thơm, vỏ mọng nước, pha trà hay làm gia vị đều tuyệt.', date: '2026-03-22' },
      { id: 'r7-2', userName: 'Thu Thảo', rating: 5, comment: 'Chanh tươi, vị chua thanh và mùi thơm rất đặc trưng.', date: '2026-03-25' },
      { id: 'r7-3', userName: 'Anh Tuấn', rating: 4, comment: 'Giao hàng nhanh, quả to đều và đẹp.', date: '2026-03-26' }
    ]
  },
  {
    id: '8',
    name: 'Dưa Lưới Cantaloupe',
    category: 'Dưa',
    price: 110000,
    image: 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?auto=format&fit=crop&q=80&w=800',
    description: 'Dưa lưới ruột cam ngọt lịm, mọng nước với hương thơm dịu nhẹ.',
    unit: 'quả',
    color: 'bg-orange-50',
    stock: 50,
    reviews: [
      { id: 'r8-1', userName: 'Minh Quân', rating: 5, comment: 'Dưa rất ngọt, giòn và thơm. Giao hàng nhanh.', date: '2026-03-25' },
      { id: 'r8-2', userName: 'Thu Trang', rating: 5, comment: 'Quả to, mọng nước, rất đáng tiền.', date: '2026-03-26' },
      { id: 'r8-3', userName: 'Thế Vinh', rating: 4, comment: 'Chất lượng tuyệt vời, sẽ ủng hộ shop tiếp.', date: '2026-03-27' }
    ]
  },
  {
    id: '9',
    name: 'Vải Thiều Lục Ngạn',
    category: 'Nhiệt Đới',
    price: 75000,
    image: 'https://nhn.1cdn.vn/thumbs/720x480/2023/05/28/vaithieuaustralia16-1672139464801-16721394649801909051677.jpeg',
    description: 'Vải thiều chín đỏ, hạt nhỏ, cùi dày và vị ngọt lịm đặc trưng của vùng đất Lục Ngạn.',
    unit: 'kg',
    color: 'bg-red-50',
    stock: 50,
    reviews: [
      { id: 'r9-1', userName: 'Minh Tuấn', rating: 5, comment: 'Vải rất ngọt, hạt nhỏ xíu, đúng chuẩn Lục Ngạn luôn.', date: '2026-03-28' },
      { id: 'r9-2', userName: 'Thu Hương', rating: 5, comment: 'Giao hàng nhanh, vải còn tươi nguyên cành.', date: '2026-03-29' },
      { id: 'r9-3', userName: 'Thanh Bình', rating: 4, comment: 'Vị ngọt lịm, cùi dày. Rất hài lòng với chất lượng.', date: '2026-03-30' }
    ]
  },
  {
    id: '10',
    name: 'Nhãn Lồng Hưng Yên',
    category: 'Nhiệt Đới',
    price: 60000,
    image: 'https://cdn.tgdd.vn/Files/2018/07/07/1099933/nhung-loai-nhan-ngon-duoc-nhieu-nguoi-chon-mua-nhat-202207121450236718.jpg',
    description: 'Nhãn lồng tiến vua với cùi dày, giòn, vị ngọt đậm và hương thơm đặc trưng.',
    unit: 'kg',
    color: 'bg-yellow-50',
    stock: 50,
    reviews: [
      { id: 'r10-1', userName: 'Văn Hoàng', rating: 5, comment: 'Nhãn rất ngọt, cùi dày và giòn đúng chuẩn Hưng Yên.', date: '2026-03-25' },
      { id: 'r10-2', userName: 'Thu Hà', rating: 5, comment: 'Giao hàng nhanh, nhãn còn tươi nguyên chùm, quả to đều.', date: '2026-03-26' },
      { id: 'r10-3', userName: 'Minh Đức', rating: 4, comment: 'Vị ngọt thanh, thơm nức mũi. Rất hài lòng.', date: '2026-03-27' }
    ]
  },
  {
    id: '11',
    name: 'Măng Cụt Lái Thiêu',
    category: 'Nhiệt Đới',
    price: 90000,
    image: 'https://monngonmoingay.com/wp-content/uploads/2023/08/cach-chon-mang-cut-ngon-khong-mat-tien-oan-1.jpg',
    description: 'Nữ hoàng trái cây với vị chua ngọt hài hòa, trắng trong and thanh mát.',
    unit: 'kg',
    color: 'bg-purple-50',
    stock: 50,
    reviews: [
      { id: 'r11-1', userName: 'Bảo Trâm', rating: 5, comment: 'Măng cụt rất ngon, trái nào cũng trắng tinh, không bị hỏng.', date: '2026-03-25' },
      { id: 'r11-2', userName: 'Thành Trung', rating: 5, comment: 'Vị chua ngọt rất vừa miệng, đúng chuẩn Lái Thiêu.', date: '2026-03-27' },
      { id: 'r11-3', userName: 'Phương Thảo', rating: 4, comment: 'Giao hàng nhanh, đóng gói kỹ càng.', date: '2026-03-28' }
    ]
  },
  {
    id: '12',
    name: 'Chôm Chôm Nhãn',
    category: 'Nhiệt Đới',
    price: 45000,
    image: 'https://s7ap1.scene7.com/is/image/aia/chom-chom-co-nong-khong%20(2)?qlt=85&wid=1200&ts=1699182164173&dpr=off',
    description: 'Chôm chôm nhãn giòn sần sật, tróc hạt và vị ngọt thanh tự nhiên.',
    unit: 'kg',
    color: 'bg-red-50',
    stock: 50,
    reviews: [
      { id: 'r12-1', userName: 'Văn Tiến', rating: 5, comment: 'Chôm chôm rất giòn, dễ tróc hạt, vị ngọt thanh cực kỳ ngon.', date: '2026-03-26' },
      { id: 'r12-2', userName: 'Lan Anh', rating: 5, comment: 'Hàng tươi, đóng gói cẩn thận. Giao hàng rất nhanh.', date: '2026-03-27' },
      { id: 'r12-3', userName: 'Minh Hoàng', rating: 4, comment: 'Quả hơi nhỏ nhưng rất ngọt và chắc thịt.', date: '2026-03-28' }
    ]
  },
  {
    id: '13',
    name: 'Dưa Hấu Long An',
    category: 'Dưa',
    price: 25000,
    image: 'https://dbnd.1cdn.vn/2024/03/21/d2b2f5f42dbd3d57a939a328e2093bdadac1f6c64325a84ccedfe722b71135366c523369ebf-_anh-chup-man-hinh-2024-03-21-luc-1710984383253.png',
    description: 'Dưa hấu đỏ ngọt, mọng nước, giải nhiệt tuyệt vời cho những ngày nắng nóng.',
    unit: 'kg',
    color: 'bg-green-50',
    stock: 50,
    reviews: [
      { id: 'r13-1', userName: 'Minh Hoàng', rating: 5, comment: 'Dưa rất ngọt, đỏ lịm và vỏ mỏng. Rất đáng mua!', date: '2026-03-26' },
      { id: 'r13-2', userName: 'Thanh Trúc', rating: 5, comment: 'Dưa tươi, mọng nước, giải nhiệt cực tốt cho mùa hè.', date: '2026-03-27' },
      { id: 'r13-3', userName: 'Tuấn Anh', rating: 4, comment: 'Giao hàng nhanh, dưa ngon nhưng quả hơi nhỏ một chút.', date: '2026-03-28' }
    ]
  },
  {
    id: '14',
    name: 'Mận Hậu Sơn La',
    category: 'Trái Cây Hạt',
    price: 55000,
    image: 'https://sonla.egap.vn/img/img_productOrigin/man-co-tac-dung-gi-2.jpeg',
    description: 'Mận hậu giòn tan, vị chua ngọt đậm đà, đặc sản nức tiếng vùng cao Tây Bắc.',
    unit: 'kg',
    color: 'bg-red-50',
    stock: 50,
    reviews: [
      { id: 'r14-1', userName: 'Minh Thư', rating: 5, comment: 'Mận rất giòn, vị chua ngọt hài hòa, chấm muối hảo hảo thì tuyệt vời.', date: '2026-03-28' },
      { id: 'r14-2', userName: 'Trần Long', rating: 5, comment: 'Đặc sản Sơn La đúng chuẩn, quả to đều, không bị chát.', date: '2026-03-29' },
      { id: 'r14-3', userName: 'Phương Linh', rating: 4, comment: 'Giao hàng nhanh, mận tươi ngon.', date: '2026-03-30' }
    ]
  },
  {
    id: '15',
    name: 'Vú Sữa Lò Rèn',
    category: 'Nhiệt Đới',
    price: 85000,
    image: 'https://cdn-i.doisongphapluat.com.vn/resize/th/upload/2024/12/09/luu-y-khi-an-vu-sua-de-tranh-ruoc-hai-vao-than-dspl-2-20112057.jpg',
    description: 'Vú sữa trắng mịn, ngọt thanh như dòng sữa mẹ, vỏ mỏng và căng bóng.',
    unit: 'kg',
    color: 'bg-purple-50',
    stock: 50,
    reviews: [
      { id: 'r15-1', userName: 'Thanh Hằng', rating: 5, comment: 'Vú sữa rất ngọt, nhiều sữa, vỏ mỏng đúng chuẩn Lò Rèn.', date: '2026-03-25' },
      { id: 'r15-2', userName: 'Hữu Duy', rating: 5, comment: 'Trái to, chín cây tự nhiên ăn rất thơm.', date: '2026-03-26' },
      { id: 'r15-3', userName: 'Minh Thư', rating: 4, comment: 'Giao hàng cẩn thận, trái không bị dập.', date: '2026-03-27' }
    ]
  },
  {
    id: '16',
    name: 'Mít Thái Siêu Sớm',
    category: 'Nhiệt Đới',
    price: 40000,
    image: 'https://tfruit.com.vn/wp-content/uploads/2020/03/qu%E1%BA%A3-m%C3%ADt-v%C3%A0-l%E1%BB%A3i-%C3%ADch.jpg',
    description: 'Mít Thái múi dày, vàng óng, vị ngọt đậm và giòn sần sật rất hấp dẫn.',
    unit: 'kg',
    color: 'bg-yellow-50',
    stock: 50,
    reviews: [
      { id: 'r16-1', userName: 'Quốc Tuấn', rating: 5, comment: 'Mít rất giòn and ngọt, múi dày, ăn cực thích.', date: '2026-03-27' },
      { id: 'r16-2', userName: 'Minh Thư', rating: 5, comment: 'Giao hàng nhanh, mít đóng gói sạch sẽ.', date: '2026-03-28' },
      { id: 'r16-3', userName: 'Hữu Bằng', rating: 4, comment: 'Vị ngọt đậm đà, không bị xơ nhiều.', date: '2026-03-29' }
    ]
  },
  {
    id: '17',
    name: 'Đào Sa Pa',
    category: 'Trái Cây Hạt',
    price: 110000,
    image: 'https://goodheart.vn/wp-content/uploads/2024/04/qua-dao-1-2.jpg',
    description: 'Đào Sa Pa lông mịn, thịt chắc, vị ngọt thanh mát mang hương vị vùng cao.',
    unit: 'kg',
    color: 'bg-orange-50',
    stock: 50,
    reviews: [
      { id: 'r17-1', userName: 'Khánh Linh', rating: 5, comment: 'Đào rất thơm and giòn, ăn một quả là muốn ăn thêm!', date: '2026-03-25' },
      { id: 'r17-2', userName: 'Văn Đức', rating: 5, comment: 'Đúng chuẩn đào Sa Pa, trái to and không bị chát.', date: '2026-03-26' },
      { id: 'r17-3', userName: 'Minh Hạnh', rating: 4, comment: 'Giao hàng nhanh, đóng gói cẩn thận.', date: '2026-03-27' }
    ]
  },
  {
    id: '18',
    name: 'Đu Đủ Chín Cây',
    category: 'Nhiệt Đới',
    price: 35000,
    image: 'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/du_du_chua_benh_gi_loi_ich_tuyet_voi_cua_loai_qua_nhiet_doi_2_c628bb3872.jpeg',
    description: 'Đu đủ chín cây tự nhiên, thịt vàng cam, vị ngọt thanh and rất tốt cho hệ tiêu hóa.',
    unit: 'kg',
    color: 'bg-orange-50',
    stock: 50,
    reviews: [
      { id: 'r18-1', userName: 'Minh Thư', rating: 5, comment: 'Đu đủ rất ngọt, chín cây tự nhiên ăn khác hẳn mua ngoài chợ.', date: '2026-03-28' },
      { id: 'r18-2', userName: 'Trần Long', rating: 5, comment: 'Quả to, thịt dày and vàng ươm. Rất hài lòng.', date: '2026-03-29' },
      { id: 'r18-3', userName: 'Phương Linh', rating: 4, comment: 'Giao hàng nhanh, đu đủ tươi ngon.', date: '2026-03-30' }
    ]
  },
  {
    id: '19',
    name: 'Ổi Hồng Nữ Hoàng',
    category: 'Nhiệt Đới',
    price: 45000,
    image: 'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/9/19/1094878/A04AD6C7-AF61-4F4F-B.jpeg',
    description: 'Ổi hồng với lớp vỏ xanh giòn, ruột hồng bắt mắt and hương thơm đặc trưng quyến rũ.',
    unit: 'kg',
    color: 'bg-green-50',
    stock: 50,
    reviews: [
      { id: 'r19-1', userName: 'Lan Anh', rating: 5, comment: 'Ổi rất giòn, ruột hồng đẹp mắt and thơm lắm.', date: '2026-03-25' },
      { id: 'r19-2', userName: 'Tuấn Minh', rating: 5, comment: 'Lần đầu ăn ổi hồng, vị rất lạ and ngon. Sẽ mua lại.', date: '2026-03-26' },
      { id: 'r19-3', userName: 'Thùy Chi', rating: 4, comment: 'Ổi tươi, giao hàng nhanh.', date: '2026-03-27' }
    ]
  },
  {
    id: '20',
    name: 'Lựu Đỏ Ai Cập',
    category: 'Nhiệt Đới',
    price: 135000,
    image: 'https://suckhoedoisong.qltns.mediacdn.vn/Images/duylinh/2018/11/18/pomegranate_image_hrws.png',
    description: 'Lựu đỏ mọng nước, hạt mềm, vị ngọt đậm đà and chứa hàm lượng chất chống oxy hóa cực cao.',
    unit: 'kg',
    color: 'bg-red-50',
    stock: 50,
    reviews: [
       { id: 'r20-1', userName: 'Hà My', rating: 5, comment: 'Hạt lựu đỏ mọng, ngọt lịm. Đóng gói rất kỹ.', date: '2026-03-28' }
    ]
  },
  {
    id: '21',
    name: 'Nho Đen Không Hạt',
    category: 'Dâu & Quả Mọng',
    price: 155000,
    image: 'https://suckhoedoisong.qltns.mediacdn.vn/jBt252BAaPNqKQdORF9knP7zcccccc/Image/2013/02/nho-662eb.jpg',
    description: 'Nho đen giòn ngọt, mọng nước and không hạt, chứa nhiều chất chống oxy hóa tốt cho tim mạch.',
    unit: 'kg',
    color: 'bg-purple-50',
    stock: 50,
    reviews: [
      { id: 'r21-1', userName: 'Hồng Anh', rating: 5, comment: 'Nho rất tươi, giòn and ngọt lịm, đặc biệt là không có hạt nên rất tiện lợi.', date: '2026-03-29' },
      { id: 'r21-2', userName: 'Quang Minh', rating: 4, comment: 'Chất lượng tốt, ăn rất ngon. Sẽ ủng hộ Fruit Haven dài dài.', date: '2026-03-30' },
      { id: 'r21-3', userName: 'Mai Phương', rating: 5, comment: 'Đóng gói cẩn thận, nho không bị dập. Rất hài lòng!', date: '2026-03-30' }
    ]
  },
  {
    id: '22',
    name: 'Chanh Leo (Chanh Dây)',
    category: 'Nhiệt Đới',
    price: 45000,
    image: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2022/7/8/1065919/292102064_1523371104.jpg?w=660',
    description: 'Chanh leo thơm nồng nàn, vị chua thanh mát, giàu vitamin C cho làn da rạng rỡ.',
    unit: 'kg',
    color: 'bg-purple-50',
    stock: 50,
     reviews: [
       { id: 'r22-1', userName: 'Lâm Tùng', rating: 5, comment: 'Pha nước uống rất thơm and mát.', date: '2026-03-25' }
     ]
  },
  {
    id: '23',
    name: 'Táo Envy Premium',
    category: 'Trái Cây Hạt',
    price: 185000,
    image: 'https://truyenhinhnghean.vn/file/4028eaa46735a26101673a4df345003c/082023/thuc-hu-cau-noi-mot-qua-tao-giup-ban-luon-khoe-manh-15213856_20230805081552.jpeg',
    description: 'Táo Envy với độ giòn vượt trội, hương thơm dịu and vị ngọt đậm đà khó cưỡng.',
    unit: 'kg',
    color: 'bg-red-50',
    stock: 50,
    reviews: [
      { id: 'r23-1', userName: 'Bích Phương', rating: 5, comment: 'Táo rất giòn, ngọt and thơm. Đáng tiền lắm!', date: '2026-03-26' },
      { id: 'r23-2', userName: 'Minh Quân', rating: 5, comment: 'Sản phẩm tươi, không bị thâm hay dập. Giao hàng nhanh.', date: '2026-03-27' },
      { id: 'r23-3', userName: 'Thanh Vân', rating: 4, comment: 'Táo ngon, trái to đều. Sẽ tiếp tục ủng hộ.', date: '2026-03-28' }
    ]
  },
  {
    id: '24',
    name: 'Na Dai Đông Triều',
    category: 'Nhiệt Đới',
    price: 85000,
    image: 'https://bazaarvietnam.vn/wp-content/uploads/2022/07/harper-bazaar-an-na-co-giam-can-khong-3.jpg',
    description: 'Na dai thịt trắng, vị ngọt đậm, ít hạt and mùi thơm quyến rũ đặc trưng.',
    unit: 'kg',
    color: 'bg-green-50',
    stock: 50,
    reviews: [
      { id: 'r24-1', userName: 'Thu Trang', rating: 5, comment: 'Na rất dai and ngọt, quả to chín đều.', date: '2026-03-27' },
      { id: 'r24-2', userName: 'Hải Yến', rating: 5, comment: 'Mùi thơm đặc trưng, ăn rất thích. Sẽ mua lại.', date: '2026-03-28' },
      { id: 'r24-3', userName: 'Tuấn Tú', rating: 4, comment: 'Na ngon, đóng gói cẩn thận không bị dập.', date: '2026-03-29' }
    ]
  },
  {
    id: '25',
    name: 'Chuối Laba Đà Lạt',
    category: 'Nhiệt Đới',
    price: 35000,
    image: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2020/11/30/858368/5180A02d4e4739da16ed.jpeg',
    description: 'Chuối Laba dẻo, thơm and ngọt hơn chuối thường, là nguồn năng lượng tuyệt vời.',
    unit: 'kg',
    color: 'bg-yellow-50',
    stock: 50,
    reviews: [
       { id: 'r25-1', userName: 'Khải Đăng', rating: 5, comment: 'Chuối dẻo, thơm lắm.', date: '2026-03-27' }
    ]
  },
  {
    id: '26',
    name: 'Bơ Sáp Đắk Lắk',
    category: 'Nhiệt Đới',
    price: 65000,
    image: 'https://monngonmoingay.com/wp-content/uploads/2024/10/Bo-sap-la-bo-gi-va-cach-chon-bo-sap-deo-ngon-MNMN-6.jpg',
    description: 'Bơ sáp dẻo quánh, béo ngậy, hạt nhỏ and vỏ mỏng từ vùng đất đỏ Tây Nguyên.',
    unit: 'kg',
    color: 'bg-green-50',
    stock: 50,
    reviews: [
      { id: 'r26-1', userName: 'Hoàng Nam', rating: 5, comment: 'Bơ rất dẻo and béo, đúng chuẩn bơ sáp Đắk Lắk luôn.', date: '2026-03-27' },
      { id: 'r26-2', userName: 'Thanh Thủy', rating: 5, comment: 'Trái to đều, hạt cực nhỏ, ăn kèm sữa đặc thì tuyệt vời.', date: '2026-03-28' },
      { id: 'r26-3', userName: 'Quốc Anh', rating: 4, comment: 'Giao hàng nhanh, bơ chín tới không bị dập nát.', date: '2026-03-28' }
    ]
  },
  {
    id: '27',
    name: 'Quả Óc Chó Vàng',
    category: 'Trái Cây Hạt',
    price: 245000,
    image: 'https://suckhoedoisong.qltns.mediacdn.vn/thumb_w/640/324455921873985536/2023/8/8/qua-oc-cho-1691500231004951165640.jpg',
    description: 'Quả óc chó giàu Omega-3, tốt cho não bộ and tim mạch, hương vị bùi béo đặc trưng.',
    unit: '500g',
    color: 'bg-orange-50',
    stock: 50,
    reviews: [
      { id: 'r27-1', userName: 'Minh Khôi', rating: 5, comment: 'Hạt rất mẩy, vị bùi béo, ăn rất ghiền.', date: '2026-03-25' },
      { id: 'r27-2', userName: 'Thu Hà', rating: 5, comment: 'Sản phẩm đóng gói kỹ, hạt không bị hôi dầu. Rất tốt cho sức khỏe.', date: '2026-03-26' },
      { id: 'r27-3', userName: 'Bảo Long', rating: 4, comment: 'Giao hàng nhanh, hạt chất lượng đồng đều.', date: '2026-03-27' }
    ]
  },
  {
    id: '28',
    name: 'Kiwi Xanh New Zealand',
    category: 'Nhiệt Đới',
    price: 120000,
    image: 'https://dbnd.1cdn.vn/2023/10/04/c0c5cee44437445f7f9ad675b57774fc097a475ecaca5a84ccedfe722b71135366c523369ebf-_6-cong-dung-cua-qua-kiwi-doi-voi-1696385851965.jpg',
    description: 'Kiwi xanh nhập khẩu giàu vitamin C, vị chua ngọt thanh mát and tốt cho sức khỏe.',
    unit: 'kg',
    color: 'bg-green-50',
    stock: 50,
    reviews: [
      { id: 'r28-1', userName: 'Minh Thư', rating: 5, comment: 'Kiwi rất tươi, vị chua ngọt hài hòa, ăn rất thích.', date: '2026-03-28' },
      { id: 'r28-2', userName: 'Tuấn Kiệt', rating: 5, comment: 'Trái to đều, đóng gói cẩn thận. Rất tốt để bổ sung vitamin C.', date: '2026-03-29' },
      { id: 'r28-3', userName: 'Lan Phương', rating: 4, comment: 'Chất lượng ổn định, giao hàng nhanh chóng.', date: '2026-03-30' }
    ]
  },
  {
    id: '29',
    name: 'Bưởi Da Xanh Bến Tre',
    category: 'Họ Cam Chanh',
    price: 70000,
    image: 'https://cdnv2.tgdd.vn/ketnoicungcau/Contents/images/upload/product/20231216/113031129/buoi-da-xanh-an-lao-11303116122023I4FVH.jpg',
    description: 'Bưởi da xanh Bến Tre múi hồng, mọng nước, vị ngọt đậm đà and không hạt.',
    unit: 'kg',
    color: 'bg-green-50',
    stock: 50,
    reviews: [
       { id: 'r29-1', userName: 'Hải Đăng', rating: 5, comment: 'Bưởi rất ngon, mọng nước.', date: '2026-03-25' }
    ]
  },
  {
    id: '30',
    name: 'Dừa Xiêm Bến Tre',
    category: 'Nhiệt Đới',
    price: 35000,
    image: 'https://misolhouse.com/assets/uploads/334222c4b6236eb8035c6a9f4a829c59.jpg',
    description: 'Dừa xiêm xanh Bến Tre ngọt lịm, mọng nước, là thức uống giải nhiệt tự nhiên hoàn hảo.',
    unit: 'quả',
    color: 'bg-green-50',
    stock: 50,
    reviews: [
      { id: 'r30-1', userName: 'Hoàng Nam', rating: 5, comment: 'Dừa rất ngọt, nước thanh mát, đúng chuẩn dừa xiêm Bến Tre.', date: '2026-03-25' },
      { id: 'r30-2', userName: 'Thanh Trúc', rating: 4, comment: 'Nước dừa nhiều, quả tươi. Giao hàng rất nhanh.', date: '2026-03-26' },
      { id: 'r30-3', userName: 'Minh Tuấn', rating: 3, comment: 'Dừa ngon nhưng trái hơi nhỏ so với mình tưởng tượng.', date: '2026-03-27' }
    ]
  },
];

export const CATEGORIES: Category[] = ['Tất cả', 'Họ Cam Chanh', 'Dâu & Quả Mọng', 'Nhiệt Đới', 'Trái Cây Hạt', 'Dưa'];

export const NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: '5 Lợi Ích Tuyệt Vời Của Trái Cây Hữu Cơ',
    excerpt: 'Khám phá lý do tại sao việc chọn trái cây hữu cơ lại quan trọng đối với sức khỏe của bạn and gia đình.',
    content: 'Trái cây hữu cơ không chỉ mang lại hương vị thơm ngon tự nhiên mà còn chứa hàm lượng dinh dưỡng cao hơn so với các loại trái cây thông thường. Việc không sử dụng thuốc trừ sâu hóa học and phân bón tổng hợp giúp bảo vệ hệ sinh thái and sức khỏe người tiêu dùng...',
    date: '2026-03-25',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800',
    author: 'Admin',
    category: 'Sức Khỏe'
  },
  {
    id: 'n2',
    title: 'Cách Bảo Quản Trái Cây Luôn Tươi Ngon',
    excerpt: 'Những mẹo nhỏ giúp bạn giữ cho trái cây luôn mọng nước and giữ được chất dinh dưỡng lâu nhất.',
    content: 'Mỗi loại trái cây có một cách bảo quản riêng biệt. Ví dụ, dâu tây nên được giữ khô ráo trong tủ lạnh, trong khi chuối lại thích hợp để ở nhiệt độ phòng. Bài viết này sẽ hướng dẫn chi tiết cách bảo quản từng loại trái cây phổ biến...',
    date: '2026-03-22',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    author: 'Fruit Haven Team',
    category: 'Mẹo Hay'
  },
  {
    id: 'n3',
    title: 'Xu Hướng Sống Xanh Cùng Fruit Haven',
    excerpt: 'Cùng tìm hiểu về phong trào sống bền vững and cách Fruit Haven đóng góp vào việc bảo vệ môi trường.',
    content: 'Tại Fruit Haven, chúng tôi không chỉ cung cấp trái cây sạch mà còn hướng tới mục tiêu phát triển bền vững. Từ việc sử dụng bao bì thân thiện với môi trường đến việc hỗ trợ các nông trại địa phương áp dụng kỹ thuật canh tác hữu cơ...',
    date: '2026-03-18',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=800',
    author: 'CEO Fruit Haven',
    category: 'Tin Tức'
  },
  {
    id: 'n4',
    title: 'Mùa Vải Thiều Lục Ngạn: Tinh Hoa Đất Trời Bắc Giang',
    excerpt: 'Lục Ngạn (Bắc Giang) đang bước vào những ngày rộn ràng nhất của mùa vải thiều - loại trái cây được mệnh danh là "vàng đỏ" của vùng đất này.',
    content: 'Cứ mỗi độ tháng 6, tháng 7 về, vùng đất Lục Ngạn lại khoác lên mình tấm áo đỏ rực của những chùm vải thiều chín mọng. Vải thiều Lục Ngạn từ lâu đã nổi tiếng khắp trong and ngoài nước bởi hương vị đặc trưng: quả to, vỏ mỏng, hạt nhỏ, cùi dày and vị ngọt lịm như mật ong.\n\nĐể có được những trái vải chất lượng nhất, người nông dân Lục Ngạn đã phải dày công chăm sóc theo các tiêu chuẩn nghiêm ngặt như VietGAP and GlobalGAP. Quy trình thu hoạch cũng được thực hiện hết sức khẩn trương vào lúc sáng sớm để giữ được độ tươi ngon and màu sắc đẹp nhất cho trái vải.\n\nTại Fruit Haven, chúng tôi tự hào mang đến cho khách hàng những chùm vải thiều Lục Ngạn chính gốc, được tuyển chọn kỹ lưỡng ngay tại vườn and vận chuyển hỏa tốc để đảm bảo độ tươi mới tuyệt đối khi đến tay người tiêu dùng.',
    date: '2026-03-28',
    image: 'https://nhn.1cdn.vn/thumbs/720x480/2023/05/28/vaithieuaustralia16-1672139464801-16721394649801909051677.jpeg',
    author: 'Fruit Haven Team',
    category: 'Tin Tức'
  },
  {
    id: 'n5',
    title: 'Bí Quyết Chọn Bơ Sáp Ngon, Dẻo Quánh Và Không Bị Đắng',
    excerpt: 'Làm sao để chọn được những quả bơ sáp chín tự nhiên, béo ngậy mà không lo bị đắng? Khám phá ngay những mẹo cực đơn giản từ chuyên gia Fruit Haven.',
    content: 'Bơ sáp là loại trái cây vô cùng bổ dưỡng nhưng cũng rất "khó chiều" nếu bạn không biết cách chọn. Một quả bơ sáp ngon phải có vỏ căng bóng, cầm chắc tay and khi lắc nhẹ có thể nghe thấy tiếng hạt chuyển động nhẹ bên trong.\n\nĐể tránh mua phải bơ đắng, hãy quan sát phần cuống. Nếu cuống bơ có màu vàng tươi, đó là bơ vừa chín tới, ăn sẽ rất ngọt. Tránh những quả có cuống xanh (bơ chưa chín) hoặc cuống màu nâu sẫm (bơ đã quá chín hoặc bị hỏng). Ngoài ra, hãy ưu tiên những quả bơ có da sần sùi nhẹ, vì đây thường là dấu hiệu của bơ sáp có độ dẻo cao.\n\nTại Fruit Haven, bơ sáp Đắk Lắk luôn được tuyển chọn kỹ lưỡng, đảm bảo độ chín tự nhiên, mang đến hương vị béo ngậy hoàn hảo cho gia đình bạn. Đừng quên bảo quản bơ ở nơi thoáng mát and chỉ cho vào tủ lạnh khi bơ đã chín hẳn để giữ được hương vị ngon nhất.',
    date: '2026-03-29',
    image: 'https://monngonmoingay.com/wp-content/uploads/2024/10/Bo-sap-la-bo-gi-va-cach-chon-bo-sap-deo-ngon-MNMN-6.jpg',
    author: 'Chuyên gia Fruit Haven',
    category: 'Mẹo Hay'
  },
  {
    id: 'n6',
    title: '7 Lợi Ích Vàng Của Lựu Đỏ Ai Cập Đối Với Sức Khỏe',
    excerpt: 'Lựu đỏ Ai Cập không chỉ hấp dẫn bởi vẻ ngoài mọng nước mà còn là "siêu thực phẩm" chứa hàm lượng chất chống oxy hóa cực cao.',
    content: 'Lựu đỏ Ai Cập từ lâu đã được biết đến như một biểu tượng của sự may mắn and sức khỏe. Với những hạt đỏ mọng như ngọc lựu, loại quả này chứa đựng nguồn dinh dưỡng dồi dào, đặc biệt là các hợp chất polyphenols.\n\n1. Chống oxy hóa mạnh mẽ: Lựu chứa punicalagins and acid punicic, giúp bảo vệ tế bào khỏi sự tổn thương của các gốc tự do.\n2. Tốt cho tim mạch: Uống nước ép lựu thường xuyên giúp giảm cholesterol xấu and ổn định huyết áp.\n3. Tăng cường hệ miễn dịch: Với hàm lượng Vitamin C and Vitamin E cao, lựu giúp cơ thể chống lại các tác nhân gây bệnh.\n4. Làm đẹp da: Các tinh chất trong lựu giúp kích thích sản sinh collagen, làm chậm quá trình lão hóa and giúp da căng mịn.\n5. Hỗ trợ tiêu hóa: Lựu là nguồn cung cấp chất xơ tốt, giúp hệ tiêu hóa hoạt động trơn tru.\n\nTại Fruit Haven, chúng tôi tuyển chọn những trái lựu đỏ Ai Cập nhập khẩu chính ngạch, đảm bảo độ tươi ngon and giữ trọn vẹn giá trị dinh dưỡng khi đến tay bạn.',
    date: '2026-03-30',
    image: 'https://suckhoedoisong.qltns.mediacdn.vn/Images/duylinh/2018/11/18/pomegranate_image_hrws.png',
    author: 'Fruit Haven Team',
    category: 'Sức Khỏe'
  }
];

export const COUPONS: Coupon[] = [
  { id: 'c1', code: 'FRUIT10', discountType: 'percentage', value: 10, minOrder: 200000, description: 'Giảm 10% cho đơn hàng từ 200k', expiry: '30/06/2026' },
  { id: 'c2', code: 'WELCOME50', discountType: 'fixed', value: 50000, minOrder: 300000, description: 'Giảm thẳng 50k cho đơn từ 300k', expiry: '31/12/2026' },
  { id: 'c3', code: 'FREESHIP', discountType: 'fixed', value: 30000, minOrder: 500000, description: 'Ưu đãi phí vận chuyển 30k', expiry: '31/12/2026' },
  { id: 'c4', code: 'HE_XANH', discountType: 'percentage', value: 15, minOrder: 1000000, description: 'Đón hè xanh - Giảm 15% đơn từ 1tr', expiry: '31/08/2026' },
];

export const BUNDLES: Bundle[] = [
  {
    id: 'b1',
    name: 'Combo Vitamin C',
    productIds: ['1', '2'], // Cam Sicily + Việt Quất
    originalPrice: 270000, 
    price: 243000, // Giảm 10%
    image: 'https://nebula.wsimg.com/b008525901e27c75a621426a1a9678df?AccessKeyId=CDBF849EA216B819FEB0&disposition=0&alloworigin=1',
    description: 'Sự kết hợp hoàn hảo giữa Cam Sicily mọng nước and Việt Quất rừng giàu dinh dưỡng. Tăng cường sức đề kháng cho cả gia đình.',
    unit: 'Combo',
    color: 'bg-orange-50',
    isBundle: true
  }
];

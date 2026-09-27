# Thư viện case lâm sàng IVUS / NIRS

Web tĩnh (không cần build, không cần backend) để đăng case lâm sàng có hình ảnh IVUS/NIRS, phân loại theo 7 chủ đề sang thương mạch vành. Toàn bộ chi phí có thể = 0đ (trừ tên miền riêng nếu muốn).

## Cấu trúc project

```
index.html          → trang chủ, lưới 7 chủ đề
topic.html           → danh sách case theo 1 chủ đề (đọc ?topic=slug)
case.html            → trang chi tiết 1 case (đọc ?id=case-id)
data/topics.json     → định nghĩa 7 chủ đề
data/cases.json      → TOÀN BỘ CASE — đây là file bạn sẽ sửa thường xuyên nhất
assets/css/style.css → giao diện đen sang trọng
assets/js/app.js     → logic đọc JSON và render trang
```

Không có bước build (npm install/webpack...). Bạn chỉ sửa file rồi deploy.

## Bước 1 — Xem thử trên máy (tùy chọn)

Mở trực tiếp `index.html` bằng trình duyệt sẽ **không load được dữ liệu** (trình duyệt chặn `fetch()` với file local). Cần chạy một server nhỏ:

```bash
cd ivus-case-library
npx serve
# hoặc: python3 -m http.server 8000
```

Rồi mở `http://localhost:3000` (hoặc `:8000`).

## Bước 2 — Đưa lên GitHub

1. Tạo tài khoản GitHub (nếu chưa có) tại github.com
2. Tạo repository mới, ví dụ `ivus-case-library`
3. Upload toàn bộ nội dung thư mục này lên (kéo-thả file trên giao diện web GitHub là đủ, không cần dùng git command line)

## Bước 3 — Deploy miễn phí lên Netlify

1. Vào netlify.com → đăng nhập bằng GitHub
2. "Add new site" → "Import an existing project" → chọn repo vừa tạo
3. Build command: để trống. Publish directory: `/` (thư mục gốc)
4. Deploy — Netlify cho bạn 1 link dạng `ten-ngau-nhien.netlify.app` ngay lập tức, hoàn toàn miễn phí

(Vercel hoặc GitHub Pages cũng làm được tương tự nếu bạn thích hơn.)

## Bước 4 — Thiết lập Cloudinary để lưu ảnh IVUS/NIRS

1. Đăng ký free tại cloudinary.com (free tier hiện tại cho ~25GB băng thông/tháng — đủ dùng lâu dài với ảnh đã tối ưu)
2. Vào Dashboard → "Media Library" → Upload ảnh (đã xóa thông tin định danh bệnh nhân trước khi upload)
3. Click vào ảnh vừa upload → "Copy URL" — đây là link bạn dán vào `cover_image` / `images` trong `cases.json`
4. Mẹo tối ưu: thêm `w_1200,q_auto` vào URL (như trong file mẫu) để Cloudinary tự nén và resize ảnh, tiết kiệm băng thông

## Bước 5 — Upload video lên YouTube (chế độ Unlisted)

1. Upload video IVUS/angio lên YouTube, chọn chế độ hiển thị **"Không công khai" (Unlisted)** — video sẽ không hiện trong tìm kiếm hay kênh, chỉ ai có link/ID mới xem được
2. Lấy YouTube video ID từ URL, ví dụ `https://youtube.com/watch?v=XXXXXXXXXXX` → ID là `XXXXXXXXXXX`
3. Dán ID đó vào trường `youtube_id` của case tương ứng trong `cases.json`

## Bước 6 — Thêm một case mới

Mở `data/cases.json`, thêm một object mới vào mảng, theo đúng cấu trúc các case mẫu:

```json
{
  "id": "than-chung-002",
  "topic": "than-chung",
  "title": "Tiêu đề case",
  "summary": "Tóm tắt ngắn hiện ở trang danh sách",
  "age_sex": "60 tuổi, nam",
  "vessel": "Tên mạch máu / đoạn tổn thương",
  "modality": "IVUS",
  "cover_image": "URL ảnh đại diện từ Cloudinary",
  "images": ["URL ảnh 1", "URL ảnh 2"],
  "youtube_id": "ID video unlisted (để trống nếu không có video)",
  "findings": [
    { "label": "Nhãn ngắn", "text": "Nội dung nhận định" }
  ],
  "notes": "Ghi chú/bàn luận thêm (tùy chọn)"
}
```

`topic` phải trùng với một `slug` trong `data/topics.json`: `than-chung`, `tai-hep-trong-stent`, `calci-hoa`, `mang-xo-vua-khong-on-dinh`, `cho-chia-doi`, `cto`, `kich-thuoc-stent`.

**Cách sửa nhanh nhất, không cần cài gì:** vào file `cases.json` trên GitHub (giao diện web) → bấm biểu tượng bút chì để sửa → dán case mới vào → "Commit changes". Netlify tự động deploy lại sau vài chục giây.

## Bước 7 (tùy chọn) — Tên miền riêng

Trong Netlify: Site settings → Domain management → thêm domain đã mua (từ Mắt Bão, Tenten, Namecheap...). Chi phí domain `.vn` hoặc `.com` khoảng 300.000–500.000đ/năm.

## Bước 8 (tùy chọn, nâng cao) — Cho phép sửa case qua giao diện quản trị thay vì sửa JSON tay

Có thể tích hợp Decap CMS (miễn phí, mã nguồn mở) để có giao diện thêm/sửa case như một trang admin, dùng Netlify Identity để đăng nhập. Bước này cần cấu hình OAuth thêm — nếu bạn muốn, có thể hỏi lại để được hướng dẫn chi tiết riêng, hoặc trước mắt sửa trực tiếp `cases.json` trên GitHub là đủ dùng tốt.

## Lưu ý quan trọng

- **Ẩn danh hoàn toàn** mọi ảnh/video trước khi upload: xóa tên, mã bệnh án, ngày sinh, metadata DICOM.
- Nên xin ý kiến/tuân thủ quy định của bệnh viện về việc công khai hình ảnh lâm sàng, dù đã ẩn danh.
- File `cases.json` hiện có dữ liệu mẫu (URL ảnh demo từ Cloudinary) — cần thay bằng ảnh thật của bạn trước khi công khai.

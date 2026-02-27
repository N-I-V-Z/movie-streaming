# Movie Streaming System (Full-stack .NET & Next.js)

Hệ thống xem phim trực tuyến chuyên nghiệp tích hợp công nghệ **HLS (HTTP Live Streaming)**, xây dựng trên kiến trúc **Clean Architecture** (.NET) và giao diện hiện đại (**Next.js**).

---

## 🏗️ Cấu trúc dự án
Hệ thống được chia thành hai phần chính:
- **`movie-streaming-api`**: Backend xử lý video, API phân trang, quản lý database (SQL Server) và chuyển đổi định dạng HLS qua FFmpeg.
- **`movie-streaming-client`**: Frontend hiển thị danh sách phim, trình phát video chuyên dụng (Video.js) và giao diện tải phim lên (Tailwind CSS).

---

## 🚀 Tính năng nổi bật
### Backend (.NET 9.0)
- **HLS Streaming:** Tự động convert video `.mp4` sang phân đoạn `.m3u8` và `.ts` qua FFmpeg.
- **Clean Architecture:** Tách biệt Domain, Application, Infrastructure và API layers.
- **Large File Upload:** Cấu hình hỗ trợ tải lên dung lượng lớn (mặc định 1GB).
- **Pagination & Standardized Response:** API đồng nhất, hỗ trợ phân trang hiệu quả.
- **Swagger:** Tài liệu API trực quan tại `/swagger`.

### Frontend (Next.js 15)
- **HLS Player:** Tích hợp `Video.js` phát mượt mà video phân đoạn.
- **Modern UI:** Giao diện tối giản, responsive hoàn toàn (Mobile/Desktop) với Tailwind CSS.
- **Dynamic Routing:** Sử dụng App Router để quản lý trang Xem và Tải phim linh hoạt.
- **Real-time Upload:** Form tải phim chuyên nghiệp kèm thông báo trạng thái.

---

## 🛠️ Yêu cầu hệ thống
1. **.NET 9.0 SDK** hoặc mới hơn.
2. **Node.js v20+** & npm.
3. **SQL Server** (Hoặc LocalDB kèm Visual Studio).
4. **FFmpeg:** **BẮT BUỘC** cài đặt và thêm vào `PATH` hệ thống để lệnh `ffmpeg` có thể chạy từ terminal.

---

## 📥 Hướng dẫn cài đặt & Chạy thử

### 1. Cài đặt Backend (`movie-streaming-api`)
- **Cấu hình Database:** Cập nhật `DefaultConnection` trong `movie-streaming-api/MovieStreaming.Api/appsettings.json`.
- **Khởi tạo Database:**
  ```bash
  cd movie-streaming-api
  dotnet ef database update --project MovieStreaming.Infrastructure --startup-project MovieStreaming.Api
  ```
- **Chạy API:**
  ```bash
  cd MovieStreaming.Api
  dotnet run
  ```
  *Mặc định chạy tại: `http://localhost:5041`*

### 2. Cài đặt Frontend (`movie-streaming-client`)
- **Cài đặt thư viện:**
  ```bash
  cd movie-streaming-client
  npm install
  ```
- **Cấu hình API:** Đảm bảo `BASE_URL` trong `src/services/api.ts` trỏ đúng địa chỉ Backend.
- **Chạy Client:**
  ```bash
  npm run dev
  ```
  *Truy cập: `http://localhost:3000`*

---

## 📁 Cấu trúc lưu trữ phim
- Phim sau khi xử lý được lưu tại: `movie-streaming-api/MovieStreaming.Api/wwwroot/movies/{slug}/`.
- Đường dẫn streaming: `http://localhost:<PORT>/movies/{slug}/index.m3u8`.

## 📜 Giấy phép
Dự án được phát triển cho mục đích học tập và xây dựng hệ thống streaming chuyên nghiệp.

---
*Ghi chú: Đảm bảo FFmpeg đã được cài đặt để tính năng tải phim và convert HLS hoạt động ổn định!*

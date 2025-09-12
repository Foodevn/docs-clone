
# 📝 Soạn thảo văn bản online

[![GitHub stars](https://img.shields.io/github/stars/hphucdev/docs-clone?style=social)](https://github.com/hphucdev/docs-clone/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/hphucdev/docs-clone)](https://github.com/hphucdev/docs-clone/issues)
[![GitHub forks](https://img.shields.io/github/forks/hphucdev/docs-clone?style=social)](https://github.com/hphucdev/docs-clone/network/members)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌟 Giới thiệu

**Soạn thảo văn bản online** là một ứng dụng web hiện đại cho phép nhiều người dùng cùng nhau soạn thảo và chỉnh sửa tài liệu trực tuyến theo thời gian thực. Được xây dựng với công nghệ tiên tiến, ứng dụng mang đến trải nghiệm làm việc nhóm mượt mà và hiệu quả.

![Demo Website](public/demo-screenshot.png)

### 🎯 Demo trực tiếp
👉 **[Trải nghiệm ngay tại đây: docs.hphucdev.id.vn](https://docs.hphucdev.id.vn)**

## ✨ Tính năng chính

- 🔄 **Chỉnh sửa theo thời gian thực**: Nhiều người dùng có thể cùng chỉnh sửa một tài liệu
- 👥 **Cộng tác trực tuyến**: Xem con trỏ và thay đổi của các cộng tác viên khác
- 📄 **Thư viện mẫu**: Tạo tài liệu nhanh chóng từ các mẫu có sẵn
- 💾 **Tự động lưu**: Không lo mất dữ liệu với tính năng lưu tự động
- 🔍 **Tìm kiếm thông minh**: Tìm tài liệu nhanh chóng trong danh sách
- 🎨 **Trình soạn thảo phong phú**: Định dạng văn bản đa dạng và trực quan
- 🔐 **Xác thực bảo mật**: Đăng nhập an toàn với Clerk Authentication

## 🛠️ Công nghệ sử dụng

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Editor**: TipTap (Rich Text Editor)
- **Realtime**: Liveblocks
- **Database**: Convex
- **Authentication**: Clerk
- **Deployment**: Vercel

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn

### Các bước cài đặt

1. **Clone dự án về máy:**
   ```bash
   git clone <link_dự_án>
   cd docs-clone
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Thiết lập biến môi trường:**
   ```bash
   cp .env.example .env.local
   ```
   Cập nhật các biến môi trường cần thiết trong file `.env.local`

4. **Chạy ứng dụng:**
   ```bash
   npm run dev
   ```

5. **Mở trình duyệt và truy cập:** `http://localhost:3000`

## 📋 Quy trình làm việc với Git

### Làm việc với nhánh mới

1. **Tạo nhánh mới cho tính năng:**
   ```bash
   git checkout -b <tên_nhánh_theo_video>
   ```

2. **Sau khi hoàn thành công việc:**
   ```bash
   git add .
   git commit -sm "tên_commit_theo_video"
   git push -u origin <tên_nhánh>
   ```

3. **Đồng bộ với nhánh main:**
   ```bash
   git checkout main
   git pull
   ```

### Lấy nhánh từ remote

```bash
git fetch origin <tên_nhánh>
git checkout <tên_nhánh>
```

## 📁 Cấu trúc dự án

```
docs-clone/
├── src/
│   ├── app/                 # App Router (Next.js 13+)
│   ├── components/          # React components
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilities và helpers
│   └── constants/          # Hằng số
├── convex/                 # Convex database schema
├── public/                 # Static assets
└── ...
```

## 🤝 Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp! Vui lòng:

1. Fork dự án
2. Tạo nhánh cho tính năng mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên nhánh (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📞 Liên hệ

- **Developer**: Phúc
- **Website**: [docs.hphucdev.id.vn](https://docs.hphucdev.id.vn)
- **Issues**: [GitHub Issues](https://github.com/hphucdev/docs-clone/issues)

## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

---

⭐ **Nếu dự án này hữu ích, hãy cho chúng tôi một star nhé!** ⭐


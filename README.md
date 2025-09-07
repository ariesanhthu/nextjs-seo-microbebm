# Microbe BM - Website Môi Trường & Sản Phẩm Xanh

Website chuyên về dịch vụ môi trường và sản phẩm thân thiện với môi trường, được xây dựng với Next.js 15 và TypeScript.

## 🌱 Giới thiệu

Microbe BM là website cung cấp các giải pháp môi trường toàn diện tại Việt Nam, bao gồm:

- Xử lý nước cấp và nước thải
- Khoan giếng và hệ thống cấp nước
- Hóa chất và chế phẩm vi sinh môi trường
- Tư vấn và thiết kế hệ thống xử lý môi trường
- Sản phẩm thân thiện với môi trường

## ✨ Tính năng chính

### 🏠 Trang chủ

- Banner slider với hình ảnh động
- Giới thiệu dịch vụ chính
- Showcase sản phẩm nổi bật
- Carousel dự án tiêu biểu
- Chính sách chất lượng

### 📦 Quản lý sản phẩm

- Danh mục sản phẩm đa dạng
- Chi tiết sản phẩm với hình ảnh
- Tìm kiếm và lọc sản phẩm
- Quản lý danh mục và tags

### 📝 Hệ thống blog

- Viết và chỉnh sửa bài viết với rich text editor (TipTap)
- Quản lý danh mục và tags
- SEO optimization cho từng bài viết
- Hệ thống tìm kiếm nội dung

### 👥 Quản trị viên

- Dashboard tổng quan với thống kê
- Quản lý nội dung trang chủ
- Quản lý sản phẩm và blog
- Quản lý thông tin liên hệ
- Upload và quản lý hình ảnh
- Editor layout tùy chỉnh

### 🔐 Xác thực & Bảo mật

- Đăng nhập/đăng ký với Clerk
- Phân quyền người dùng
- Bảo mật API endpoints

## 🛠️ Công nghệ sử dụng

### Frontend

- **Next.js 15** - React framework với App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animation library
- **TipTap** - Rich text editor
- **Radix UI** - UI components
- **Lucide React** - Icons

### Backend & Database

- **Firebase** - Database và authentication
- **Firebase Admin** - Server-side operations
- **Cloudinary** - Image storage và optimization

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Sass** - CSS preprocessing
- **Turbopack** - Fast bundling

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống

- Node.js 18+
- npm, yarn, pnpm hoặc bun

### Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### Cấu hình môi trường

Tạo file `.env.local` với các biến môi trường cần thiết:

```env
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

### Chạy development server

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem website.

### Build cho production

```bash
npm run build
npm run start
```

## 📁 Cấu trúc project

```
src/
├── app/                    # Next.js App Router
│   ├── (user)/            # Public pages
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── tiptap-*/         # Rich text editor components
├── features/             # Feature-based modules
│   ├── admin/            # Admin features
│   ├── blog/             # Blog management
│   ├── product/          # Product management
│   └── section-about/    # About page sections
├── hooks/                # Custom React hooks
├── lib/                  # Utilities và configurations
├── services/             # External services
└── types/                # TypeScript type definitions
```

## 🎨 Tính năng nổi bật

### Rich Text Editor

- TipTap editor với đầy đủ tính năng
- Hỗ trợ bảng, hình ảnh, link
- Custom nodes và extensions
- Real-time preview

### Image Management

- Upload ảnh lên Cloudinary
- Tự động optimize và resize
- Lazy loading cho performance
- Responsive images

### SEO Optimization

- Dynamic metadata generation
- Open Graph tags
- Structured data
- Sitemap tự động

### Performance

- Server-side rendering (SSR)
- Static generation (SSG)
- Image optimization
- Bundle optimization với Turbopack

## 📱 Responsive Design

Website được thiết kế responsive hoàn toàn, tối ưu cho:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔧 Scripts có sẵn

```bash
npm run dev          # Chạy development server
npm run build        # Build cho production
npm run start        # Chạy production server
npm run lint         # Chạy ESLint
```

## 📄 License

Dự án này được phát triển cho Công ty TNHH Môi trường & Du lịch Ánh Trăng Xanh.

---
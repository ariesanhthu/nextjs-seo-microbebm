"use client"

import BlogGallery from "@/features/blog/components/blog-gallery"
import NavbarAdmin from "@/components/NavbarAdmin"

export default function AdminBlogListPage() {
  return (
    <div className="space-y-6">
      <NavbarAdmin 
        name="Quản lý bài viết"
        description="Tạo, chỉnh sửa và quản lý các bài viết trên website"
      />
      <BlogGallery/>
    </div>
  )
}



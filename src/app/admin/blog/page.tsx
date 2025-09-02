"use client"

import BlogGallery from "@/features/blog/components/blog-gallery"
import NavbarAdmin from "@/components/NavbarAdmin"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminBlogListPage() {
  const router = useRouter()
  return (
    <div className="space-y-6">
      <NavbarAdmin 
        name="Quản lý bài viết"
        description="Tạo, chỉnh sửa và quản lý các bài viết trên website"
        buttonTool={
          <div className="flex items-center gap-2">
            <Button onClick={() => router.push('/admin/blog/new')} variant="default" className="btn-primary">
              <Plus className="mr-2 h-4 w-4" /> Thêm bài viết
            </Button>
          </div>
        }
      />
      <BlogGallery/>
    </div>
  )
}



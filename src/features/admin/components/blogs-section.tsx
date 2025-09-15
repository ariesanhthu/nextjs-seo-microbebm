"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, NotebookPen, BookOpen } from "lucide-react"
import { HomepageResponseDto } from "@/lib/dto/homepage.dto"
import { BlogResponseDto } from "@/lib/dto/blog.dto"
import { useBlogGallery } from "@/features/blog/context/blog-gallery-context"
import { toast } from "sonner"

interface BlogsSectionProps {
  form: HomepageResponseDto | null
  setForm: (form: HomepageResponseDto | null) => void
}

export default function BlogsSection({ form, setForm }: BlogsSectionProps) {
  const blogGallery = useBlogGallery()

  const handleBlogSelection = () => {
    blogGallery.openSelectionDialog(form?.blogs || [], (selected) => {
      if (form) {
        setForm({
          ...form,
          blogs: selected
        })
        toast.success(`Đã chọn ${selected.length} bài viết nổi bật`)
      }
    })
  }

  const removeBlog = (blogId: string) => {
    if (form) {
      setForm({
        ...form,
        blogs: (form.blogs || []).filter(b => b.id !== blogId)
      })
      toast.success("Đã xóa bài viết khỏi danh sách nổi bật")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><NotebookPen className="h-5 w-5" /> Bài viết nổi bật</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-foreground">
            Đã chọn {form?.blogs?.length || 0} bài viết
          </div>
          <Button variant="outline" onClick={handleBlogSelection}>
            <Plus className="h-4 w-4 mr-2" />
            {form?.blogs?.length ? "Chỉnh sửa" : "Thêm bài viết"}
          </Button>
        </div>

        {(form?.blogs || []).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(form?.blogs || []).map((blog) => (
              <Card key={blog.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{blog.title}</h4>
                      <p className="text-xs text-gray-500 truncate">
                        {blog.excerpt || "Không có mô tả"}
                      </p>
                      {blog.tags && blog.tags.length > 0 && (
                        <span className="text-xs text-blue-600 font-medium">
                          {blog.tags[0].name}
                        </span>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-6 w-6 text-white"
                      onClick={() => removeBlog(blog.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-foreground py-8">
            <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>Chưa có bài viết nào được chọn</p>
            <p className="text-sm">Nhấn "Thêm bài viết" để bắt đầu</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

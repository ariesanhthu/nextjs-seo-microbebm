"use client"

import React from "react"
import BlogEditor, { BlogEditorHandle } from "@/features/blog/components/blog-editor"
import NavbarAdmin from "@/components/NavbarAdmin"
import { Button } from "@/components/ui/button"
import { Plus, Save } from "lucide-react"
import { BlogResponseDto } from "@/lib/dto/blog.dto"
import OpenBlogButton from "@/features/blog/components/open-blog-button"
import { toast } from "@/hooks/use-toast"

export default function AdminBlogEditorPage({ params }: { params: Promise<{ id?: string[] }> }) {
  const p = React.use(params)
  const blogId = Array.isArray(p?.id) && p.id.length > 0 ? p.id[0] : null
  const editorRef = React.useRef<BlogEditorHandle | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [dirty, setDirty] = React.useState(false)
  
  const handleDirtyChange = (isDirty: boolean) => {
    setDirty(isDirty);
  }

  const handleOpenBlogFromDialog = () => {}

  const handleCreateNew = () => {
    editorRef.current?.reset()
  }

  return (
    <div className="space-y-6">
      <NavbarAdmin
        name={blogId ? "Chỉnh sửa bài viết" : "Tạo bài viết"}
        showBackButton={true}
        description="tùy chỉnh bài viết, mở bài viết và tạo mới"
        buttonTool={
          <div className="flex items-center gap-2">
            <OpenBlogButton
              onOpen={(blog: BlogResponseDto) => editorRef.current?.loadBlog(blog)}
              variant="default"
              className="btn-accent"
              disabled={saving}
            />
            <Button onClick={handleCreateNew} variant="secondary" className="btn-primary">
              <Plus className="mr-2 h-4 w-4" /> Tạo mới
            </Button>
            <Button
              onClick={async () => {

                if (saving || !dirty) return
                setSaving(true)
                try {
                  await editorRef.current?.save()
                } finally {
                  setSaving(false)
                }
              }}
              disabled={saving || !dirty}
              variant="default"
              className="btn-success"
            >
              <Save className="mr-2 h-4 w-4" /> {saving ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        }
      />

      <BlogEditor ref={editorRef} blogId={blogId} onDirtyChange={handleDirtyChange} />
    </div>
  )
}



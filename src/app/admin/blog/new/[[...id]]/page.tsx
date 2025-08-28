import BlogEditor from "@/features/blog/components/blog-editor";

export default async function AdminBlogEditorPage({ params }: { params: Promise<{ id?: string[] }> }) {
  const p = await params
  const blogId = Array.isArray(p?.id) && p.id.length > 0 ? p.id[0] : null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{blogId ? "Chỉnh sửa bài viết" : "Tạo bài viết"}</h1>
      <BlogEditor blogId={blogId} />
    </div>
  )
}



import { notFound } from "next/navigation";
import Image from "next/image";
import { BlogResponseDto } from "@/lib/dto/blog.dto";
import { fetchBlogSlugServerCached } from "@/lib/fetchers/blogSlug.fetcher";
import { formatDate } from "@/utils/format-date";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog: BlogResponseDto | null = await fetchBlogSlugServerCached(slug);
  if (!blog) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Thumbnail Image */}
        {blog.thumbnail_url && (
          <div className="flex justify-center mb-8 mt-20">
            <div className="relative w-full max-w-3xl">
              <Image
                src={blog.thumbnail_url}
                alt={blog.title}
                width={800}
                height={500}
                className="w-full h-auto rounded-lg shadow-lg object-cover"
                style={{ maxHeight: "500px" }}
                priority
              />
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {blog.title}
          </h1>
          {blog.excerpt && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {blog.excerpt}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {blog.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-lg">
                  {blog.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Tác giả</p>
                <p className="text-gray-600">{blog.author}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-medium text-gray-900">Ngày đăng</p>
              <p className="text-gray-600">{formatDate(blog.created_at)}</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-center gap-8 text-sm text-gray-500">
              {blog.view_count !== undefined && (
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  {blog.view_count} lượt xem
                </span>
              )}
              {blog.status && (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    blog.status === "published"
                      ? "bg-green-100 text-green-800"
                      : blog.status === "draft"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {blog.status === "published"
                    ? "Đã xuất bản"
                    : blog.status === "draft"
                    ? "Bản nháp"
                    : "Đã lưu trữ"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

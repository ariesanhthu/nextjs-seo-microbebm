"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Grid3X3, List, ChevronLeft, ChevronRight, Loader2, TreePine, Leaf } from "lucide-react"
import BlogCard from "./blog-card"
import type { BlogResponseDto } from "@/lib/dto/blog.dto"
import type { BlogFilters } from "./blog-filter"
import { EBlogStatus } from "@/lib/enums/blog-status.enum"

interface BlogGridProps {
  blogs: BlogResponseDto[]
  loading: boolean
  hasNextPage: boolean
  hasPrevPage: boolean
  onNextPage: () => void
  onPrevPage: () => void
  filters: BlogFilters
  onFiltersChange: (filters: BlogFilters) => void
  viewMode: "grid" | "list"
}

export default function BlogGrid({
  blogs,
  loading,
  hasNextPage,
  hasPrevPage,
  onNextPage,
  onPrevPage,
  filters,
  onFiltersChange,
  viewMode,
}: BlogGridProps) {
  // Xóa state viewMode local vì giờ nhận từ prop

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="relative mb-6">
            <Loader2 className="h-16 w-16 animate-spin text-green-600 mx-auto" />
          </div>
          <p className="text-lg text-slate-600 font-medium">Đang tải bài viết về môi trường...</p>
          <p className="text-sm text-slate-500 mt-1">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    )
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center shadow-lg">
            <TreePine className="h-12 w-12 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-green-800">Không tìm thấy bài viết</h3>
          <p className="text-slate-600 mb-6">
            {filters.search || filters.tags.length > 0
              ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
              : "Chưa có bài viết nào được đăng"}
          </p>
          {(filters.search || filters.tags.length > 0 || filters.status !== EBlogStatus.PUBLISHED) && (
            <Button
              variant="outline"
              onClick={() => onFiltersChange({ search: "", tags: [], status: EBlogStatus.PUBLISHED })}
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Xóa phần nút lưới/danh sách cũ */}
      
      {/* Blog Grid/List */}
      <div
        className={
          viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
        }
      >
        {blogs.map((blog, index) => (
          <div key={blog.id} className={viewMode === "list" ? "w-full" : ""}>
            <BlogCard blog={blog} variant={viewMode === "list" ? "compact" : "default"} />
          </div>
        ))}
      </div>

      {(hasNextPage || hasPrevPage) && (
        <div className="flex items-center justify-center gap-6 pt-12">
          <Button
            variant="outline"
            onClick={onPrevPage}
            disabled={!hasPrevPage || loading}
            className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
            Trang trước
          </Button>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-green-200 text-green-700 px-4 py-2">
              <TreePine className="h-3 w-3 mr-1" />
              {blogs.length} bài viết
            </Badge>
          </div>

          <Button
            variant="outline"
            onClick={onNextPage}
            disabled={!hasNextPage || loading}
            className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
          >
            Trang sau
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X, Plus, BookOpen, ChevronLeft, ChevronRight } from "lucide-react"
import { BlogResponseDto } from "@/lib/dto/blog.dto"
import { EBlogStatus } from "@/lib/enums/blog-status.enum"

interface BlogSelectionDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedBlogs: BlogResponseDto[]) => void
  currentSelected: BlogResponseDto[]
  numberSelection?: number // Optional: max number of blogs to select (undefined = unlimited)
  // Data props
  blogs: BlogResponseDto[]
  loading: boolean
  error: string | null
  hasNextPage: boolean
  hasPrevPage: boolean
  goToNextPage: () => void
  goToPrevPage: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  isSearching: boolean
  refresh: () => void
}

export default function BlogSelectionDialog({
  isOpen,
  onClose,
  onConfirm,
  currentSelected,
  numberSelection,
  blogs,
  loading,
  error,
  hasNextPage,
  hasPrevPage,
  goToNextPage,
  goToPrevPage,
  searchQuery,
  setSearchQuery,
  isSearching,
  refresh
}: BlogSelectionDialogProps) {
  const [selectedBlogs, setSelectedBlogs] = useState<BlogResponseDto[]>(currentSelected)
  const [localSearch, setLocalSearch] = useState<string>(searchQuery)

  useEffect(() => {
    if (isOpen) {
      setSelectedBlogs(currentSelected)
      setLocalSearch(searchQuery)
      refresh()
    }
  }, [isOpen, currentSelected])

  // Debounce search to reduce rerenders/fetches
  useEffect(() => {
    if (!isOpen) return
    const handler = setTimeout(() => {
      if (localSearch !== searchQuery) setSearchQuery(localSearch)
    }, 300)
    return () => clearTimeout(handler)
  }, [localSearch, isOpen])

  const toggleBlogSelection = (blog: BlogResponseDto) => {
    const isSelected = selectedBlogs.some(b => b.id === blog.id)
    if (isSelected) {
      // Always allow removing selected blogs
      setSelectedBlogs(selectedBlogs.filter(b => b.id !== blog.id))
    } else {
      // Check if we've reached the selection limit
      if (numberSelection && selectedBlogs.length >= numberSelection) {
        // If numberSelection is 1, replace the current selection
        if (numberSelection === 1) {
          setSelectedBlogs([blog])
        }
        // For other limits, don't add more (could show a toast/message here)
        return
      }
      setSelectedBlogs([...selectedBlogs, blog])
    }
  }

  const removeSelectedBlog = (blogId: string) => {
    setSelectedBlogs(selectedBlogs.filter(b => b.id !== blogId))
  }

  const handleConfirm = () => {
    onConfirm(selectedBlogs);
    setSearchQuery("");
    onClose();
  }

  const getStatusBadgeColor = (status: EBlogStatus) => {
    switch (status) {
      case EBlogStatus.PUBLISHED:
        return "bg-green-100 text-green-800"
      case EBlogStatus.DRAFT:
        return "bg-yellow-100 text-yellow-800"
      case EBlogStatus.ARCHIVED:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: EBlogStatus) => {
    switch (status) {
      case EBlogStatus.PUBLISHED:
        return "Đã xuất bản"
      case EBlogStatus.DRAFT:
        return "Bản nháp"
      case EBlogStatus.ARCHIVED:
        return "Đã lưu trữ"
      default:
        return "Không xác định"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 will-change-transform">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col transform-gpu">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <div>
              <h2 className="text-xl font-semibold">Chọn bài viết</h2>
              {numberSelection && (
                <p className="text-sm text-gray-500">
                  {numberSelection === 1 
                    ? "Chỉ có thể chọn 1 bài viết" 
                    : `Tối đa ${numberSelection} bài viết`
                  }
                </p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left side - Blog list */}
          <div className="flex-1 border-r overflow-hidden">
            <div className="p-4 pb-0">
              <div>
                <Label htmlFor="search">Tìm kiếm bài viết</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Nhập tiêu đề hoặc nội dung bài viết..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={!hasPrevPage || loading || isSearching}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={!hasNextPage || loading || isSearching}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                {(loading || isSearching) && (
                  <div className="text-sm text-gray-500">
                    {isSearching ? "Đang tìm kiếm..." : "Đang tải..."}
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 pt-2 overflow-y-auto h-full overscroll-contain">
              {loading || isSearching ? (
                <div className="text-center py-8 text-gray-500">
                  {isSearching ? "Đang tìm kiếm..." : "Đang tải..."}
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <p>Có lỗi xảy ra: {error}</p>
                  <Button variant="outline" size="sm" onClick={refresh} className="mt-2">
                    Thử lại
                  </Button>
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Không tìm thấy bài viết nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {blogs.map((blog) => {
                    const isSelected = selectedBlogs.some(b => b.id === blog.id)
                    return (
                      <Card
                        key={blog.id}
                        className={`cursor-pointer transition-[box-shadow,transform] duration-200 hover:shadow-md ${
                          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => toggleBlogSelection(blog)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            {/* <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                              {blog.thumbnail_url ? (
                                <img 
                                  src={blog.thumbnail_url} 
                                  alt={blog.title}
                                  loading="lazy"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <BookOpen className="h-8 w-8 text-gray-600" />
                              )}
                            </div> */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm truncate">{blog.title}</h3>
                              <p className="text-xs text-gray-500 truncate">
                                {blog.excerpt || "Không có mô tả"}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={isSelected ? "default" : "secondary"} className="text-xs">
                                  {isSelected ? "Đã chọn" : "Chưa chọn"}
                                </Badge>
                                <Badge 
                                  className={`text-xs ${getStatusBadgeColor(blog.status)}`}
                                  variant="secondary"
                                >
                                  {getStatusText(blog.status)}
                                </Badge>
                                <span className="text-xs text-gray-400">
                                  {blog.author}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Selected blogs */}
          <div className="w-80 overflow-hidden">
            <div className="p-4 pb-0">
              <h3 className="font-medium">Bài viết đã chọn ({selectedBlogs.length})</h3>
            </div>
            
            <div className="p-4 pt-2 overflow-y-auto h-full overscroll-contain">
              {selectedBlogs.length === 0 ? (
                <div className="text-center py-8 text-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 text-foreground" />
                  <p>Chưa có bài viết nào được chọn</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedBlogs.map((blog) => (
                    <Card key={blog.id} className="relative">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          {/* <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                            {blog.thumbnail_url ? (
                              <img 
                                src={blog.thumbnail_url} 
                                alt={blog.title}
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <BookOpen className="h-6 w-6 text-gray-600" />
                            )}
                          </div> */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{blog.title}</h4>
                            <p className="text-xs text-gray-500 truncate">
                              {blog.excerpt || "Không có mô tả"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-700"
                            onClick={() => removeSelectedBlog(blog.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleConfirm}>
            Xác nhận ({selectedBlogs.length}{numberSelection ? `/${numberSelection}` : ''})
          </Button>
        </div>
      </div>
    </div>
  )
}

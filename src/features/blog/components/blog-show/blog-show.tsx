"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Filter, X, RefreshCw, Leaf, TreePine, Sprout, Grid3X3, List } from "lucide-react"
import { BlogShowProvider, useBlogShow } from "../../context/blog-show-context"
import BlogFilter, { type BlogFilters } from "./blog-filter"
import BlogGrid from "./blog-grid"

function BlogShowContent() {
  const {
    blogs,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    filters,
    setFilters,
    refresh,
    clearFilters,
  } = useBlogShow()

  const [showFilters, setShowFilters] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Sync selectedTags with filters.tags
  useEffect(() => {
    setSelectedTags(filters.tags)
  }, [filters.tags])

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  const handleFiltersChange = (newFilters: BlogFilters) => {
    setFilters(newFilters)
    setSelectedTags(newFilters.tags)
  }

  const handleClearFilters = () => {
    setSelectedTags([])
    clearFilters()
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center text-red-600">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Lỗi tải blog</h3>
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={refresh} className="bg-green-600 hover:bg-green-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Thử lại
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative z-10 mt-20">
       
        <div className="flex flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {/* <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 ${
                showFilters
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "border-green-200 text-green-700 hover:bg-green-50"
              }`}
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
            </Button> */}

            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Làm mới
            </Button>

            {(filters.search || filters.tags.length > 0 || filters.status !== 'published') && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="text-slate-600 hover:text-green-700 hover:bg-green-50"
              >
                <X className="h-4 w-4 mr-1" />
                Xóa bộ lọc
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 p-1 bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-green-100">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`h-8 px-3 ${
                  viewMode === "grid"
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
                    : "text-green-700 hover:bg-green-50"
                }`}
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Lưới
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`h-8 px-3 ${
                  viewMode === "list"
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
                    : "text-green-700 hover:bg-green-50"
                }`}
              >
                <List className="h-4 w-4 mr-1" />
                Danh sách
              </Button>
            </div>
          </div>
        </div>

        {showFilters && (
          <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg text-green-800">Bộ lọc tìm kiếm</CardTitle>
              </div>
              <CardDescription className="text-green-700">
                Tìm kiếm và lọc bài viết theo chủ đề môi trường
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <BlogFilter
                onFilterChange={handleFiltersChange}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
              />
            </CardContent>
          </Card>
        )}

        {/* Blog Grid */}
        <BlogGrid
          blogs={blogs}
          loading={loading}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          onNextPage={goToNextPage}
          onPrevPage={goToPrevPage}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          viewMode={viewMode}
        />
      </div>
    </div>
  )
}

interface BlogShowProps {
  initialFilters?: BlogFilters
}

export default function BlogShow({ initialFilters }: BlogShowProps) {
  const defaultFilters: BlogFilters = {
    search: "",
    tags: [],
    status: "published"
  }
  
  return (
    <BlogShowProvider initialFilters={initialFilters || defaultFilters}>
      <BlogShowContent />
    </BlogShowProvider>
  )
}

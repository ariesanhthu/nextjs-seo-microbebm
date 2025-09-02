"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, X, Leaf, TreePine, Sprout } from "lucide-react"
import type { TagResponseDto } from "@/lib/dto/tag.dto"
import { EBlogStatus } from "@/lib/enums/blog-status.enum"

interface BlogFilterProps {
  onFilterChange: (filters: BlogFilters) => void
  selectedTags: string[]
  onTagToggle: (tagId: string) => void
}

export interface BlogFilters {
  search: string
  tags: string[]
  status: EBlogStatus
}

export default function BlogFilter({ onFilterChange, selectedTags, onTagToggle }: BlogFilterProps) {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState(EBlogStatus.PUBLISHED)
  const [tags, setTags] = useState<TagResponseDto[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTags()
  }, [])

  // Kích hoạt filter thực sự
  useEffect(() => {
    const filters = { search, tags: selectedTags, status }
    onFilterChange(filters)
  }, [search, selectedTags, status, onFilterChange])

  const fetchTags = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/tag?limit=50")
      const data = await response.json()
      if (data.success) {
        setTags(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching tags:", error)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSearch("")
    setStatus(EBlogStatus.PUBLISHED)
    onFilterChange({ search: "", tags: [], status: EBlogStatus.PUBLISHED })
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 h-5 w-5" />
        <Input
          placeholder="Tìm kiếm bài viết về môi trường..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 pr-4 h-12 border-green-200 focus:border-green-400 focus:ring-green-400 bg-white/80 backdrop-blur-sm"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <Leaf className="h-4 w-4 text-green-400" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Filter className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-green-800">Lọc theo chủ đề môi trường:</span>
          </div>
          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 px-3 text-xs text-slate-600 hover:text-green-700 hover:bg-green-50"
            >
              <X className="h-3 w-3 mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-green-800">Trạng thái:</label>
          <div className="flex gap-2">
            {[EBlogStatus.ALL, EBlogStatus.PUBLISHED, EBlogStatus.DRAFT].map((statusOption) => (
              <Button
                key={statusOption}
                variant={status === statusOption ? "default" : "outline"}
                size="sm"
                onClick={() => setStatus(statusOption)}
                className={`${
                  status === statusOption
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "border-green-200 text-green-700 hover:bg-green-50"
                }`}
              >
                {statusOption === 'all' ? 'Tất cả' : 
                 statusOption === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <TreePine className="h-4 w-4 animate-pulse text-green-500" />
              Đang tải chủ đề...
            </div>
          ) : (
            tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedTags.includes(tag.id)
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
                    : "hover:bg-green-50 border-green-200 text-green-700 hover:border-green-300"
                }`}
                onClick={() => onTagToggle(tag.id)}
              >
                <Sprout className="h-3 w-3 mr-1" />
                {tag.name}
              </Badge>
            ))
          )}
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-green-50/80 backdrop-blur-sm rounded-lg border border-green-100">
          <span className="text-sm text-green-800 font-medium flex items-center gap-1">
            <Leaf className="h-3 w-3" />
            Chủ đề đang chọn:
          </span>
          {selectedTags.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId)
            return tag ? (
              <Badge
                key={tagId}
                variant="secondary"
                className="cursor-pointer hover:bg-red-100 hover:text-red-700 bg-white/80 text-green-700 border border-green-200"
                onClick={() => onTagToggle(tagId)}
              >
                {tag.name}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ) : null
          })}
        </div>
      )}
    </div>
  )
}

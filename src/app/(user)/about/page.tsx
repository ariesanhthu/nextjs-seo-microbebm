"use client"

import { useEffect, useState } from "react"
import LayoutPreview from "@/features/section-about/components/layout-preview"
import type { AboutResponseDto } from "@/lib/dto/about.dto"
import type { ApiResponseDto } from "@/lib/dto/api-response.dto"

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch("/api/about")
        const data: ApiResponseDto<AboutResponseDto> = await response.json()

        if (!data.success) {
          throw new Error(data.message)
        }

        setAboutData(data.data || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchAboutData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Lỗi: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  if (!aboutData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Chưa có nội dung nào được tạo</p>
        </div>
      </div>
    )
  }

  return <LayoutPreview data={aboutData} />
}

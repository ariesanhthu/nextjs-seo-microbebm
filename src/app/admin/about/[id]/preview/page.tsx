"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import LayoutPreview from "@/features/section-about/components/layout-preview"
import type { AboutResponseDto } from "@/lib/dto/about.dto"
import type { ApiResponseDto } from "@/lib/dto/api-response.dto"

export default function AboutPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [aboutData, setAboutData] = useState<AboutResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch(`/api/about/${id}`)
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

    if (id) {
      fetchAboutData()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.push("/admin/about")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <p>Đang tải dữ liệu...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.push("/admin/about")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <p className="text-red-500">Lỗi: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!aboutData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.push("/admin/about")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <p>Không tìm thấy dữ liệu</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.push("/admin/about")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Preview Layout</h1>
                <p className="text-foreground">Đây là cách layout sẽ hiển thị trên trang web</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <LayoutPreview data={aboutData} />
      </div>
    </div>
  )
}

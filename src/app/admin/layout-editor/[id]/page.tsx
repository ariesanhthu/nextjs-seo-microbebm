"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import LayoutEditor from "@/features/section-about/components/layout-editor"
import type { AboutResponseDto } from "@/lib/dto/about.dto"
import type { ApiResponseDto } from "@/lib/dto/api-response.dto"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EditLayoutPage() {
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

  return (
    <div className="min-h-screen bg-background">
      <LayoutEditor initialData={aboutData || undefined} aboutId={id} />
    </div>
  )
}

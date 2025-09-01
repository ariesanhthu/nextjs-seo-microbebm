"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { toast } from "sonner"
import { useGlobalAlert } from "@/features/alert-dialog/context/alert-dialog-context"
import type { AboutResponseDto } from "@/lib/dto/about.dto"
import type { ApiResponseDto } from "@/lib/dto/api-response.dto"

export default function AboutManagementPage() {
  const router = useRouter()
  const [aboutData, setAboutData] = useState<AboutResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const { showAlert } = useGlobalAlert()

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const response = await fetch("/api/about")
      const data: ApiResponseDto<AboutResponseDto> = await response.json()

      if (!data.success) {
        throw new Error(data.message)
      }

      // API trả về một object, chúng ta cần chuyển thành array
      const aboutArray = data.data ? [data.data] : []
      setAboutData(aboutArray)
    } catch (error) {
      toast.error(`Lỗi khi tải dữ liệu: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = await showAlert({
      title: "Xác nhận xóa",
      description: "Bạn có chắc chắn muốn xóa layout này? Hành động này không thể hoàn tác.",
      variant: "destructive"
    })

    if (confirmed) {
      try {
        const response = await fetch(`/api/about/${id}`, {
          method: "DELETE"
        })

        const data: ApiResponseDto<any> = await response.json()

        if (!data.success) {
          throw new Error(data.message)
        }

        toast.success("Đã xóa layout thành công!")
        fetchAboutData()
      } catch (error) {
        toast.error(`Lỗi khi xóa: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Đang tải dữ liệu...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quản lý Layout About</CardTitle>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/admin/layout-editor")}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo Layout mới
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Quản lý các layout cho trang About. Mỗi layout có thể chứa nhiều section với các style khác nhau.
          </p>
        </CardContent>
      </Card>

      {aboutData.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">Chưa có layout nào được tạo</p>
            <Button onClick={() => router.push("/admin/layout-editor")}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo Layout đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {aboutData.map((about, index) => (
            <Card key={about.id || index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Layout #{index + 1}
                  </CardTitle>
                  <Badge variant="secondary">
                    {about.section?.length || 0} sections
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* <div className="space-y-2 mb-4"> */}
                  {/* <p className="text-sm text-muted-foreground">
                    <strong>Sections:</strong> {about.section?.length || 0}
                  </p> */}
                  {/* {about.section && about.section.length > 0 && (
                    <div className="text-sm">
                      <p className="font-medium">Các section:</p>
                      <ul className="list-disc list-inside text-muted-foreground">
                        {about.section.slice(0, 3).map((section, idx) => (
                          <li key={idx}>
                            {section.title || `Section ${idx + 1}`}
                            <Badge variant="outline" className="ml-2 text-xs">
                              Style {section.style}
                            </Badge>
                          </li>
                        ))}
                        {about.section.length > 3 && (
                          <li className="text-muted-foreground">
                            ... và {about.section.length - 3} section khác
                          </li>
                        )}
                      </ul>
                    </div>
                  )} */}
                {/* </div> */}
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/admin/layout-editor/${about.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Chỉnh sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/admin/about/${about.id}/preview`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => about.id && handleDelete(about.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Xóa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
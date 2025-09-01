"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Save, ArrowLeft, Eye } from "lucide-react"
import { toast } from "sonner"
import SectionForm from "./section-form"
import { AboutResponseDto } from "@/lib/dto/about.dto"
import { EStyleSection } from "@/lib/enums/style-section.enum"
import type { ApiResponseDto } from "@/lib/dto/api-response.dto"
import { useGlobalAlert } from "@/features/alert-dialog/context/alert-dialog-context"
import LayoutPreview from "./layout-preview"

type AboutSection = AboutResponseDto['section'][0]

interface LayoutEditorProps {
  initialData?: AboutResponseDto
  aboutId?: string
}

export default function LayoutEditor({ initialData, aboutId }: LayoutEditorProps) {
  const router = useRouter()
  const [sections, setSections] = useState<AboutSection[]>(initialData?.section || [])
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const { showAlert } = useGlobalAlert()

  const addSection = () => {
    const newSection: AboutSection = {
      title: "",
      subtitle: "",
      image_url: null,
      subsection: [],
      style: EStyleSection.NOIMAGE
    }
    setSections([...sections, newSection])
    toast.success("Đã thêm section mới!")
  }

  const updateSection = (index: number, section: AboutSection) => {
    const newSections = [...sections]
    newSections[index] = section
    setSections(newSections)
  }

  const removeSection = async (index: number) => {
    const confirmed = await showAlert({
      title: "Xác nhận xóa",
      description: "Bạn có chắc chắn muốn xóa section này?",
      variant: "destructive"
    })
    
    if (confirmed) {
      const newSections = sections.filter((_, i) => i !== index)
      setSections(newSections)
      toast.success("Đã xóa section!")
    }
  }

  const saveLayout = async () => {
    setLoading(true)
    try {
      const url = aboutId ? `/api/about/${aboutId}` : "/api/about"
      const method = aboutId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ section: sections }),
      })

      const data: ApiResponseDto<AboutResponseDto> = await response.json()

      if (!data.success) {
        throw new Error(data.message)
      }

      toast.success("Layout đã được lưu thành công!")
    } catch (error) {
      toast.error(`Lỗi khi lưu layout: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  if (showPreview) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => router.push("/admin/about")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
                <CardTitle>Preview Layout</CardTitle>
              </div>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                <Eye className="h-4 w-4 mr-2" />
                Quay lại chỉnh sửa
              </Button>
            </div>
          </CardHeader>
        </Card>
        <LayoutPreview data={{ section: sections} as AboutResponseDto} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.push("/admin/about")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <CardTitle>Chỉnh sửa Layout</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? "Ẩn Preview" : "Xem Preview"}
              </Button>
              <Button variant="outline" onClick={addSection}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm Section
              </Button>
              <Button onClick={saveLayout} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Đang lưu..." : "Lưu Layout"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Tạo và chỉnh sửa các section cho trang của bạn. Mỗi section có thể có style khác nhau:
          </p>
          <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
            <li>Style 0: Không có hình ảnh</li>
            <li>Style 1: Có 1 hình ảnh</li>
            <li>Style 2: Có 4 hình ảnh</li>
          </ul>
        </CardContent>
      </Card>

      {sections.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">Chưa có section nào được tạo</p>
            <Button onClick={addSection}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo Section đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sections.map((section, index) => (
            <SectionForm
              key={index}
              section={section}
              onUpdate={(updatedSection: AboutSection) => updateSection(index, updatedSection)}
              onDelete={() => removeSection(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

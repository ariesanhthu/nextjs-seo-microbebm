"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { HomepageResponseDto } from "@/lib/dto/homepage.dto"
import { CldImage } from "next-cloudinary"
import { Plus, Trash2, Eye, Upload } from "lucide-react"
import { useImageGallery } from "@/features/image-storage/context/image-gallery-context"
import { ImageMetadataResponseDto } from "@/lib/dto/image-metadata.dto"
import ImageUploader from "@/features/image-storage/components/image-uploader"
import { toast } from "sonner"

interface PolicySectionProps {
  form: HomepageResponseDto | null
  setForm: (form: HomepageResponseDto | null) => void
}

export default function PolicySection({ form, setForm }: PolicySectionProps) {
  const { openDialog } = useImageGallery()
  const [imageUrl, setImageUrl] = useState(form?.image_policy || "")

  const handleSelectPolicy = () => {
    openDialog((image: ImageMetadataResponseDto) => {
      setImageUrl(image.url)
      if (form) {
        setForm({
          ...form,
          image_policy: image.url
        })
      }
      toast.success("Đã chọn hình ảnh policy")
    })
  }

  const handleRemoveImage = () => {
    setImageUrl("")
    if (form) {
      setForm({
        ...form,
        image_policy: ""
      })
    }
    toast.success("Đã xóa hình ảnh policy")
  }

  const handleImageUpload = (url: string) => {
    setImageUrl(url)
    if (form) {
      setForm({
        ...form,
        image_policy: url
      })
    }
    toast.success("Đã tải lên hình ảnh policy")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Chính sách hình ảnh
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Hình ảnh chính sách</Label>
          
          {imageUrl ? (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <CldImage
                  src={imageUrl}
                  alt="Policy Image Preview"
                  width={400}
                  height={300}
                  className="rounded-lg object-cover"
                  onError={() => {
                    toast.error("Không thể tải hình ảnh")
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSelectPolicy}>
                  Chọn từ thư viện
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRemoveImage}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa hình ảnh
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={handleSelectPolicy} className="h-24">
                  <div className="flex flex-col items-center gap-2">
                    <Plus className="h-6 w-6" />
                    <span className="text-sm">Chọn từ thư viện</span>
                  </div>
                </Button>
                <div className="flex items-center justify-center">
                  <ImageUploader 
                    refreshGallery={() => {}} 
                    onImageSelect={handleImageUpload}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Trash2, Image as ImageIcon, FileText } from "lucide-react"
import { HomepageResponseDto } from "@/lib/dto/homepage.dto"
import { ImageMetadataResponseDto } from "@/lib/dto/image-metadata.dto"
import { useImageGallery } from "@/features/image-storage/context/image-gallery-context"
import { toast } from "sonner"
import Image from "next/image"
import ImageUploader from "@/features/image-storage/components/image-uploader"

interface ContentSectionProps {
  form: HomepageResponseDto | null
  setForm: (form: HomepageResponseDto | null) => void
}

export default function ContentSection({ form, setForm }: ContentSectionProps) {
  const imageGallery = useImageGallery()

  const onChangeContent = (key: "title" | "subtitle", value: string) => {
    if (form) {
      setForm({
        ...form,
        [key]: value
      })
    }
  }

  const removeBanner = (idx: number) => {
    if (form) {
      setForm({
        ...form,
        banner: (form.banner || []).filter((_, i) => i !== idx)
      })
      toast.success("Đã xóa ảnh banner")
    }
  }

  const handleSelectBanner = () => {
    imageGallery.openDialog((image: ImageMetadataResponseDto) => {
      if (form) {
        setForm({
          ...form,
          banner: [...(form.banner || []), image.url]
        })
        toast.success("Đã thêm ảnh vào banner")
      }
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Thông tin chung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Tiêu đề chính</Label>
            <Input 
              id="title" 
              value={form?.title || ""} 
              onChange={(e) => onChangeContent("title", e.target.value)}
              placeholder="Nhập tiêu đề chính của website"
            />
          </div>
          <div>
            <Label htmlFor="subtitle">Tiêu đề phụ</Label>
            <Input 
              id="subtitle" 
              value={form?.subtitle || ""} 
              onChange={(e) => onChangeContent("subtitle", e.target.value)}
              placeholder="Nhập tiêu đề phụ của website"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Ảnh Banner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {
              (form?.banner || []).map((img, idx) => (
                <div key={idx} className="relative">
                  <Image 
                    src={img} 
                    width={300} 
                    height={120} 
                    alt={`banner-${idx}`} 
                    className="rounded-md object-cover" 
                  />
                  <Button size="icon" variant="destructive" className="absolute top-2 right-2 text-white" onClick={() => removeBanner(idx)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSelectBanner}>Chọn từ thư viện</Button>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="text-sm text-foreground">Hoặc tải ảnh mới</div>
            <ImageUploader />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

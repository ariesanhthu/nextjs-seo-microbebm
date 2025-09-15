"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Sliders } from "lucide-react"
import { HomepageResponseDto } from "@/lib/dto/homepage.dto"
import { ImageMetadataResponseDto } from "@/lib/dto/image-metadata.dto"
import { useImageGallery } from "@/features/image-storage/context/image-gallery-context"
import { toast } from "sonner"
import Image from "next/image"
import ImageUploader from "@/features/image-storage/components/image-uploader"

interface SliderSectionProps {
  form: HomepageResponseDto | null
  setForm: (form: HomepageResponseDto | null) => void
}

export default function SliderSection({ form, setForm }: SliderSectionProps) {
  const imageGallery = useImageGallery()

  const addSlider = (publicId: string, title: string = "", description: string = "") => {
    if (form) {
      setForm({
        ...form,
        slider: [...(form.slider || []), { image_url: publicId, title, description }]
      })
      toast.success("Đã thêm ảnh vào slider")
    }
  }

  const removeSlider = (idx: number) => {
    if (form) {
      setForm({
        ...form,
        slider: (form.slider || []).filter((_, i) => i !== idx)
      })
      toast.success("Đã xóa ảnh slider")
    }
  }

  const updateSliderField = (idx: number, field: 'title' | 'description', value: string) => {
    if (form) {
      const updatedSlider = [...(form.slider || [])]
      updatedSlider[idx] = {
        ...updatedSlider[idx],
        [field]: value
      }
      setForm({
        ...form,
        slider: updatedSlider
      })
    }
  }

  const handleSelectSlider = () => {
    imageGallery.openDialog((image: ImageMetadataResponseDto) => {
      addSlider(image.url)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sliders className="h-5 w-5" /> Ảnh Slider
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(form?.slider || []).map((sliderItem, idx) => (
            <div key={`${sliderItem.image_url}-${idx}`} className="space-y-3">
              <div className="space-y-2">
                <div>
                  <Label htmlFor={`slider-title-${idx}`} className="text-sm font-medium">
                    Tiêu đề
                  </Label>
                  <Input
                    id={`slider-title-${idx}`}
                    value={sliderItem.title || ''}
                    onChange={(e) => updateSliderField(idx, 'title', e.target.value)}
                    placeholder="Nhập tiêu đề..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`slider-description-${idx}`} className="text-sm font-medium">
                    Mô tả
                  </Label>
                  <Textarea
                    id={`slider-description-${idx}`}
                    value={sliderItem.description || ''}
                    onChange={(e) => updateSliderField(idx, 'description', e.target.value)}
                    placeholder="Nhập mô tả..."
                    className="mt-1 min-h-[60px]"
                  />
                </div>
              </div>
              
              <div className="relative">
                <Image 
                  src={sliderItem.image_url} 
                  width={300} 
                  height={160} 
                  alt={`slide-${idx}`} 
                  className="rounded-md object-cover w-full h-40" 
                />
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="absolute top-2 right-2 text-white" 
                  onClick={() => removeSlider(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center">
            <Button variant="outline" onClick={handleSelectSlider} className="h-40 w-full">
              <div className="flex flex-col items-center gap-2">
                <Plus className="h-8 w-8" />
                <span>Thêm ảnh</span>
              </div>
            </Button>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="text-sm text-foreground">Hoặc tải ảnh mới</div>
          <ImageUploader />
        </div>
      </CardContent>
    </Card>
  )
}

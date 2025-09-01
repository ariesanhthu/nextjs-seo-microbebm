"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Trash2, Eye, Edit } from "lucide-react"
import { AboutResponseDto } from "@/lib/dto/about.dto"
import { EStyleSection } from "@/lib/enums/style-section.enum"
import { useGlobalAlert } from "@/features/alert-dialog/context/alert-dialog-context"
import StylePreview from "./style-preview"

type AboutSection = AboutResponseDto['section'][0]

interface SectionFormProps {
  section: AboutSection
  onUpdate: (section: AboutSection) => void
  onDelete: () => void
}

export default function SectionForm({ section, onUpdate, onDelete }: SectionFormProps) {
  const [mode, setMode] = useState<"preview" | "edit">("preview")
  const { showAlert } = useGlobalAlert()

  const updateSection = (updates: Partial<AboutSection>) => {
    onUpdate({ ...section, ...updates })
  }

  const handleDelete = async () => {
    const confirmed = await showAlert({
      title: "Xác nhận xóa",
      description: "Bạn có chắc chắn muốn xóa section này?",
      variant: "destructive"
    })
    
    if (confirmed) {
      onDelete()
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Section Editor</CardTitle>
          <div className="flex items-center gap-2">
            <ToggleGroup type="single" value={mode} onValueChange={(value) => value && setMode(value as "preview" | "edit")}>
              <ToggleGroupItem value="preview" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </ToggleGroupItem>
              <ToggleGroupItem value="edit" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Chỉnh sửa
              </ToggleGroupItem>
            </ToggleGroup>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {mode === "preview" ? (
          <StylePreview 
            section={section} 
            onUpdate={updateSection} 
            onDelete={handleDelete}
          />
        ) : (
          <div className="space-y-4">
            {/* Section Title */}
            <div>
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                value={section.title}
                onChange={(e) => updateSection({ title: e.target.value })}
                placeholder="Nhập tiêu đề section"
              />
            </div>

            {/* Section Subtitle */}
            <div>
              <Label htmlFor="subtitle">Phụ đề</Label>
              <Input
                id="subtitle"
                value={section.subtitle}
                onChange={(e) => updateSection({ subtitle: e.target.value })}
                placeholder="Nhập phụ đề section"
              />
            </div>

            {/* Style Selection */}
            <div>
              <Label htmlFor="style">Style</Label>
              <Select value={section.style.toString()} onValueChange={(value) => updateSection({ style: parseInt(value) as EStyleSection })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EStyleSection.NOIMAGE.toString()}>Style 0 - Không hình</SelectItem>
                  <SelectItem value={EStyleSection.ONEIMAGE.toString()}>Style 1 - 1 hình</SelectItem>
                  <SelectItem value={EStyleSection.FOURIMAGE.toString()}>Style 2 - 4 hình</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button onClick={() => setMode("preview")}>
                Xem Preview
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"
import { AboutResponseDto, SubsectionDto } from "@/lib/dto/about.dto"
import { EStyleSection } from "@/lib/enums/style-section.enum"
import SubsectionEditor from "./subsection-editor"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"

type AboutSection = AboutResponseDto['section'][0]

interface StylePreviewProps {
  section: AboutSection
  onUpdate: (section: AboutSection) => void
  onDelete: () => void
}

export default function StylePreview({ section, onUpdate, onDelete }: StylePreviewProps) {
  const updateSection = (updates: Partial<AboutSection>) => {
    onUpdate({ ...section, ...updates })
  }

  const updateSubsection = (index: number, updates: Partial<SubsectionDto[0]>) => {
    const newSubsections = [...section.subsection]
    if (newSubsections[index]) {
      newSubsections[index] = { ...newSubsections[index], ...updates }
      updateSection({ subsection: newSubsections })
    }
  }

  const addSubsection = () => {
    const newSubsection = {
      name: "",
      description: "",
      ref: null,
      icon: null,
      image_url: null,
    }
    updateSection({ subsection: [...section.subsection, newSubsection] })
    toast.success("Đã thêm subsection!")
  }

  const removeSubsection = (index: number) => {
    const newSubsections = section.subsection.filter((_, i) => i !== index)
    updateSection({ subsection: newSubsections })
    toast.success("Đã xóa subsection!")
  }

  const getMaxImages = () => {
    switch (section.style) {
      case EStyleSection.NOIMAGE:
        return 0
      case EStyleSection.ONEIMAGE:
        return 1
      case EStyleSection.FOURIMAGE:
        return 4
      default:
        return 0
    }
  }

  const canAddImage = () => {
    const maxImages = getMaxImages()
    const currentImages = section.subsection.filter((sub) => sub.image_url).length
    return currentImages < maxImages
  }

  const renderStyle0 = () => (
    <div className="space-y-6">
      {/* Title và Subtitle ở giữa */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">{section.title || "Chưa có tiêu đề"}</h2>
        {section.subtitle && (
          <p className="text-lg text-gray-600">{section.subtitle}</p>
        )}
      </div>

      {/* Subsections list dọc */}
      <div className="space-y-4">
        {section.subsection.map((subsection, index) => (
          <SubsectionEditor
            key={index}
            subsection={subsection}
            index={index}
            onUpdate={(updates) => updateSubsection(index, updates)}
            onDelete={() => removeSubsection(index)}
            showImage={false}
          />
        ))}
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={addSubsection}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm subsection
        </Button>
      </div>
    </div>
  )

  const renderStyle1 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Ảnh lớn bên trái */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{section.title || "Chưa có tiêu đề"}</h2>
        {section.subtitle && (
          <p className="text-gray-600">{section.subtitle}</p>
        )}
        
        {/* Ảnh chính - lấy từ subsection đầu tiên có ảnh */}
        {section.subsection.find(sub => sub.image_url) && (
          <div className="relative">
            <img
              src={section.subsection.find(sub => sub.image_url)?.image_url || ""}
              alt="Main image"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Subsections bên phải */}
      <div className="space-y-4">
        {section.subsection.map((subsection, index) => (
          <SubsectionEditor
            key={index}
            subsection={subsection}
            index={index}
            onUpdate={(updates) => updateSubsection(index, updates)}
            onDelete={() => removeSubsection(index)}
            showImage={true}
            canAddImage={canAddImage()}
          />
        ))}
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={addSubsection}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm subsection
        </Button>
      </div>
    </div>
  )

  const renderStyle2 = () => (
    <div className="space-y-6">
      {/* Title và Subtitle ở trên */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">{section.title || "Chưa có tiêu đề"}</h2>
        {section.subtitle && (
          <p className="text-lg text-gray-600">{section.subtitle}</p>
        )}
      </div>

      {/* Grid 2x2 cho subsections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {section.subsection.slice(0, 4).map((subsection, index) => (
          <SubsectionEditor
            key={index}
            subsection={subsection}
            index={index}
            onUpdate={(updates) => updateSubsection(index, updates)}
            onDelete={() => removeSubsection(index)}
            showImage={true}
            canAddImage={canAddImage()}
          />
        ))}
        
        {/* Nút thêm nếu chưa đủ 4 */}
        {section.subsection.length < 4 && (
          <div className="flex items-center justify-center">
            <Button 
              type="button" 
              variant="outline" 
              onClick={addSubsection}
              className="h-32 w-full border-dashed"
            >
              <Plus className="h-6 w-6 mr-2" />
              Thêm subsection
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  const renderPreview = () => {
    switch (section.style) {
      case EStyleSection.NOIMAGE:
        return renderStyle0()
      case EStyleSection.ONEIMAGE:
        return renderStyle1()
      case EStyleSection.FOURIMAGE:
        return renderStyle2()
      default:
        return renderStyle0()
    }
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Preview - Style {section.style}</h3>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Xóa Section
        </Button>
      </div>
      
      {renderPreview()}
    </div>
  )
}

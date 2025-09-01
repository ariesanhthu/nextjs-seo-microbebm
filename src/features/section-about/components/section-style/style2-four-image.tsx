"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import SubsectionEditor from "../subsection-editor"
import SectionHeader from "./section-header"
import { AboutResponseDto } from "@/lib/dto/about.dto"
import { useSectionStyle } from "../../hooks"

type AboutSection = AboutResponseDto['section'][0]

interface Style2FourImageProps {
  section: AboutSection
  onUpdate: (section: AboutSection) => void
}

export default function Style2FourImage({ section, onUpdate }: Style2FourImageProps) {
  const {
    updateSubsection,
    addSubsection,
    removeSubsection,
    canAddImage,
    canAddSubsection
  } = useSectionStyle({ section, onUpdate })

  return (
    <div className="space-y-6">
      {/* Title và Subtitle ở trên */}
      <SectionHeader section={section} />

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
            canAddImage={canAddImage}
            sectionStyle={section.style}
          />
        ))}
        
        {/* Nút thêm nếu chưa đủ 4 */}
        {canAddSubsection && (
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
}

"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import SubsectionEditor from "../subsection-editor"
import SectionHeader from "./section-header"
import ImageWithMetadata from "@/components/ui/image-with-metadata"
import { AboutResponseDto } from "@/lib/dto/about.dto"
import { useSectionStyle } from "../../hooks"

type AboutSection = AboutResponseDto['section'][0]

interface Style1OneImageProps {
  section: AboutSection
  onUpdate: (section: AboutSection) => void
}

export default function Style1OneImage({ section, onUpdate }: Style1OneImageProps) {
  const {
    updateSubsection,
    addSubsection,
    removeSubsection,
    canAddSubsection
  } = useSectionStyle({ section, onUpdate })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Ảnh lớn bên trái */}
      <div className="space-y-4">
        <SectionHeader 
          section={section} 
          className="space-y-2"
          titleClassName="text-2xl font-bold"
          subtitleClassName="text-gray-600"
        />
        
        {/* Ảnh chính - lấy từ section image_url */}
        {section.image_url && (
          <div className="relative">
            <ImageWithMetadata
              src={section.image_url}
              alt="Main image"
              width={400}
              height={256}
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
            showImage={false}
            canAddImage={false}
            sectionStyle={section.style}
          />
        ))}
        
        {canAddSubsection && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={addSubsection}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm subsection
          </Button>
        )}
      </div>
    </div>
  )
}

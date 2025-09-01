"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import SubsectionEditor from "../subsection-editor"
import SectionHeader from "./section-header"
import { AboutResponseDto } from "@/lib/dto/about.dto"
import { useSectionStyle } from "../../hooks"

type AboutSection = AboutResponseDto['section'][0]

interface Style0NoImageProps {
  section: AboutSection
  onUpdate: (section: AboutSection) => void
}

export default function Style0NoImage({ section, onUpdate }: Style0NoImageProps) {
  const {
    updateSubsection,
    addSubsection,
    removeSubsection,
    canAddSubsection
  } = useSectionStyle({ section, onUpdate })

  return (
    <div className="space-y-6">
      {/* Title và Subtitle ở giữa */}
      <SectionHeader section={section} />

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

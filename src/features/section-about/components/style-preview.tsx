"use client"
import { AboutResponseDto } from "@/lib/dto/about.dto"
import { EStyleSection } from "@/lib/enums/style-section.enum"
import { Style0NoImage, Style1OneImage, Style2FourImage } from "./section-style"
type AboutSection = AboutResponseDto['section'][0]

interface StylePreviewProps {
  section: AboutSection
  onUpdate: (section: AboutSection) => void
  onDelete: () => void
}

export default function StylePreview({ section, onUpdate, onDelete }: StylePreviewProps) {
  const renderPreview = () => {
    switch (section.style) {
      case EStyleSection.NOIMAGE:
        return <Style0NoImage section={section} onUpdate={onUpdate} />
      case EStyleSection.ONEIMAGE:
        return <Style1OneImage section={section} onUpdate={onUpdate} />
      case EStyleSection.FOURIMAGE:
        return <Style2FourImage section={section} onUpdate={onUpdate} />
      default:
        return <Style0NoImage section={section} onUpdate={onUpdate} />
    }
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
      {renderPreview()}
    </div>
  )
}

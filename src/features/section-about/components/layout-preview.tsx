"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ImageIcon } from "lucide-react"
import { AboutResponseDto } from "@/lib/dto/about.dto"
import { EStyleSection } from "@/lib/enums/style-section.enum"
import Style0NoImage from "./section-style/style0-no-image"
import Style1OneImage from "./section-style/style1-one-image"
import Style2FourImage from "./section-style/style2-four-image"

type AboutSection = AboutResponseDto['section'][0]

interface LayoutPreviewProps {
  data: AboutResponseDto
}

// Mapping từ EStyleSection đến các style components
const styleComponentMap = {
  [EStyleSection.NOIMAGE]: Style0NoImage,
  [EStyleSection.ONEIMAGE]: Style1OneImage,
  [EStyleSection.FOURIMAGE]: Style2FourImage,
} as const

export default function LayoutPreview({ data }: LayoutPreviewProps) {
  const renderSection = (section: AboutSection, index: number) => {
    const StyleComponent = styleComponentMap[section.style]
    
    if (!StyleComponent) {
      console.warn(`Unknown style: ${section.style}`)
      return null
    }

    // Mock onUpdate function cho preview mode
    const mockOnUpdate = (updatedSection: AboutSection) => {
      console.log('Preview mode - section updated:', updatedSection)
    }

    return (
      <div key={index} className="mb-8">
        <StyleComponent 
          section={section} 
          onUpdate={mockOnUpdate}
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {data.section && data.section.length > 0 ? (
        <div className="space-y-12">
          {data.section.map((section, index) => renderSection(section, index))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Chưa có section nào được tạo</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

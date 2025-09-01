"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, ImageIcon } from "lucide-react"
import { AboutResponseDto } from "@/lib/dto/about.dto"
import { EStyleSection } from "@/lib/enums/style-section.enum"
import ImageWithMetadata from "@/components/ui/image-with-metadata"

type AboutSection = AboutResponseDto['section'][0]

interface LayoutPreviewProps {
  data: AboutResponseDto
}

export default function LayoutPreview({ data }: LayoutPreviewProps) {
  const renderSubsection = (subsection: AboutSection['subsection'][0], index: number) => {
    return (
      <Card key={index} className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {subsection.image_url && (
              <div className="flex-shrink-0">
                <ImageWithMetadata
                  src={subsection.image_url}
                  alt={subsection.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">{subsection.name}</h4>
                {subsection.icon && (
                  <span className="text-lg">{subsection.icon}</span>
                )}
              </div>
              <p className="text-muted-foreground mb-2">{subsection.description}</p>
              {subsection.ref && (
                <Button variant="outline" size="sm" asChild>
                  <a href={subsection.ref} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Xem thêm
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderSection = (section: AboutSection, index: number) => {
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

    const maxImages = getMaxImages()
    const subsectionsWithImages = section.subsection.filter(sub => sub.image_url)
    const subsectionsWithoutImages = section.subsection.filter(sub => !sub.image_url)

    return (
      <Card key={index} className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{section.title}</CardTitle>
              {section.subtitle && (
                <p className="text-muted-foreground mt-1">{section.subtitle}</p>
              )}
            </div>
            <Badge variant="outline">
              Style {section.style}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {maxImages === 0 && (
            <div className="space-y-4">
              {section.subsection.map((subsection, idx) => renderSubsection(subsection, idx))}
            </div>
          )}

          {maxImages === 1 && (
            <div className="space-y-4">
              {subsectionsWithImages.slice(0, 1).map((subsection, idx) => renderSubsection(subsection, idx))}
              {subsectionsWithoutImages.map((subsection, idx) => renderSubsection(subsection, idx + 1))}
            </div>
          )}

          {maxImages === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subsectionsWithImages.slice(0, 4).map((subsection, idx) => (
                <div key={idx} className="space-y-2">
                  {subsection.image_url && (
                    <ImageWithMetadata
                      src={subsection.image_url}
                      alt={subsection.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold">{subsection.name}</h4>
                    <p className="text-sm text-muted-foreground">{subsection.description}</p>
                    {subsection.ref && (
                      <Button variant="outline" size="sm" asChild className="mt-2">
                        <a href={subsection.ref} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Xem thêm
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {subsectionsWithoutImages.map((subsection, idx) => renderSubsection(subsection, idx + 4))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Preview Layout</h1>
        <p className="text-muted-foreground">
          Đây là cách layout sẽ hiển thị trên trang web
        </p>
      </div>

      {data.section && data.section.length > 0 ? (
        <div className="space-y-6">
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

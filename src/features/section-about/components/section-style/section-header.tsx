"use client"
import { AboutResponseDto } from "@/lib/dto/about.dto"

type AboutSection = AboutResponseDto['section'][0]

interface SectionHeaderProps {
  section: AboutSection
  className?: string
  titleClassName?: string
  subtitleClassName?: string
}

export default function SectionHeader({ 
  section, 
  className = "text-center space-y-2",
  titleClassName = "text-3xl font-bold",
  subtitleClassName = "text-lg text-gray-600"
}: SectionHeaderProps) {
  return (
    <div className={className}>
      <h2 className={titleClassName}>
        {section.title || "Chưa có tiêu đề"}
      </h2>
      {section.subtitle && (
        <p className={subtitleClassName}>
          {section.subtitle}
        </p>
      )}
    </div>
  )
}

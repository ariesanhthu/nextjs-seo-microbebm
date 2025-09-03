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
        <div className={subtitleClassName}>
          <div className="flex justify-center mt-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-100/90 to-emerald-100/90 dark:from-green-900/40 dark:to-emerald-900/40 rounded-full border border-green-200/60 dark:border-green-700/60 backdrop-blur-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-base font-bold text-emerald-800 dark:text-emerald-200">
                  {section.subtitle}
                </span>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse animation-delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

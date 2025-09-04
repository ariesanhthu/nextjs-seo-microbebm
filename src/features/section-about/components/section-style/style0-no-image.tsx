"use client"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles } from "lucide-react"
import SectionHeader from "./section-header"
import { AboutResponseDto } from "@/lib/dto/about.dto"
import { useSectionStyle } from "../../hooks"
import { cn } from "@/lib/utils"
import { DynamicIcon } from "../../hooks/useIconFieldDynamic"
import dynamic from "next/dynamic"

// Dynamic import cho SubsectionEditor
const SubsectionEditor = dynamic(() => import("../subsection-editor"), {
  ssr: false,
  loading: () => <div className="h-8 w-8 bg-muted animate-pulse rounded" />
})

// Component riêng để tránh vi phạm Rules of Hooks
function FeatureCard({ 
  subsection, 
  index, 
  updateSubsection, 
  removeSubsection, 
  sectionStyle,
  isPreview = false
}: {
  subsection: any
  index: number
  updateSubsection: (index: number, updates: any) => void
  removeSubsection: (index: number) => void
  sectionStyle: any
  isPreview?: boolean
}) {
  
  return (
    <div
      className={cn(
        "group relative",
        "animate-in fade-in-0 slide-in-from-bottom-4",
        `animation-delay-${index * 100}`
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative h-full p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        {/* Icon Container */}
        <div className="mb-4">
          <div className="inline-flex p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            <DynamicIcon 
              iconName={subsection.icon || undefined} 
              fallbackIcon={Sparkles}
              className="w-6 h-6 text-primary" 
            />
          </div>
        </div>

        {/* Content */}
        <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
          {subsection.name || "Feature Title"}
        </h3>
        <p className="text-sm text-foreground line-clamp-3">
          {subsection.description || "Add a brief description of this feature to help visitors understand its value."}
        </p>

        {/* Optional link - styled as subtle text link */}
        {subsection.ref && (
          <a
            href={subsection.ref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Learn more
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}

        {/* Edit controls for admin mode - chỉ hiện trong edit mode */}
        {!isPreview && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <SubsectionEditor
              subsection={subsection}
              index={index}
              onUpdate={(updates) => updateSubsection(index, updates)}
              onDelete={() => removeSubsection(index)}
              showImage={false}
              sectionStyle={sectionStyle}
              className="!p-0 !border-0 !bg-transparent"
              isPreview={isPreview}
            />
          </div>
        )} 
      </div>
    </div>
  )
}

type AboutSection = AboutResponseDto['section'][0]

interface Style0NoImageProps {
  section: AboutSection
  onUpdate: (section: AboutSection) => void
  isPreview?: boolean
}

export default function Style0NoImage({ section, onUpdate, isPreview = false }: Style0NoImageProps) {
  const {
    updateSubsection,
    addSubsection,
    removeSubsection,
    canAddSubsection
  } = useSectionStyle({ section, onUpdate })

  return (
    <div className="relative w-full">
      {/* Decorative background gradient */}
      <div className="w-full absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl -z-10" />
      
      <div className="space-y-12 p-8 w-full">
        {/* Enhanced Header with animation */}
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <SectionHeader 
            section={section}
            className="text-center space-y-4 max-w-3xl mx-auto"
            
            subtitleClassName="text-lg md:text-xl text-foreground leading-relaxed"
          />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {section.subsection.map((subsection, index) => (
            <FeatureCard
              key={index}
              subsection={subsection}
              index={index}
              updateSubsection={updateSubsection}
              removeSubsection={removeSubsection}
              sectionStyle={section.style as any}
              isPreview={isPreview}
            />
          ))}

          {/* Add Feature Button - chỉ hiện trong edit mode */}
          {!isPreview && canAddSubsection && section.subsection.length < 4 && (
            <div className="animate-in fade-in-0 slide-in-from-bottom-4 animation-delay-300">
              <button
                type="button"
                onClick={addSubsection}
                className="h-full min-h-[200px] w-full rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 flex flex-col items-center justify-center gap-3 group"
              >
                <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  Add Feature
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
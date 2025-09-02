// "use client"
// import { Button } from "@/components/ui/button"
// import { Plus } from "lucide-react"
// import SubsectionEditor from "../subsection-editor"
// import SectionHeader from "./section-header"
// import ImageWithMetadata from "@/components/ui/image-with-metadata"
// import { AboutResponseDto } from "@/lib/dto/about.dto"
// import { useSectionStyle } from "../../hooks"

// type AboutSection = AboutResponseDto['section'][0]

// interface Style1OneImageProps {
//   section: AboutSection
//   onUpdate: (section: AboutSection) => void
// }

// export default function Style1OneImage({ section, onUpdate }: Style1OneImageProps) {
//   const {
//     updateSubsection,
//     addSubsection,
//     removeSubsection,
//     canAddSubsection
//   } = useSectionStyle({ section, onUpdate })

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//       {/* Ảnh lớn bên trái */}
//       <div className="space-y-4">
//         <SectionHeader 
//           section={section} 
//           className="space-y-2"
//           titleClassName="text-2xl font-bold"
//           subtitleClassName="text-gray-600"
//         />
        
//         {/* Ảnh chính - lấy từ section image_url */}
//         {section.image_url && (
//           <div className="relative">
//             <ImageWithMetadata
//               src={section.image_url}
//               alt="Main image"
//               width={400}
//               height={256}
//               className="w-full h-64 object-cover rounded-lg"
//             />
//           </div>
//         )}
//       </div>

//       {/* Subsections bên phải */}
//       <div className="space-y-4">
//         {section.subsection.map((subsection, index) => (
//           <SubsectionEditor
//             key={index}
//             subsection={subsection}
//             index={index}
//             onUpdate={(updates) => updateSubsection(index, updates)}
//             onDelete={() => removeSubsection(index)}
//             showImage={false}
//             canAddImage={false}
//             sectionStyle={section.style}
//           />
//         ))}
        
//         {canAddSubsection && (
//           <Button 
//             type="button" 
//             variant="outline" 
//             onClick={addSubsection}
//             className="w-full"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Thêm subsection
//           </Button>
//         )}
//       </div>
//     </div>
//   )
// }
"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowRight, CheckCircle2, Award } from "lucide-react"
import SubsectionEditor from "../subsection-editor"
import SectionHeader from "./section-header"
import ImageWithMetadata from "@/components/ui/image-with-metadata"
import { AboutResponseDto } from "@/lib/dto/about.dto"
import { useSectionStyle } from "../../hooks"
import { useIconField } from "@/features/icon-picker/hooks/useIconFeild"
import { cn } from "@/lib/utils"

type AboutSection = AboutResponseDto['section'][0]

interface Style1OneImageProps {
  section: AboutSection
  onUpdate: (section: AboutSection) => void
  isPreview?: boolean
}

export default function Style1OneImage({ section, onUpdate, isPreview = false }: Style1OneImageProps) {
  const {
    updateSubsection,
    addSubsection,
    removeSubsection,
    canAddSubsection
  } = useSectionStyle({ section, onUpdate })

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 rounded-3xl -z-10" />
      
      <div className="space-y-12 p-8">
        {/* Enhanced Header */}
        <div className="animate-in fade-in-0 slide-in-from-top-4 duration-700">
          <SectionHeader 
            section={section}
            className="text-center space-y-4 max-w-3xl mx-auto"
            titleClassName="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            subtitleClassName="text-lg md:text-xl text-foreground leading-relaxed"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Featured Image */}
          <div className="relative group animate-in fade-in-0 slide-in-from-left-8 duration-700 animation-delay-200">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 p-1">
              <div className="relative overflow-hidden rounded-[calc(1.5rem-4px)] bg-card">
                {section.image_url ? (
                  <>
                    <ImageWithMetadata
                      src={section.image_url}
                      alt="Featured image"
                      width={600}
                      height={400}
                      className="w-full h-[400px] object-cover"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </>
                ) : (
                  <div className="w-full h-[400px] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-center">
                      <Award className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                      <p className="text-muted-foreground">Add Featured Image</p>
                    </div>
                  </div>
                )}
                
                {/* Certification Badge Overlay */}
                <div className="absolute top-6 left-6">
                  <Badge className="px-4 py-2 bg-primary text-primary-foreground font-semibold shadow-lg">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    ISO Certified
                  </Badge>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          </div>

          {/* Right: Subsections List */}
          <div className="space-y-6">
            {section.subsection.map((subsection, index) => {
              const { IconComponent } = useIconField(subsection.icon || "CheckCircle2")
              
              return (
                <div
                  key={index}
                  className={cn(
                    "group relative animate-in fade-in-0 slide-in-from-right-8",
                    `animation-delay-${300 + index * 100}`
                  )}
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex gap-4 p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        {IconComponent ? (
                          <IconComponent className="w-6 h-6 text-primary" />
                        ) : (
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                        {subsection.name || "Feature Title"}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {subsection.description || "Add a description for this feature."}
                      </p>
                      
                      {subsection.ref && (
                        <a
                          href={subsection.ref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-2"
                        >
                          Learn more
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </a>
                      )}
                    </div>

                    {/* Edit controls - chỉ hiện trong edit mode */}
                    {!isPreview && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <SubsectionEditor
                          subsection={subsection}
                          index={index}
                          onUpdate={(updates) => updateSubsection(index, updates)}
                          onDelete={() => removeSubsection(index)}
                          showImage={false}
                          canAddImage={false}
                          sectionStyle={section.style}
                          className="!p-0 !border-0 !bg-transparent"
                          isPreview={isPreview}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Add Subsection Button - chỉ hiện trong edit mode */}
            {!isPreview && canAddSubsection && (
              <button
                type="button"
                onClick={addSubsection}
                className="w-full p-6 rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  Add Feature
                </span>
              </button>
            )}

            {/* CTA Button - chỉ hiện trong preview mode */}
            {isPreview && (
              <div className="pt-6">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  Discover More
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
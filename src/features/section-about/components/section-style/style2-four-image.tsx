// // "use client"
// // import { Button } from "@/components/ui/button"
// // import { Plus } from "lucide-react"
// // import SubsectionEditor from "../subsection-editor"
// // import SectionHeader from "./section-header"
// // import { AboutResponseDto } from "@/lib/dto/about.dto"
// // import { useSectionStyle } from "../../hooks"

// // type AboutSection = AboutResponseDto['section'][0]

// // interface Style2FourImageProps {
// //   section: AboutSection
// //   onUpdate: (section: AboutSection) => void
// // }

// // export default function Style2FourImage({ section, onUpdate }: Style2FourImageProps) {
// //   const {
// //     updateSubsection,
// //     addSubsection,
// //     removeSubsection,
// //     canAddImage,
// //     canAddSubsection
// //   } = useSectionStyle({ section, onUpdate })

// //   return (
// //     <div className="space-y-6">
// //       {/* Title và Subtitle ở trên */}
// //       <SectionHeader section={section} />

// //       {/* Grid 2x2 cho subsections */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //         {section.subsection.slice(0, 4).map((subsection, index) => (
// //           <SubsectionEditor
// //             key={index}
// //             subsection={subsection}
// //             index={index}
// //             onUpdate={(updates) => updateSubsection(index, updates)}
// //             onDelete={() => removeSubsection(index)}
// //             showImage={true}
// //             canAddImage={canAddImage}
// //             sectionStyle={section.style}
// //           />
// //         ))}
        
// //         {/* Nút thêm nếu chưa đủ 4 */}
// //         {canAddSubsection && (
// //           <div className="flex items-center justify-center">
// //             <Button 
// //               type="button" 
// //               variant="outline" 
// //               onClick={addSubsection}
// //               className="h-32 w-full border-dashed"
// //             >
// //               <Plus className="h-6 w-6 mr-2" />
// //               Thêm subsection
// //             </Button>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }
// "use client"
// import { Badge } from "@/components/ui/badge"
// import { Plus, ArrowRight, Leaf, Sparkles } from "lucide-react"
// import SubsectionEditor from "../subsection-editor"
// import SectionHeader from "./section-header"
// import ImageWithMetadata from "@/components/ui/image-with-metadata"
// import type { AboutResponseDto } from "@/lib/dto/about.dto"
// import { useSectionStyle } from "../../hooks"
// import { useIconField } from "@/features/icon-picker/hooks/useIconFeild"
// import { cn } from "@/lib/utils"

// type AboutSection = AboutResponseDto["section"][0]

// interface Style2FourImageProps {
//   section: AboutSection
//   onUpdate: (section: AboutSection) => void
//   isPreview?: boolean
// }

// export default function Style2FourImage({ section, onUpdate, isPreview = false }: Style2FourImageProps) {
//   const { updateSubsection, addSubsection, removeSubsection, canAddImage, canAddSubsection } = useSectionStyle({
//     section,
//     onUpdate,
//   })

//   const icon0 = useIconField(section.subsection[0]?.icon || "Leaf")
//   const icon1 = useIconField(section.subsection[1]?.icon || "Leaf")
//   const icon2 = useIconField(section.subsection[2]?.icon || "Leaf")
//   const icon3 = useIconField(section.subsection[3]?.icon || "Leaf")
//   const icon4 = useIconField(section.subsection[4]?.icon || "Leaf")
//   const icon5 = useIconField(section.subsection[5]?.icon || "Leaf")
//   const icon6 = useIconField(section.subsection[6]?.icon || "Leaf")
//   const icon7 = useIconField(section.subsection[7]?.icon || "Leaf")
//   const icon8 = useIconField(section.subsection[8]?.icon || "Leaf")
//   const icon9 = useIconField(section.subsection[9]?.icon || "Leaf")

//   const iconComponents = [icon0, icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, icon9]

//   return (
//     <div className="relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 via-green-50/60 to-teal-50/80 dark:from-emerald-950/30 dark:via-green-950/20 dark:to-teal-950/25" />

//       {/* Organic floating shapes */}
//       <div className="absolute top-10 left-1/3 w-72 h-72 bg-gradient-to-br from-green-200/40 to-emerald-300/30 rounded-[40%_60%_70%_30%] blur-2xl animate-pulse" />
//       <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-gradient-to-tl from-teal-200/35 to-cyan-300/25 rounded-[60%_40%_30%_70%] blur-2xl animate-pulse animation-delay-2000" />
//       <div className="absolute top-1/2 left-10 w-48 h-48 bg-gradient-to-r from-lime-200/30 to-green-300/20 rounded-[50%_50%_80%_20%] blur-xl animate-pulse animation-delay-1000" />

//       {/* Subtle leaf patterns */}
//       <div className="absolute inset-0 opacity-5 dark:opacity-10">
//         <div className="absolute top-20 left-20 text-6xl text-green-600 rotate-12">🌿</div>
//         <div className="absolute top-40 right-32 text-4xl text-emerald-600 -rotate-45">🍃</div>
//         <div className="absolute bottom-32 left-1/4 text-5xl text-teal-600 rotate-45">🌱</div>
//         <div className="absolute bottom-20 right-20 text-3xl text-green-600 -rotate-12">🌿</div>
//       </div>

//       <div className="relative space-y-20 p-8 lg:p-16">
//         <div className="animate-in fade-in-0 slide-in-from-top-4 duration-700">
//           <SectionHeader
//             section={section}
//             className="text-center space-y-8 max-w-5xl mx-auto"
//             titleClassName="text-5xl md:text-7xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent leading-tight tracking-tight"
//             subtitleClassName="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto"
//           />
//           <div className="flex justify-center mt-8">
//             <div className="relative group">
//               <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
//               <div className="relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-100/90 to-emerald-100/90 dark:from-green-900/40 dark:to-emerald-900/40 rounded-full border border-green-200/60 dark:border-green-700/60 backdrop-blur-sm">
//                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
//                 <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
//                 <span className="text-base font-bold text-emerald-800 dark:text-emerald-200">
//                   Sustainable Innovation
//                 </span>
//                 <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse animation-delay-500" />
//                 <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse animation-delay-1000"></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
//           {section.subsection.slice(0, 4).map((subsection, index) => {
//             const { IconComponent } = iconComponents[index]

//             return (
//               <div
//                 key={index}
//                 className={cn(
//                   "group relative animate-in fade-in-0 slide-in-from-bottom-8",
//                   `animation-delay-${200 + index * 150}`,
//                 )}
//                 style={{ animationDelay: `${200 + index * 150}ms` }}
//               >
//                 <div className="relative h-full overflow-hidden rounded-[2.5rem] border-2 border-green-200/70 dark:border-green-700/50 bg-gradient-to-br from-white/80 to-green-50/60 dark:from-slate-800/80 dark:to-emerald-900/20 backdrop-blur-xl hover:border-emerald-400/80 hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-700 hover:-translate-y-3 hover:rotate-1">
//                   {/* Decorative corner elements */}
//                   <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-bl-[2rem] opacity-60"></div>
//                   <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-teal-200/30 to-transparent rounded-tr-[1.5rem] opacity-60"></div>

//                   <div className="relative h-80 overflow-hidden bg-gradient-to-br from-emerald-100/90 to-teal-100/70 dark:from-emerald-900/50 dark:to-teal-900/40 rounded-t-[2rem]">
//                     {subsection.image_url ? (
//                       <>
//                         <ImageWithMetadata
//                           src={subsection.image_url || "/placeholder.svg"}
//                           alt={subsection.name || "Feature image"}
//                           width={400}
//                           height={320}
//                           className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 group-hover:saturate-110"
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//                         {/* Enhanced floating orbs */}
//                         <div className="absolute top-6 left-6 w-20 h-20 bg-gradient-to-br from-white/30 to-emerald-200/40 rounded-full blur-xl opacity-70 group-hover:opacity-90 transition-all duration-500 animate-pulse"></div>
//                         <div className="absolute bottom-6 right-6 w-16 h-16 bg-gradient-to-tl from-teal-200/40 to-white/30 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-all duration-500 animate-pulse animation-delay-1000"></div>
//                       </>
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30">
//                         <button
//                           onClick={() => canAddImage && addSubsection()}
//                           className="text-center p-10 hover:bg-white/30 dark:hover:bg-emerald-900/30 rounded-[2rem] transition-all duration-500 hover:scale-110 group/btn"
//                         >
//                           <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-200 to-teal-200 dark:from-emerald-700 dark:to-teal-700 rounded-[1.5rem] flex items-center justify-center group-hover/btn:rotate-12 transition-transform duration-300 shadow-lg">
//                             <Leaf className="w-10 h-10 text-emerald-600 dark:text-emerald-300" />
//                           </div>
//                           <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">Add Nature Image</p>
//                           <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 mt-2">
//                             Showcase sustainability
//                           </p>
//                         </button>
//                       </div>
//                     )}

//                     {index === 0 && (
//                       <div className="absolute top-6 left-6">
//                         <div className="relative">
//                           <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur opacity-75 animate-pulse"></div>
//                           <Badge className="relative bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white backdrop-blur-sm shadow-xl border-0 px-5 py-2 rounded-full font-bold text-sm">
//                             ⭐ Featured
//                           </Badge>
//                         </div>
//                       </div>
//                     )}

//                     <div className="absolute bottom-6 right-6">
//                       <div className="relative group/icon">
//                         <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
//                         <div className="relative w-18 h-18 rounded-2xl bg-gradient-to-br from-white/95 via-emerald-50/95 to-teal-50/95 dark:from-slate-800/95 dark:via-emerald-900/95 dark:to-teal-900/95 backdrop-blur-sm shadow-2xl border-2 border-emerald-200/60 dark:border-emerald-700/60 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
//                           {IconComponent ? (
//                             <IconComponent className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
//                           ) : (
//                             <Leaf className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="p-8 space-y-5 bg-gradient-to-b from-transparent via-green-50/20 to-emerald-50/40 dark:via-green-900/10 dark:to-emerald-900/20">
//                     <h3 className="font-black text-2xl text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors leading-tight tracking-tight">
//                       {subsection.name || "Eco-Friendly Feature"}
//                     </h3>
//                     <p className="text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed text-base font-medium">
//                       {subsection.description ||
//                         "Discover how this sustainable feature contributes to a greener future while delivering exceptional value and environmental benefits."}
//                     </p>

//                     {subsection.ref && (
//                       <div className="pt-2">
//                         <a
//                           href={subsection.ref}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 rounded-xl border border-emerald-200/60 dark:border-emerald-700/60 text-base font-bold text-emerald-700 dark:text-emerald-300 hover:from-emerald-200 hover:to-teal-200 dark:hover:from-emerald-800/70 dark:hover:to-teal-800/70 transition-all duration-300 group/link hover:scale-105"
//                         >
//                           Explore More
//                           <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover/link:translate-x-2" />
//                         </a>
//                       </div>
//                     )}
//                   </div>

//                   {/* Edit controls - chỉ hiện trong edit mode */}
//                   {!isPreview && (
//                     <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
//                       <SubsectionEditor
//                         subsection={subsection}
//                         index={index}
//                         onUpdate={(updates) => updateSubsection(index, updates)}
//                         onDelete={() => removeSubsection(index)}
//                         showImage={true}
//                         canAddImage={canAddImage}
//                         sectionStyle={section.style}
//                         className="!p-0 !border-0 !bg-transparent"
//                         isPreview={isPreview}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )
//           })}

//           {/* Add Feature Button - chỉ hiện trong edit mode */}
//           {!isPreview && canAddSubsection && (
//             <div
//               className="animate-in fade-in-0 slide-in-from-bottom-8 animation-delay-600"
//               style={{ animationDelay: "600ms" }}
//             >
//               <button
//                 type="button"
//                 onClick={addSubsection}
//                 className="h-full min-h-[520px] w-full rounded-[2.5rem] border-3 border-dashed border-emerald-300/50 dark:border-emerald-600/40 hover:border-emerald-500/80 bg-gradient-to-br from-emerald-50/30 to-teal-50/20 dark:from-emerald-900/20 dark:to-teal-900/10 hover:from-emerald-100/60 hover:to-teal-100/40 dark:hover:from-emerald-900/40 dark:hover:to-teal-900/30 transition-all duration-700 flex flex-col items-center justify-center gap-8 group hover:scale-105 hover:-rotate-1"
//               >
//                 <div className="relative">
//                   <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-[2rem] blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
//                   <div className="relative w-24 h-24 rounded-[2rem] bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 dark:from-emerald-800 dark:via-green-800 dark:to-teal-800 group-hover:from-emerald-200 group-hover:via-green-200 group-hover:to-teal-200 dark:group-hover:from-emerald-700 dark:group-hover:via-green-700 dark:group-hover:to-teal-700 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-xl border-2 border-emerald-200/60 dark:border-emerald-700/60">
//                     <Plus className="h-12 w-12 text-emerald-600 dark:text-emerald-300 transition-colors" />
//                   </div>
//                 </div>
//                 <div className="text-center space-y-3">
//                   <p className="font-black text-xl text-emerald-700 dark:text-emerald-300 transition-colors">
//                     Add Green Feature
//                   </p>
//                   <p className="text-emerald-600/90 dark:text-emerald-400/90 font-bold text-base">
//                     Showcase sustainable innovation
//                   </p>
//                 </div>
//               </button>
//             </div>
//           )}
//         </div>

//         {section.subsection.length > 4 && (
//           <div className="mt-20 space-y-8">
//             <div className="text-center space-y-4">
//               <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
//                 More Green Features
//               </h3>
//               <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto"></div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {section.subsection.slice(4).map((subsection, index) => {
//                 const { IconComponent } = iconComponents[index + 4]

//                 return (
//                   <div key={index + 4} className="group">
//                     <div className="p-6 rounded-2xl border border-emerald-200/60 dark:border-emerald-700/40 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 hover:border-emerald-400/60 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-1">
//                       <div className="flex items-start gap-4">
//                         <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-800 dark:to-teal-800 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
//                           {IconComponent ? (
//                             <IconComponent className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
//                           ) : (
//                             <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
//                           )}
//                         </div>
//                         <div className="flex-1">
//                           <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors leading-tight">
//                             {subsection.name}
//                           </h4>
//                           <p className="text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
//                             {subsection.description}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
"use client"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowRight, Leaf, Sparkles } from "lucide-react"
import SubsectionEditor from "../subsection-editor"
import SectionHeader from "./section-header"
import Image from "next/image"
import type { AboutResponseDto } from "@/lib/dto/about.dto"
import { useSectionStyle } from "../../hooks"
import { useIconField } from "@/features/icon-picker/hooks/useIconFeild"
import { cn } from "@/lib/utils"

// Component riêng để xử lý icon
function SubsectionIcon({ iconName }: { iconName?: string }) {  
  const { IconComponent } = useIconField(iconName || "Leaf")
  return IconComponent ? <IconComponent className="w-9 h-9 text-emerald-600 dark:text-emerald-400" /> : <Leaf className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
}

function SubsectionIconSmall({ iconName }: { iconName?: string | null }) {
  const { IconComponent } = useIconField(iconName || "Leaf")
  return IconComponent ? <IconComponent className="w-6 h-6 text-emerald-600 dark:text-emerald-300" /> : <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
}

type AboutSection = AboutResponseDto["section"][0]

interface Style2FourImageProps {
  section: AboutSection
  onUpdate: (section: AboutSection) => void
  isPreview?: boolean
}

export default function Style2FourImage({ section, onUpdate, isPreview = false }: Style2FourImageProps) {
  const { updateSubsection, addSubsection, removeSubsection, canAddImage, canAddSubsection } = useSectionStyle({
    section,
    onUpdate,
  })

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 via-green-50/60 to-teal-50/80 dark:from-emerald-950/30 dark:via-green-950/20 dark:to-teal-950/25" />

      {/* Organic floating shapes */}
      <div className="absolute top-10 left-1/3 w-72 h-72 bg-gradient-to-br from-green-200/40 to-emerald-300/30 rounded-[40%_60%_70%_30%] blur-2xl animate-pulse" />
      <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-gradient-to-tl from-teal-200/35 to-cyan-300/25 rounded-[60%_40%_30%_70%] blur-2xl animate-pulse animation-delay-2000" />
      <div className="absolute top-1/2 left-10 w-48 h-48 bg-gradient-to-r from-lime-200/30 to-green-300/20 rounded-[50%_50%_80%_20%] blur-xl animate-pulse animation-delay-1000" />

      {/* Subtle leaf patterns */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-20 left-20 text-6xl text-green-600 rotate-12">🌿</div>
        <div className="absolute top-40 right-32 text-4xl text-emerald-600 -rotate-45">🍃</div>
        <div className="absolute bottom-32 left-1/4 text-5xl text-teal-600 rotate-45">🌱</div>
        <div className="absolute bottom-20 right-20 text-3xl text-green-600 -rotate-12">🌿</div>
      </div>

      <div className="relative space-y-20 p-8 lg:p-16">
        <div className="animate-in fade-in-0 slide-in-from-top-4 duration-700">
          <SectionHeader
            section={section}
            className="text-center space-y-8 max-w-5xl mx-auto"
            titleClassName="text-5xl md:text-7xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent leading-tight tracking-tight"
            subtitleClassName="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto"
          />
         
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {section.subsection.slice(0, 4).map((subsection, index) => {

            return (
              <div
                key={index}
                className={cn(
                  "group relative animate-in fade-in-0 slide-in-from-bottom-8",
                  `animation-delay-${200 + index * 150}`,
                )}
                style={{ animationDelay: `${200 + index * 150}ms` }}
              >
                <div className="relative h-full overflow-hidden rounded-[2.5rem] border-2 border-green-200/70 dark:border-green-700/50 bg-gradient-to-br from-white/80 to-green-50/60 dark:from-slate-800/80 dark:to-emerald-900/20 backdrop-blur-xl hover:border-emerald-400/80 hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-700 hover:-translate-y-3 hover:rotate-1">
                  {/* Decorative corner elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-bl-[2rem] opacity-60"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-teal-200/30 to-transparent rounded-tr-[1.5rem] opacity-60"></div>

                  <div className="relative h-80 overflow-hidden bg-gradient-to-br from-emerald-100/90 to-teal-100/70 dark:from-emerald-900/50 dark:to-teal-900/40 rounded-t-[2rem]">
                    {subsection.image_url ? (
                      <>
                        <Image
                          src={subsection.image_url || "/placeholder.svg"}
                          alt={subsection.name || "Feature image"}
                          width={400}
                          height={320}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 group-hover:saturate-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Enhanced floating orbs */}
                        <div className="absolute top-6 left-6 w-20 h-20 bg-gradient-to-br from-white/30 to-emerald-200/40 rounded-full blur-xl opacity-70 group-hover:opacity-90 transition-all duration-500 animate-pulse"></div>
                        <div className="absolute bottom-6 right-6 w-16 h-16 bg-gradient-to-tl from-teal-200/40 to-white/30 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-all duration-500 animate-pulse animation-delay-1000"></div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30">
                        <button
                          onClick={() => canAddImage && addSubsection()}
                          className="text-center p-10 hover:bg-white/30 dark:hover:bg-emerald-900/30 rounded-[2rem] transition-all duration-500 hover:scale-110 group/btn"
                        >
                          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-200 to-teal-200 dark:from-emerald-700 dark:to-teal-700 rounded-[1.5rem] flex items-center justify-center group-hover/btn:rotate-12 transition-transform duration-300 shadow-lg">
                            <Leaf className="w-10 h-10 text-emerald-600 dark:text-emerald-300" />
                          </div>
                          <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">Add Nature Image</p>
                          <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 mt-2">
                            Showcase sustainability
                          </p>
                        </button>
                      </div>
                    )}

                    <div className="absolute bottom-6 right-6">
                      <div className="relative group/icon">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        <div className="relative w-18 h-18 rounded-2xl bg-gradient-to-br from-white/95 via-emerald-50/95 to-teal-50/95 dark:from-slate-800/95 dark:via-emerald-900/95 dark:to-teal-900/95 backdrop-blur-sm shadow-2xl border-2 border-emerald-200/60 dark:border-emerald-700/60 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                          <SubsectionIcon iconName={subsection.icon || undefined} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-5 bg-gradient-to-b from-transparent via-green-50/20 to-emerald-50/40 dark:via-green-900/10 dark:to-emerald-900/20">
                    <h3 className="font-black text-2xl text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors leading-tight tracking-tight">
                      {subsection.name || "Eco-Friendly Feature"}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed text-base font-medium">
                      {subsection.description ||
                        "Discover how this sustainable feature contributes to a greener future while delivering exceptional value and environmental benefits."}
                    </p>

                    {subsection.ref && (
                      <div className="pt-2">
                        <a
                          href={subsection.ref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 rounded-xl border border-emerald-200/60 dark:border-emerald-700/60 text-base font-bold text-emerald-700 dark:text-emerald-300 hover:from-emerald-200 hover:to-teal-200 dark:hover:from-emerald-800/70 dark:hover:to-teal-800/70 transition-all duration-300 group/link hover:scale-105"
                        >
                          Explore More
                          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover/link:translate-x-2" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Edit controls - ẩn trong preview mode để tránh gọi hook context */}
                  {!isPreview && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <SubsectionEditor
                        subsection={subsection}
                        index={index}
                        onUpdate={(updates) => updateSubsection(index, updates)}
                        onDelete={() => removeSubsection(index)}
                        showImage={true}
                        canAddImage={canAddImage}
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

          {!isPreview && canAddSubsection && (
            <div
              className="animate-in fade-in-0 slide-in-from-bottom-8 animation-delay-600"
              style={{ animationDelay: "600ms" }}
            >
              <button
                type="button"
                onClick={addSubsection}
                className="h-full min-h-[520px] w-full rounded-[2.5rem] border-3 border-dashed border-emerald-300/50 dark:border-emerald-600/40 hover:border-emerald-500/80 bg-gradient-to-br from-emerald-50/30 to-teal-50/20 dark:from-emerald-900/20 dark:to-teal-900/10 hover:from-emerald-100/60 hover:to-teal-100/40 dark:hover:from-emerald-900/40 dark:hover:to-teal-900/30 transition-all duration-700 flex flex-col items-center justify-center gap-8 group hover:scale-105 hover:-rotate-1"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-[2rem] blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-24 h-24 rounded-[2rem] bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 dark:from-emerald-800 dark:via-green-800 dark:to-teal-800 group-hover:from-emerald-200 group-hover:via-green-200 group-hover:to-teal-200 dark:group-hover:from-emerald-700 dark:group-hover:via-green-700 dark:group-hover:to-teal-700 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-xl border-2 border-emerald-200/60 dark:border-emerald-700/60">
                    <Plus className="h-12 w-12 text-emerald-600 dark:text-emerald-300 transition-colors" />
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <p className="font-black text-xl text-emerald-700 dark:text-emerald-300 transition-colors">
                    Add Green Feature
                  </p>
                  <p className="text-emerald-600/90 dark:text-emerald-400/90 font-bold text-base">
                    Showcase sustainable innovation
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>

        {section.subsection.length > 4 && (
          <div className="mt-20 space-y-8">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                More Green Features
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.subsection.slice(4).map((subsection, index) => {

                return (
                  <div key={index + 4} className="group">
                    <div className="p-6 rounded-2xl border border-emerald-200/60 dark:border-emerald-700/40 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 hover:border-emerald-400/60 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-800 dark:to-teal-800 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                          <SubsectionIconSmall iconName={subsection.icon || undefined} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors leading-tight">
                            {subsection.name}
                          </h4>
                          <p className="text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                            {subsection.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"
import { useCallback } from "react"
import { toast } from "sonner"
import { AboutResponseDto, SubsectionDto } from "@/lib/dto/about.dto"
import { EStyleSection } from "@/lib/enums/style-section.enum"

type AboutSection = AboutResponseDto['section'][0]

interface UseSectionStyleProps {
  section: AboutSection
  onUpdate: (section: AboutSection) => void
}

export function useSectionStyle({ section, onUpdate }: UseSectionStyleProps) {
  // Update section với partial updates
  const updateSection = useCallback((updates: Partial<AboutSection>) => {
    onUpdate({ ...section, ...updates })
  }, [section, onUpdate])

  // Update subsection tại index cụ thể
  const updateSubsection = useCallback((index: number, updates: Partial<SubsectionDto[0]>) => {
    const newSubsections = [...section.subsection]
    if (newSubsections[index]) {
      newSubsections[index] = { ...newSubsections[index], ...updates }
      updateSection({ subsection: newSubsections })
    }
  }, [section.subsection, updateSection])

  // Thêm subsection mới
  const addSubsection = useCallback(() => {
    const newSubsection: SubsectionDto[0] = {
      name: "",
      description: "",
      ref: null,
      icon: null,
      image_url: null,
    }
    updateSection({ subsection: [...section.subsection, newSubsection] })
    toast.success("Đã thêm subsection!")
  }, [section.subsection, updateSection])

  // Xóa subsection tại index
  const removeSubsection = useCallback((index: number) => {
    const newSubsections = section.subsection.filter((_, i) => i !== index)
    updateSection({ subsection: newSubsections })
    toast.success("Đã xóa subsection!")
  }, [section.subsection, updateSection])

  // Kiểm tra có thể thêm ảnh không
  const canAddImage = useCallback(() => {
    switch (section.style) {
      case EStyleSection.NOIMAGE:
        return false
      case EStyleSection.ONEIMAGE:
        // Style 1: chỉ có 1 ảnh ở section level
        return !section.image_url
      case EStyleSection.FOURIMAGE:
        // Style 2: tối đa 4 ảnh ở subsection level
        const currentImages = section.subsection.filter((sub) => sub.image_url).length
        return currentImages < 4
      default:
        return false
    }
  }, [section.style, section.image_url, section.subsection])

  // Kiểm tra có hiển thị ảnh ở subsection không
  const shouldShowImageInSubsection = useCallback(() => {
    return section.style === EStyleSection.FOURIMAGE
  }, [section.style])

  // Lấy số lượng ảnh tối đa cho style hiện tại
  const getMaxImages = useCallback(() => {
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
  }, [section.style])

  // Kiểm tra có thể thêm subsection không
  const canAddSubsection = useCallback(() => {
    if (section.style === EStyleSection.FOURIMAGE) {
      return section.subsection.length < 4
    }
    return true
  }, [section.style, section.subsection.length])

  return {
    // State
    section,
    
    // Actions
    updateSection,
    updateSubsection,
    addSubsection,
    removeSubsection,
    
    // Computed values
    canAddImage: canAddImage(),
    shouldShowImageInSubsection: shouldShowImageInSubsection(),
    maxImages: getMaxImages(),
    canAddSubsection: canAddSubsection(),
    
    // Style specific helpers
    isStyle0: section.style === EStyleSection.NOIMAGE,
    isStyle1: section.style === EStyleSection.ONEIMAGE,
    isStyle2: section.style === EStyleSection.FOURIMAGE,
  }
}

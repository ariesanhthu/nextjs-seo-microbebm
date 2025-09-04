"use client"
import React, { useState, useEffect } from "react"
import { LucideIcon } from "lucide-react"

// Component wrapper để sử dụng useIconField hook
interface DynamicIconProps {
  iconName?: string
  fallbackIcon?: LucideIcon
  className?: string
}

export function DynamicIcon({ iconName, fallbackIcon: FallbackIcon, className }: DynamicIconProps) {
  const [IconComponent, setIconComponent] = useState<React.ComponentType<any> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadIcon = async () => {
      try {
        const module = await import("@/features/icon-picker/hooks/useIconFeild")
        if (mounted) {
          const { useIconField } = module
          // Tạo component để sử dụng hook
          const IconWrapper: React.FC<{ className?: string }> = ({ className }) => {
            const { IconComponent: DynamicIconComponent } = useIconField(iconName)
            return DynamicIconComponent ? <DynamicIconComponent className={className} /> : null
          }
          setIconComponent(() => IconWrapper)
        setIsLoading(false)
        }
      } catch (error) {
        console.error("Failed to load icon:", error)
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    if (iconName) {
      loadIcon()
    } else {
      setIsLoading(false)
    }

    return () => {
      mounted = false
    }
  }, [iconName])

  if (isLoading) {
    return <div className={`animate-pulse bg-muted rounded ${className}`} />
  }

  if (IconComponent) {
    return <IconComponent className={className} />
  }

  if (FallbackIcon) {
    return <FallbackIcon className={className} />
  }

  return null
}

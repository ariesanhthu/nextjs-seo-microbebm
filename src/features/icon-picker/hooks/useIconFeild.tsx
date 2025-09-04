"use client"

import { useState, useEffect } from "react"
import { Icon } from "@/components/ui/icon-picker"
import dynamicIconImports from "lucide-react/dynamicIconImports"

type IconName = keyof typeof dynamicIconImports

export function useIconField(initialValue?: string) {
  const [iconName, setIconName] = useState<IconName | undefined>(initialValue as IconName)

  // Update iconName khi initialValue thay đổi
  useEffect(() => {
    setIconName(initialValue as IconName)
  }, [initialValue])

  // Component đã chọn (để render ở view-only)
  const IconComponent = iconName ? ({ className, ...props }: any) => (
    <Icon name={iconName} className={className} {...props} />
  ) : null

  return {
    iconName,          // IconName type cho IconPicker
    setIconName,       // setter (dùng cho IconPicker)
    IconComponent,     // dùng để render icon
  }
}

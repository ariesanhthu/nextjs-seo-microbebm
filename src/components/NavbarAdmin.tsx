"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface NavbarAdminProps {
  name: string
  description?: string
  buttonNavigation?: ReactNode
  buttonTool?: ReactNode
  showBackButton?: boolean
  onBack?: () => void
}

export default function NavbarAdmin({
  name,
  description,
  buttonNavigation,
  buttonTool,
  showBackButton = false,
  onBack
}: NavbarAdminProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200 py-5 -mx-6 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            {description && (
              <p className="text-sm text-foreground mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {buttonNavigation && buttonNavigation}
          {buttonTool && buttonTool}
        </div>
      </div>
    </div>
  )
}

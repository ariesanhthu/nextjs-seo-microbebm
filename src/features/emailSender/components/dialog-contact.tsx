"use client"

import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

// Dynamic import ContactDialog để tối ưu performance
const ContactDialog = dynamic(() => import("./contact-dialog"), {
  loading: () => (
    <Button size="lg" variant="outline" disabled>
      <Mail className="mr-2 h-4 w-4" />
      Đang tải...
    </Button>
  ),
  ssr: false
})

interface DialogContactProps {
  children?: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function DialogContact({ 
  children, 
  className,
  variant = "outline",
  size = "lg"
}: DialogContactProps) {
  return (
    <ContactDialog className={className} variant={variant} size={size}>
      {children}
    </ContactDialog>
  )
}

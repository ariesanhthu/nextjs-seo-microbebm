"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import ContactForm from "./contactForm"

interface ContactDialogProps {
  children?: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function ContactDialog({ 
  children, 
  className,
  variant = "outline",
  size = "lg"
}: ContactDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button 
            className={`sticky top-0 z-10 ${className || ''}`} 
            size={size} 
            variant={variant}
          >
            <Mail className="mr-2 h-4 w-4" />
            Liên hệ
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ContactForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}

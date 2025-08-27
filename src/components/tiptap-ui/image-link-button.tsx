"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EditorContext } from "@tiptap/react"
import { ImageIcon, Link, X } from "lucide-react"
import { toast } from "sonner"
import { useImageGallery } from "@/features/image-storage/context/image-gallery-context"
import { ImageMetadataResponseDto } from "@/lib/dto/image-metadata.dto"

interface ImageLinkButtonProps {
  text?: string
}

export function ImageLinkButton({ text = "Image" }: ImageLinkButtonProps) {
  const { editor } = React.useContext(EditorContext)

  const imageGallery = useImageGallery();

  const handleOpenImageGallery = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    imageGallery.openDialog((image: ImageMetadataResponseDto) => {
      if (!editor) {
        toast.error("Editor not available")
        return
      }

      // Insert image into editor directly
      editor.chain().focus().setImage({
        src: image.url,
        alt: image.public_id || "Image",
        title: image.public_id || undefined
      }).run()

      toast.success("Image added successfully!")
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="gap-1 min-w-0"
      disabled={!editor}
      onClick={handleOpenImageGallery}
    >
      <ImageIcon className="h-4 w-4" />
      {text}
    </Button>
  )
}

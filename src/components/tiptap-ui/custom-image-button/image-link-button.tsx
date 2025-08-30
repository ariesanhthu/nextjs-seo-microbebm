"use client"

import * as React from "react"
import { Button } from "../../tiptap-ui-primitive/button"
import { EditorContext } from "@tiptap/react"
import { ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { useImageGallery } from "@/features/image-storage/context/image-gallery-context"
import { ImageMetadataResponseDto } from "@/lib/dto/image-metadata.dto"

interface ImageLinkButtonProps {
  text?: string
}

export function ImageLinkButton({ text = "Image" }: ImageLinkButtonProps) {
  const { editor } = React.useContext(EditorContext)

  const imageGallery = useImageGallery();

  const handleOpenImageGallery = React.useCallback((e: React.MouseEvent) => {
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
  }, [editor, imageGallery])

  return (
    <Button
      type="button"
      data-style="ghost"
      tabIndex={-1}
      disabled={!editor}
      onClick={handleOpenImageGallery}
    >
      <ImageIcon className="tiptap-button-icon" />
      {text && <span className="tiptap-button-text">{text}</span>}
    </Button>
  )
}

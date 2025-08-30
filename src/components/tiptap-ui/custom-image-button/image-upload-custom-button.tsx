"use client"

import * as React from "react"
import { Button } from "@/components/tiptap-ui-primitive/button"
import { EditorContext } from "@tiptap/react"
import { Upload } from "lucide-react"
import { toast } from "sonner"
import { ImageMetadataResponseDto } from "@/lib/dto/image-metadata.dto"
import { CldUploadWidget } from "next-cloudinary"
import { useRef, useEffect } from "react"

interface ImageUploadButtonProps {
  text?: string
}


interface UploadResult {
  public_id: string;
  secure_url: string;
  bytes: number;
  width: number;
  height: number;
  format: string;
}

export function ImageUploadCustomButton({ text = "Image" }: ImageUploadButtonProps) {
  const { editor } = React.useContext(EditorContext)
  const editorRef = useRef(editor); // Keep a stable reference

  // Update editor ref when editor changes
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  const handleInsertImage = React.useCallback((imageMetadata: ImageMetadataResponseDto) => {
    const currentEditor = editorRef.current;
    
    if (!currentEditor) {
      toast.error("Editor not available")
      return
    }

    setTimeout(() => {
      if (currentEditor.isDestroyed) {
        toast.error("Editor has been destroyed")
        return
      }

      // Insert image into editor directly
      currentEditor.chain().focus().setImage({
        src: imageMetadata.url,
        alt: imageMetadata.public_id || "Image",
        title: imageMetadata.public_id || undefined
      }).run()

      toast.success("Image added successfully!")
    }, 100)
  }, [])


  const createImageMetadata = React.useCallback(async (result: UploadResult) => {
    try {
      const res = await fetch("/api/image-metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_id: result.public_id,
          url: result.secure_url,
          height: result.height,
          width: result.width
        })
      });
      const data = await res.json();
      if (data.success === false) {
        throw new Error(`Create metadata for image failed: ${data.message}\n${data?.validationErrors}`);
      }

      handleInsertImage(data.data);
    } catch (error: any) {
      toast.error("Failed to create image metadata");
    }
  }, [handleInsertImage]); // Only depend on handleInsertImage

  const handleUploadSuccess = React.useCallback(async (result: any) => {
    await createImageMetadata(result.info as UploadResult);
  }, [createImageMetadata]);

  return (
    <CldUploadWidget 
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onSuccess={handleUploadSuccess}
    >
      {({ open }) => (
        <Button 
          type="button"
          data-style="ghost"
          tabIndex={-1}
          disabled={!editor}
          onClick={async () => {
            open()
          }}
        >
          <Upload className="tiptap-button-icon" />
        </Button>
      )}
    </CldUploadWidget>
  )
}

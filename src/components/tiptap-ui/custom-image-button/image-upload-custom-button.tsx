"use client"

import * as React from "react"
import { Button } from "@/components/tiptap-ui-primitive/button"
import { EditorContext } from "@tiptap/react"
import { Upload } from "lucide-react"
import { toast } from "sonner"
import { ImageMetadataResponseDto } from "@/lib/dto/image-metadata.dto"
import { CldUploadWidget } from "next-cloudinary"
import { useRef } from "react"

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
  const imageMetadata = useRef<ImageMetadataResponseDto | null>(null);

  const handleInsertImage = React.useCallback((imageMetadata: ImageMetadataResponseDto) => {
    if (!editor) {
      toast.error("Editor not available")
      return
    }

    // Insert image into editor directly
    editor.chain().focus().setImage({
      src: imageMetadata.url,
      alt: imageMetadata.public_id || "Image",
      title: imageMetadata.public_id || undefined
    }).run()

    toast.success("Image added successfully!")
  }, [editor])


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
      imageMetadata.current = data;
      toast.success("Create imagemetadata successfully!")
    } catch (error: any) {
      console.log(error.message);
    }
  }, []);

  const handleUploadSuccess = React.useCallback(async (result: any) => {
    await createImageMetadata(result.info as UploadResult);
  }, [createImageMetadata, handleInsertImage, editor]);

  const handleUploadStart = () => {
  };

  return (
    <CldUploadWidget 
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onSuccess={handleUploadSuccess}
      onOpen={handleUploadStart}
      onClose={() => {
        if (imageMetadata.current) {
          handleInsertImage(imageMetadata.current);
        }
      }}
    >
      {({ open }) => (
        <Button 
          type="button"
          data-style="ghost"
          tabIndex={-1}
          disabled={!editor}
          onClick={() => {open()}}
        >
          <Upload className="tiptap-button-icon" />
        </Button>
      )}
    </CldUploadWidget>
  )
}

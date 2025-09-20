"use client";

import { useState } from 'react';
import { CldUploadWidget, CldImage } from 'next-cloudinary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

      // "id",
      // "batchId",
      // "asset_id",
      // "version",
      // "version_id",
      // "signature",
      // "format",
      // "resource_type",
      // "created_at",
      // "tags",
      // "bytes",
      // "type",
      // "etag",
      // "placeholder",
      // "secure_url",
      // "asset_folder",
      // "display_name",
      // "original_filename",
      // "path",
      // "thumbnail_url"
interface UploadResult {
  public_id: string;
  secure_url: string;
  bytes: number;
  width: number;
  height: number;
  format: string;
}

interface ImageUploaderProps {
  refreshGallery?: () => void;
  onImageSelect?: (url: string) => void;
}

export default function ImageUploader({ refreshGallery, onImageSelect }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const createImageMetadata = async (result: UploadResult) => {
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

    } catch (error: any) {
      console.log(error.message);
    }
  } 

  const handleUploadSuccess = async (result: any) => {
    await createImageMetadata(result.info as UploadResult);
    toast.success("Ảnh được tải lên thành công!");
    refreshGallery?.();
    onImageSelect?.(result.info.secure_url);
    setIsUploading(false);
  };

  const handleUploadStart = () => {
    setIsUploading(true);
  };

  return (
    <div className="flex gap-4">
      <CldUploadWidget 
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={handleUploadSuccess}
        onOpen={handleUploadStart}
      >
        {({ open }) => (
          <Button 
            onClick={() => open()} 
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
}


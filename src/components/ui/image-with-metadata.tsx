"use client";

import { useState, useEffect } from 'react';
import { CldImage } from 'next-cloudinary';
import { ImageIcon } from 'lucide-react';
import { ImageMetadataResponseDto } from '@/lib/dto/image-metadata.dto';

interface ImageWithMetadataProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
}

export default function ImageWithMetadata({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  fallbackSrc = "/images/no-image.jpg"
}: ImageWithMetadataProps) {
  const [publicId, setPublicId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImageMetadata = async () => {
      if (!src) {
        setPublicId(null);
        return;
      }

      // Nếu src đã là URL thực sự (bắt đầu bằng http hoặc /), không thể dùng CldImage
      if (src.startsWith('http') || src.startsWith('/')) {
        console.warn('ImageWithMetadata: Using external URL with CldImage is not supported. Use regular Image component instead.');
        setPublicId(null);
      return;
      }

      // Nếu src là public_id, sử dụng trực tiếp
      setPublicId(src);
    };

    fetchImageMetadata();
  }, [src]);

  if (loading) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
        style={!fill ? { width, height } : {}}
      >
        <span className="text-gray-500 text-sm">Loading...</span>
      </div>
    );
  }

  if (!publicId || error) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={!fill ? { width, height } : {}}
      >
        <ImageIcon className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  return (
    <CldImage
      src={publicId}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      priority={priority}
      onError={() => setError(true)}
    />
  );
}

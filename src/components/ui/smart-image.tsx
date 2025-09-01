"use client";

import Image from 'next/image';

interface SmartImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}

export default function SmartImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false
}: SmartImageProps) {
  // Nếu không có src, hiển thị placeholder
  if (!src) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={!fill ? { width, height } : {}}
      >
        <span className="text-gray-500 text-sm">No Image</span>
      </div>
    );
  }

  // Sử dụng Image thông thường cho tất cả images
  return (
    <Image
      src={src.startsWith('/') ? src : src.startsWith('http') ? src : `/${src}`}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      priority={priority}
    />
  );
}

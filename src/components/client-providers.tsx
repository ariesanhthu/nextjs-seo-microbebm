"use client";

import { useEffect, useRef } from "react";
import { AlertDialogProvider } from "@/features/alert-dialog/context/alert-dialog-context";
import { ImageGalleryProvider } from "@/features/image-storage/context/image-gallery-context";
import { BlogGalleryProvider } from "@/features/blog/context/blog-gallery-context";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ImageGalleryProvider key="stable-image-gallery">
      <BlogGalleryProvider key="stable-blog-gallery">
        <AlertDialogProvider key="stable-alert-dialog">
          {children}
        </AlertDialogProvider>
      </BlogGalleryProvider>
    </ImageGalleryProvider>
  );
}

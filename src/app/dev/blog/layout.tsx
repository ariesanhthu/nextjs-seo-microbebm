"use client";

import { AlertDialogProvider } from "@/features/alert-dialog/context/alert-dialog-context";
import { ImageGalleryProvider } from "@/features/image-storage/context/image-gallery-context";
import { BlogGalleryProvider } from "@/features/blog/context/blog-gallery-context";

export default function DevLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

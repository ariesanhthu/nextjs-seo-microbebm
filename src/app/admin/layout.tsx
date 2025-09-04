"use client"

import type React from "react"
import AdminSidebar from "@/components/SideBar"
import { BlogGalleryProvider } from "@/features/blog/context/blog-gallery-context";
import { ImageGalleryProvider } from "@/features/image-storage/context/image-gallery-context";
import { Toaster } from "@/components/ui/toaster"; 
import { TagGalleryProvider } from "@/features/tag/context/tag-galerry-context";
import { ProductGalleryProvider } from "@/features/product/context/product-gallery-context";
import { AlertDialogProvider } from "@/features/alert-dialog/context/alert-dialog-context";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const { collapsed } = useSidebar()
  
  return (
    <div className="min-h-screen px-10 bg-background">
      <AdminSidebar />
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        collapsed ? "lg:pl-20" : "lg:pl-64"
      )}>
        <main className="pt-16 lg:pt-8">{children}</main>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <ImageGalleryProvider>
        <BlogGalleryProvider>
          <ProductGalleryProvider>
            <TagGalleryProvider>
              <AlertDialogProvider>
                <AdminLayoutContent>{children}</AdminLayoutContent>
                <Toaster />
              </AlertDialogProvider>
          </TagGalleryProvider>
        </ProductGalleryProvider>
      </BlogGalleryProvider>
    </ImageGalleryProvider>
    </SidebarProvider>
  )
}

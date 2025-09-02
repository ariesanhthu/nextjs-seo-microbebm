import type React from "react"
import AdminSidebar from "@/components/SideBar"
import { BlogGalleryProvider } from "@/features/blog/context/blog-gallery-context";
import { ImageGalleryProvider } from "@/features/image-storage/context/image-gallery-context";
import { Toaster } from "@/components/ui/toaster"; 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ImageGalleryProvider>
      <BlogGalleryProvider>
          <div className="min-h-screen bg-gray-50 px-10">
            <AdminSidebar />
            <div className="lg:pl-64">
              <main className="pt-16 lg:pt-8">{children}</main>
            </div>
          </div>
          <Toaster />
      </BlogGalleryProvider>
    </ImageGalleryProvider>
  )
}

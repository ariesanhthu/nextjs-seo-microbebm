"use client"

import ImageGallery from "@/features/image-storage/components/image-gallery"
import NavbarAdmin from "@/components/NavbarAdmin"

export default function AdminImageStoragePage() {
  return (
    <div className="space-y-6">
      <NavbarAdmin 
        name="Quản lý hình ảnh"
        description="Tải lên, quản lý và tổ chức hình ảnh cho website"
      />
      <ImageGallery/>
    </div>
  )
}



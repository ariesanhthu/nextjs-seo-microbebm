import type React from "react"
import AdminSidebar from "@/components/SideBar"
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-64">
        <main className="p-4 pt-16 lg:p-8 lg:pt-8">{children}</main>
      </div>
    </div>
  )
}

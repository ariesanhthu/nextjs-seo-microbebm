"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, FileText, Settings, MessageSquare, Bell, LogOut, ChevronLeft, ChevronRight, Leaf, Image } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useSidebar } from "@/contexts/SidebarContext"

type SidebarItem = {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: { title: string; href: string }[]
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  // Check if we're on mobile on initial render
  useEffect(() => {
    const checkMobile = () => {
      setCollapsed(window.innerWidth < 1024)
      setMobileOpen(false)
    }
    
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [setCollapsed, setMobileOpen])

  const sidebarItems: SidebarItem[] = [
    {
      title: "Tổng quan",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
      submenu: [
        { title: "Trang chủ", href: "/admin/homepage"},
        { title: "Giới thiệu", href: "/admin/about"},
        { title: "Đơn hàng", href: "/admin/orders" },
      ],
    },
    {
      title: "Sản phẩm",
      href: "/admin/product",
      icon: <Package className="h-5 w-5" />,
      submenu: [
        // { title: "Tất cả sản phẩm", href: "/admin/product" },
        { title: "Thêm sản phẩm", href: "/admin/product/new" },
        { title: "Danh mục", href: "/admin/product/categories" },
      ],
    },
    {
      title: "Bài viết",
      href: "/admin/blog",
      icon: <FileText className="h-5 w-5" />,
      submenu: [
        // { title: "Tất cả bài viết", href: "/admin/blog" },
        { title: "Thêm bài viết", href: "/admin/blog/new" },
        { title: "Thẻ", href: "/admin/blog/tag"},
      ],
    },
    {
      title: "Khách hàng liên hệ",
      href: "/admin/contact",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Kho ảnh",
      href: "/admin/image-storage",
      icon: <Image className="h-5 w-5" />,
    },
    // {
    //   title: "Đơn hàng",
    //   href: "/admin/orders",
    //   icon: <ShoppingCart className="h-5 w-5" />,
    // },
    // {
    //   title: "Thống kê",
    //   href: "/admin/analytics",
    //   icon: <BarChart3 className="h-5 w-5" />,
    // },
   
    // {
    //   title: "Dự án",
    //   href: "/admin/project",
    //   icon: <Package className="h-5 w-5" />,
    // },
    // {
    //   title: "Tin nhắn",
    //   href: "/admin/messages",
    //   icon: <MessageSquare className="h-5 w-5" />,
    // },
    // {
    //   title: "Cài đặt",
    //   href: "/admin/settings",
    //   icon: <Settings className="h-5 w-5" />,
    // },
  ]

  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null)
    } else {
      setOpenSubmenu(title)
    }
  }

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  const hasActiveChild = (item: SidebarItem) => {
    return item.submenu?.some((subitem) => isActive(subitem.href)) ?? false
  }

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="z-90 fixed left-4 top-4 flex h-10 w-10 items-center justify-center rounded-md bg-green-600 text-white shadow-md lg:hidden"
        aria-label="Open sidebar"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-100 flex w-64 flex-col bg-white shadow-xl transition-all duration-300 ease-in-out",
          collapsed && !mobileOpen ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href="/" className="hover:text-green-400 flex items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white">
                <Leaf className="h-5 w-5" />
                </div>
                {(!collapsed || mobileOpen) && <span className="ml-2 text-lg font-bold text-green-600">Trang quản lý</span>}
            </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden rounded-md p-1.5 text-gray-500 hover:bg-gray-100 lg:block"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.title}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={cn(
                        "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        (pathname === item.href || hasActiveChild(item))
                          ? "bg-green-50 text-green-600"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                      )}
                    >
                      <span className="flex items-center">
                        {item.icon}
                        {(!collapsed || mobileOpen) && (
                          <Link
                            href={item.href}
                            className="ml-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item.title}
                          </Link>
                        )}
                      </span>
                      {(!collapsed || mobileOpen) && (
                        <ChevronRight
                          className={cn(
                            "ml-auto h-4 w-4 transition-transform",
                            (openSubmenu === item.title || hasActiveChild(item)) && "rotate-90",
                          )}
                        />
                      )}
                    </button>
                    {(openSubmenu === item.title || hasActiveChild(item)) && (!collapsed || mobileOpen) && (
                      <ul className="mt-1 space-y-1 pl-10">
                        {item.submenu?.map((subitem) => (
                          <li key={subitem.title}>
                            <Link
                              href={subitem.href}
                              className={cn(
                                "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive(subitem.href)
                                  ? "bg-green-50 text-green-600"
                                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                              )}
                            >
                              {subitem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-green-50 text-green-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    {item.icon}
                    {(!collapsed || mobileOpen) && <span className="ml-3">{item.title}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        {/* <div className="border-t p-4">
          <div className="flex items-center justify-between">
            {(!collapsed || mobileOpen) && (
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@ecogreen.vn</p>
                </div>
              </div>
            )}
          </div>
        </div> */}
      </aside>
    </>
  )
}

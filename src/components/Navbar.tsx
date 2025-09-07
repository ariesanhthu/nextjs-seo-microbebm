"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from 'lucide-react'
import { cn } from "@/lib/utils"

import { SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import axios from "axios";

import {
    LayoutDashboard
  } from "lucide-react";

type NavItem = { title: string; url: string }

export default function Navbar({ nav = [] as NavItem[] }: { nav?: NavItem[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { isSignedIn } = useUser();
  
  useEffect(() => {
    const fetchRole = async () => {
      // Chỉ gọi API khi user đã đăng nhập
      if (!isSignedIn) {
        setIsAdmin(false);
        return;
      }
      try {
        const res = await axios.get("/api/check-role");
        setIsAdmin(res.data.isAdmin);
      } catch (error) {
        console.error("Error fetching role:", error);
        setIsAdmin(false);
      }
    };

    fetchRole();
  }, [isSignedIn]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className={cn(
          "flex h-16 items-center justify-between rounded-full px-6 transition-all duration-300",
          "bg-white/20 backdrop-blur-lg border border-white/20 shadow-md shadow-green-400/20"
        )}>
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-green-600 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-white"
                >
                  <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
                  <path d="M16.5 9.4 7.55 4.24" />
                  <polyline points="3.29 7 12 12 20.71 7" />
                  <line x1="12" y1="22" x2="12" y2="12" />
                  <circle cx="18.5" cy="15.5" r="2.5" />
                  <path d="M20.27 17.27 22 19" />
                </svg>
              </div>
              <span className="text-xl font-bold text-primary">Môi trường</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {nav.map((item) => (
              <Link
                key={`${item.title}-${item.url}`}
                href={item.url || "#"}
                className={cn(
                     "relative px-4 py-2 text-base font-bold transition-all duration-300 rounded-full",
                     "text-primary hover:text-green-900 hover:bg-green-50/50",
                     "after:absolute after:bottom-1 after:left-1/2 after:h-[2px] after:w-0 after:bg-green-900 after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-6"
                   )}
              >
                {item.title}
              </Link>
            ))}
{/*             
            <div className="relative">
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                                 className={cn(
                   "flex items-center px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full",
                   isScrolled ? "text-white hover:text-green-400 hover:bg-white/20" : "text-green-800 hover:text-green-600 hover:bg-green-50/50"
                 )}
              >
                Sản phẩm
                <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform duration-200", isProductsOpen && "rotate-180")} />
              </button>
              {isProductsOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-md py-3 shadow-xl border border-gray-200/50">
                  <Link
                    href="/products/organic"
                    className="block px-5 py-3 text-sm text-green-800 hover:bg-green-50/70 hover:text-green-600 transition-colors duration-200"
                    onClick={() => setIsProductsOpen(false)}
                  >
                    Sản phẩm hữu cơ
                  </Link>
                  <Link
                    href="/products/recycled"
                    className="block px-5 py-3 text-sm text-green-800 hover:bg-green-50/70 hover:text-green-600 transition-colors duration-200"
                    onClick={() => setIsProductsOpen(false)}
                  >
                    Sản phẩm tái chế
                  </Link>
                  <Link
                    href="/products/water-saving"
                    className="block px-5 py-3 text-sm text-green-800 hover:bg-green-50/70 hover:text-green-600 transition-colors duration-200"
                    onClick={() => setIsProductsOpen(false)}
                  >
                    Sản phẩm tiết kiệm nước
                  </Link>
                </div>
              )}
            </div> */}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden items-center space-x-3 lg:flex">
            <Link
              href="/contact"
              className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25 transform hover:scale-105"
            >
              Liên hệ ngay
            </Link>
            {!isSignedIn ? (
                <SignUpButton signInFallbackRedirectUrl="/" fallbackRedirectUrl="/">
                  <div className="rounded-full bg-gradient-to-r from-green-600 to-green-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:from-green-700 hover:to-green-600 hover:shadow-lg hover:shadow-green-600/25 transform hover:scale-105">
                      Đăng nhập
                  </div>
                </SignUpButton>
            ) : (
              <div className="flex items-center">
                <UserButton afterSignOutUrl="/">
                  {isAdmin && (
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="Quản lý trang"
                        labelIcon={<LayoutDashboard fill="#059669" size={15} stroke="0"/>}
                        href="/admin"
                      />
                    </UserButton.MenuItems>
                  )}
                </UserButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn("lg:hidden transition-colors duration-200", "text-primary hover:text-green-800")}
            aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 z-40">
          <div className="container mx-auto px-4">
            <div className="mt-4 rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-xl overflow-hidden">
              <nav className="flex flex-col py-4">
                {nav.map((item) => (
                  <Link
                    key={`${item.title}-${item.url}`}
                    href={item.url || "#"}
                    className="px-6 py-3 text-green-800 hover:bg-green-50/70 hover:text-green-600 transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
                
                <div className="border-t border-gray-200/50 mt-2 pt-2">
                  <button
                    onClick={() => setIsProductsOpen(!isProductsOpen)}
                    className="flex w-full items-center justify-between px-6 py-3 text-green-800 hover:bg-green-50/70 hover:text-green-600 transition-colors duration-200 font-medium"
                  >
                    <span>Sản phẩm</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isProductsOpen && "rotate-180")} />
                  </button>
                  {isProductsOpen && (
                    <div className="bg-green-50/30 border-t border-green-100">
                      <Link
                        href="/products/organic"
                        className="block px-8 py-3 text-green-700 hover:bg-green-50/70 hover:text-green-600 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sản phẩm hữu cơ
                      </Link>
                      <Link
                        href="/products/recycled"
                        className="block px-8 py-3 text-green-700 hover:bg-green-50/70 hover:text-green-600 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sản phẩm tái chế
                      </Link>
                      <Link
                        href="/products/water-saving"
                        className="block px-8 py-3 text-green-700 hover:bg-green-50/70 hover:text-green-600 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sản phẩm tiết kiệm nước
                      </Link>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200/50 mt-4 pt-4 px-6">
                  <Link
                    href="/contact"
                    className="block w-full rounded-full bg-green-600 px-5 py-3 text-center text-sm font-medium text-white transition-all duration-300 hover:bg-green-700 hover:shadow-lg transform hover:scale-105 mb-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Liên hệ ngay
                  </Link>
                  
                  {!isSignedIn ? (
                    <div className="w-full rounded-full bg-gradient-to-r from-green-600 to-green-500 px-5 py-3 text-center text-sm font-medium text-white transition-all duration-300 hover:from-green-700 hover:to-green-600">
                      <SignUpButton signInFallbackRedirectUrl="/" fallbackRedirectUrl="/">
                        Đăng nhập
                      </SignUpButton>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <UserButton afterSignOutUrl="/">
                        {isAdmin && (
                          <UserButton.MenuItems>
                            <UserButton.Link
                              label="Quản lý trang"
                              labelIcon={<LayoutDashboard fill="#059669" size={15} stroke="0"/>}
                              href="/admin"
                            />
                          </UserButton.MenuItems>
                        )}
                      </UserButton>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
          
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm -z-10"
            onClick={() => setIsMenuOpen(false)}
          />
        </div>
      )}
    </header>
  )
}

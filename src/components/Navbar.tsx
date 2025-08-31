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
  
import { checkRole } from '@/utils/roles'

type NavItem = { title: string; url: string }

export default function Navbar({ nav = [] as NavItem[] }: { nav?: NavItem[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { isSignedIn } = useUser();
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await axios.get("/api/check-role");
        setIsAdmin(res.data.isAdmin);
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    fetchRole();
  }, []);

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
    <header
      className={cn(
        "fixed left-0 top-0 z-50 w-full transition-all duration-300 px-10",
        isScrolled
          ? "bg-white/95 backdrop-blur shadow-md"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 font-bold">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-40">
              <div className="flex items-center">
                <div className="mr-2 flex h-9 w-9 items-center justify-center rounded-full bg-green-600">
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
                <span className={`text-xl font-bold ${isScrolled ? 'text-green-600' : 'text-white'}`}>Môi trường</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-1 lg:flex">
            {nav.map((item) => (
              <Link
                key={`${item.title}-${item.url}`}
                href={item.url || "#"}
                className={`px-3 py-2 text-sm font-medium transition-colors hover:text-green-600 ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                {item.title}
              </Link>
            ))}
            <div className="relative">
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className={`flex items-center px-3 py-2 text-sm font-medium transition-colors hover:text-green-600 ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                Sản phẩm
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isProductsOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md bg-white py-2 shadow-lg">
                  <Link
                    href="/products/organic"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sản phẩm hữu cơ
                  </Link>
                  <Link
                    href="/products/recycled"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sản phẩm tái chế
                  </Link>
                  <Link
                    href="/products/water-saving"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sản phẩm tiết kiệm nước
                  </Link>
                </div>
              )}
            </div>
            {/* Có thể giữ dropdown sản phẩm như một mục tĩnh bổ sung */}
            
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden items-center space-x-4 lg:flex">
            <Link
              href="/contact"
              className="rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              Liên hệ ngay
            </Link>
            {!isSignedIn ? (
                <div className="flex gap-4">
                    <div className="rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700">
                        <SignUpButton signInFallbackRedirectUrl="/" fallbackRedirectUrl="/">
                            Đăng nhập
                        </SignUpButton>
                    </div>
                </div>
                    ) : (
                    <UserButton afterSignOutUrl="/">
                        {/* KIỂM TRA TÀI KHOẢN */}
                        {
                            isAdmin ? (
                            <UserButton.MenuItems>
                            <UserButton.Link
                                label="Quản lý trang"
                                labelIcon={<LayoutDashboard fill="#3e9392" size={15} stroke="0"/>}
                                href="/admin"
                            />
                            </UserButton.MenuItems>
                            )  : null
                        }
                        
                    </UserButton>
                    )}
            </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden ${isScrolled ? "text-gray-700" : "text-white"}`}
            aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="container mx-auto px-4 pb-4">
            <nav className="flex flex-col space-y-2 bg-white py-4">
              {nav.map((item) => (
                <Link
                  key={`${item.title}-${item.url}`}
                  href={item.url || "#"}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
              <div>
                <button
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  className="flex w-full items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <span>Sản phẩm</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isProductsOpen && (
                  <div className="ml-4 border-l border-gray-200 pl-4">
                    <Link
                      href="/products/organic"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sản phẩm hữu cơ
                    </Link>
                    <Link
                      href="/products/recycled"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sản phẩm tái chế
                    </Link>
                    <Link
                      href="/products/water-saving"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sản phẩm tiết kiệm nước
                    </Link>
                  </div>
                )}
              </div>
              <Link
                href="/contact"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Liên hệ
              </Link>
              <div className="mt-4 flex items-center space-x-4 border-t border-gray-200 pt-4">
                <Link
                  href="/contact"
                  className="flex-1 rounded-full bg-green-600 px-4 py-2 text-center text-sm font-medium text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Liên hệ ngay
                </Link>
                
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

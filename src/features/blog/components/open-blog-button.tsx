"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { FolderOpenDot } from "lucide-react"
import { useBlogGallery } from "../context/blog-gallery-context"
import type { BlogResponseDto } from "@/lib/dto/blog.dto"

type OpenBlogButtonProps = {
  onOpen: (blog: BlogResponseDto) => void
  className?: string
  variant?: React.ComponentProps<typeof Button>["variant"]
  disabled?: boolean
}

export default function OpenBlogButton({ onOpen, className, variant = "default", disabled }: OpenBlogButtonProps) {
  const blogGallery = useBlogGallery()

  const handleClick = () => {
    if (disabled) return
    blogGallery.openSelectionDialog([], (blogs) => {
      if (blogs.length > 0) {
        onOpen(blogs[0])
      }
    }, 1)
  }

  return (
    <Button onClick={handleClick} variant={variant} className={className} disabled={disabled}>
      <FolderOpenDot className="mr-2 h-4 w-4" /> Mở bài viết
    </Button>
  )
}



"use client"

import type { BlogResponseDto } from "@/lib/dto/blog.dto"
import { Leaf, TreePine, Sprout } from "lucide-react"
import BlogCard from "./blog-card"

interface FeaturedBlogProps {
  featuredBlog: BlogResponseDto | null
}

export default function FeaturedBlog({ featuredBlog }: FeaturedBlogProps) {
  if (!featuredBlog) {
    return null
  }

  return (
    <div className="mb-16">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sprout className="h-5 w-5 text-green-600" />
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            Bài viết nổi bật
          </h2>
          <TreePine className="h-5 w-5 text-emerald-600" />
        </div>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
          Khám phá bài viết mới nhất về môi trường và phát triển bền vững
        </p>
        <div className="flex items-center justify-center gap-1 mt-3">
          <div className="h-0.5 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
          <Leaf className="h-3 w-3 text-green-500" />
          <div className="h-0.5 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <BlogCard blog={featuredBlog} variant="featured" />
      </div>
    </div>
  )
}

"use client"

import ImageWithMetadata from "@/components/ui/image-with-metadata"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, Leaf, TreePine } from "lucide-react"
import Link from "next/link"
import type { BlogResponseDto } from "@/lib/dto/blog.dto"

interface BlogCardProps {
  blog: BlogResponseDto
  variant?: "default" | "featured" | "compact"
}

export default function BlogCard({ blog, variant = "default" }: BlogCardProps) {
  const formatDate = (dateInput: string | any) => {
    let date: Date
    if (typeof dateInput === 'string') {
      date = new Date(dateInput)
    } else if (dateInput && typeof dateInput === 'object' && dateInput.toDate) {
      // Handle Firestore Timestamp
      date = dateInput.toDate()
    } else {
      date = new Date()
    }
    
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Convert HTML content to plain text for display
  const htmlToText = (html: string): string => {
    if (!html) return ""
    // Remove HTML tags and decode HTML entities
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
  }
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + "..."
  }
  if (variant === "compact") {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm hover:from-green-100/80 hover:to-emerald-100/80">
        <div className="flex gap-4 p-4">
          <div className="flex-shrink-0 relative">
            {blog.thumbnail_url ? (
              <ImageWithMetadata
                src={blog.thumbnail_url}
                width={80}
                height={80}
                alt={blog.title}
                className="rounded-xl object-cover w-20 h-20 ring-2 ring-green-200/50 group-hover:ring-green-300/70 transition-all"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center ring-2 ring-green-200/50">
                <Leaf className="h-8 w-8 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-green-700 transition-colors text-balance">
              {blog.title}
            </CardTitle>
            <CardDescription className="text-sm text-slate-600 line-clamp-2 mt-1 text-pretty">
              {truncateText(htmlToText(blog.content), 120)}
            </CardDescription>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3 text-green-600" />
                {blog.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-green-600" />
                {formatDate(blog.created_at)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (variant === "featured") {
    return (
      <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl bg-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5" />
        <div className="relative">
          {blog.thumbnail_url ? (
            <ImageWithMetadata
              src={blog.thumbnail_url}
              width={800}
              height={400}
              alt={blog.title}
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-80 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center">
              <div className="text-center text-white">
                <TreePine className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg font-medium">Bài viết về môi trường</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="bg-green-500/90 text-white border-green-400/50 hover:bg-green-600/90 transition-colors"
                >
                  <Leaf className="h-3 w-3 mr-1" />
                  {tag.name}
                </Badge>
              ))}
            </div>
            <CardTitle className="text-3xl font-bold mb-3 line-clamp-2 text-balance">{blog.title}</CardTitle>
            <CardDescription className="text-white/90 line-clamp-2 mb-4 text-lg text-pretty">
              {blog.excerpt || truncateText(htmlToText(blog.content), 120)}
            </CardDescription>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-white/80">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {blog.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(blog.created_at)}
                </span>
              </div>
              <Link href={`/blog/${blog.slug}`}>
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  Đọc thêm
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-green-50/30 backdrop-blur-sm h-full flex flex-col hover:from-green-50/50 hover:to-emerald-50/50">
      <div className="relative overflow-hidden">
        {blog.thumbnail_url ? (
          <ImageWithMetadata
            src={blog.thumbnail_url}
            width={400}
            height={250}
            alt={blog.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center">
            <TreePine className="h-12 w-12 text-white/80"/>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <div className="flex flex-wrap gap-1">
            {blog.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-xs bg-green-600/90 text-white border-green-500/50 backdrop-blur-sm"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <div className="flex flex-col gap-1">
            {blog.status && blog.status !== 'published' && (
              <Badge
                variant="secondary"
                className="text-xs bg-orange-500/90 text-white border-orange-400/50 backdrop-blur-sm"
              >
                {blog.status === 'draft' ? 'Nháp' : 'Lưu trữ'}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold line-clamp-2 group-hover:text-green-700 transition-colors text-balance">
          {blog.title}
        </CardTitle>
        <CardDescription className="text-slate-600 line-clamp-3 text-pretty">
          {blog.excerpt || truncateText(htmlToText(blog.content), 120)}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 pb-3 flex-1">
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <User className="h-4 w-4 text-green-600" />
            {blog.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-green-600" />
            {formatDate(blog.created_at)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/blog/${blog.slug}`} className="w-full">
          <Button
            variant="outline"
            className="w-full group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all border-green-200 text-green-700 hover:shadow-md bg-transparent"
          >
            Đọc thêm
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

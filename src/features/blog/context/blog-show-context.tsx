"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { BlogResponseDto } from "@/lib/dto/blog.dto"
import type { BlogFilters } from "../components/blog-show/blog-filter"
import { EBlogStatus } from "@/lib/enums/blog-status.enum"

interface BlogShowContextType {
  blogs: BlogResponseDto[]
  loading: boolean
  error: string | null
  hasNextPage: boolean
  hasPrevPage: boolean
  currentPage: number
  filters: BlogFilters
  goToNextPage: () => void
  goToPrevPage: () => void
  setFilters: (filters: BlogFilters) => void
  refresh: () => void
  clearFilters: () => void
}

const BlogShowContext = createContext<BlogShowContextType | undefined>(undefined)

export function useBlogShow() {
  const context = useContext(BlogShowContext)
  if (context === undefined) {
    throw new Error("useBlogShow must be used within a BlogShowProvider")
  }
  return context
}

interface BlogShowProviderProps {
  children: React.ReactNode
  initialFilters?: BlogFilters
}

export function BlogShowProvider({ children, initialFilters }: BlogShowProviderProps) {
  const [blogs, setBlogs] = useState<BlogResponseDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPrevPage, setHasPrevPage] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFiltersState] = useState<BlogFilters>(
    initialFilters || {
      search: "",
      tags: [],
      status: EBlogStatus.PUBLISHED,
    },
  )
  const [cursor, setCursor] = useState<string | undefined>(undefined)

  const fetchBlogs = useCallback(
    async (resetCursor = false) => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()

        if (!resetCursor && cursor) {
          params.append("cursor", cursor)
        }

        params.append("limit", "10")
        params.append("sort", "desc")

        // Add filter parameters
        if (filters.search) {
          params.append("search", filters.search)
        }
        if (filters.tags.length > 0) {
          params.append("tags", filters.tags.join(","))
        }
        if (filters.status && filters.status !== "all") {
          params.append("status", filters.status)
        }

        const response = await fetch(`/api/blog?${params.toString()}`)
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch blogs")
        }

        if (resetCursor) {
          setBlogs(data.data || [])
          setCurrentPage(1)
          setHasPrevPage(false)
        } else {
          setBlogs((prev) => [...prev, ...(data.data || [])])
          setCurrentPage((prev) => prev + 1)
          setHasPrevPage(true)
        }

        setHasNextPage(data.hasNextPage || false)
        setCursor(data.nextCursor)

        // Remove featured blog logic
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    },
    [cursor, filters],
  )

  const goToNextPage = useCallback(() => {
    if (hasNextPage && !loading) {
      fetchBlogs(false)
    }
  }, [hasNextPage, loading, fetchBlogs])

  const goToPrevPage = useCallback(() => {
    // For cursor-based pagination, we need to implement a different approach
    // This is a simplified version - you might want to implement proper previous page logic
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
      // You might need to store previous cursors or implement a different pagination strategy
    }
  }, [currentPage])

  const setFilters = useCallback(
    (newFilters: BlogFilters) => {
      setFiltersState(newFilters)
      setCursor(undefined)
      setCurrentPage(1)
      // Reset and fetch with new filters
      setTimeout(() => fetchBlogs(true), 0)
    },
    [fetchBlogs],
  )

  const clearFilters = useCallback(() => {
    const emptyFilters = { search: "", tags: [], status: EBlogStatus.PUBLISHED }
    setFiltersState(emptyFilters)
    setCursor(undefined)
    setCurrentPage(1)
    setTimeout(() => fetchBlogs(true), 0)
  }, [fetchBlogs])

  const refresh = useCallback(() => {
    setCursor(undefined)
    setCurrentPage(1)
    fetchBlogs(true)
  }, [fetchBlogs])

  useEffect(() => {
    fetchBlogs(true)
  }, [])

  const value: BlogShowContextType = {
    blogs,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    currentPage,
    filters,
    goToNextPage,
    goToPrevPage,
    setFilters,
    refresh,
    clearFilters,
  }

  return <BlogShowContext.Provider value={value}>{children}</BlogShowContext.Provider>
}

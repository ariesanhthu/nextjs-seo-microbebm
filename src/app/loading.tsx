// src/app/environment/loading.tsx
'use client'

import { Loader2, Leaf } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading()
{
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-green-50 p-6">
      {/* Icon + Spinner */}
      <div className="flex items-center gap-3 mb-8">
        <Leaf className="h-10 w-10 text-green-600" />
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>

      {/* Skeleton Card */}
      <div className="w-full max-w-md space-y-4">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-1/2 bg-green-200" />
        {/* Subtitle skeleton */}
        <Skeleton className="h-4 w-1/3 bg-green-200" />
        {/* Content block skeleton */}
        <Skeleton className="h-32 w-full bg-green-200" />
      </div>

      <p className="mt-6 text-green-700 font-medium">Đang tải dữ liệu môi trường...</p>
    </div>
  )
}

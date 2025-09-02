// src/app/environment/loading.tsx
'use client'

import { Leaf } from 'lucide-react'
import BackgroundPattern from '@/components/background-pattern'
export default function Loading()
{
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-green-50 p-6">
      <BackgroundPattern
        type="leaf"
        color="currentColor"
        opacity={0.05}
        rotation={45}
        spacing={80}
        strokeWidth={1}
      />
    {/* Icon + Spinner */}
    <div className="mb-12 relative flex items-center justify-center h-20 w-20">
      {/* Subtle pulse ring around leaf */}
      <div className="absolute inset-0 rounded-full bg-green-200 opacity-30 animate-ping"></div>
      <div className="absolute inset-2 rounded-full bg-green-300 opacity-20 animate-pulse"></div>

      <Leaf className="h-12 w-12 text-green-600 animate-bounce relative z-10" />
    </div>

    <p className="mt-6 text-green-700 font-medium">Đang tải dữ liệu...</p>
    </div>
    
  )
}

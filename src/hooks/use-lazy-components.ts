// Hook for lazy loading components
"use client"

import React, { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'

interface LazyComponentState {
  [key: string]: boolean
}

export function useLazyComponents() {
  const [loadedComponents, setLoadedComponents] = useState<LazyComponentState>({})

  const loadComponent = useCallback((componentName: string) => {
    setLoadedComponents(prev => ({
      ...prev,
      [componentName]: true
    }))
  }, [])

  const isComponentLoaded = useCallback((componentName: string) => {
    return loadedComponents[componentName] || false
  }, [loadedComponents])

  return {
    loadComponent,
    isComponentLoaded,
    loadedComponents
  }
}

// Pre-configured dynamic components
export const LazyContentEditor = dynamic(() => import("@/features/blog/components/content-editor"), {
  ssr: false,
  loading: () => React.createElement('div', { className: 'h-64 bg-gray-200 rounded animate-pulse' })
})

export const LazyImageUploader = dynamic(() => import("@/features/image-storage/components/image-uploader"), {
  ssr: false,
  loading: () => React.createElement('div', { className: 'h-32 bg-gray-200 rounded animate-pulse' })
})


export const LazyCldImage = dynamic(() => import("next-cloudinary").then(mod => ({ default: mod.CldImage })), {
  ssr: false
})

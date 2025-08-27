"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { usePaginatedFetch, ESort } from '@/hooks/use-paginated-fetch';
import OpenBlogDialog from '../components/open-blog-dialog';
import { BlogResponseDto } from '@/lib/dto/blog.dto';
interface BlogGalleryContextType {
  // Dialog state
  isOpen: boolean;
  openDialog: (onSelect: (image: BlogResponseDto) => void) => void;
  closeDialog: () => void;
  
  // Data from pagination hook
  blogs: BlogResponseDto[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  refresh: () => void;
  cacheSize: number;
}

const BlogGalleryContext = createContext<BlogGalleryContextType | undefined>(undefined);

interface BlogGalleryProviderProps {
  children: React.ReactNode;
}

export function BlogGalleryProvider({ children }: BlogGalleryProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentOnSelect, setCurrentOnSelect] = useState<((blog: BlogResponseDto) => void) | null>(null);

  // Use the pagination hook to manage blog data
  const {
    data: blogs,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    refresh,
    cacheSize
  } = usePaginatedFetch<BlogResponseDto>('/api/blog', {
    limit: 10,
    sort: ESort.DESC,
    autoFetch: true // Auto-fetch on mount so data is ready when dialog opens
  });

  const openDialog = useCallback((onSelect: (image: BlogResponseDto) => void) => {
    setCurrentOnSelect(() => onSelect); // Store the callback
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setCurrentOnSelect(null);
  }, []);

  const handleSelect = useCallback((image: BlogResponseDto) => {
    if (currentOnSelect) {
      currentOnSelect(image);
    }
    closeDialog();
  }, [currentOnSelect, closeDialog]);

  const contextValue: BlogGalleryContextType = {
    isOpen,
    openDialog,
    closeDialog,
    blogs,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    refresh,
    cacheSize
  };

  return (
    <BlogGalleryContext.Provider value={contextValue}>
      {children}

      {/* Hidden the dialog when close, do not re-render */}
      <div
        className={`fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <OpenBlogDialog
          onSelect={handleSelect}
          closeDialog={closeDialog}
          isOpen={isOpen}
        />
      </div>
    </BlogGalleryContext.Provider>
  );
}

export function useBlogGallery() {
  const context = useContext(BlogGalleryContext);
  if (context === undefined) {
    throw new Error('useBlogGallery must be used within a BlogGalleryProvider');
  }
  return context;
}

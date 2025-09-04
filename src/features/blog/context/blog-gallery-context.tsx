"use client";

import React, { createContext, useContext, useState, useCallback, lazy, Suspense } from 'react';
import { usePaginatedFetch, ESort } from '@/hooks/use-paginated-fetch';
import { BlogResponseDto } from '@/lib/dto/blog.dto';
import { EBlogStatus } from '@/lib/enums/blog-status.enum';
import { toast } from 'sonner';

const BlogSelectionDialog = lazy(() => import('../components/blog-selection-dialog'));
interface BlogGalleryContextType {
  // Data from pagination hook
  blogs: BlogResponseDto[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  handleUpdateBlogStatus: (id: string, status: EBlogStatus) => Promise<void>;
  refresh: () => void;
  cacheSize: number;
  
  // Search functionality
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  
  // Blog selection functionality
  selectedBlogs: BlogResponseDto[];
  isSelectionDialogOpen: boolean;
  openSelectionDialog: (currentSelected?: BlogResponseDto[], onConfirm?: (selected: BlogResponseDto[]) => void, numberSelection?: number) => void;
  closeSelectionDialog: () => void;
  toggleBlogSelection: (blog: BlogResponseDto) => void;
  removeSelectedBlog: (blogId: string) => void;
  clearSelection: () => void;
  setSelectedBlogs: (blogs: BlogResponseDto[]) => void;
}

const BlogGalleryContext = createContext<BlogGalleryContextType | undefined>(undefined);

interface BlogGalleryProviderProps {
  children: React.ReactNode;
}

export function BlogGalleryProvider({ children }: BlogGalleryProviderProps) {
  // Blog selection state
  const [selectedBlogs, setSelectedBlogs] = useState<BlogResponseDto[]>([]);
  const [isSelectionDialogOpen, setIsSelectionDialogOpen] = useState(false);
  const [currentOnConfirm, setCurrentOnConfirm] = useState<((selected: BlogResponseDto[]) => void) | null>(null);
  const [numberSelection, setNumberSelection] = useState<number | undefined>(undefined);

  // Use the pagination hook to manage blog data
  const {
    data: blogs,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    refresh,
    cacheSize,
    searchQuery,
    setSearchQuery,
    isSearching
  } = usePaginatedFetch<BlogResponseDto>('/api/blog', {
    limit: 10,
    sort: ESort.DESC,
    autoFetch: false,
    searchDebounceMs: 300
  });

  const handleUpdateBlogStatus = useCallback(async (id: string, status: EBlogStatus) => {
    // Update the blog status
    const res = await fetch(`/api/blog/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success('Cập nhật trạng thái blog thành công');
      refresh();
    } else {
      toast.error('Cập nhật trạng thái blog thất bại');
    }
  }, []);

  // Blog selection functions
  const openSelectionDialog = useCallback((currentSelected: BlogResponseDto[] = [], onConfirm?: (selected: BlogResponseDto[]) => void, numberSelectionParam?: number) => {
    setSelectedBlogs(currentSelected);
    setCurrentOnConfirm(() => onConfirm || null);
    setNumberSelection(numberSelectionParam);
    setIsSelectionDialogOpen(true);
    // Don't reset search when dialog opens - let users keep their search context
    refresh();
  }, [refresh]);

  const closeSelectionDialog = useCallback(() => {
    setIsSelectionDialogOpen(false);
    setCurrentOnConfirm(null);
    setNumberSelection(undefined);
  }, []);

  const toggleBlogSelection = useCallback((blog: BlogResponseDto) => {
    setSelectedBlogs(prev => {
      const isSelected = prev.some(b => b.id === blog.id);
      if (isSelected) {
        return prev.filter(b => b.id !== blog.id);
      } else {
        return [...prev, blog];
      }
    });
  }, []);

  const removeSelectedBlog = useCallback((blogId: string) => {
    setSelectedBlogs(prev => prev.filter(b => b.id !== blogId));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedBlogs([]);
  }, []);

  const confirmSelection = useCallback((blogs: BlogResponseDto[]) => {
    if (currentOnConfirm) {
      currentOnConfirm(blogs);
    }
    closeSelectionDialog();
  }, [currentOnConfirm, closeSelectionDialog]);

  const contextValue: BlogGalleryContextType = {
    blogs,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    handleUpdateBlogStatus,
    refresh,
    cacheSize,
    searchQuery,
    setSearchQuery,
    isSearching,
    selectedBlogs,
    isSelectionDialogOpen,
    openSelectionDialog,
    closeSelectionDialog,
    toggleBlogSelection,
    removeSelectedBlog,
    clearSelection,
    setSelectedBlogs,
  };

  return (
    <BlogGalleryContext.Provider value={contextValue}>
      {children}
      
      {/* Blog Selection Dialog - Dynamic Import */}
      {isSelectionDialogOpen && (
        <Suspense fallback={<div>Loading...</div>}>
          <BlogSelectionDialog
            isOpen={isSelectionDialogOpen}
            onClose={closeSelectionDialog}
            onConfirm={confirmSelection}
            currentSelected={selectedBlogs}
            numberSelection={numberSelection}
            blogs={blogs}
            loading={loading}
            error={error}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            goToNextPage={goToNextPage}
            goToPrevPage={goToPrevPage}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearching={isSearching}
            refresh={refresh}
          />
        </Suspense>
      )}
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

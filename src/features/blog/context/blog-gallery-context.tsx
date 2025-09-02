"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePaginatedFetch, ESort } from '@/hooks/use-paginated-fetch';
import OpenBlogDialog from '../components/open-blog-dialog';
import BlogSelectionDialog from '../components/blog-selection-dialog';
import { BlogResponseDto } from '@/lib/dto/blog.dto';
import { EBlogStatus } from '@/lib/enums/blog-status.enum';
import { toast } from 'sonner';
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
  openSelectionDialog: (currentSelected?: BlogResponseDto[], onConfirm?: (selected: BlogResponseDto[]) => void) => void;
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
  const [isOpen, setIsOpen] = useState(false);
  const [currentOnSelect, setCurrentOnSelect] = useState<((blog: BlogResponseDto) => void) | null>(null);
  
  // Blog selection state
  const [selectedBlogs, setSelectedBlogs] = useState<BlogResponseDto[]>([]);
  const [isSelectionDialogOpen, setIsSelectionDialogOpen] = useState(false);
  const [currentOnConfirm, setCurrentOnConfirm] = useState<((selected: BlogResponseDto[]) => void) | null>(null);

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

  // Select Blog dialog function
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
  const openSelectionDialog = useCallback((currentSelected: BlogResponseDto[] = [], onConfirm?: (selected: BlogResponseDto[]) => void) => {
    setSelectedBlogs(currentSelected);
    setCurrentOnConfirm(() => onConfirm || null);
    setIsSelectionDialogOpen(true);
    // Don't reset search when dialog opens - let users keep their search context
    refresh();
  }, [refresh]);

  const closeSelectionDialog = useCallback(() => {
    setIsSelectionDialogOpen(false);
    setSearchQuery("");
    setCurrentOnConfirm(null);
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

  useEffect(() => {
    if (isOpen) {
      goToFirstPage();
    }
  }, [isOpen]);

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
          data={blogs}
          loading={loading}
          error={error}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          goToNextPage={goToNextPage}
          goToPrevPage={goToPrevPage}
          goToFirstPage={goToFirstPage}
          refresh={refresh}
          cacheSize={cacheSize}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearching={isSearching}
        />
      </div>
      
      {/* Blog Selection Dialog */}
      <div
        className={`fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-200 ${
          isSelectionDialogOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <BlogSelectionDialog
          isOpen={isSelectionDialogOpen}
          onClose={closeSelectionDialog}
          onConfirm={confirmSelection}
          currentSelected={selectedBlogs}
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

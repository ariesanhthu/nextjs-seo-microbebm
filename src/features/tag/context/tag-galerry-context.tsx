"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePaginatedFetch, ESort } from '@/hooks/use-paginated-fetch';
import { TagResponseDto } from '@/lib/dto/tag.dto';
import ChooseTagDialog from '../components/choose-tag-dialog';
interface TagGalleryContextType {
  // Dialog state
  isOpen: boolean;
  openDialog: (onSelect: (tags: TagResponseDto[]) => void) => void;
  closeDialog: () => void;
  
  // Data from pagination hook
  tags: TagResponseDto[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  refresh: () => void;
  cacheSize: number;
}

const TagGalleryContext = createContext<TagGalleryContextType | undefined>(undefined);

interface TagGalleryProviderProps {
  children: React.ReactNode;
}

export function TagGalleryProvider({ children }: TagGalleryProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentOnSelect, setCurrentOnSelect] = useState<((tag: TagResponseDto[]) => void) | null>(null);

  // Use the pagination hook to manage tag data
  const {
    data: tags,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    refresh,
    cacheSize
  } = usePaginatedFetch<TagResponseDto>('/api/tag', {
    limit: 10,
    sort: ESort.DESC,
    autoFetch: false
  });

  const openDialog = useCallback((onSelect: (tag: TagResponseDto[]) => void) => {
    setCurrentOnSelect(() => onSelect); // Store the callback
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setCurrentOnSelect(null);
  }, []);

  const handleSelect = useCallback((tag: TagResponseDto[]) => {
    if (currentOnSelect) {
      currentOnSelect(tag);
    }
    closeDialog();
  }, [currentOnSelect, closeDialog]);

  const contextValue: TagGalleryContextType = {
    isOpen,
    openDialog,
    closeDialog,
    tags,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    refresh,
    cacheSize
  };

  useEffect(() => {
    if (isOpen) {
      goToFirstPage();
    }
  }, [isOpen]);

  return (
    <TagGalleryContext.Provider value={contextValue}>
      {children}

      {/* Hidden the dialog when close, do not re-render */}
      <div
        className={`fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChooseTagDialog
          onSelect={handleSelect}
          closeDialog={closeDialog}
          isOpen={isOpen}
          data={tags}
          loading={loading}
          error={error}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          goToNextPage={goToNextPage}
          goToPrevPage={goToPrevPage}
          goToFirstPage={goToFirstPage}
          refresh={refresh}
          cacheSize={cacheSize}
        />
      </div>
    </TagGalleryContext.Provider>
  );
}

export function useTagGallery() {
  const context = useContext(TagGalleryContext);
  if (context === undefined) {
    throw new Error('useTagGallery must be used within a TagGalleryProvider');
  }
  return context;
}

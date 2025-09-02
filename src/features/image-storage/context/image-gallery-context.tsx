"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePaginatedFetch, ESort } from '@/hooks/use-paginated-fetch';
import { ImageMetadataResponseDto } from '@/lib/dto/image-metadata.dto';
import OpenImageMetadataDialog from '../components/open-image-diaglog';

interface ImageGalleryContextType {
  // Dialog state
  isOpen: boolean;
  openDialog: (onSelect: (image: ImageMetadataResponseDto) => void) => void;
  closeDialog: () => void;
  
  // Data from pagination hook
  imageMetadatas: ImageMetadataResponseDto[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToFirstPage: () => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  refresh: () => void;
  cacheSize: number;
}

const ImageGalleryContext = createContext<ImageGalleryContextType | undefined>(undefined);

interface ImageGalleryProviderProps {
  children: React.ReactNode;
}

export function ImageGalleryProvider({ children }: ImageGalleryProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentOnSelect, setCurrentOnSelect] = useState<((image: ImageMetadataResponseDto) => void) | null>(null);

  // Use the pagination hook to manage image data
  const {
    data: imageMetadatas,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    refresh,
    cacheSize
  } = usePaginatedFetch<ImageMetadataResponseDto>('/api/image-metadata', {
    limit: 12,
    sort: ESort.DESC,
    autoFetch: false // Auto-fetch on mount so data is ready when dialog opens
  });

  const openDialog = useCallback((onSelect: (image: ImageMetadataResponseDto) => void) => {
    setCurrentOnSelect(() => onSelect); // Store the callback
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setCurrentOnSelect(null);
  }, []);

  const handleSelect = useCallback((image: ImageMetadataResponseDto) => {
    if (currentOnSelect) {
      currentOnSelect(image);
    }
    closeDialog();
  }, [currentOnSelect, closeDialog]);

  const contextValue: ImageGalleryContextType = {
    isOpen,
    openDialog,
    closeDialog,
    imageMetadatas,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    goToFirstPage,
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
    <ImageGalleryContext.Provider value={contextValue}>
      {children}

      {/* Hidden the dialog when close, do not re-render */}
      <div
        className={`fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <OpenImageMetadataDialog
          onSelect={handleSelect}
          closeDialog={closeDialog}
          isOpen={isOpen}
          data={imageMetadatas}
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
    </ImageGalleryContext.Provider>
  );
}

export function useImageGallery() {
  const context = useContext(ImageGalleryContext);
  if (context === undefined) {
    throw new Error('useImageGallery must be used within an ImageGalleryProvider');
  }
  return context;
}

"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { usePaginatedFetch, ESort } from '@/hooks/use-paginated-fetch';
import LazyOnOpen from '@/components/lazy-on-open';
import { ProductResponseDto } from '@/lib/dto/product.dto';
import { toast } from 'sonner';
interface ProductGalleryContextType {
  // Data from pagination hook
  products: ProductResponseDto[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  refresh: () => void;
  cacheSize: number;
  
  // Search functionality
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  
  // Product selection functionality
  selectedProducts: ProductResponseDto[];
  isSelectionDialogOpen: boolean;
  openSelectionDialog: (currentSelected?: ProductResponseDto[], onConfirm?: (selected: ProductResponseDto[]) => void, numberSelection?: number) => void;
  closeSelectionDialog: () => void;
  toggleProductSelection: (product: ProductResponseDto) => void;
  removeSelectedProduct: (productId: string) => void;
  clearSelection: () => void;
  setSelectedProducts: (products: ProductResponseDto[]) => void;
}

const ProductGalleryContext = createContext<ProductGalleryContextType | undefined>(undefined);

interface ProductGalleryProviderProps {
  children: React.ReactNode;
}

export function ProductGalleryProvider({ children }: ProductGalleryProviderProps) {
  // Product selection state
  const [selectedProducts, setSelectedProducts] = useState<ProductResponseDto[]>([]);
  const [isSelectionDialogOpen, setIsSelectionDialogOpen] = useState(false);
  const [currentOnConfirm, setCurrentOnConfirm] = useState<((selected: ProductResponseDto[]) => void) | null>(null);
  const [numberSelection, setNumberSelection] = useState<number | undefined>(undefined);

  // Use the pagination hook to manage product data
  const {
    data: products,
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
  } = usePaginatedFetch<ProductResponseDto>('/api/product', {
    limit: 10,
    sort: ESort.DESC,
    autoFetch: false,
    searchDebounceMs: 300
  });

  // Product selection functions
  const openSelectionDialog = useCallback((currentSelected: ProductResponseDto[] = [], onConfirm?: (selected: ProductResponseDto[]) => void, numberSelectionParam?: number) => {
    setSelectedProducts(currentSelected);
    setCurrentOnConfirm(() => onConfirm || null);
    setNumberSelection(numberSelectionParam);
    setIsSelectionDialogOpen(true);
    // Don't reset search when dialog opens - let users keep their search context
    refresh();
  }, [refresh]);

  const closeSelectionDialog = useCallback(() => {
    setIsSelectionDialogOpen(false);
    setCurrentOnConfirm(null);
    setSearchQuery("");
    setNumberSelection(undefined);
  }, []);

  const toggleProductSelection = useCallback((product: ProductResponseDto) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(b => b.id === product.id);
      if (isSelected) {
        return prev.filter(b => b.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  }, []);

  const removeSelectedProduct = useCallback((productId: string) => {
    setSelectedProducts(prev => prev.filter(b => b.id !== productId));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  const confirmSelection = useCallback((products: ProductResponseDto[]) => {
    if (currentOnConfirm) {
      currentOnConfirm(products);
    }
    closeSelectionDialog();
  }, [currentOnConfirm, closeSelectionDialog]);

  const contextValue: ProductGalleryContextType = {
    products,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    refresh,
    cacheSize,
    searchQuery,
    setSearchQuery,
    isSearching,
    selectedProducts,
    isSelectionDialogOpen,
    openSelectionDialog,
    closeSelectionDialog,
    toggleProductSelection,
    removeSelectedProduct,
    clearSelection,
    setSelectedProducts,
  };

  return (
    <ProductGalleryContext.Provider value={contextValue}>
      {children}
      
      <LazyOnOpen
        open={isSelectionDialogOpen}
        loader={() => import('../components/product-selection-dialog')}
        fallback={<div>Loading...</div>}
        componentProps={{
          isOpen: isSelectionDialogOpen,
          onClose: closeSelectionDialog,
          onConfirm: confirmSelection,
          currentSelected: selectedProducts,
          numberSelection,
          products,
          loading,
          error,
          hasNextPage,
          hasPrevPage,
          goToNextPage,
          goToPrevPage,
          searchQuery,
          setSearchQuery,
          isSearching,
          refresh,
        }}
      />
    </ProductGalleryContext.Provider>
  );
}

export function useProductGallery() {
  const context = useContext(ProductGalleryContext);
  if (context === undefined) {
    throw new Error('useProductGallery must be used within a ProductGalleryProvider');
  }
  return context;
}

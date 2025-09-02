"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, RefreshCw, X } from 'lucide-react';
import { TagResponseDto } from '@/lib/dto/tag.dto';
import { UsePaginatedFetchReturn } from '@/hooks/use-paginated-fetch';
import { useEffect, useState } from 'react';


interface ChooseTagDialogProps extends Partial<UsePaginatedFetchReturn<TagResponseDto>> {
  onSelect: (tag: TagResponseDto[]) => void;
  closeDialog: () => void;
  isOpen?: boolean;
}

export default function ChooseTagDialog({ 
  onSelect, 
  closeDialog, 
  isOpen = true,
  data: tags,
  loading,
  error,
  hasNextPage,
  hasPrevPage,
  goToFirstPage,
  goToNextPage,
  goToPrevPage,
  refresh,
  cacheSize
}: ChooseTagDialogProps) {

  const [selectionTag, setSelectionTag] = useState<TagResponseDto[]>([]);

  const clearCache = () => {
    if (refresh) {
      refresh(); // This will clear cache and refetch current page
    }
  };

  const handleConfirm = () => {
    onSelect(selectionTag.filter((tag, index, self) => self.findIndex(t => t.id === tag.id) === index));
    closeDialog();
  }

  const handleSelect = (tag: TagResponseDto) => {
    if (selectionTag.includes(tag)) {
      setSelectionTag((prev) => prev.filter((t) => t !== tag));
    } else {
      setSelectionTag((prev) => [...prev, tag]);
    }
  };

  // Don't render content when closed 
  if (!isOpen) {
    return null;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              <p>Error loading tags: {error}</p>
              <Button onClick={refresh} className="mt-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    // <div className="">
      <Card className='w-1/3 h-120 min-h-100 border-4 rounded-2xl'>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Thư viện bài viết
            <div className="ml-auto">
              <Button variant="ghost" onClick={clearCache}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              {
                selectionTag.length > 0 && (
                  <Button variant="ghost" onClick={handleConfirm}>
                    Xác nhận
                  </Button>
                )
              }
              <Button variant="ghost" onClick={closeDialog}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>

        </CardHeader>
        <CardContent className="max-h-2/3 min-h-2/3 overflow-x-auto overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
              <div className="flex flex-col gap-4 w-full">
                {tags?.map((tag) => (
                  <Button 
                    key={tag.id} 
                    className={selectionTag.includes(tag) 
                      ? "flex flex-row gap-5 justify-start bg-primary hover:bg-green-300 border-secondary border-2"
                      : "flex flex-row gap-5 justify-start bg-transparent hover:bg-accent"}
                    onClick={() => handleSelect(tag)}
                  >
                    <div className="truncate font-medium text-black overflow-auto">{tag.name}</div>
                  </Button>
                ))}
              </div>

              {tags?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No tags found
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className='flex flex-row justify-center items-center mt-6 gap-5'>
          <Button
            variant="outline"
            onClick={goToPrevPage}
            disabled={!hasPrevPage || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center">
            <Badge variant="outline">
              {tags?.length} tags
            </Badge>
          </div>
          
          <Button
            variant="outline"
            onClick={goToNextPage}
            disabled={!hasNextPage || loading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>

        </CardFooter>
      </Card>
  );
}
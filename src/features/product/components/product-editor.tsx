"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { ProductResponseDto, CreateProductDto } from '@/lib/dto/product.dto';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface ProductEditorProps {
  productId?: string | null;
}

export default function ProductEditor({ productId }: ProductEditorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    main_img: '',
    content: '',
  });

  // Fetch product data if editing
  useEffect(() => {
    if (productId) {
      fetchProduct();
      setIsEditing(true);
    }
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/product/${productId}`);
      const data = await res.json();
      
      if (data.success) {
        const product = data.data;
        setFormData({
          name: product.name || '',
          description: product.description || '',
          main_img: product.main_img || '',
          content: product.content || '',
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to load product",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const url = isEditing ? `/api/product/${productId}` : '/api/product';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          main_img: formData.main_img,
          content: formData.content,
          sub_img: [],
          category_ids: [],
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: isEditing ? "Product updated successfully" : "Product created successfully",
        });
        router.push('/admin/product');
      } else {
        toast({
          title: "Error",
          description: data.message || `Failed to ${isEditing ? 'update' : 'create'} product`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/product');
  };

  if (isLoading && isEditing) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading product...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="p-0 h-auto"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {isEditing ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên sản phẩm *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                placeholder="Nhập tên sản phẩm"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả ngắn *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                rows={3}
                placeholder="Nhập mô tả ngắn về sản phẩm"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="main_img">URL hình ảnh chính *</Label>
              <Input
                id="main_img"
                value={formData.main_img}
                onChange={(e) => handleInputChange('main_img', e.target.value)}
                required
                placeholder="https://example.com/image.jpg"
              />
              {formData.main_img && (
                <div className="mt-2">
                  <img
                    src={formData.main_img}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Nội dung chi tiết *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                required
                rows={6}
                placeholder="Nhập nội dung chi tiết về sản phẩm"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Đang cập nhật...' : 'Đang tạo...'}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? 'Cập nhật' : 'Tạo sản phẩm'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

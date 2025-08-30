"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductResponseDto } from "@/lib/dto/product.dto";

type Product = ProductResponseDto;

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Tìm product theo slug (name) thay vì ID
        const response = await fetch("/api/product");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        
        const data = await response.json();
        const products = data.data || data;
        
        // Tìm product theo slug (name)
        const foundProduct = products.find((p: Product) => 
          p.name.toLowerCase().replace(/\s+/g, '-') === params.slug
        );
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError("Sản phẩm không tồn tại");
        }
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Không tìm thấy sản phẩm"}
          </h1>
          <Link href="/">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Trang chủ
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Sản phẩm</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white shadow-lg">
                             <Image
                 src={product.main_img.startsWith("/") ? product.main_img : `/${product.main_img}`}
                 alt={product.name}
                 fill
                 className="object-cover transition-transform duration-300 hover:scale-105"
                 priority
               />
            </div>
            
            {/* Thumbnail Gallery (có thể mở rộng sau) */}
            <div className="flex space-x-2">
                             <div className="relative aspect-square w-20 overflow-hidden rounded-md border-2 border-green-500">
                 <Image
                   src={product.main_img.startsWith("/") ? product.main_img : `/${product.main_img}`}
                   alt={product.name}
                   fill
                   className="object-cover"
                 />
               </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-sm">
                  Sản phẩm mới
                </Badge>
                                 {product.created_at && (
                   <span className="text-sm text-gray-500">
                     Cập nhật: {new Date(product.created_at as any).toLocaleDateString('vi-VN')}
                   </span>
                 )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Mô tả sản phẩm
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Giá
                </h3>
                <Link href="/contact" className="text-2xl font-bold text-green-600">
                   Liên hệ để biết giá
                 </Link>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Liên hệ đặt hàng
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/contact" className="w-full">
                  <Button className="w-full" size="lg">
                    <Phone className="mr-2 h-4 w-4" />
                    Gọi điện
                  </Button>
                </Link>
                
                <Link href="/contact" className="w-full">
                  <Button variant="outline" className="w-full" size="lg">
                    <Mail className="mr-2 h-4 w-4" />
                    Gửi email
                  </Button>
                </Link>
              </div>

              <Link href="/contact" className="w-full">
                <Button variant="secondary" className="w-full" size="lg">
                  <MapPin className="mr-2 h-4 w-4" />
                  Đến cửa hàng
                </Button>
              </Link>
            </div>

            {/* Additional Info */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-800 text-lg">
                  Tại sao chọn sản phẩm này?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-green-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Chất lượng cao, bền bỉ
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Thân thiện với môi trường
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Giá cả hợp lý
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Dịch vụ hậu mãi tốt
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Sản phẩm liên quan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Có thể thêm sản phẩm liên quan ở đây */}
          </div>
        </div>
      </div>
    </div>
  );
}

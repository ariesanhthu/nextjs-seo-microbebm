"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import ImageWithMetadata from "@/components/ui/image-with-metadata";
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
        const response = await axios.get(`/api/product/${params.slug}`);
        const foundProduct = response.data.data;
        
        if (foundProduct) {
          console.log('📥 Loaded product:', {
            id: foundProduct.id,
            name: foundProduct.name,
            slug: foundProduct.slug,
            contentLength: foundProduct.content?.length || 0,
            contentPreview: foundProduct.content?.substring(0, 100) + '...',
            hasSubImages: foundProduct.sub_img && foundProduct.sub_img.length > 0,
            description: foundProduct.description?.substring(0, 50) + '...'
          });
          setProduct(foundProduct);
        } else {
          setError("Sản phẩm không tồn tại");
        }
      } catch (err: any) {
        console.error("Error fetching product:", err);
        if (err.response?.status === 404) {
          setError("Sản phẩm không tồn tại");
        } else {
          setError("Không thể tải thông tin sản phẩm");
        }
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
    <div className="min-h-screen bg-gray-50 mt-10">
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
              <ImageWithMetadata
                src={product.main_img}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {product.sub_img && product.sub_img.length > 0 && (
              <div className="flex space-x-2 overflow-x-auto">
                <div className="relative aspect-square w-20 overflow-hidden rounded-md border-2 border-green-500 flex-shrink-0">
                  <ImageWithMetadata
                    src={product.main_img}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {product.sub_img.map((img, index) => (
                  <div key={index} className="relative aspect-square w-20 overflow-hidden rounded-md border-2 border-gray-200 flex-shrink-0">
                    <ImageWithMetadata
                      src={img}
                      alt={`${product.name} - Ảnh ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
            <div className="flex items-center space-x-2">
                <Badge variant="outline"  className="text-sm bg-green-500">
                  Sản phẩm mới
                </Badge>
                                 {product.created_at && (
                   <span className="text-sm text-gray-500">
                     Cập nhật: {new Date(product.created_at as any).toLocaleDateString('vi-VN')}
                   </span>
                 )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 mt-2">
                {product.name}
              </h1>
             
            </div>

            <div className="space-y-4 mt-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Mô tả sản phẩm
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <Link href="/contact" className="text-2xl font-bold text-green-600">
                   Liên hệ để biết giá
                 </Link>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Nút gọi điện */}
                <Link href="tel:0393614127" className="w-full" passHref>
                  <Button className="w-full" size="lg">
                    <Phone className="mr-2 h-4 w-4" />
                    Gọi ngay
                  </Button>
                </Link>

                {/* Nút Liên hệ */}
                <Link href="/contact" className="w-full" passHref>
                  <Button className="w-full" size="lg" variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Liên hệ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Product Content - Hiển thị bên dưới hình ảnh */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Thông tin chi tiết
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product.content ? (
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-blockquote:border-l-green-500 prose-blockquote:bg-green-50 prose-blockquote:text-gray-700 prose-img:rounded-lg prose-img:shadow-md"
                  dangerouslySetInnerHTML={{ 
                    __html: product.content 
                  }} 
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-lg mb-2">Chưa có nội dung chi tiết</p>
                  <p className="text-sm">Nội dung sẽ được cập nhật sớm nhất</p>
                </div>
              )}
            </CardContent>
          </Card>
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

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductResponseDto } from "@/lib/dto/product.dto";
import Image from "next/image";
import { HOMEPAGE_SEED_DATA } from "@/lib/homepageData";

// Hàm helper để xử lý image URL
function getImageUrl(url?: string): string {
  if (!url) return "/placeholder.svg";
  return url;
}

export type FeaturedProductItem = ProductResponseDto;
const sampleProducts: ProductResponseDto[] = HOMEPAGE_SEED_DATA.products;

export default function FeaturedProducts({ products: inputProducts }: { products?: ProductResponseDto[] }) {
  const [isVisible, setIsVisible] = useState(false);
  
  const products: ProductResponseDto[] = (inputProducts?.length ? inputProducts : sampleProducts);
  // const [products, setProducts] = useState<IProduct[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");

  // Hiệu ứng hiển thị (animation fade in)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, index) => (
          <div
           key={product.id}
           className={`transform rounded-lg bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
             isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
           }`}
           style={{ transitionDelay: `${index * 100}ms` }}
         >
                     <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
                          <Image
                            src={product.main_img}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                          />
          </div>
          <div className="p-6">
            <h3 className="mb-2 text-xl font-semibold text-gray-800">
              {product.name}
            </h3>
            <p className="mb-4 text-gray-600">{product.description}</p>
            <div className="flex item-center justify-between">
                             <span className="text-lg font-bold text-green-600">
                 Liên hệ
               </span>
              <Link
                href={`/product/${product.slug}`}
                className="group flex items-center text-sm font-medium text-green-600 hover:text-green-700"
              >
                Chi tiết
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

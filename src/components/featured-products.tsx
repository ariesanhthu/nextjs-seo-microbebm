"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const products: ProductResponseDto[] = (inputProducts?.length ? inputProducts : sampleProducts);

  // Hiệu ứng hiển thị (animation fade in)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Kiểm tra trạng thái scroll và hiển thị nút điều hướng
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll sang trái
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 320; // Chiều rộng mỗi card + gap
      scrollContainerRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
      });
    }
  };

  // Scroll sang phải
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 320; // Chiều rộng mỗi card + gap
      scrollContainerRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      });
    }
  };

  // Kiểm tra nút điều hướng khi component mount và khi products thay đổi
  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [products]);

  return (
    <div className="relative">
      {/* Container chính với scroll ngang */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth scroll-snap-x scroll-snap-mandatory"
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`flex-shrink-0 w-80 transform rounded-lg bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl scroll-snap-align-start ${
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
              <p className="mb-4 text-gray-600 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
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

      {/* Nút điều hướng trái */}
      {showLeftButton && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
          aria-label="Cuộn sang trái"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
      )}

      {/* Nút điều hướng phải */}
      {showRightButton && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
          aria-label="Cuộn sang phải"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      )}
    </div>
  );
}

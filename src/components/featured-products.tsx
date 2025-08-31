"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductResponseDto } from "@/lib/dto/product.dto";

// Hàm helper để đảm bảo URL hợp lệ cho component Image
function getImageUrl(url?: string): string {
  if (!url) return "/placeholder.svg";
  // Nếu URL đã bắt đầu bằng '/' hoặc 'http', trả về luôn
  if (url.startsWith("/") || url.startsWith("http")) return url;
  // Nếu không, giả sử đó là đường dẫn tương đối và thêm '/' ở đầu
  return `/${url}`;
}

export type FeaturedProductItem = ProductResponseDto;

// Sample product data
const sampleProducts: FeaturedProductItem[] = [
  {
    id: "1",
    created_at: new Date() as any,
    updated_at: new Date() as any,
    name: "Túi vải tự nhiên",
    slug: "tui-vai-tu-nhien",
    description: "Túi vải được làm từ bông hữu cơ 100%, thân thiện với môi trường và có thể tái sử dụng nhiều lần.",
    main_img: "/images/product-1.jpg",
    sub_img: [],
    content: "Túi vải được làm từ bông hữu cơ 100%, thân thiện với môi trường và có thể tái sử dụng nhiều lần.",
    categories: []
  },
  {
    id: "2",
    created_at: new Date() as any,
    updated_at: new Date() as any,
    name: "Bình nước thủy tinh",
    slug: "binh-nuoc-thuy-tinh",
    description: "Bình nước thủy tinh cao cấp, không chứa BPA, an toàn cho sức khỏe và thân thiện với môi trường.",
    main_img: "/images/product-2.jpg",
    sub_img: [],
    content: "Bình nước thủy tinh cao cấp, không chứa BPA, an toàn cho sức khỏe và thân thiện với môi trường.",
    categories: []
  },
  {
    id: "3",
    created_at: new Date() as any,
    updated_at: new Date() as any,
    name: "Ống hút tre tự nhiên",
    slug: "ong-hut-tre-tu-nhien",
    description: "Ống hút làm từ tre tự nhiên, thay thế hoàn hảo cho ống hút nhựa, có thể phân hủy sinh học.",
    main_img: "/images/product-3.jpg",
    sub_img: [],
    content: "Ống hút làm từ tre tự nhiên, thay thế hoàn hảo cho ống hút nhựa, có thể phân hủy sinh học.",
    categories: []
  },
]

export default function FeaturedProducts({ products: inputProducts }: { products?: FeaturedProductItem[] }) {
  const [isVisible, setIsVisible] = useState(false);
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

  // Fetch products từ API khi component mount
  // useEffect(() => {
  //   async function fetchProducts() {
  //     try {
  //       const res = await fetch("/api/product");
  //       if (!res.ok) {
  //         throw new Error("Failed to fetch products");
  //       }
  //       const data = await res.json();
  //       setProducts(data.data || data);
  //     } catch (err: any) {
  //       console.error("Error fetching products:", err);
  //       setError("Error fetching products");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchProducts();
  // }, []);

  // if (loading) {
  //   return <p className="text-center text-gray-500">Loading products...</p>;
  // }

  // if (error) {
  //   return <p className="text-center text-red-500">{error}</p>;
  // }

  const products: FeaturedProductItem[] = (inputProducts?.length ? inputProducts : sampleProducts).map((p) => ({
    id: p.id,
    created_at: p.created_at,
    updated_at: p.updated_at,
    name: p.name ?? "Sản phẩm",
    slug: p.slug ?? p.name.toLowerCase().replace(/\s+/g, '-'),
    description: p.description ?? "",
    main_img: p.main_img ?? "/placeholder.svg",
    sub_img: p.sub_img ?? [],
    content: p.content ?? "",
    categories: p.categories ?? []
  }));

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
               src={getImageUrl(product.main_img)}
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

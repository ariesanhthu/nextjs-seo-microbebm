"use client"
import Link from "next/link";
import { ChevronRight, Droplets, Leaf, Recycle, Shield } from "lucide-react";
import * as React from "react";

import FeaturedProducts, { FeaturedProductItem } from "@/components/featured-products";
import ProjectsCarousel from "@/components/projects-carousel";
import QualityPolicy from "@/components/quality-policy";
import { HomepageResponseDto } from "@/lib/dto/homepage.dto";
import { useHomepage } from "@/features/homepage/context/homepage-context";
import { ProductResponseDto } from "@/lib/dto/product.dto";
import SlideShow, { SlideItem } from "@/components/banner-slider";

export default function MainContent() {
  const data: HomepageResponseDto = useHomepage();
  // Helper function để validate URL
  const getValidImageUrl = (url?: string): string => {
    if (!url || typeof url !== 'string') return "/images/nature-banner.jpg";
    
    // Kiểm tra URL có hợp lệ không
    if (url.startsWith("/")) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    
    // Nếu URL không hợp lệ, trả về fallback
    return "/images/nature-banner.jpg";
  };

  const banners: string[] = (data?.banner ?? []).map(getValidImageUrl);
  if (banners.length === 0) banners.push("/images/nature-banner.jpg");
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const clampedIndex = Math.min(currentIndex, banners.length - 1);
  const bannerSlides: SlideItem[] = banners.map((image) => ({ image }));
  
  const mappedProducts: ProductResponseDto[] = (data?.products ?? []).map((p, idx) => ({
    id: p.id ?? idx.toString(),
    created_at: new Date() as any,
    updated_at: new Date() as any,
    name: p.name ?? "Sản phẩm",
    slug: p.slug ?? `product-${idx}`,
    description: "",
    main_img: getValidImageUrl(p.main_img),
    sub_img: [],
    content: "",
    categories: [],
    search: "",
  }));

  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* Banner/Message Section */}
      <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] min-h-[500px] sm:min-h-[600px] w-full overflow-hidden">
        <SlideShow
          items={bannerSlides}
          heightClass="h-full"
          autoIntervalMs={5000}
          onIndexChange={setCurrentIndex}
          renderOverlay={() => null}

        />
        {/* Color overlay (top 50%) with fading to transparent */}
        <div className="h-full absolute inset-x-0 top-0 bg-gradient-to-b from-black/80 to-black/0 pointer-events-none z-10"/>
        {/* Blur overlay (top 50%) with gradient mask to decrease blur towards bottom */}
        <div
              className="z-10 absolute inset-x-0 top-0 pointer-events-none backdrop-blur-md"
              style={{
                height: "50%",
                WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
              }}
            />
          <div className="container absolute inset-0 z-10 mx-auto flex flex-col items-center justify-center px-10 text-center text-primary-foreground">
          {/* <h1 className="mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
            {data?.title ?? "Tôn vinh thiên nhiên - Sống xanh mỗi ngày"}
          </h1>
          <p className="mb-6 sm:mb-8 max-w-2xl text-base sm:text-lg md:text-xl px-2">
            {data?.subtitle ?? "Chúng tôi cung cấp các sản phẩm thân thiện với môi trường, góp phần xây dựng một tương lai bền vững cho thế hệ mai sau."}
          </p> */}
          {/* <Link
            href="#products"
            className="group flex items-center rounded-full bg-green-600 px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-medium text-white transition-all hover:bg-green-700"
          >
            Khám phá ngay
            <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
          </Link> */}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16" id="Services">
        <div className="container mx-auto px-10">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
              Dịch vụ của chúng tôi
            </h2>
            <p className="mx-auto max-w-2xl text-foreground">
              Chúng tôi cung cấp các giải pháp toàn diện giúp bạn và doanh nghiệp sống và làm việc theo phong cách bền vững.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Service 1 */}
            <div className="group rounded-lg bg-white p-4 sm:p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto sm:mx-0">
                <Leaf className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="mb-3 text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
                Sản phẩm hữu cơ
              </h3>
              <p className="text-gray-600 text-center sm:text-left text-sm sm:text-base">
                Các sản phẩm được sản xuất từ nguyên liệu tự nhiên, không chứa hóa chất độc hại.
              </p>
            </div>

            {/* Service 2 */}
            <div className="group rounded-lg bg-white p-4 sm:p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto sm:mx-0">
                <Recycle className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="mb-3 text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
                Tái chế bền vững
              </h3>
              <p className="text-gray-600 text-center sm:text-left text-sm sm:text-base">
                Giải pháp tái chế toàn diện cho doanh nghiệp và cá nhân, giảm thiểu rác thải.
              </p>
            </div>

            {/* Service 3 */}
            <div className="group rounded-lg bg-white p-4 sm:p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto sm:mx-0">
                <Droplets className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="mb-3 text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
                Tiết kiệm nước
              </h3>
              <p className="text-gray-600 text-center sm:text-left text-sm sm:text-base">
                Các sản phẩm và giải pháp giúp tiết kiệm nước trong sinh hoạt và sản xuất.
              </p>
            </div>

            {/* Service 4 */}
            <div className="group rounded-lg bg-white p-4 sm:p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto sm:mx-0">
                <Shield className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="mb-3 text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
                Tư vấn môi trường
              </h3>
              <p className="text-gray-600 text-center sm:text-left text-sm sm:text-base">
                Dịch vụ tư vấn chuyên nghiệp về các giải pháp bảo vệ môi trường cho doanh nghiệp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16" id="Projects">
        <div className="container mx-auto px-10">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
              Công trình kinh nghiệm
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Những dự án tiêu biểu mà chúng tôi đã thực hiện, mang lại giá trị bền vững cho khách hàng và môi trường.
            </p>
          </div>

          <ProjectsCarousel slides={data?.slider ?? []} />
        </div>
      </section>

      {/* Quality Policy Section */}
      <QualityPolicy />

      {/* Featured Products Section */}
      <section id="products" className="bg-background py-16">
        <div className="container mx-auto px-10">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold text-black md:text-4xl">
              Sản phẩm tiêu biểu
            </h2>
            <p className="mx-auto max-w-2xl text-foreground">
              Khám phá các sản phẩm thân thiện với môi trường.
            </p>
          </div>

          <FeaturedProducts products={mappedProducts} />
        </div>
      </section>
    </main>
  );
}


"use client"
import * as React from "react";

import FeaturedProducts, { FeaturedProductItem } from "@/components/featured-products";
import FeaturedBlogs from "@/components/featured-blogs";
import ProjectsCarousel from "@/components/projects-carousel";
import QualityPolicy from "@/components/quality-policy";
import { HomepageResponseDto } from "@/lib/dto/homepage.dto";
import { useHomepage } from "@/features/homepage/context/homepage-context";
import { ProductResponseDto } from "@/lib/dto/product.dto";
import AboutHomepage from "@/components/aboutHomepage";
import SlideShow, { SlideItem } from "@/components/banner-slider";
import { BlogResponseDto } from "@/lib/dto/blog.dto";

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

  const mappedBlogs: BlogResponseDto[] = (data?.blogs ?? []).map((b, idx) => ({
    id: b.id ?? idx.toString(),
    created_at: new Date() as any,
    updated_at: new Date() as any,
    title: b.title ?? "Bài viết",
    slug: b.slug ?? `blog-${idx}`,
    excerpt: (b as any).excerpt ?? "",
    thumbnail_url: getValidImageUrl((b as any).thumbnail_url),
  } as unknown as BlogResponseDto));
  

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
      
      <AboutHomepage/>
      
       {/* Featured Products Section */}
       <section id="products" className="bg-background py-16">
        <div className="container mx-auto px-10">
          <div className="mb-6 text-center">
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
      <QualityPolicy imageSrc={data?.image_policy ? getValidImageUrl(data.image_policy) : "/images/quality-policy.jpg"} />


      {/* Featured Blogs Section */}
      {mappedBlogs.length > 0 && (
        <section id="blogs" className="bg-background py-16">
          <div className="container mx-auto px-10">
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-3xl font-bold text-black md:text-4xl">Bài viết nổi bật</h2>
              <p className="mx-auto max-w-2xl text-foreground">Chia sẻ kiến thức, cập nhật công nghệ.</p>
            </div>
            <FeaturedBlogs blogs={mappedBlogs} />
          </div>
        </section>
      )}
      
    </main>
  );
}


"use client"
import * as React from "react";

import FeaturedProducts from "@/components/featured-products";
import FeaturedBlogs from "@/components/featured-blogs";
import ProjectsCarousel from "@/components/projects-carousel";
import QualityPolicy from "@/components/quality-policy";
import AboutHomepage from "@/components/aboutHomepage";
import SlideShow, { SlideItem } from "@/components/banner-slider";

import { HomepageResponseDto } from "@/lib/dto/homepage.dto";
import { ProductResponseDto } from "@/lib/dto/product.dto";
import { BlogResponseDto } from "@/lib/dto/blog.dto";
import { useHomepage } from "@/features/homepage/context/homepage-context";

// Helper functions
const getValidImageUrl = (url?: string): string => {
  if (!url || typeof url !== 'string') return "/images/nature-banner.jpg";
  
  if (url.startsWith("/")) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  
  return "/images/nature-banner.jpg";
};

interface RawProduct {
  id?: string;
  name?: string;
  slug?: string;
  main_img?: string;
}

interface RawBlog {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  thumbnail_url?: string;
}

const mapProducts = (products: RawProduct[]): ProductResponseDto[] => {
  return products.map((p, idx) => ({
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
};

const mapBlogs = (blogs: RawBlog[]): BlogResponseDto[] => {
  return blogs.map((b, idx) => ({
    id: b.id ?? idx.toString(),
    created_at: new Date() as any,
    updated_at: new Date() as any,
    title: b.title ?? "Bài viết",
    slug: b.slug ?? `blog-${idx}`,
    excerpt: b.excerpt ?? "",
    thumbnail_url: getValidImageUrl(b.thumbnail_url),
  } as unknown as BlogResponseDto));
};

const prepareBannerSlides = (banners: string[]): SlideItem[] => {
  const validBanners = banners.length > 0 ? banners : ["/images/nature-banner.jpg"];
  return validBanners.map((image) => ({ image }));
};

export default function MainContent() {
  const data: HomepageResponseDto = useHomepage();
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);

  // Process data
  const banners = (data?.banner ?? []).map(getValidImageUrl);
  const bannerSlides = prepareBannerSlides(banners);
  const mappedProducts = mapProducts(data?.products ?? []);
  const mappedBlogs = mapBlogs(data?.blogs ?? []);
  

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <BannerSection 
        bannerSlides={bannerSlides} 
        currentIndex={currentIndex} 
        onIndexChange={setCurrentIndex} 
      />
      
      <AboutHomepage />
      
      <FeaturedProductsSection products={mappedProducts} />
      
      <ProjectsSection slides={data?.slider ?? []} />
      
      <QualityPolicySection imageSrc={data?.image_policy ? getValidImageUrl(data.image_policy) : "/images/quality-policy.jpg"} />
      
      {mappedBlogs.length > 0 && (
        <FeaturedBlogsSection blogs={mappedBlogs} />
      )}
    </main>
  );
}

// Section Components
interface BannerSectionProps {
  bannerSlides: SlideItem[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const BannerSection = ({ bannerSlides, currentIndex, onIndexChange }: BannerSectionProps) => (
  <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] min-h-[500px] sm:min-h-[600px] w-full overflow-hidden">
    <SlideShow
      items={bannerSlides}
      heightClass="h-full"
      autoIntervalMs={5000}
      onIndexChange={onIndexChange}
      renderOverlay={() => null}
    />
    <div className="h-full absolute inset-x-0 top-0 bg-gradient-to-b from-black/80 to-black/0 pointer-events-none z-10"/>
    <div
      className="z-10 absolute inset-x-0 top-0 pointer-events-none backdrop-blur-md"
      style={{
        height: "50%",
        WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
      }}
    />
  </section>
);

interface FeaturedProductsSectionProps {
  products: ProductResponseDto[];
}

const FeaturedProductsSection = ({ products }: FeaturedProductsSectionProps) => (
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
      <FeaturedProducts products={products} />
    </div>
  </section>
);

interface ProjectSlide {
  title: string;
  description: string;
  image_url: string;
}

interface ProjectsSectionProps {
  slides: ProjectSlide[];
}

const ProjectsSection = ({ slides }: ProjectsSectionProps) => (
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
      <ProjectsCarousel slides={slides} />
    </div>
  </section>
);

interface QualityPolicySectionProps {
  imageSrc: string;
}

const QualityPolicySection = ({ imageSrc }: QualityPolicySectionProps) => (
  <QualityPolicy imageSrc={imageSrc} />
);

interface FeaturedBlogsSectionProps {
  blogs: BlogResponseDto[];
}

const FeaturedBlogsSection = ({ blogs }: FeaturedBlogsSectionProps) => (
  <section id="blogs" className="bg-background py-16">
    <div className="container mx-auto px-10">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-3xl font-bold text-black md:text-4xl">Bài viết nổi bật</h2>
        <p className="mx-auto max-w-2xl text-foreground">Chia sẻ kiến thức, cập nhật công nghệ.</p>
      </div>
      <FeaturedBlogs blogs={blogs} />
    </div>
  </section>
);


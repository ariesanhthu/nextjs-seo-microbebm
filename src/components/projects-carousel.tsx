"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import SlideShow, { SlideItem } from "@/components/banner-slider";
import { HomepageSlider } from "@/lib/dto/homepage.dto";
import BackdropImage from "@/components/backdrop-image";

type ProjectsCarouselProps = {
  slides?: HomepageSlider;
};

export default function ProjectsCarousel({ slides = [] }: ProjectsCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const safeImage = (url?: string): string => {
    if (!url || typeof url !== "string") return "/images/project-1.jpg";
    if (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://")) return url;
    return "/images/project-1.jpg";
  };

  const slideItems: SlideItem[] = useMemo(
    () => slides.map((s) => ({ image: safeImage(s.image_url) })),
    [slides]
  );

  return (
    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-xl">
      {slides.length > 0 ? (
        <>
          <SlideShow
            items={slideItems}
            heightClass="h-[500px]"
            autoIntervalMs={3000}
            onIndexChange={setCurrentSlide}
            renderOverlay={(_, index) => {
              const slide = slides[index];
              return (
                <>
                  {/* Color overlay (top 50%) with fading to transparent */}
                  <div className="z-10 absolute inset-x-0 top-0 h-full bg-gradient-to-t from-black/90 to-black/0 pointer-events-none"/>
                  {/* Blur overlay (top 50%) with gradient mask to decrease blur towards bottom */}
                  <div
                    className="z-20 absolute inset-x-0 top-0 pointer-events-none backdrop-blur-md"
                    style={{
                      height: "50%",
                      WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
                      maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
                    }}
                  />
                  {/* Content overlay */}
                  <div className="z-30 absolute bottom-8 left-0 right-0 p-8 text-white ml-10">
                    <h3 className="mb-2 text-2xl font-bold">{slide?.title}</h3>
                    <p className="mb-4 text-gray-200">{slide?.description}</p>
                    <Link
                      href="#"
                      className="inline-flex items-center rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </>
              );
            }}
          />
        </>
      ) : (
        <div className="flex h-[500px] items-center justify-center">
          <p className="text-gray-500">Loading projects...</p>
        </div>
      )}
    </div>
  );
}

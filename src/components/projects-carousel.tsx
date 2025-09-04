"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import SlideShow, { SlideItem } from "@/components/banner-slider";
import { HomepageSlider } from "@/lib/dto/homepage.dto";

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
        <SlideShow
          items={slideItems}
          heightClass="h-[500px]"
          autoIntervalMs={3000}
          onIndexChange={setCurrentSlide}
          renderOverlay={(_, index) => {
            const slide = slides[index];
            return (
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="mb-2 text-2xl font-bold">{slide?.title}</h3>
                <p className="mb-4 text-gray-200">{slide?.description}</p>
                <Link
                  href="#"
                  className="inline-flex items-center rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  Xem chi tiết
                </Link>
              </div>
            );
          }}
        />
      ) : (
        <div className="flex h-[500px] items-center justify-center">
          <p className="text-gray-500">Loading projects...</p>
        </div>
      )}
    </div>
  );
}

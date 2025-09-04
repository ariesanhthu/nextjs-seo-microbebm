"use client";

import Image from "next/image";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type SlideItem = {
  image: string;
};

type SlideShowProps<T extends SlideItem> = {
  items: T[];
  className?: string;
  heightClass?: string; // ví dụ: h-[500px]
  autoIntervalMs?: number; // mặc định 3000ms
  initialIndex?: number;
  renderOverlay?: (item: T, index: number) => React.ReactNode;
  onIndexChange?: (index: number) => void;
};

export default function SlideShow<T extends SlideItem>({
  items,
  className,
  heightClass = "h-[500px]",
  autoIntervalMs = 5000,
  initialIndex = 0,
  renderOverlay,
  onIndexChange,
}: SlideShowProps<T>) {
  const [currentSlide, setCurrentSlide] = React.useState<number>(initialIndex);
  const [isAnimating, setIsAnimating] = React.useState<boolean>(false);

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };
  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  return (
    <div className={`relative w-full overflow-hidden ${heightClass} ${className ?? ""}`}>
      <div
        className="relative flex w-full h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        
        {items.map((item, index) => (
          <div key={index} className="relative min-w-full h-full">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={`slide-${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {renderOverlay ? (
              <>{renderOverlay(item, index)}</>
            ) : null}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={prevSlide}
        className="z-40 absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-sm transition-all hover:bg-white/50"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="z-40 absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-sm transition-all hover:bg-white/50"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="z-40 absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isAnimating) return;
              setIsAnimating(true);
              setCurrentSlide(index);
              setTimeout(() => setIsAnimating(false), 500);
            }}
            className={`h-2 w-8 rounded-full transition-all ${
              currentSlide === index ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
}

export type { SlideShowProps, SlideItem };



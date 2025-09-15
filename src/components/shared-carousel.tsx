"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export type CarouselItem = {
  id: string;
  title: string;
  description?: string;
  href?: string;
  imageUrl: string;
  cta?: React.ReactNode;
};

type SharedCarouselProps = {
  items: CarouselItem[];
  ctaBuilder?: (item: CarouselItem) => React.ReactNode;
  linkLabel?: string;
  linkBuilder?: (item: CarouselItem) => string | undefined;
};

export default function SharedCarousel({
  items,
  ctaBuilder,
  linkLabel = "Chi tiết",
  linkBuilder,
}: SharedCarouselProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollByCards = (delta: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 320;
      scrollContainerRef.current.scrollBy({ left: delta * cardWidth, behavior: "smooth" });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      return () => container.removeEventListener("scroll", checkScrollButtons);
    }
  }, [items]);

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth scroll-snap-x scroll-snap-mandatory py-5"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, index) => (
          <Card
            key={item.id}
            className={`flex-shrink-0 w-80 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl scroll-snap-align-start flex flex-col ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <CardHeader className="p-0">
              <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover transition-transform duration-300 hover:scale-105" />
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col">
              <h3 className="mb-2 text-xl font-semibold text-gray-800">{item.title}</h3>
              {!!item.description && <p className="text-gray-600 line-clamp-2 flex-1">{item.description}</p>}
            </CardContent>
            <CardFooter className="flex items-center justify-between p-6 pt-0 mt-auto">
              {ctaBuilder ? ctaBuilder(item) : item.cta}
              {(() => {
                const href = linkBuilder ? linkBuilder(item) : item.href;
                if (!href) return null;
                return (
                  <Link href={href} className="group flex items-center text-sm font-medium text-green-600 hover:text-green-700">
                    {linkLabel}
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                );
              })()}
            </CardFooter>
          </Card>
        ))}
      </div>

      {showLeftButton && (
        <button
          onClick={() => scrollByCards(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
          aria-label="Cuộn sang trái"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
      )}

      {showRightButton && (
        <button
          onClick={() => scrollByCards(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
          aria-label="Cuộn sang phải"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      )}
    </div>
  );
}



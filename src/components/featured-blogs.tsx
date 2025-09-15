"use client";

import { BlogResponseDto } from "@/lib/dto/blog.dto";
import SharedCarousel, { CarouselItem } from "@/components/shared-carousel";

type FeaturedBlogsProps = {
  blogs?: BlogResponseDto[];
};

export default function FeaturedBlogs({ blogs = [] }: FeaturedBlogsProps) {
  const items: CarouselItem[] = (blogs ?? []).map((b, idx) => ({
    id: b.id ?? String(idx),
    title: b.title ?? "Bài viết",
    description: b.excerpt ?? "",
    imageUrl: b.thumbnail_url || "/placeholder.svg",
    href: `/blog/${b.slug ?? `blog-${idx}`}`,
  }));

  if (!items.length) return null;

  return (
    <SharedCarousel
      items={items}
      linkLabel="Đọc tiếp"
    />
  );
}



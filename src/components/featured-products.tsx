"use client";

import { ProductResponseDto } from "@/lib/dto/product.dto";
import { HOMEPAGE_SEED_DATA } from "@/lib/homepageData";
import SharedCarousel, { CarouselItem } from "@/components/shared-carousel";
import DialogContact from "@/features/emailSender/components/dialog-contact";

export type FeaturedProductItem = ProductResponseDto;
const sampleProducts: ProductResponseDto[] = HOMEPAGE_SEED_DATA.products;

export default function FeaturedProducts({ products: inputProducts }: { products?: ProductResponseDto[] }) {
  const products: ProductResponseDto[] = inputProducts?.length ? inputProducts : sampleProducts;

  const items: CarouselItem[] = products.map((p) => ({
    id: p.id,
    title: p.name,
    description: p.description,
    imageUrl: p.main_img,
    href: `/product/${p.slug}`,
  }));

  return (
    <SharedCarousel
      items={items}
      ctaBuilder={() => (
        <DialogContact
          variant="outline"
          size="sm"
          className="text-green-600 hover:text-green-700 border-green-600 hover:border-green-700"
        />
      )}
      linkLabel="Chi tiết"
    />
  );
}

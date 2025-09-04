import type { Metadata } from "next";
import { fetchBlogSlugServer } from "@/lib/fetchers/blogSlug.fetcher";
import { getBaseUrl } from "@/utils/base-url";

export async function generateBlogMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await fetchBlogSlugServer(params.slug);

  if (!post) {
    return {
      title: "Bài viết không tồn tại",
      robots: { index: false, follow: false },
    };
  }

  const base = (typeof getBaseUrl === "function")
    ? await getBaseUrl()
    : new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://nextjs-seo-microbebm.vercel.app");

  const url = new URL(`/blog/${post.slug}`, base).toString();
  const title = post.title;
  const description = post.excerpt ?? post.title;

  const images =
    post.thumbnail_url
      ? [{ url: post.thumbnail_url }]
      : undefined;

  return {
    metadataBase: base,
    title: { default: title, template: "%s | Enviro World" },
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: "Enviro World",
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images?.map((i) => (typeof i === "string" ? i : i.url)),
    },
    authors: [{ name: post.author }], // author là string
    other: {
      "article:published_time": post.created_at ?? post.publishedAt,
      ...(post.updated_at || post.updatedAt
        ? { "article:modified_time": post.updated_at ?? post.updatedAt }
        : {}),
    },
  };
}

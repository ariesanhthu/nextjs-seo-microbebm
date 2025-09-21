import type { Metadata } from "next";
import { fetchBlogSlugServerCached } from "@/lib/fetchers/blogSlug.fetcher";

function normalizeBaseUrl(input?: string | URL) {
  if (input instanceof URL) return input;
  const base =
    input ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://microbebm.com/";
  return new URL(base);
}

function absUrl(u: string | undefined | null, base: URL): string | undefined {
  if (!u) return undefined;
  try {
    return new URL(u, base).toString();
  } catch {
    return undefined;
  }
}

function toIsoOrUndefined(v: unknown): string | undefined {
  if (!v) return undefined;
  const d = new Date(v as any);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

function cleanDescription(s?: string): string | undefined {
  if (!s) return undefined;
  const text = s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  // cắt ~160 ký tự
  return text.length > 160 ? text.slice(0, 157) + "..." : text;
}

export async function generateBlogMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await fetchBlogSlugServerCached(params.slug);
  // post: { slug, title, excerpt?, author, thumbnail_url?, created_at?, updated_at?, publishedAt?, updatedAt?, tags?: string[], category?: string }

  if (!post) {
    return {
      title: "Bài viết không tồn tại",
      robots: { index: false, follow: false },
    };
  }

  const metadataBase = normalizeBaseUrl();
  const path = `/blog/${post.slug}`;
  const url = new URL(path, metadataBase).toString();

  const title = post.title;
  const description = cleanDescription(post.excerpt ?? post.title);

  const published = toIsoOrUndefined(post.created_at ?? post.publishedAt);
  const modified  = toIsoOrUndefined(post.updated_at ?? post.updatedAt);

  // Ảnh OG tuyệt đối + kèm size
  const ogImageUrl = absUrl(post.thumbnail_url, metadataBase);
  const ogImages = ogImageUrl
    ? [{ url: ogImageUrl, width: 1200, height: 630 }]
    : undefined;

  const authorName = post.author ?? "Enviro World";
  const tags = Array.isArray((post as any).tags) ? (post as any).tags as string[] : undefined;
  const category = (post as any).category as string | undefined;

  return {
    metadataBase,
    title: { default: title, template: "%s | Enviro World" },
    description,
    robots: {
      index: true,
      follow: true,
      // GoogleBot directives hữu ích
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: url,
      // Nếu có đa ngôn ngữ, khai báo ở đây:
      // languages: { "vi-VN": url, "en-US": urlEn },
      // types: { "application/rss+xml": new URL("/blog/feed.xml", metadataBase).toString() },
    },

    openGraph: {
      type: "article",
      url,
      siteName: "Enviro World",
      title,
      description,
      images: ogImages,
      // Article fields OG
      publishedTime: published,
      modifiedTime: modified,
      authors: [authorName],
      tags,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages?.map(i => (typeof i === "string" ? i : i.url)),
      // Nếu có: site: "@enviro_world", creator: "@enviro_world"
    },

    authors: [{ name: authorName }],

    // Meta “article:*” cho compatibility (song song với OG ở trên)
    other: {
      ...(published ? { "article:published_time": published } : {}),
      ...(modified ? { "article:modified_time": modified } : {}),
      ...(category ? { "article:section": category } : {}),
      ...(tags && tags.length ? { "article:tag": tags } : {}),
    },

    // Optional khác:
    // keywords: tags, // nếu bạn muốn
    // category,
    // formatDetection: { telephone: false, address: false, email: false },
  };
}

import { MetadataRoute } from "next"
import { BlogService } from "@/services/firebase/blog/blog.service"

export default async function sitemap(): Promise<MetadataRoute.Sitemap>
{
  const blogs = await BlogService.getAllForSitemap();

  const blogUrls: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `https://microbebm.com/blog/${blog.slug}`,
    lastModified: blog.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: "https://microbebm.com/",
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...blogUrls,
  ];
}

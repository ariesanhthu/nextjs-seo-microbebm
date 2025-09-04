import "server-only";             
import { cache } from "react";
import { BlogService } from '@/services/firebase/blog/blog.service';
import type { BlogResponseDto } from '@/lib/dto/blog.dto';

function toPlain(value: any): any {
  if (value == null) return value;
  if (Array.isArray(value)) return value.map(toPlain);
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object" && typeof (value as any).toDate === "function") {
    return (value as any).toDate().toISOString();
  }
  if (typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toPlain(v)]));
  }
  return value;
}

async function _fetchBlogSlugServer(slug: string): Promise<BlogResponseDto | null> {
  const raw = await BlogService.getBySlug(slug);
  return raw ? (toPlain(raw) as BlogResponseDto) : null;
}

export const fetchBlogSlugServerCached = cache(_fetchBlogSlugServer);

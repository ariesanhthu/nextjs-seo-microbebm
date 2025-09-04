import { headers } from "next/headers";

export async function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) return new URL(envUrl);

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return new URL(`https://${vercel}`);

  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    const proto = h.get("x-forwarded-proto") || (host?.startsWith("localhost") ? "http" : "https");
    if (host) return new URL(`${proto}://${host}`);
  } catch {}

  const port = process.env.PORT || "3000";
  return new URL(`http://localhost:${port}`);
}

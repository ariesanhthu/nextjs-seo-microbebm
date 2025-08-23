// app/api/placeholder/[width]/[height]/route.ts
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: any
  ): Promise<Response> {
    const {width, height} = context.params as { width: string | 100; height: string | 100 } 
    // { params }: { params: { width: string; height: string } }
//   const width = parseInt(params.width) || 100;
//   const height = parseInt(params.height) || 100;

  // Tạo ảnh SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#ddd"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="#666">
        ${width}x${height}
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400' // Cache 24h
    }
  });
}
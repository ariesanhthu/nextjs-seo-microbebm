"use client"

import React from "react"

export interface ContentPreviewProps {
  html: string
  className?: string
  previewClassName?: string
}

export function processContentForPreview(html: string): string {
  return html
    .replace(
      /<table[^>]*>[\s\S]*?<\/table>/gi,
      (match) => {
        return `<div class="table-responsive">${match}</div>`
      }
    )
    .replace(
      /<img[^>]*src="[^"]*"[^>]*alt="([^"]*)"[^>]*\/?>(?!<\/img>)/gi,
      (_match, altText) => {
        const displayText = altText || "No alt text provided"
        return `<div class="image-placeholder" style="
          background: #f3f4f6;
          border: 2px dashed #d1d5db;
          border-radius: 0.375rem;
          padding: 0.75rem 1rem;
          color: #6b7280;
          font-style: italic;
          font-size: 0.875rem;
          text-align: center;
          margin: 0.5rem 0;
          display: inline-block;
          min-width: 200px;
        ">📷 Ảnh: ${displayText}</div>`
      }
    )
    .replace(
      /<img[^>]*alt="([^"]*)"[^>]*src="[^"]*"[^>]*\/?>(?!<\/img>)/gi,
      (_match, altText) => {
        const displayText = altText || "No alt text provided"
        return `<div class="image-placeholder" style="
          background: #f3f4f6;
          border: 2px dashed #d1d5db;
          border-radius: 0.375rem;
          padding: 0.75rem 1rem;
          color: #6b7280;
          font-style: italic;
          font-size: 0.875rem;
          text-align: center;
          margin: 0.5rem 0;
          display: inline-block;
          min-width: 200px;
        ">📷 Ảnh: ${displayText}</div>`
      }
    )
    .replace(
      /<img[^>]*src="[^"]*"[^>]*(?!alt=)[^>]*\/?>(?!<\/img>)/gi,
      `<div class="image-placeholder" style="
        background: #fef2f2;
        border: 2px dashed #fca5a5;
        border-radius: 0.375rem;
        padding: 0.75rem 1rem;
        color: #dc2626;
        font-style: italic;
        font-size: 0.875rem;
        text-align: center;
        margin: 0.5rem 0;
        display: inline-block;
        min-width: 200px;
      ">Ảnh: không có mô tả</div>`
    )
}

export default function ContentPreview({ html, className, previewClassName }: ContentPreviewProps) {
  return (
    <div className={className}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .blog-preview ul {
              list-style-type: disc !important;
              padding-left: 1.5rem !important;
              margin: 1rem 0 !important;
            }
            .blog-preview ol {
              list-style-type: decimal !important;
              padding-left: 1.5rem !important;
              margin: 1rem 0 !important;
            }
            .blog-preview li {
              margin: 0.25rem 0 !important;
              display: list-item !important;
            }
            .blog-preview ul ul {
              list-style-type: circle !important;
              margin: 0.25rem 0 !important;
            }
            .blog-preview ul ul ul {
              list-style-type: square !important;
            }
            .blog-preview input[type="checkbox"] {
              margin-right: 0.5rem;
            }
            .blog-preview h1 { color: #111827; font-size: 2.25rem; font-weight: 800; margin: 2rem 0 1rem 0; }
            .blog-preview h2 { color: #111827; font-size: 1.875rem; font-weight: 700; margin: 1.5rem 0 0.75rem 0; }
            .blog-preview h3 { color: #111827; font-size: 1.5rem; font-weight: 600; margin: 1.25rem 0 0.5rem 0; }
            .blog-preview h4 { color: #111827; font-size: 1.25rem; font-weight: 600; margin: 1rem 0 0.5rem 0; }
            .blog-preview p { color: #374151; margin: 0.75rem 0; line-height: 1.625; }
            .blog-preview strong { color: #111827; font-weight: 600; }
            .blog-preview code { color: #db2777; background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; }
            .blog-preview blockquote { border-left: 4px solid #3b82f6; background: #eff6ff; padding: 0.5rem 1rem; margin: 1rem 0; }
            .blog-preview table { 
              border-collapse: collapse !important; 
              width: 100% !important; 
              margin: 1rem 0 !important;
              border: 1px solid #d1d5db !important;
              font-size: clamp(0.875rem, 2vw, 1rem) !important;
              min-width: 100% !important;
            }
            .blog-preview .table-responsive {
              overflow-x: auto !important;
              -webkit-overflow-scrolling: touch !important;
              margin: 1rem 0 !important;
              border-radius: 0.5rem !important;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
              position: relative !important;
            }
            .blog-preview .table-responsive::after {
              content: "← Vuốt để xem thêm →" !important;
              position: absolute !important;
              bottom: 0.25rem !important;
              right: 0.5rem !important;
              font-size: 0.6rem !important;
              color: #9ca3af !important;
              background: rgba(255, 255, 255, 0.9) !important;
              padding: 0.125rem 0.25rem !important;
              border-radius: 0.125rem !important;
              pointer-events: none !important;
              opacity: 0 !important;
              transition: opacity 0.3s ease !important;
            }
            @media (max-width: 768px) {
              .blog-preview .table-responsive::after {
                opacity: 1 !important;
              }
            }
            .blog-preview .table-responsive table {
              margin: 0 !important;
              min-width: 600px !important;
            }
            @media (max-width: 768px) {
              .blog-preview .table-responsive {
                margin: 0.75rem 0 !important;
                border-radius: 0.375rem !important;
              }
              .blog-preview table {
                font-size: 0.75rem !important;
                border-radius: 0.375rem !important;
              }
              .blog-preview th, .blog-preview td {
                padding: 0.375rem 0.5rem !important;
                white-space: nowrap !important;
              }
              .blog-preview th {
                font-size: 0.7rem !important;
                font-weight: 700 !important;
                text-transform: uppercase !important;
                letter-spacing: 0.025em !important;
              }
            }
            @media (max-width: 480px) {
              .blog-preview .table-responsive {
                margin: 0.5rem 0 !important;
                border-radius: 0.25rem !important;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
              }
              .blog-preview table {
                font-size: 0.7rem !important;
                border-radius: 0.25rem !important;
                min-width: 500px !important;
              }
              .blog-preview th, .blog-preview td {
                padding: 0.25rem 0.375rem !important;
                white-space: nowrap !important;
              }
              .blog-preview th {
                font-size: 0.65rem !important;
                font-weight: 700 !important;
                text-transform: uppercase !important;
                letter-spacing: 0.025em !important;
                background-color: #f3f4f6 !important;
              }
              .blog-preview td {
                font-size: 0.65rem !important;
                line-height: 1.3 !important;
              }
              .blog-preview tr:nth-child(even) {
                background-color: #fafafa !important;
              }
            }
            @media (max-width: 360px) {
              .blog-preview table {
                min-width: 450px !important;
              }
              .blog-preview th, .blog-preview td {
                padding: 0.2rem 0.3rem !important;
              }
              .blog-preview th {
                font-size: 0.6rem !important;
              }
              .blog-preview td {
                font-size: 0.6rem !important;
              }
            }
            .blog-preview th { 
              border: 1px solid #d1d5db !important; 
              background-color: #f9fafb !important; 
              padding: 0.5rem !important; 
              text-align: left !important;
              font-weight: 600 !important;
            }
            .blog-preview td { 
              border: 1px solid #d1d5db !important; 
              padding: 0.5rem !important; 
            }
            .blog-preview tr:nth-child(even) { 
              background-color: #f9fafb !important; 
            }
            .image-placeholder { transition: all 0.2s ease; }
            .image-placeholder:hover { background: #e5e7eb !important; border-color: #9ca3af !important; }
          `,
        }}
      />
      <div
        className={"blog-preview prose prose-lg max-w-none" + (previewClassName ? ` ${previewClassName}` : "")}
        dangerouslySetInnerHTML={{ __html: processContentForPreview(html) }}
      />
    </div>
  )
}



"use client"

import React from "react"

export interface ContentPreviewProps {
  html: string
  className?: string
  previewClassName?: string
}

export function processContentForPreview(html: string): string {
  return html
    // Xử lý bảng với responsive wrapper
    .replace(
      /<table[^>]*>[\s\S]*?<\/table>/gi,
      (match) => {
        return `<div class="table-responsive">${match}</div>`
      }
    )
    // Xử lý hình ảnh có alt text
    .replace(
      /<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>(?!<\/img>)/gi,
      (_match, src, altText) => {
        const displayText = altText || "Không có mô tả"
        return `<div class="image-container">
          <img src="${src}" alt="${altText}" class="responsive-image" loading="lazy" />
          <div class="image-caption">📷 ${displayText}</div>
        </div>`
      }
    )
    // Xử lý hình ảnh không có alt text
    .replace(
      /<img[^>]*src="([^"]*)"[^>]*(?!alt=)[^>]*\/?>(?!<\/img>)/gi,
      (_match, src) => {
        return `<div class="image-container">
          <img src="${src}" alt="Hình ảnh" class="responsive-image" loading="lazy" />
          <div class="image-caption warning">⚠️ Hình ảnh thiếu mô tả</div>
        </div>`
      }
    )
    // Xử lý code blocks với syntax highlighting
    .replace(
      /<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi,
      (match, code) => {
        return `<div class="code-block-wrapper">
          <div class="code-block-header">
            <span class="code-block-title">Code</span>
            <button class="copy-button" onclick="copyToClipboard(this)">📋 Copy</button>
          </div>
          <pre class="code-block"><code>${code}</code></pre>
        </div>`
      }
    )
    // Xử lý links với external indicator
    .replace(
      /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi,
      (match, href, text) => {
        const isExternal = href.startsWith('http') && !href.includes(window?.location?.hostname || '')
        const externalIcon = isExternal ? '🔗' : ''
        return `<a href="${href}" class="content-link" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>
          ${text} ${externalIcon}
        </a>`
      }
    )
}

export default function ContentPreview({ html, className, previewClassName }: ContentPreviewProps) {
  return (
    <div className={className}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Typography */
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
            
            /* Image Styles */
            .image-container {
              margin: 1.5rem 0;
              text-align: center;
              border-radius: 0.5rem;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .responsive-image {
              width: 100%;
              height: auto;
              max-width: 100%;
              display: block;
              transition: transform 0.3s ease;
            }
            .responsive-image:hover {
              transform: scale(1.02);
            }
            .image-caption {
              background: #f8fafc;
              padding: 0.5rem 1rem;
              font-size: 0.875rem;
              color: #64748b;
              border-top: 1px solid #e2e8f0;
              font-style: italic;
            }
            .image-caption.warning {
              background: #fef2f2;
              color: #dc2626;
              border-top-color: #fca5a5;
            }
            
            /* Code Block Styles */
            .code-block-wrapper {
              margin: 1.5rem 0;
              border-radius: 0.5rem;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .code-block-header {
              background: #1f2937;
              color: #f9fafb;
              padding: 0.75rem 1rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 0.875rem;
            }
            .code-block-title {
              font-weight: 600;
            }
            .copy-button {
              background: #374151;
              color: #f9fafb;
              border: none;
              padding: 0.25rem 0.5rem;
              border-radius: 0.25rem;
              cursor: pointer;
              font-size: 0.75rem;
              transition: background 0.2s ease;
            }
            .copy-button:hover {
              background: #4b5563;
            }
            .code-block {
              background: #111827;
              color: #f9fafb;
              padding: 1rem;
              margin: 0;
              overflow-x: auto;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              font-size: 0.875rem;
              line-height: 1.5;
            }
            .code-block code {
              background: transparent !important;
              color: inherit !important;
              padding: 0 !important;
            }
            
            /* Link Styles */
            .content-link {
              color: #2563eb;
              text-decoration: underline;
              text-decoration-color: #93c5fd;
              text-underline-offset: 2px;
              transition: all 0.2s ease;
            }
            .content-link:hover {
              color: #1d4ed8;
              text-decoration-color: #2563eb;
            }
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
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function copyToClipboard(button) {
              const codeBlock = button.parentElement.nextElementSibling;
              const code = codeBlock.querySelector('code').textContent;
              navigator.clipboard.writeText(code).then(() => {
                const originalText = button.textContent;
                button.textContent = '✅ Copied!';
                button.style.background = '#059669';
                setTimeout(() => {
                  button.textContent = originalText;
                  button.style.background = '#374151';
                }, 2000);
              }).catch(() => {
                button.textContent = '❌ Failed';
                setTimeout(() => {
                  button.textContent = '📋 Copy';
                }, 2000);
              });
            }
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



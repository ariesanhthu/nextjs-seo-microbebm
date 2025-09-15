"use client";

import React, { Suspense, lazy, useEffect, useMemo, useRef } from "react";

type LoaderResult = { default: React.ComponentType<any> };

interface LazyOnOpenProps<P extends Record<string, any> = Record<string, any>> {
  open: boolean;
  loader: () => Promise<LoaderResult>;
  fallback?: React.ReactNode;
  componentProps?: P;
  /**
   * Nếu true, preload module ngay khi mount để khi open không bị flash fallback
   */
  preload?: boolean;
  /**
   * Thay đổi cacheKey sẽ buộc tạo LazyComponent mới (remount)
   */
  cacheKey?: string | number;
  /**
   * Nếu true, không unmount khi close để tránh chớp khi mở lại
   */
  keepMounted?: boolean;
}

export default function LazyOnOpen<P extends Record<string, any>>({
  open,
  loader,
  fallback,
  componentProps,
  preload = true,
  cacheKey,
  keepMounted = false,
}: LazyOnOpenProps<P>) {
  const lazyRef = useRef<React.LazyExoticComponent<any> | null>(null);
  const lastKeyRef = useRef<string | number | undefined>(undefined);

  // Preload module sớm để tránh Suspense fallback khi open
  useEffect(() => {
    if (preload) {
      void loader();
    }
  }, [preload, loader]);

  // Tạo LazyComponent chỉ khi chưa có hoặc cacheKey thay đổi
  if (lazyRef.current === null || lastKeyRef.current !== cacheKey) {
    lazyRef.current = lazy(loader);
    lastKeyRef.current = cacheKey;
  }

  const LazyComponent = lazyRef.current;

  if (!open && !keepMounted) return null;

  return (
    <Suspense fallback={fallback ?? <div>Loading...</div>}>
      {/* Nếu keepMounted và không open, ẩn nội dung nhưng vẫn giữ mount */}
      <div style={!open ? { display: "none" } : undefined}>
        <LazyComponent {...(componentProps as any)} />
      </div>
    </Suspense>
  );
}



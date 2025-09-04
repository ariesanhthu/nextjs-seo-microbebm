"use client";

import React, { Suspense, lazy, useMemo } from "react";

type LoaderResult = { default: React.ComponentType<any> };

interface LazyOnOpenProps<P extends Record<string, any> = Record<string, any>> {
  open: boolean;
  loader: () => Promise<LoaderResult>;
  fallback?: React.ReactNode;
  componentProps?: P;
}

export default function LazyOnOpen<P extends Record<string, any>>({
  open,
  loader,
  fallback,
  componentProps,
}: LazyOnOpenProps<P>) {
  const LazyComponent = useMemo(() => lazy(loader), [loader]);

  if (!open) return null;

  return (
    <Suspense fallback={fallback ?? <div>Loading...</div>}>
      <LazyComponent {...(componentProps as any)} />
    </Suspense>
  );
}



// Hook to check if we're in admin context
"use client"

import { usePathname } from 'next/navigation'

export function useAdminContext() {
  const pathname = usePathname()
  return pathname.startsWith('/admin')
}

export function useUserContext() {
  const pathname = usePathname()
  return !pathname.startsWith('/admin')
}

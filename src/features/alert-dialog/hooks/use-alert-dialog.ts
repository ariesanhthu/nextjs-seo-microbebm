// Custom hook for reusable AlertDialog functionality

import { useState, useCallback } from 'react'

export interface AlertDialogConfig {
  title: string
  description: string
  actionText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

export interface UseAlertDialogReturn {
  isOpen: boolean
  config: AlertDialogConfig | null
  showAlert: (config: AlertDialogConfig) => Promise<boolean>
  closeAlert: () => void
  handleAction: () => void
  handleCancel: () => void
}

export function useAlertDialog(): UseAlertDialogReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<AlertDialogConfig | null>(null)
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null)

  const showAlert = useCallback((alertConfig: AlertDialogConfig): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setConfig({
        actionText: 'Đồng ý',
        cancelText: 'Hủy',
        variant: 'default',
        ...alertConfig
      })
      setResolvePromise(() => resolve)
      setIsOpen(true)
    })
  }, [])

  const closeAlert = useCallback(() => {
    setIsOpen(false)
    setConfig(null)
    setResolvePromise(null)
  }, [])

  const handleAction = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(true)
    }
    closeAlert()
  }, [resolvePromise, closeAlert])

  const handleCancel = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(false)
    }
    closeAlert()
  }, [resolvePromise, closeAlert])

  return {
    isOpen,
    config,
    showAlert,
    closeAlert,
    handleAction,
    handleCancel
  }
}

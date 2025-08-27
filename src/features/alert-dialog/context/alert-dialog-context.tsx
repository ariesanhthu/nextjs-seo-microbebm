// Global AlertDialog context for app-wide usage

"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { useAlertDialog, AlertDialogConfig, UseAlertDialogReturn } from '@/features/alert-dialog/hooks/use-alert-dialog'
import { ReusableAlertDialog } from '@/features/alert-dialog/components/reusable-alert-dialog'

interface AlertDialogContextType {
  showAlert: (config: AlertDialogConfig) => Promise<boolean>
}

const AlertDialogContext = createContext<AlertDialogContextType | null>(null)

interface AlertDialogProviderProps {
  children: ReactNode
}

export function AlertDialogProvider({ children }: AlertDialogProviderProps) {
  const alertDialog = useAlertDialog()

  return (
    <AlertDialogContext.Provider 
      value={{ 
        showAlert: alertDialog.showAlert 
      }}
    >
      {children}
      <ReusableAlertDialog
        isOpen={alertDialog.isOpen}
        config={alertDialog.config}
        onAction={alertDialog.handleAction}
        onCancel={alertDialog.handleCancel}
        onOpenChange={(open) => {
          if (!open) alertDialog.closeAlert()
        }}
      />
    </AlertDialogContext.Provider>
  )
}

export function useGlobalAlert(): AlertDialogContextType {
  const context = useContext(AlertDialogContext)
  if (!context) {
    throw new Error('useGlobalAlert must be used within an AlertDialogProvider')
  }
  return context
}

// Convenience functions for common alert types
export function useConfirmation() {
  const { showAlert } = useGlobalAlert()
  
  return {
    confirm: (title: string, description?: string) =>
      showAlert({
        title,
        description: description || 'Bạn có chắc chắn muốn thực hiện hành động này?',
        actionText: 'Đồng ý',
        cancelText: 'Hủy',
        variant: 'default'
      }),
    
    delete: (title: string, description?: string) =>
      showAlert({
        title,
        description: description || 'Hành động này không thể hoàn tác.',
        actionText: 'Xóa',
        cancelText: 'Hủy',
        variant: 'destructive'
      }),
    
    save: (title: string, description?: string) =>
      showAlert({
        title,
        description: description || 'Bạn có muốn lưu các thay đổi?',
        actionText: 'Lưu',
        cancelText: 'Hủy',
        variant: 'default'
      }),
    
    custom: (config: AlertDialogConfig) => showAlert(config)
  }
}

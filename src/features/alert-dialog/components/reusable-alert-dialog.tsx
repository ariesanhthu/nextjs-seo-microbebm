// Reusable AlertDialog component

"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertDialogConfig } from "@/features/alert-dialog/hooks/use-alert-dialog"
import { cn } from "@/lib/utils"

interface ReusableAlertDialogProps {
  isOpen: boolean
  config: AlertDialogConfig | null
  onAction: () => void
  onCancel: () => void
  onOpenChange?: (open: boolean) => void
}

export function ReusableAlertDialog({
  isOpen,
  config,
  onAction,
  onCancel,
  onOpenChange
}: ReusableAlertDialogProps) {
  if (!config) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{config.title}</AlertDialogTitle>
          {config.description && (
            <AlertDialogDescription>
              {config.description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {config.cancelText || 'Hủy'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onAction}
            className={cn(
              config.variant === 'destructive' && 
              'bg-destructive text-destructive-foreground hover:bg-destructive/90'
            )}
          >
            {config.actionText || 'Đồng ý'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

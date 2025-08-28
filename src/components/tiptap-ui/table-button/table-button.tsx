"use client"

import * as React from "react"

// --- Tiptap UI ---
import type { UseTableConfig } from "./use-table"
import {
  TABLE_SHORTCUT_KEY,
  useTable,
} from "./use-table"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Lib ---
import { parseShortcutKeys } from "@/lib/tiptap-utils"

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Badge } from "@/components/tiptap-ui-primitive/badge"

export interface TableButtonProps
  extends Omit<ButtonProps, "type">,
    UseTableConfig {
  /**
   * Optional text to display alongside the icon.
   */
  text?: string
  /**
   * Optional show shortcut keys in the button.
   * @default false
   */
  showShortcut?: boolean
}

export function TableShortcutBadge({
  shortcutKeys = TABLE_SHORTCUT_KEY,
}: {
  shortcutKeys?: string
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>
}

/**
 * Button component for inserting tables in a Tiptap editor.
 *
 * For custom button implementations, use the `useTable` hook instead.
 */
export const TableButton = React.forwardRef<
  HTMLButtonElement,
  TableButtonProps
>(({ text, showShortcut = false, ...props }, ref) => {
  const { editor } = useTiptapEditor()
  const { icon: Icon, isAvailable, isVisible, insertTable } = useTable({
    editor,
    ...props,
  })

  if (!isVisible) return null

  return (
    <Button
      ref={ref}
      data-style="ghost"
      disabled={!isAvailable}
      onClick={insertTable}
      {...props}
    >
      <Icon className="tiptap-button-icon" />
      {text && <span className="tiptap-button-text">{text}</span>}
      {showShortcut && <TableShortcutBadge />}
    </Button>
  )
})

TableButton.displayName = "TableButton"

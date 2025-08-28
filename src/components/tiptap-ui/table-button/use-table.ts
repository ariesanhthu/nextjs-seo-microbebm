"use client"

import * as React from "react"
import type { Editor } from "@tiptap/react"
import { useHotkeys } from "react-hotkeys-hook"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"
import { useIsMobile } from "@/hooks/use-mobile"

// --- Icons ---
import { TableIcon } from "@/components/tiptap-icons/table-icon"

// --- UI Utils ---
import {
  isNodeInSchema,
} from "@/lib/tiptap-utils"

export const TABLE_SHORTCUT_KEY = "mod+alt+t"

/**
 * Configuration for the table functionality
 */
export interface UseTableConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * Whether the button should hide when table is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful table creation.
   */
  onTableCreated?: () => void
}

/**
 * Checks if a table can be inserted in the current editor state
 */
export function canInsertTable(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false

  // Check if table node is available in the schema
  if (!isNodeInSchema("table", editor)) return false

  // Check if we can insert a table at the current position
  return editor.can().insertTable({ rows: 3, cols: 3, withHeaderRow: true })
}

/**
 * Inserts a table in the editor
 */
export function insertTable(
  editor: Editor | null,
  options: { rows?: number; cols?: number; withHeaderRow?: boolean } = {}
): boolean {
  if (!canInsertTable(editor)) return false

  const { rows = 3, cols = 3, withHeaderRow = true } = options

  try {
    editor!.chain().focus().insertTable({ rows, cols, withHeaderRow }).run()
    return true
  } catch (error) {
    console.error("Failed to insert table:", error)
    return false
  }
}

/**
 * Hook for table functionality in Tiptap editor
 */
export function useTable(config: UseTableConfig = {}) {
  const { hideWhenUnavailable = false, onTableCreated } = config
  const { editor } = useTiptapEditor(config.editor)
  const isMobile = useIsMobile()

  // Table insertion handler
  const handleInsertTable = React.useCallback(() => {
    if (insertTable(editor)) {
      onTableCreated?.()
    }
  }, [editor, onTableCreated])

  // Keyboard shortcut
  useHotkeys(
    TABLE_SHORTCUT_KEY,
    (event) => {
      event.preventDefault()
      handleInsertTable()
    },
    {
      enabled: canInsertTable(editor),
      enableOnContentEditable: !isMobile,
    }
  )

  // Compute states
  const isAvailable = React.useMemo(
    () => canInsertTable(editor),
    [editor, editor?.state, editor?.isEditable]
  )

  const isVisible = React.useMemo(
    () => (hideWhenUnavailable ? isAvailable : true),
    [hideWhenUnavailable, isAvailable]
  )

  return React.useMemo(
    () => ({
      icon: TableIcon,
      isAvailable,
      isVisible,
      insertTable: handleInsertTable,
      canInsertTable: () => canInsertTable(editor),
    }),
    [isAvailable, isVisible, handleInsertTable, editor]
  )
}

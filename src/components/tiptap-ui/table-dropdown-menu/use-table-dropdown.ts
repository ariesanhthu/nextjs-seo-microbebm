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
export const MERGE_CELLS_SHORTCUT_KEY = "mod+shift+m"
export const SPLIT_CELL_SHORTCUT_KEY = "mod+shift+s"

/**
 * Configuration for the table dropdown functionality
 */
export interface UseTableDropdownConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * Whether the dropdown should hide when table operations are not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful table operation.
   */
  onTableOperation?: (operation: string) => void
}

/**
 * Table size interface
 */
export interface TableSize {
  rows?: number
  cols?: number
  withHeaderRow?: boolean
}

/**
 * Checks if a table can be inserted in the current editor state
 */
export function canInsertTable(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false

  // Check if table node is available in the schema
  if (!isNodeInSchema("table", editor)) return false

  // Prevent inserting a table inside another table
  if (isInTable(editor)) return false

  // Check if we can insert a table at the current position
  return editor.can().insertTable({ rows: 3, cols: 3, withHeaderRow: true })
}

/**
 * Checks if cells can be merged
 */
export function canMergeCells(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  return editor.can().mergeCells()
}

/**
 * Checks if a cell can be split
 */
export function canSplitCell(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  return editor.can().splitCell()
}

/**
 * Checks if we're currently in a table
 */
export function isInTable(editor: Editor | null): boolean {
  if (!editor) return false
  return editor.isActive("table")
}

/**
 * Inserts a table with specified dimensions
 */
export function insertTable(
  editor: Editor | null,
  options: TableSize = {}
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
 * Merges selected cells
 */
export function mergeCells(editor: Editor | null): boolean {
  if (!canMergeCells(editor)) return false

  try {
    editor!.chain().focus().mergeCells().run()
    return true
  } catch (error) {
    console.error("Failed to merge cells:", error)
    return false
  }
}

/**
 * Splits the current cell
 */
export function splitCell(editor: Editor | null): boolean {
  if (!canSplitCell(editor)) return false

  try {
    editor!.chain().focus().splitCell().run()
    return true
  } catch (error) {
    console.error("Failed to split cell:", error)
    return false
  }
}

/**
 * Adds a row above the current row
 */
export function addRowBefore(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable || !isInTable(editor)) return false

  try {
    editor.chain().focus().addRowBefore().run()
    return true
  } catch (error) {
    console.error("Failed to add row before:", error)
    return false
  }
}

/**
 * Adds a row below the current row
 */
export function addRowAfter(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable || !isInTable(editor)) return false

  try {
    editor.chain().focus().addRowAfter().run()
    return true
  } catch (error) {
    console.error("Failed to add row after:", error)
    return false
  }
}

/**
 * Adds a column to the left of the current column
 */
export function addColumnBefore(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable || !isInTable(editor)) return false

  try {
    editor.chain().focus().addColumnBefore().run()
    return true
  } catch (error) {
    console.error("Failed to add column before:", error)
    return false
  }
}

/**
 * Adds a column to the right of the current column
 */
export function addColumnAfter(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable || !isInTable(editor)) return false

  try {
    editor.chain().focus().addColumnAfter().run()
    return true
  } catch (error) {
    console.error("Failed to add column after:", error)
    return false
  }
}

/**
 * Deletes the current row
 */
export function deleteRow(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable || !isInTable(editor)) return false

  try {
    editor.chain().focus().deleteRow().run()
    return true
  } catch (error) {
    console.error("Failed to delete row:", error)
    return false
  }
}

/**
 * Deletes the current column
 */
export function deleteColumn(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable || !isInTable(editor)) return false

  try {
    editor.chain().focus().deleteColumn().run()
    return true
  } catch (error) {
    console.error("Failed to delete column:", error)
    return false
  }
}

/**
 * Deletes the entire table
 */
export function deleteTable(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable || !isInTable(editor)) return false

  try {
    editor.chain().focus().deleteTable().run()
    return true
  } catch (error) {
    console.error("Failed to delete table:", error)
    return false
  }
}

/**
 * Hook for table dropdown functionality in Tiptap editor
 */
export function useTableDropdown(config: UseTableDropdownConfig = {}) {
  const { hideWhenUnavailable = false, onTableOperation } = config
  const { editor } = useTiptapEditor(config.editor)
  const isMobile = useIsMobile()

  // Table operation handlers
  const handleInsertTable = React.useCallback((size: TableSize) => {
    if (insertTable(editor, size)) {
      onTableOperation?.("insertTable")
    }
  }, [editor, onTableOperation])

  const handleMergeCells = React.useCallback(() => {
    if (mergeCells(editor)) {
      onTableOperation?.("mergeCells")
    }
  }, [editor, onTableOperation])

  const handleSplitCell = React.useCallback(() => {
    if (splitCell(editor)) {
      onTableOperation?.("splitCell")
    }
  }, [editor, onTableOperation])

  // Keyboard shortcuts
  useHotkeys(
    TABLE_SHORTCUT_KEY,
    (event) => {
      event.preventDefault()
      handleInsertTable({ rows: 3, cols: 3, withHeaderRow: true })
    },
    {
      enabled: canInsertTable(editor),
      enableOnContentEditable: !isMobile,
    }
  )

  useHotkeys(
    MERGE_CELLS_SHORTCUT_KEY,
    (event) => {
      event.preventDefault()
      handleMergeCells()
    },
    {
      enabled: canMergeCells(editor),
      enableOnContentEditable: !isMobile,
    }
  )

  useHotkeys(
    SPLIT_CELL_SHORTCUT_KEY,
    (event) => {
      event.preventDefault()
      handleSplitCell()
    },
    {
      enabled: canSplitCell(editor),
      enableOnContentEditable: !isMobile,
    }
  )

  // Compute states
  const isAvailable = React.useMemo(
    () => canInsertTable(editor) || isInTable(editor),
    [editor, editor?.state, editor?.isEditable]
  )

  const isVisible = React.useMemo(
    () => (hideWhenUnavailable ? isAvailable : true),
    [hideWhenUnavailable, isAvailable]
  )

  const tableState = React.useMemo(() => ({
    canInsert: canInsertTable(editor),
    canMerge: canMergeCells(editor),
    canSplit: canSplitCell(editor),
    inTable: isInTable(editor),
  }), [editor, editor?.state, editor?.isEditable])

  return React.useMemo(
    () => ({
      icon: TableIcon,
      isAvailable,
      isVisible,
      tableState,
      insertTable: handleInsertTable,
      mergeCells: handleMergeCells,
      splitCell: handleSplitCell,
      addRowBefore: () => addRowBefore(editor),
      addRowAfter: () => addRowAfter(editor),
      addColumnBefore: () => addColumnBefore(editor),
      addColumnAfter: () => addColumnAfter(editor),
      deleteRow: () => deleteRow(editor),
      deleteColumn: () => deleteColumn(editor),
      deleteTable: () => deleteTable(editor),
    }),
    [isAvailable, isVisible, tableState, handleInsertTable, handleMergeCells, handleSplitCell, editor]
  )
}

"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Icons ---
import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon"
import { TableIcon } from "@/components/tiptap-icons/table-icon"
import { MergeCellsIcon } from "@/components/tiptap-icons/merge-cells-icon"
import { SplitCellsIcon } from "@/components/tiptap-icons/split-cells-icon"
import { AddRowIcon } from "@/components/tiptap-icons/add-row-icon"
import { AddColumnIcon } from "@/components/tiptap-icons/add-column-icon"
import { DeleteRowIcon } from "@/components/tiptap-icons/delete-row-icon"
import { DeleteColumnIcon } from "@/components/tiptap-icons/delete-column-icon"
import { DeleteTableIcon } from "@/components/tiptap-icons/delete-table-icon"

// --- Tiptap UI ---
import { useTableDropdown } from "./use-table-dropdown"
import { TableSizePicker } from "./table-size-picker"

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { Button, ButtonGroup } from "@/components/tiptap-ui-primitive/button"
import { Separator } from "@/components/tiptap-ui-primitive/separator"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/tiptap-ui-primitive/dropdown-menu"

export interface TableDropdownMenuProps extends Omit<ButtonProps, "type"> {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor
  /**
   * Whether the dropdown should be hidden when no table operations are available
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback for when the dropdown opens or closes
   */
  onOpenChange?: (isOpen: boolean) => void
  /**
   * Whether to render the dropdown menu in a portal
   * @default false
   */
  portal?: boolean
}

export const TableDropdownMenu = React.forwardRef<
  HTMLButtonElement,
  TableDropdownMenuProps
>(({ hideWhenUnavailable = false, onOpenChange, portal = false, ...props }, ref) => {
  const { editor } = useTiptapEditor()
  const [isTablePickerOpen, setIsTablePickerOpen] = React.useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)

  const {
    icon: Icon,
    isVisible,
    tableState,
    insertTable,
    mergeCells,
    splitCell,
    addRowBefore,
    addRowAfter,
    addColumnBefore,
    addColumnAfter,
    deleteRow,
    deleteColumn,
    deleteTable,
  } = useTableDropdown({
    editor,
    hideWhenUnavailable,
    onTableOperation: (operation) => {
      setIsTablePickerOpen(false)
      setIsDropdownOpen(false)
      console.log(`Table operation: ${operation}`)
    },
  })

  const handleTablePickerOpenChange = React.useCallback(
    (open: boolean) => {
      setIsTablePickerOpen(open)
      if (open) {
        setIsDropdownOpen(false) // Close dropdown when table picker opens
      }
      onOpenChange?.(open)
    },
    [onOpenChange]
  )

  const handleDropdownOpenChange = React.useCallback(
    (open: boolean) => {
      setIsDropdownOpen(open)
      if (open) {
        setIsTablePickerOpen(false) // Close table picker when dropdown opens
      }
      onOpenChange?.(open)
    },
    [onOpenChange]
  )

  const handleTableSizeSelect = React.useCallback(
    (rows: number, cols: number) => {
      insertTable({ rows, cols, withHeaderRow: true })
      setIsTablePickerOpen(false)
    },
    [insertTable]
  )

  const handleQuickInsert = React.useCallback(() => {
    insertTable({ rows: 3, cols: 3, withHeaderRow: true })
  }, [insertTable])

  if (!isVisible) return null

  return (
    <ButtonGroup orientation="horizontal">
      {/* Table Icon Button - For inserting tables */}
      <DropdownMenu modal open={isTablePickerOpen} onOpenChange={handleTablePickerOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button 
            ref={ref} 
            data-style="ghost" 
            data-state={isTablePickerOpen ? "open" : "closed"}
            disabled={!tableState.canInsert} 
            {...props}
          >
            <Icon className="tiptap-button-icon" />
            <span className="tiptap-button-text">Table</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-auto min-w-[200px] tiptap-card" align="start" portal={true}>
          {/* Table Size Picker */}
          {tableState.canInsert && (
            <>
              <div className="px-2 py-1">
                <TableSizePicker onSizeSelect={handleTableSizeSelect} />
              </div>
            </>
          )}
          
          {/* Show message when can't insert */}
          {!tableState.canInsert && (
            <div className="px-4 py-2 text-sm text-muted-foreground">
              Cannot insert table here
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dropdown Arrow Button - For table operations */}
      <DropdownMenu modal open={isDropdownOpen} onOpenChange={handleDropdownOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button 
            data-style="ghost" 
            data-state={isDropdownOpen ? "open" : "closed"}
            className="px-2"
          >
            <ChevronDownIcon className="tiptap-button-icon" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="tiptap-card p-2" align="start" portal={true}>
          {/* Cell Operations */}

          <DropdownMenuItem
            onClick={mergeCells}
            disabled={!tableState.canMerge || !tableState.inTable}
            className="flex items-center w-full gap-2"
          >
            <Button ref={ref} data-style="ghost" {...props} className="w-full text-left">
              <MergeCellsIcon className="tiptap-button-icon" />
              <span className="tiptap-button-text">Merge Cells</span>
            </Button>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={splitCell}
            disabled={!tableState.canSplit || !tableState.inTable}
            className="flex items-center w-full gap-2"
          >
            <Button ref={ref} data-style="ghost" {...props} className="w-full text-left">
              <SplitCellsIcon className="tiptap-button-icon" />
              <span className="tiptap-button-text">  Split Cell </span>
            </Button>
          </DropdownMenuItem>
          <Separator className="my-1" orientation="horizontal"/>
          
          {/* Row Operations */}
          <DropdownMenuItem 
            onClick={addRowBefore} 
            disabled={!tableState.inTable} 
            className="flex gap-2 w-full"
          >
            <Button ref={ref} data-style="ghost" {...props} className="w-full text-left">
              <AddRowIcon className="tiptap-button-icon" />
              <span className="tiptap-button-text">Add Row Above</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={addRowAfter} 
            disabled={!tableState.inTable} 
            className="flex items-center w-full gap-2"
          >
            <Button ref={ref} data-style="ghost" {...props} className="w-full text-left">
              <AddRowIcon className="tiptap-button-icon transform rotate-180" />
              <span className="tiptap-button-text">Add Row Below</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={deleteRow} 
            disabled={!tableState.inTable} 
            className="flex items-center w-full gap-2"
          >
            <Button ref={ref} data-style="ghost" {...props} className="w-full text-left">
              <DeleteRowIcon className="tiptap-button-icon" />
              <span className="tiptap-button-text text-destructive">Delete Row</span>
            </Button>
          </DropdownMenuItem>
          <Separator className="my-1" orientation="horizontal"/>
          
          {/* Column Operations */}
          <DropdownMenuItem 
            onClick={addColumnBefore} 
            disabled={!tableState.inTable} 
            className="flex items-center w-full gap-2"
          >
            <Button ref={ref} data-style="ghost" {...props} className="w-full text-left">
              <AddColumnIcon className="tiptap-button-icon" />
              <span className="tiptap-button-text">Add Column Left</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={addColumnAfter} 
            disabled={!tableState.inTable} 
            className="flex items-center w-full gap-2"
          >
            <Button ref={ref} data-style="ghost" {...props} className="w-full text-left">
              <AddColumnIcon className="w-4 h-4 transform rotate-180" />
              <span className="tiptap-button-text">Add Column Right</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={deleteColumn} 
            disabled={!tableState.inTable} 
            className="flex items-center w-full gap-2"
          >
            <Button ref={ref} data-style="ghost" {...props} className="w-full text-left">
              <DeleteColumnIcon className="tiptap-button-icon" />
              <span className="tiptap-button-text text-destructive">Delete Column</span>
            </Button>
          </DropdownMenuItem>

          <Separator className="my-1" orientation="horizontal"/>

          {/* Table Operations */}
          <DropdownMenuItem 
            onClick={deleteTable} 
            disabled={!tableState.inTable} 
            className="flex items-center w-full gap-2"
          >
            <Button ref={ref} data-style="ghost" {...props} className="w-full text-left">
              <DeleteTableIcon className="tiptap-button-icon" />
              <span className="tiptap-button-text text-destructive">Delete Table</span>
            </Button>
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
})

TableDropdownMenu.displayName = "TableDropdownMenu"

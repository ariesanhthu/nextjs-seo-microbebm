"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import "./table-size-picker.scss"

export interface TableSizePickerProps {
  onSizeSelect: (rows: number, cols: number) => void
  maxRows?: number
  maxCols?: number
  className?: string
}

export function TableSizePicker({
  onSizeSelect,
  maxRows = 10,
  maxCols = 10,
  className,
}: TableSizePickerProps) {
  const [hoveredCell, setHoveredCell] = React.useState<{ row: number; col: number } | null>(null)

  const handleCellHover = (row: number, col: number) => {
    setHoveredCell({ row, col })
  }

  const handleCellClick = (row: number, col: number) => {
    onSizeSelect(row + 1, col + 1)
  }

  const renderGrid = () => {
    const cells = []
    for (let row = 0; row < maxRows; row++) {
      for (let col = 0; col < maxCols; col++) {
        const isHighlighted = hoveredCell && row <= hoveredCell.row && col <= hoveredCell.col
        cells.push(
          <div
            key={`${row}-${col}`}
            className={cn(
              "table-size-picker-cell",
              isHighlighted && "highlighted"
            )}
            onMouseEnter={() => handleCellHover(row, col)}
            onClick={() => handleCellClick(row, col)}
          />
        )
      }
    }
    return cells
  }

  const getSizeText = () => {
    if (!hoveredCell) return "Select table size"
    return `${hoveredCell.row + 1} × ${hoveredCell.col + 1}`
  }

  return (
    <div className={cn("table-size-picker", className)}>
      <div className="table-size-picker-text">
        {getSizeText()}
      </div>
      <div
        className="table-size-picker-grid"
        style={{
          gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
        }}
        onMouseLeave={() => setHoveredCell(null)}
      >
        {renderGrid()}
      </div>
      <div className="table-size-picker-hint">
        Click to insert table
      </div>
    </div>
  )
}

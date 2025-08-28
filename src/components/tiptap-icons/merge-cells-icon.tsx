import * as React from "react"

export const MergeCellsIcon = React.memo(
  ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        width="24"
        height="24"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path d="M3 3h18v18H3V3z" />
        <path d="M21 9H3" />
        <path d="M21 15H3" />
        <path d="M12 3v18" />
        <path d="M8 8l8 8" />
        <path d="M16 8l-8 8" />
      </svg>
    )
  }
)

MergeCellsIcon.displayName = "MergeCellsIcon"

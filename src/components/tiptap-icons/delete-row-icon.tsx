import * as React from "react"

export const DeleteRowIcon = React.memo(
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
        {/* Table structure */}
        <rect x="3" y="6" width="18" height="12" rx="1" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="6" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="18" />
        
        {/* Minus icon */}
        <circle cx="12" cy="3" r="2" fill="currentColor" />
        <line x1="10" y1="3" x2="14" y2="3" strokeWidth="1.5" />
      </svg>
    )
  }
)

DeleteRowIcon.displayName = "DeleteRowIcon"

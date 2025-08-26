 import * as React from "react"

export const DeleteColumnIcon = React.memo(
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
        <rect x="6" y="3" width="12" height="18" rx="1" />
        <line x1="12" y1="3" x2="12" y2="21" />
        <line x1="15" y1="3" x2="15" y2="21" />
        <line x1="6" y1="9" x2="18" y2="9" />
        <line x1="6" y1="15" x2="18" y2="15" />
        
        {/* Minus icon */}
        <circle cx="3" cy="12" r="2" fill="currentColor" />
        <line x1="1" y1="12" x2="5" y2="12" strokeWidth="1.5" />
      </svg>
    )
  }
)

DeleteColumnIcon.displayName = "DeleteColumnIcon"

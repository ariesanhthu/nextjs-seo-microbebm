import * as React from "react"

export const DeleteTableIcon = React.memo(
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
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="12" y1="3" x2="12" y2="21" />
        
        {/* X mark */}
        <line x1="8" y1="8" x2="16" y2="16" strokeWidth="2.5" stroke="#ef4444" />
        <line x1="16" y1="8" x2="8" y2="16" strokeWidth="2.5" stroke="#ef4444" />
      </svg>
    )
  }
)

DeleteTableIcon.displayName = "DeleteTableIcon"

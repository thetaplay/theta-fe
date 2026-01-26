import React from 'react'

interface SFSymbolProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export const ChevronLeft: React.FC<SFSymbolProps> = ({ size = 24, className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      {/* TODO: Paste SVG path dari SF Symbols app di sini */}
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  )
}

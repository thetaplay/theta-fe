import React from 'react'

interface SFSymbolProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export const ArrowUpRight: React.FC<SFSymbolProps> = ({ size = 24, className = '', ...props }) => {
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
      <path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

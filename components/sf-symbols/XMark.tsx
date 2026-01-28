import React from 'react'

interface SFSymbolProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export const XMark: React.FC<SFSymbolProps> = ({ size = 24, className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className}
      {...props}
    >
      <path d="M18 6L6 18M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

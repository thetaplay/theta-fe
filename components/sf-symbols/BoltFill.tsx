import React from 'react'

interface SFSymbolProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export const BoltFill: React.FC<SFSymbolProps> = ({ size = 24, className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 86.6699 139.502"
      fill="currentColor"
      className={className}
      {...props}
    >
      {/* SF Symbol: bolt.fill - Official dari Apple */}
      <path d="M0 77.1974C0 79.1994 1.5625 80.7619 3.85742 80.7619L39.6484 80.7619L20.7031 132.178C18.5547 137.842 24.3652 140.772 28.0762 136.182L85.0586 64.8927C85.9863 63.672 86.5234 62.549 86.5234 61.2794C86.5234 59.2775 85.0098 57.6662 82.7148 57.6662L46.875 57.6662L65.8691 6.29898C68.0176 0.58609 62.207-2.3436 58.4961 2.29507L1.51367 73.5841C0.585938 74.8048 0 75.9279 0 77.1974Z" />
    </svg>
  )
}

import React from 'react'

interface SFSymbolProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export const ArrowtriangleUpFill: React.FC<SFSymbolProps> = ({ size = 24, className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 99.707 102.588"
      fill="currentColor"
      className={className}
      {...props}
    >
      {/* SF Symbol: arrowtriangle.up.fill - Official dari Apple */}
      <path d="M99.707 95.7031C99.707 93.457 98.7305 91.6992 97.5586 89.2578L57.4219 6.34766C55.127 1.66016 52.9297 0.0488281 49.8535 0.0488281C46.8262 0.0488281 44.6289 1.66016 42.2852 6.34766L2.19727 89.2578C0.976562 91.748 0 93.5059 0 95.752C0 100 3.17383 102.588 8.20312 102.588L91.5527 102.539C96.5332 102.539 99.707 99.9512 99.707 95.7031Z" />
    </svg>
  )
}

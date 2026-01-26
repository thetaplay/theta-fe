import React from 'react'

interface SFSymbolProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export const ArrowtriangleDownFill: React.FC<SFSymbolProps> = ({ size = 24, className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 99.707 102.588"
      fill="currentColor"
      className={className}
      {...props}
    >
      {/* SF Symbol: arrowtriangle.down.fill - Official dari Apple */}
      <path d="M99.707 6.93359C99.707 2.73438 96.5332 0.0976562 91.5527 0.0976562L8.20312 0.0488281C3.17383 0.0488281 0 2.68555 0 6.88477C0 9.17969 0.976562 10.9375 2.19727 13.4277L42.2852 96.2891C44.6289 101.025 46.8262 102.588 49.8535 102.588C52.9297 102.588 55.127 101.025 57.4219 96.2891L97.5586 13.4277C98.7305 10.9863 99.707 9.22852 99.707 6.93359Z" />
    </svg>
  )
}

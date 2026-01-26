import React from 'react'

interface SFSymbolProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export const PersonFill: React.FC<SFSymbolProps> = ({ size = 24, className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 121.875 121.875"
      fill="currentColor"
      className={className}
      {...props}
    >
      {/* SF Symbol: person.fill */}
      <path d="M60.9375 63.7207C74.8535 63.7207 86.1328 52.4414 86.1328 38.4766C86.1328 24.5605 74.8535 13.2324 60.9375 13.2324C47.0215 13.2324 35.7422 24.5605 35.7422 38.4766C35.7422 52.4414 47.0215 63.7207 60.9375 63.7207ZM16.6504 108.887L105.225 108.887C111.475 108.887 115.088 105.225 115.088 99.2188C115.088 84.9121 95.751 72.1191 60.9375 72.1191C26.123 72.1191 6.83594 84.9121 6.83594 99.2188C6.83594 105.225 10.4492 108.887 16.6504 108.887Z" />
    </svg>
  )
}

import React from 'react'

interface SFSymbolProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export const ArrowDownLeft: React.FC<SFSymbolProps> = ({ size = 24, className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 92.4809 92.627"
      fill="currentColor"
      className={className}
      {...props}
    >
      {/* SF Symbol: arrow.down.left - Official dari Apple */}
      <path d="M91.0159 1.85547C89.0139-0.0976562 86.3284-0.244141 84.2776 1.85547L18.0178 68.0664L5.76195 81.1035C3.90648 82.959 3.95531 85.3516 5.66429 87.1094C7.4221 88.8184 9.86351 88.8672 11.6702 87.0605L24.7561 74.8047L91.0159 8.49609C93.0178 6.49414 92.9202 3.75977 91.0159 1.85547ZM9.6682 50.9766L9.6682 23.1934C9.6682 20.6543 7.51976 18.3594 4.83421 18.3594C2.24632 18.3594 0.00022881 20.5078 0.00022881 23.3887L0.0978851 87.5C0.0978851 90.5273 2.09984 92.627 5.22484 92.627L69.3362 92.627C72.3147 92.627 74.3166 90.3809 74.3166 87.793C74.3166 85.2539 72.0705 83.1055 69.5315 83.1055L44.1897 83.1055L8.49632 84.1309Z" />
    </svg>
  )
}

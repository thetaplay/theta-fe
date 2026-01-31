'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  href?: string
  useImage?: boolean
}

export function BrandLogo({ size = 'md', showText = true, href = '/', useImage = true }: BrandLogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const content = (
    <div className="flex items-center gap-2">
      {/* Logo - use image if available, otherwise fallback to gradient */}
      {useImage ? (
        <Image
          src="/logo/Logo-Nawasena.png"
          alt="Nawasena"
          width={32}
          height={32}
          className={sizeClasses[size]}
        />
      ) : (
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center font-bold text-white`}>
          N
        </div>
      )}
      {showText && (
        <span className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent`}>
          Nawasena
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}

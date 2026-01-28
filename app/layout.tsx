import React from "react"
import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { AnimatedLayout } from '@/components/AnimatedLayout'
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: 'Market Predictions - iOS PWA',
  description: 'Predict market events with native iOS-style PWA',
  generator: 'v0.app',
  applicationName: 'Market Predictions',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Market Predictions',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#19e65e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#19e65e" />
        <meta name="apple-mobile-web-app-status-bar-style" content="light" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Force light mode immediately on page load
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
                document.documentElement.style.colorScheme = 'light';
                document.documentElement.style.backgroundColor = '#ffffff';
                document.body.style.backgroundColor = '#ffffff';
                
                // Clear all dark mode related storage
                localStorage.removeItem('theme-mode');
                localStorage.removeItem('theme');
                localStorage.removeItem('next-theme');
                sessionStorage.removeItem('theme-mode');
                sessionStorage.removeItem('theme');
                
                // Override prefers-color-scheme media query
                const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
                if (darkModeQuery.matches) {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                }
                
                // Listen for any dark mode preference changes and override them
                darkModeQuery.addListener((e) => {
                  if (e.matches) {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.style.colorScheme = 'light';
                  }
                });
              })();
            `,
          }}
        />
      </head>
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider>
          <AnimatedLayout>
            {children}
          </AnimatedLayout>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

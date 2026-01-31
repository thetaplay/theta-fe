import React from "react"
import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { AnimatedLayout } from '@/components/AnimatedLayout'
import { Providers } from '@/components/providers'
import './globals.css'
import '@coinbase/onchainkit/styles.css'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: 'Nawasena - Trade Options',
  description: 'Trade options on Nawasena',
  generator: 'Nawasena',
  applicationName: 'Nawasena',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Nawasena',
  },
  icons: {
    icon: [
      {
        url: '/logo/Logo-Nawasena.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo/Logo-Nawasena.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logo/Logo-Nawasena.png',
      },
    ],
    apple: '/logo/Logo-Nawasena.png',
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
        <Providers>
          <ThemeProvider>
            <AnimatedLayout>
              {children}
            </AnimatedLayout>
          </ThemeProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

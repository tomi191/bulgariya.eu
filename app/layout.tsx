import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'Референдум за Еврото в България',
  description: 'Гласувайте за бъдещето на България - За или Против Еврото',
  icons: {
    icon: '/Flag_of_Bulgaria.svg.png',
  },
  openGraph: {
    title: 'Референдум за Еврото в България',
    description: 'Гласувайте за бъдещето на България - За или Против Еврото',
    type: 'website',
    locale: 'bg_BG',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bg">
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}

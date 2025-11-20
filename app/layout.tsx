import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Footer from '@/components/ui/Footer'

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
    description: 'Гласувайте за бъдещето на България - За или Protiv Еврото',
    type: 'website',
    locale: 'bg_BG',
    url: 'https://bulgariya.eu',
    siteName: 'Референдум за Еврото',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'България във Еврозоната',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Референдум за Еврото в България',
    description: 'Гласувайте за бъдещето на България - За или Против Еврото',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bg">
      <body className="flex flex-col min-h-screen">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  )
}

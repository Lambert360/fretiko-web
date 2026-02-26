import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fretiko - Your Super-App for Social & Shopping',
  description: 'A revolutionary digital ecosystem combining social networking and shopping in one unified platform',
  icons: {
    icon: '/logo_main.png',
    apple: '/logo_main.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        {children}
      </body>
    </html>
  )
}

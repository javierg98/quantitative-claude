import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Link from 'next/link'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Economic Outlook Dashboard',
  description: 'Self-improving macroeconomics dashboard powered by real-time data and AI analysis',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased bg-gray-50 text-gray-900`}>
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Economic Outlook Dashboard</h1>
              <p className="text-xs text-gray-500">Real-time macroeconomic data — self-improving with AI</p>
            </div>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/insights" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Insights
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Admin
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}

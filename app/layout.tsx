import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BTMM TradingView Script Manager',
  description: 'Beat The Market Makers - Complete Trading System with Pine Script Management, Educational Workbook, and Advanced Strategy Building',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  )
}
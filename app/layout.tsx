import './globals.css'

export const metadata = {
  title: 'DCF Valuation Tool',
  description: 'FAANG company valuation calculator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

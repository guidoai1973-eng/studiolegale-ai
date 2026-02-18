import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StudioLegale-AI.it - Assistente Legale AI',
  description: 'Trova l\'avvocato giusto con l\'aiuto dell\'intelligenza artificiale',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}

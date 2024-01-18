import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import Header from '@/components/Header'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'probe.wtf',
    description: 'built by the MSHRM.studio team',
}

type Props = {
    children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
    return (
        <html lang="en">
            <body className={`${inter.className} p-4`}>
                <Header />

                <main className="w-full overflow-x-hidden pt-6">
                    {children}
                </main>

                <Analytics />
            </body>
        </html>
    )
}

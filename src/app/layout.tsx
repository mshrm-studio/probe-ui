import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

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
                <main className="w-full overflow-x-hidden">{children}</main>

                <Footer />
            </body>
        </html>
    )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Lil Nouns Explorer',
    description: 'Built by the MSHRM.studio team',
}

type Props = {
    children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <header className="mb-6">
                    <img
                        className="mx-auto h-[45px]"
                        src={`${process.env.NEXT_PUBLIC_DO_STORAGE_URL}/lils/logo.png`}
                        alt="Probe Logo"
                    />
                </header>

                <main className="w-full overflow-x-hidden px-4">
                    {children}
                </main>
            </body>
        </html>
    )
}

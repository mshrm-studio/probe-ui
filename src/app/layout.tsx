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
            <body className={`${inter.className} p-4`}>
                <main className="w-full overflow-x-hidden">{children}</main>

                <footer className="mt-6">
                    <img
                        className="h-[45px]"
                        src={`${process.env.NEXT_PUBLIC_DO_STORAGE_URL}/lils/logo.png`}
                        alt="Probe Logo"
                    />
                </footer>
            </body>
        </html>
    )
}

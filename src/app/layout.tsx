import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import Header from '@/components/Header/Header'
import { Analytics } from '@vercel/analytics/react'
import DimensionsProvider from '@/components/DimensionsProvider'
import ShowExplorePageFiltersProvider from '@/components/ShowExplorePageFiltersProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'probe.wtf',
    description: 'Probing Nouns',
}

type Props = {
    children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
    const spacesStorageUrl = process.env.NEXT_PUBLIC_DO_STORAGE_URL

    return (
        <html lang="en">
            <link
                rel="icon"
                href={`${spacesStorageUrl}/Probe_Logo.svg`}
                type="image/svg"
            />

            <body className={inter.className}>
                <DimensionsProvider>
                    <ShowExplorePageFiltersProvider>
                        <Header />

                        <main className="w-full">{children}</main>

                        <Analytics />
                    </ShowExplorePageFiltersProvider>
                </DimensionsProvider>
            </body>
        </html>
    )
}

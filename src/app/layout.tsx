import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import Header from '@/components/Header/Header'
import { Analytics } from '@vercel/analytics/react'
import DimensionsProvider from '@/components/Provider/Dimensions'
import RequestingProvider from '@/components/Provider/Requesting'
import ShowExplorePageFiltersProvider from '@/components/Provider/ShowExplorePageFilters'
import RpcProvider from '@/components/Provider/Rpc'
import Web3ModalProvider from '@/components/Provider/Web3Modal'

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
                <RpcProvider>
                    <Web3ModalProvider>
                        <RequestingProvider>
                            <DimensionsProvider>
                                <ShowExplorePageFiltersProvider>
                                    {children}

                                    <Analytics />
                                </ShowExplorePageFiltersProvider>
                            </DimensionsProvider>
                        </RequestingProvider>
                    </Web3ModalProvider>
                </RpcProvider>
            </body>
        </html>
    )
}

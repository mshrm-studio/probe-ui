import type { Metadata } from 'next'
import '@/app/globals.css'
import { Analytics } from '@vercel/analytics/react'
import DimensionsProvider from '@/components/Provider/Dimensions'
import RequestingProvider from '@/components/Provider/Requesting'
import RpcProvider from '@/components/Provider/Rpc'
import Web3ModalProvider from '@/components/Provider/Web3Modal'
import { Comic_Neue } from 'next/font/google'

const comicNeue = Comic_Neue({
    weight: ['700'], // Specify the weights you want to use
    subsets: ['latin'], // Include the subset for Latin characters
    display: 'swap', // Optional: improve loading performance with "swap"
})

export const metadata: Metadata = {
    title: 'probe.wtf',
    description: 'Probing Nouns',
}

type Props = {
    children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
    return (
        <html lang="en">
            <link
                rel="icon"
                href={`${process.env.NEXT_PUBLIC_DO_STORAGE_URL}/Probe_Logo.svg`}
                type="image/svg"
            />

            <body className={comicNeue.className}>
                <RpcProvider>
                    <Web3ModalProvider>
                        <RequestingProvider>
                            <DimensionsProvider>
                                {children}

                                <Analytics />
                            </DimensionsProvider>
                        </RequestingProvider>
                    </Web3ModalProvider>
                </RpcProvider>
            </body>
        </html>
    )
}

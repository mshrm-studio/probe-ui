import type { Metadata } from 'next'
import '@/app/globals.css'
import { Analytics } from '@vercel/analytics/react'
import DimensionsProvider from '@/components/Provider/Dimensions'
import RequestingProvider from '@/components/Provider/Requesting'
import RpcProvider from '@/components/Provider/Rpc'
import Web3ModalProvider from '@/components/Provider/Web3Modal'

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

            <body>
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

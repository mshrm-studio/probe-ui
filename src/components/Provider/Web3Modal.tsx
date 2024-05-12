'use client'

import dynamic from 'next/dynamic'

const Web3Modal = dynamic(() => import('@/utils/contexts/Web3ModalContext'), {
    ssr: false,
})

export default function Web3ModalProvider({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return <Web3Modal>{children}</Web3Modal>
}

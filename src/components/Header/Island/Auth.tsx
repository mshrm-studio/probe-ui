'use client'

import useOutsideClick from '@/utils/hooks/useClickOutside'
import {
    useDisconnect,
    useWeb3Modal,
    useWeb3ModalAccount,
} from '@web3modal/ethers/react'
import { useRef, useState } from 'react'
import styles from '@/utils/styles/header/island/flyOut.module.css'
import EthAddress from '@/components/EthAddress'

type Props = {
    children: React.ReactNode
}

export default function HeaderIslandAuth({ children }: Props) {
    const { address, isConnected } = useWeb3ModalAccount()
    const { open } = useWeb3Modal()
    const { disconnect } = useDisconnect()

    const handleClick = () => {
        if (!isConnected) {
            open()
        } else {
            setShowAuthMenu((value) => !value)
        }
    }

    const [showAuthMenu, setShowAuthMenu] = useState(false)

    const authRef = useRef<HTMLDivElement>(null)

    useOutsideClick(authRef, () => setShowAuthMenu(false))

    return (
        <div ref={authRef}>
            <button onClick={handleClick}>{children}</button>

            {isConnected && address && showAuthMenu && (
                <div className={`${styles.flyOut} ${styles.auth}`}>
                    <p className="text-xs">
                        Connected as <EthAddress address={address} />
                    </p>

                    <button className="mt-4" onClick={disconnect}>
                        Disconnect
                    </button>
                </div>
            )}
        </div>
    )
}

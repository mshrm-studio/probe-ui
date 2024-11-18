'use client'

import useOutsideClick from '@/utils/hooks/useClickOutside'
import { useRef, useState } from 'react'
import styles from '@/utils/styles/header/island/flyOut.module.css'
import Link from 'next/link'
import SpacesImage from '@/components/SpacesImage'

export default function HeaderIslandProbe({
    className,
}: {
    className: string
}) {
    const [showProbeMenu, setShowProbeMenu] = useState(false)

    const probeRef = useRef<HTMLDivElement>(null)

    useOutsideClick(probeRef, () => setShowProbeMenu(false))

    const menu = [
        { href: '/nouns', text: 'Nouns' },
        { href: '/lils', text: 'Lils' },
        { href: '/nouns/dreams/create', text: 'Dream' },
    ]

    return (
        <li className={className}>
            <div ref={probeRef}>
                <button onClick={() => setShowProbeMenu((value) => !value)}>
                    <SpacesImage src="header/probe.svg" />
                </button>

                {showProbeMenu && (
                    <div className={`${styles.flyOut} ${styles.probe}`}>
                        <nav>
                            <ul className="space-y-4">
                                {menu.map((item, index) => (
                                    <li key={index}>
                                        <Link href={item.href}>
                                            {item.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </li>
    )
}

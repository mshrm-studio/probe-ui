'use client'

import NounImageFromId from '@/components/Noun/ImageFromId'
import AuctionContext from '@/utils/contexts/AuctionContext'
import ProjectContext from '@/utils/contexts/ProjectContext'
import Link from 'next/link'
import { useContext } from 'react'
import NounListBidBage from '@/app/nouns/_components/NounList/BidBadge'
import styles from '@/app/nouns/_styles/nounList.module.css'

export default function AuctionItem() {
    const { auction } = useContext(AuctionContext)
    const { project, baseUrl } = useContext(ProjectContext)

    if (project !== 'Nouns') return null

    if (!auction) return null

    return (
        <li className={styles.nounLink}>
            <Link
                href={`${baseUrl}/auction`}
                className={`${styles.nounLink} ${styles.auctionedNoun}`}
            >
                <NounImageFromId nounId={auction.nounId} />

                <label className={styles.nounLinkLabel}>{auction.nounId}</label>

                <NounListBidBage nounId={auction.nounId} />
            </Link>
        </li>
    )
}

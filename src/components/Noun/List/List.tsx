'use client'

import React, { useContext, useMemo } from 'react'
import Noun from '@/utils/dto/Noun'
import NounImage from '@/components/Noun/Image'
import styles from '@/utils/styles/nounList.module.css'
import Link from 'next/link'
import Project from '@/utils/dto/Project'
import NounListBidBage from '@/components/Noun/List/BidBadge'
import AuctionContext from '@/utils/contexts/AuctionContext'
import useAuctionStatus from '@/utils/services/useAuctionStatus'
import NounImageFromId from '@/components/Noun/ImageFromId'

type Props = {
    project: Project
    nouns: Noun[]
}

const NounList: React.FC<Props> = ({ project, nouns }) => {
    const { auction } = useContext(AuctionContext)

    const auctionActive = useAuctionStatus(auction)

    const linkPrefix = useMemo(() => {
        return project === 'LilNouns' ? `/lils` : `/nouns`
    }, [project])

    const nounsWithSvgUrl = useMemo(() => {
        return nouns.filter(
            (noun): noun is Noun & { svg_url: string } =>
                typeof noun.svg_url === 'string'
        )
    }, [nouns])

    const auctionNounInList = useMemo(() => {
        return nouns.find((noun) => noun.token_id === auction?.nounId)
            ? true
            : false
    }, [auction, nouns])

    return (
        <div className={styles.listWrapper}>
            <ul className="grid gap-2 grid-cols-5 md:grid-cols-10 xl:grid-cols-18">
                {auction && !auctionNounInList && (
                    <li className={styles.nounLink}>
                        <Link
                            href={`${linkPrefix}/auction`}
                            className={`${styles.nounLink} ${styles.auctionedNoun}`}
                        >
                            <NounImageFromId nounId={auction.nounId} />

                            <label className={styles.nounLinkLabel}>
                                {auction.nounId}
                            </label>

                            <NounListBidBage nounId={auction.nounId} />
                        </Link>
                    </li>
                )}

                {nounsWithSvgUrl.map((noun) => (
                    <li key={noun.token_id}>
                        <Link
                            href={`${linkPrefix}/${noun.token_id}`}
                            className={`${styles.nounLink} ${
                                noun.token_id == auction?.nounId &&
                                auctionActive
                                    ? styles.auctionedNoun
                                    : styles.nonAuctionedNoun
                            }`}
                        >
                            <NounImage noun={noun} />

                            <label className={styles.nounLinkLabel}>
                                {noun.token_id}
                            </label>

                            <NounListBidBage nounId={noun.token_id} />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default NounList

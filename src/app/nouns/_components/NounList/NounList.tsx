'use client'

import React, { useContext, useMemo } from 'react'
import Noun from '@/utils/dto/Noun'
import NounImage from '@/components/Noun/Image'
import styles from '@/app/nouns/_styles/nounList.module.css'
import Link from 'next/link'
import Project from '@/utils/dto/Project'
import NounListBidBage from '@/app/nouns/_components/NounList/BidBadge'
import AuctionContext from '@/utils/contexts/AuctionContext'
import useAuctionStatus from '@/utils/hooks/useAuctionStatus'
import NounImageFromId from '@/components/Noun/ImageFromId'
import { useSearchParams } from 'next/navigation'
import NounUnorderedList from '@/components/Noun/List/List'

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
        return nouns.find((noun) => noun.token_id == auction?.nounId)
            ? true
            : false
    }, [auction, nouns])

    const searchParams = useSearchParams()

    const nounListIsFiltered = useMemo(() => {
        // Convert searchParams to an object to filter and check
        const entries = Array.from(searchParams.entries())
        // Check if there are any filters other than per_page, sort_property, or sort_method
        return entries.some(
            ([key]) =>
                !['per_page', 'sort_property', 'sort_method'].includes(key)
        )
    }, [searchParams])

    return (
        <div className={styles.listWrapper}>
            <NounUnorderedList>
                {project === 'Nouns' &&
                    auction &&
                    !auctionNounInList &&
                    !nounListIsFiltered && (
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
            </NounUnorderedList>
        </div>
    )
}

export default NounList

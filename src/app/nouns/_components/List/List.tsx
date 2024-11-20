'use client'

import React, { useContext, useMemo } from 'react'
import Noun from '@/utils/dto/Noun'
import styles from '@/app/nouns/_styles/list.module.css'
import Link from 'next/link'
import AuctionContext from '@/utils/contexts/AuctionContext'
import useAuctionStatus from '@/utils/hooks/useAuctionStatus'
import { useSearchParams } from 'next/navigation'
import NounList from '@/components/Noun/List/List'
import NounListBidBage from '@/app/nouns/_components/List/BidBadge'
import NounListAuctionItem from '@/app/nouns/_components/List/AuctionItem'
import ProjectContext from '@/utils/contexts/ProjectContext'
import NounImageFromSeed from '@/components/Noun/ImageFromSeed'

type Props = {
    nounList: Noun[]
}

const List: React.FC<Props> = ({ nounList }) => {
    const { auction } = useContext(AuctionContext)
    const { baseUrl } = useContext(ProjectContext)
    const auctionActive = useAuctionStatus(auction)

    const nounsWithSvgUrl = useMemo(() => {
        return nounList.filter(
            (noun): noun is Noun & { svg_url: string } =>
                typeof noun.svg_url === 'string'
        )
    }, [nounList])

    const auctionNounInList = useMemo(() => {
        return nounList.find((noun) => noun.token_id == auction?.nounId)
            ? true
            : false
    }, [auction, nounList])

    const searchParams = useSearchParams()

    const nounListIsFiltered = useMemo(() => {
        // Convert searchParams to an object to filter and check
        const entries = Array.from(searchParams.entries())

        // Check if there are any filters other than per_page, sort_property, or sort_method
        return entries.some(
            ([key]) =>
                !['page', 'per_page', 'sort_property', 'sort_method'].includes(
                    key
                )
        )
    }, [searchParams])

    return (
        <div className={styles.listWrapper}>
            <NounList>
                {!auctionNounInList && !nounListIsFiltered && (
                    <NounListAuctionItem />
                )}

                {nounsWithSvgUrl.map((noun) => (
                    <li key={noun.token_id}>
                        <Link
                            href={`${baseUrl}/${noun.token_id}`}
                            className={`${styles.nounLink} ${
                                noun.token_id == auction?.nounId &&
                                auctionActive
                                    ? styles.auctionedNoun
                                    : styles.nonAuctionedNoun
                            }`}
                        >
                            <NounImageFromSeed seed={noun} />

                            <label className={styles.nounLinkLabel}>
                                {noun.token_id}
                            </label>

                            <NounListBidBage nounId={noun.token_id} />
                        </Link>
                    </li>
                ))}
            </NounList>
        </div>
    )
}

export default List

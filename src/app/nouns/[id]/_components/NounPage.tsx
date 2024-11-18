'use client'

import Project from '@/utils/dto/Project'
import { useContext, useEffect, useState } from 'react'
import NounImage from '@/components/Noun/Image'
import styles from '@/utils/styles/nounPage.module.css'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import Link from 'next/link'
import NounPageAuctionDetails from '@/app/nouns/[id]/_components/AuctionDetails'
import ContractTransactionReceipt from '@/utils/dto/ContractTransactionReceipt'
import AuctionContext from '@/utils/contexts/AuctionContext'
import useAuctionStatus from '@/utils/hooks/useAuctionStatus'
import Header from '@/app/nouns/[id]/_components/Header'
import useLiveAuction from '@/utils/hooks/useLiveAuction'
import AuctionBid from '@/app/nouns/[id]/_components/AuctionBid'
import NounPageColorHistogram from '@/app/nouns/[id]/_components/ColorHistogram'
import NounPageTraits from '@/app/nouns/[id]/_components/Traits'
import Noun from '@/utils/dto/Noun'

type Props = {
    project: Project
    noun: Noun
}

const NounPage: React.FC<Props> = ({ project, noun }) => {
    const [receipt, setReceipt] = useState<ContractTransactionReceipt>()
    const { auction } = useContext(AuctionContext)
    const auctionActive = useAuctionStatus(auction)
    useLiveAuction(noun.token_id, auction?.nounId)

    useEffect(() => {
        if (!noun) return

        document.body.style.backgroundColor = `#${noun.background_name}`

        return () => {
            document.body.style.backgroundColor = ''
        }
    }, [noun])

    const { dimensions } = useContext(DimensionsContext)

    return (
        <>
            <Header />

            <main>
                <div className={styles.pageWrapper}>
                    <div
                        className={styles.imageWrapper}
                        style={{
                            backgroundColor: `#${noun.background_name}`,
                            maxHeight:
                                dimensions.viewportOrientation === 'Landscape'
                                    ? dimensions.viewportHeight -
                                      dimensions.headerHeight
                                    : 'none',
                        }}
                    >
                        <NounImage
                            className="w-full max-w-full max-h-full"
                            noun={noun}
                        />
                    </div>

                    <div className={styles.detailsWrapper}>
                        <h1 className={styles.heading}>
                            <span className="block text-[25.5px] leading-[.69] xl:text-[37.8px]">
                                {project === 'LilNouns' ? 'Lil' : 'Noun'}
                            </span>

                            <span className="block text-[105px] leading-[.69] xl:text-[156px]">
                                {noun.token_id}
                            </span>
                        </h1>

                        <div className={styles.body}>
                            <div className={styles.content}>
                                <section className="mb-2">
                                    <NounPageAuctionDetails
                                        nounId={noun.token_id}
                                        receipt={receipt}
                                    />
                                </section>

                                {project === 'Nouns' &&
                                    auction &&
                                    auctionActive &&
                                    auction.nounId == noun.token_id && (
                                        <AuctionBid setReceipt={setReceipt} />
                                    )}

                                <div>
                                    <NounPageColorHistogram noun={noun} />

                                    <section>
                                        <h3 className={styles.sectionTitle}>
                                            {project === 'LilNouns'
                                                ? 'Lil Noun'
                                                : 'Noun'}{' '}
                                            Stats
                                        </h3>

                                        <NounPageTraits noun={noun} />
                                    </section>

                                    <div className="mt-4 text-[13px]">
                                        <Link
                                            className="text-link"
                                            href={
                                                project === 'Nouns'
                                                    ? `https://nouns.wtf/noun/${noun.token_id}`
                                                    : `https://lilnouns.wtf/lilnoun/${noun.token_id}`
                                            }
                                            target="_blank"
                                        >
                                            View Activity
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default NounPage

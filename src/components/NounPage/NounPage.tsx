'use client'

import Project from '@/utils/dto/Project'
import useNoun from '@/utils/services/useNoun'
import { useContext, useEffect, useState } from 'react'
import NounImage from '@/components/Noun/Image'
import styles from '@/utils/styles/nounPage.module.css'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import Link from 'next/link'
import SpacesImage from '@/components/SpacesImage'
import NounPageAuctionDetails from '@/components/NounPage/AuctionDetails'
import ContractTransactionReceipt from '@/utils/dto/ContractTransactionReceipt'
import AuctionContext from '@/utils/contexts/AuctionContext'
import useAuctionStatus from '@/utils/services/useAuctionStatus'
import Header from '@/components/NounPage/Header'
import useLiveAuction from '@/utils/services/useLiveAuction'
import AuctionBid from '@/components/NounPage/AuctionBid'
import NounPageColorHistogram from '@/components/NounPage/ColorHistogram'
import NounPageTraits from '@/components/NounPage/Traits'

const NounPage: React.FC<{ project: Project; nounId: number }> = ({
    project,
    nounId,
}) => {
    const { error, fetching, fetchNoun, noun } = useNoun(project)
    const [receipt, setReceipt] = useState<ContractTransactionReceipt>()
    const { auction } = useContext(AuctionContext)
    const auctionActive = useAuctionStatus(auction)
    useLiveAuction(nounId, auction?.nounId)

    useEffect(() => {
        fetchNoun(nounId)
    }, [nounId])

    useEffect(() => {
        if (!noun) return

        document.body.style.backgroundColor = `#${noun.background_name}`

        return () => {
            document.body.style.backgroundColor = ''
        }
    }, [noun])

    const { dimensions } = useContext(DimensionsContext)

    if (fetching) {
        return (
            <div className="pt-32">
                <SpacesImage
                    className="mx-auto h-10 w-10"
                    src="misc/probe-loader.gif"
                    alt="Loader"
                />
            </div>
        )
    }

    if (noun === null) {
        return (
            <p className="text-center text-red-500 font-bold">Noun not found</p>
        )
    }

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

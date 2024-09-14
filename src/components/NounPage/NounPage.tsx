'use client'

import Project from '@/utils/dto/Project'
import useNoun from '@/utils/services/useNoun'
import { useContext, useEffect, useMemo, useState } from 'react'
import NounImage from '@/components/Noun/Image'
import { Londrina_Solid } from 'next/font/google'
import styles from '@/utils/styles/nounPage.module.css'
import { startCase } from 'lodash'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import { usePathname } from 'next/navigation'
import useHref from '@/utils/services/useHref'
import Link from 'next/link'
import SpacesImage from '@/components/SpacesImage'
import SettlementDetails from '@/components/NounPage/SettlementDetails'
import MintedAt from '@/components/NounPage/MintedAt'
import NounColorHistogram from '@/components/Noun/ColorHistogram'
import NounPageAuctionDetails from '@/components/NounPage/AuctionDetails'
import AuctionPlaceBid from '@/components/Auction/PlaceBid/PlaceBid'
import AuctionPlaceBidPayableAmount from '../Auction/PlaceBid/PayableAmount'
import Button from '@/components/Button'
import { useWeb3ModalAccount } from '@web3modal/ethers/react'
import ContractTransactionReceipt from '@/utils/dto/ContractTransactionReceipt'
import CryptoWalletConnect from '@/components/CryptoWallet/Connect'
import AuctionContext from '@/utils/contexts/AuctionContext'
import useAuctionStatus from '@/utils/services/useAuctionStatus'
import Header from '@/components/NounPage/Header'
import RpcContext from '@/utils/contexts/RpcContext'

const londrinaSolid = Londrina_Solid({
    subsets: ['latin'],
    weight: '400',
})

const NounPage: React.FC<{ project: Project; nounId: number }> = ({
    project,
    nounId,
}) => {
    const { error, fetching, fetchNoun, noun } = useNoun(project)
    const { isConnected } = useWeb3ModalAccount()
    const [receipt, setReceipt] = useState<ContractTransactionReceipt>()
    const { auction } = useContext(AuctionContext)
    const auctionActive = useAuctionStatus(auction)
    const { provider } = useContext(RpcContext)
    const [blockNumber, setBlockNumber] = useState<number | null>(null)

    useEffect(() => {
        fetchNoun(nounId)
    }, [nounId])

    useEffect(() => {
        if (!provider || !noun) return

        const fetchBlockNumber = async () => {
            try {
                const block = await provider.getBlock(noun.block_number)

                if (block) {
                    setBlockNumber(block.number)
                }
            } catch (error) {
                console.error('Failed to fetch block number:', error)
            }
        }

        fetchBlockNumber()
    }, [noun, provider])

    const { dimensions } = useContext(DimensionsContext)
    const { lilsLink, nounsLink } = useHref()
    const pathname = usePathname()

    const listHref = useMemo(() => {
        return pathname.includes('/lils') ? lilsLink : nounsLink
    }, [pathname])

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
                        <h1
                            className={`${londrinaSolid.className} ${styles.heading}`}
                        >
                            <span className="block text-[85px] leading-[.69] xl:text-[126px]">
                                {project === 'LilNouns' ? 'Lil' : 'Noun'}
                            </span>

                            <span className="block text-[105px] leading-[.69] xl:text-[156px]">
                                {noun.token_id}
                            </span>
                        </h1>

                        <div className={styles.body}>
                            <div className={styles.content}>
                                <p className={styles.dob}>
                                    {project === 'LilNouns' ? (
                                        <MintedAt mintedAt={noun.minted_at} />
                                    ) : (auction &&
                                          auction.nounId == noun.token_id) ||
                                      !blockNumber ? (
                                        <MintedAt mintedAt={noun.minted_at} />
                                    ) : (
                                        <SettlementDetails
                                            blockNumber={blockNumber}
                                            mintedAt={noun.minted_at}
                                        />
                                    )}
                                </p>

                                {project === 'Nouns' &&
                                    auction &&
                                    auction.nounId == noun.token_id && (
                                        <section className="space-y-2">
                                            <NounPageAuctionDetails
                                                nounId={noun.token_id}
                                                receipt={receipt}
                                            />

                                            {isConnected && (
                                                <AuctionPlaceBid
                                                    setReceipt={setReceipt}
                                                >
                                                    <div className="flex space-x-2">
                                                        <div>
                                                            <AuctionPlaceBidPayableAmount
                                                                disabled={
                                                                    !isConnected
                                                                }
                                                            />
                                                        </div>

                                                        <div>
                                                            <Button
                                                                disabled={
                                                                    !isConnected
                                                                }
                                                                nativeType="submit"
                                                            >
                                                                Bid
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </AuctionPlaceBid>
                                            )}

                                            {!isConnected && auctionActive && (
                                                <CryptoWalletConnect>
                                                    Login to bid
                                                </CryptoWalletConnect>
                                            )}
                                        </section>
                                    )}

                                <div>
                                    {noun.color_histogram && (
                                        <section className="mb-6">
                                            <h3 className={styles.sectionTitle}>
                                                Colors
                                            </h3>

                                            <NounColorHistogram
                                                className={styles.colorList}
                                                histogram={noun.color_histogram}
                                            />
                                        </section>
                                    )}

                                    <section>
                                        <h3 className={styles.sectionTitle}>
                                            {project === 'LilNouns'
                                                ? 'Lil Noun'
                                                : 'Noun'}{' '}
                                            Stats
                                        </h3>

                                        <dl className="space-y-1">
                                            <div
                                                className={styles.dlItemInline}
                                            >
                                                <dt className={styles.dt}>
                                                    Body:
                                                </dt>{' '}
                                                <dd className={styles.dd}>
                                                    <Link
                                                        href={`${listHref}&body=${noun.body_name}`}
                                                        className={
                                                            styles.attributeLink
                                                        }
                                                    >
                                                        {startCase(
                                                            noun.body_name.replace(
                                                                new RegExp(
                                                                    `^body-`
                                                                ),
                                                                ''
                                                            )
                                                        )}
                                                    </Link>
                                                </dd>
                                            </div>

                                            <div
                                                className={styles.dlItemInline}
                                            >
                                                <dt className={styles.dt}>
                                                    Accessory:
                                                </dt>{' '}
                                                <dd className={styles.dd}>
                                                    <Link
                                                        href={`${listHref}&accessory=${noun.accessory_name}`}
                                                        className={
                                                            styles.attributeLink
                                                        }
                                                    >
                                                        {startCase(
                                                            noun.accessory_name.replace(
                                                                new RegExp(
                                                                    `^accessory-`
                                                                ),
                                                                ''
                                                            )
                                                        )}
                                                    </Link>
                                                </dd>
                                            </div>

                                            <div
                                                className={styles.dlItemInline}
                                            >
                                                <dt className={styles.dt}>
                                                    Head:
                                                </dt>{' '}
                                                <dd className={styles.dd}>
                                                    <Link
                                                        href={`${listHref}&head=${noun.head_name}`}
                                                        className={
                                                            styles.attributeLink
                                                        }
                                                    >
                                                        {startCase(
                                                            noun.head_name.replace(
                                                                new RegExp(
                                                                    `^head-`
                                                                ),
                                                                ''
                                                            )
                                                        )}
                                                    </Link>
                                                </dd>
                                            </div>

                                            <div
                                                className={styles.dlItemInline}
                                            >
                                                <dt className={styles.dt}>
                                                    Glasses:
                                                </dt>{' '}
                                                <dd className={styles.dd}>
                                                    <Link
                                                        href={`${listHref}&glasses=${noun.glasses_name}`}
                                                        className={
                                                            styles.attributeLink
                                                        }
                                                    >
                                                        {startCase(
                                                            noun.glasses_name.replace(
                                                                new RegExp(
                                                                    `^glasses-`
                                                                ),
                                                                ''
                                                            )
                                                        )}
                                                    </Link>
                                                </dd>
                                            </div>

                                            {noun.area && (
                                                <div
                                                    className={
                                                        styles.dlItemInline
                                                    }
                                                >
                                                    <dt className={styles.dt}>
                                                        Area:
                                                    </dt>
                                                    <dd className={styles.dd}>
                                                        {noun.area}
                                                        <span className="lowercase">
                                                            px
                                                        </span>
                                                    </dd>
                                                </div>
                                            )}

                                            {noun.weight && (
                                                <div
                                                    className={
                                                        styles.dlItemInline
                                                    }
                                                >
                                                    <dt className={styles.dt}>
                                                        Brightness:
                                                    </dt>
                                                    <dd className={styles.dd}>
                                                        {noun.weight}
                                                        <span className="lowercase">
                                                            lm
                                                        </span>
                                                    </dd>
                                                </div>
                                            )}
                                        </dl>
                                    </section>

                                    <div className="mt-4 text-[13px] uppercase">
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

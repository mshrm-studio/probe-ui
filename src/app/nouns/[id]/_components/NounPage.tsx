'use client'

import Project from '@/utils/dto/Project'
import { useContext, useEffect, useMemo } from 'react'
import styles from '@/app/nouns/[id]/_styles/nounPage.module.css'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import Link from 'next/link'
import Header from '@/app/nouns/[id]/_components/Header'
import ColorHistogram from '@/app/nouns/[id]/_components/ColorHistogram'
import Traits from '@/app/nouns/[id]/_components/Traits'
import Dream from '@/app/nouns/[id]/_components/Dream'
import Noun from '@/utils/dto/Noun'
import Auction from '@/app/nouns/[id]/_components/Auction/Auction'
import NounImageFromSeed from '@/components/Noun/ImageFromSeed'
import DreamNoun, { isDreamNoun } from '@/utils/dto/DreamNoun'
import useNounTraitList from '@/utils/hooks/useNounTraitList'

type Props = {
    project: Project
    noun: Noun | DreamNoun
}

const NounPage: React.FC<Props> = ({ project, noun }) => {
    const { backgroundList } = useNounTraitList()

    const backgroundColor = useMemo(() => {
        if (isDreamNoun(noun)) {
            const bg = backgroundList.find(
                (t) => t.seed_id == noun.background_seed_id
            )

            return bg ? `#${bg.name}` : '#ffffff'
        }

        return `#${noun.background_name}`
    }, [backgroundList, noun])

    useEffect(() => {
        document.body.style.backgroundColor = backgroundColor

        return () => {
            document.body.style.backgroundColor = ''
        }
    }, [backgroundColor])

    const { dimensions } = useContext(DimensionsContext)

    return (
        <>
            <Header />

            <main>
                <div className={styles.pageWrapper}>
                    <div
                        className={styles.imageWrapper}
                        style={{
                            maxHeight:
                                dimensions.viewportOrientation === 'Landscape'
                                    ? dimensions.viewportHeight -
                                      dimensions.headerHeight
                                    : 'none',
                        }}
                    >
                        <NounImageFromSeed seed={noun} />
                    </div>

                    <div className={styles.detailsWrapper}>
                        <h1 className={styles.heading}>
                            <span className="block text-[25.5px] leading-[.69] xl:text-[37.8px]">
                                {isDreamNoun(noun)
                                    ? 'Dream'
                                    : project === 'LilNouns'
                                    ? 'Lil'
                                    : 'Noun'}
                            </span>

                            <span className="block text-[105px] leading-[.69] xl:text-[156px]">
                                {isDreamNoun(noun) ? noun.id : noun.token_id}
                            </span>
                        </h1>

                        <div className={styles.body}>
                            <div className={styles.content}>
                                {!isDreamNoun(noun) && <Auction noun={noun} />}

                                {isDreamNoun(noun) && <Dream noun={noun} />}

                                <div>
                                    {!isDreamNoun(noun) && (
                                        <ColorHistogram noun={noun} />
                                    )}

                                    <section>
                                        <h3 className={styles.sectionTitle}>
                                            {project === 'LilNouns'
                                                ? 'Lil Noun'
                                                : 'Noun'}{' '}
                                            Stats
                                        </h3>

                                        <Traits noun={noun} />
                                    </section>

                                    {!isDreamNoun(noun) && (
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
                                    )}
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

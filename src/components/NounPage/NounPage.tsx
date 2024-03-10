'use client'

import Project from '@/utils/dto/Project'
import useNoun from '@/utils/services/useNoun'
import { useContext, useEffect, useMemo } from 'react'
import NounImage from '@/components/Noun/Image'
import { Londrina_Solid } from 'next/font/google'
import styles from '@/utils/styles/nounPage.module.css'
import { startCase } from 'lodash'
import { DateTime } from 'luxon'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import { usePathname } from 'next/navigation'
import useHref from '@/utils/services/useHref'
import Link from 'next/link'

const londrinaSolid = Londrina_Solid({
    subsets: ['latin'],
    weight: '900',
})

const NounPage: React.FC<{ project: Project; nounId: number }> = ({
    project,
    nounId,
}) => {
    const { error, fetching, fetchNoun, noun } = useNoun(project)

    useEffect(() => {
        fetchNoun(nounId)
    }, [nounId])

    const { dimensions } = useContext(DimensionsContext)
    const { lilsLink, nounsLink } = useHref()
    const pathname = usePathname()

    const listHref = useMemo(() => {
        return pathname.includes('/lils') ? lilsLink : nounsLink
    }, [pathname])

    if (fetching) {
        return <p>Loading...</p>
    }

    if (noun === null) {
        return <p>Noun not found</p>
    }

    return (
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
                <h1>
                    <span className="font-bold uppercase text-sm">Noun</span>
                    <br />
                    <span className={`${londrinaSolid.className} text-8xl`}>
                        {noun.token_id}
                    </span>
                </h1>

                <p className="uppercase text-sm text-[#6C6C6C] font-bold">
                    Born{' '}
                    {DateTime.fromISO(noun.minted_at, {
                        zone: 'utc',
                    })
                        .toLocal()
                        .toFormat('MMMM d, yyyy h:mm a (z)')}
                </p>

                <dl className="space-y-1">
                    {noun.color_histogram && (
                        <div className="space-y-1 mb-6">
                            <dt className={styles.dt}>Colors</dt>

                            <dd>
                                <ul className={styles.colorList}>
                                    {Object.entries(noun.color_histogram).map(
                                        ([color, weight], index) => (
                                            <li
                                                key={`${color}-${index}`}
                                                style={{
                                                    backgroundColor: color,
                                                }}
                                                className="h-6 w-6"
                                                title={`${color} (${weight})`}
                                            ></li>
                                        )
                                    )}
                                </ul>
                            </dd>
                        </div>
                    )}

                    {noun.area && (
                        <div className={styles.dlItemInline}>
                            <dt className={styles.dt}>Area:</dt>
                            <dd className={styles.dd}>{noun.area}</dd>
                        </div>
                    )}

                    {noun.weight && (
                        <div className={styles.dlItemInline}>
                            <dt className={styles.dt}>Weight:</dt>
                            <dd className={styles.dd}>{noun.weight}</dd>
                        </div>
                    )}

                    <div className={styles.dlItemInline}>
                        <dt className={styles.dt}>Body:</dt>{' '}
                        <dd className={styles.dd}>
                            <Link href={`${listHref}&body=${noun.body_name}`}>
                                {startCase(
                                    noun.body_name.replace(
                                        new RegExp(`^body-`),
                                        ''
                                    )
                                )}
                            </Link>
                        </dd>
                    </div>

                    <div className={styles.dlItemInline}>
                        <dt className={styles.dt}>Accessory:</dt>{' '}
                        <dd className={styles.dd}>
                            <Link
                                href={`${listHref}&accessory=${noun.accessory_name}`}
                            >
                                {startCase(
                                    noun.accessory_name.replace(
                                        new RegExp(`^accessory-`),
                                        ''
                                    )
                                )}
                            </Link>
                        </dd>
                    </div>

                    <div className={styles.dlItemInline}>
                        <dt className={styles.dt}>Head:</dt>{' '}
                        <dd className={styles.dd}>
                            <Link href={`${listHref}&head=${noun.head_name}`}>
                                {startCase(
                                    noun.head_name.replace(
                                        new RegExp(`^head-`),
                                        ''
                                    )
                                )}
                            </Link>
                        </dd>
                    </div>

                    <div className={styles.dlItemInline}>
                        <dt className={styles.dt}>Glasses:</dt>{' '}
                        <dd className={styles.dd}>
                            <Link
                                href={`${listHref}&glasses=${noun.glasses_name}`}
                            >
                                {startCase(
                                    noun.glasses_name.replace(
                                        new RegExp(`^glasses-`),
                                        ''
                                    )
                                )}
                            </Link>
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    )
}

export default NounPage

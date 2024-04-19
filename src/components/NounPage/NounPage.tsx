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
    weight: '400',
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
                <h1 className={`${londrinaSolid.className} ${styles.heading}`}>
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
                            Born{' '}
                            {DateTime.fromISO(noun.minted_at, {
                                zone: 'utc',
                            })
                                .toLocal()
                                .toFormat('MMMM d, yyyy h:mm a (z)')}
                        </p>

                        <div>
                            {noun.color_histogram && (
                                <section className="mb-6">
                                    <h3 className={styles.sectionTitle}>
                                        Colors
                                    </h3>

                                    <ul className={styles.colorList}>
                                        {Object.entries(
                                            noun.color_histogram
                                        ).map(([color, weight], index) => (
                                            <li key={`${color}-${index}`}>
                                                <Link
                                                    href={`${listHref}&color=${encodeURIComponent(
                                                        color
                                                    )}`}
                                                    className="block h-6 w-6"
                                                    style={{
                                                        backgroundColor: color,
                                                    }}
                                                    title={`${color} (${weight})`}
                                                ></Link>
                                            </li>
                                        ))}
                                    </ul>
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
                                    <div className={styles.dlItemInline}>
                                        <dt className={styles.dt}>Body:</dt>{' '}
                                        <dd className={styles.dd}>
                                            <Link
                                                href={`${listHref}&body=${noun.body_name}`}
                                                className={styles.attributeLink}
                                            >
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
                                        <dt className={styles.dt}>
                                            Accessory:
                                        </dt>{' '}
                                        <dd className={styles.dd}>
                                            <Link
                                                href={`${listHref}&accessory=${noun.accessory_name}`}
                                                className={styles.attributeLink}
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

                                    <div className={styles.dlItemInline}>
                                        <dt className={styles.dt}>Head:</dt>{' '}
                                        <dd className={styles.dd}>
                                            <Link
                                                href={`${listHref}&head=${noun.head_name}`}
                                                className={styles.attributeLink}
                                            >
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
                                                className={styles.attributeLink}
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

                                    {noun.area && (
                                        <div className={styles.dlItemInline}>
                                            <dt className={styles.dt}>Area:</dt>
                                            <dd className={styles.dd}>
                                                {noun.area}
                                                <span className="lowercase">
                                                    px
                                                </span>
                                            </dd>
                                        </div>
                                    )}

                                    {noun.weight && (
                                        <div className={styles.dlItemInline}>
                                            <dt className={styles.dt}>
                                                Weight:
                                            </dt>
                                            <dd className={styles.dd}>
                                                {noun.weight}
                                                <span className="lowercase">
                                                    gg
                                                </span>
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NounPage

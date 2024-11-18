'use client'

import Noun from '@/utils/dto/Noun'
import styles from '@/app/nouns/[id]/styles/nounPage.module.css'
import { startCase } from 'lodash'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useHref from '@/utils/hooks/useHref'
import { useMemo } from 'react'

type Props = {
    noun: Noun
}

const NounPageTraits: React.FC<Props> = ({ noun }) => {
    const { lilsLink, nounsLink } = useHref()
    const pathname = usePathname()

    const listHref = useMemo(() => {
        return pathname.includes('/lils') ? lilsLink : nounsLink
    }, [pathname])

    return (
        <dl className="space-y-1">
            <div className={styles.dlItemInline}>
                <dt className={styles.dt}>Body:</dt>
                <dd className={styles.dd}>
                    <Link
                        href={`${listHref}&body=${noun.body_name}`}
                        className={styles.attributeLink}
                    >
                        {startCase(
                            noun.body_name.replace(new RegExp(`^body-`), '')
                        )}
                    </Link>
                </dd>
            </div>

            <div className={styles.dlItemInline}>
                <dt className={styles.dt}>Accessory:</dt>
                <dd className={styles.dd}>
                    <Link
                        href={`${listHref}&accessory=${noun.accessory_name}`}
                        className={styles.attributeLink}
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
                <dt className={styles.dt}>Head:</dt>
                <dd className={styles.dd}>
                    <Link
                        href={`${listHref}&head=${noun.head_name}`}
                        className={styles.attributeLink}
                    >
                        {startCase(
                            noun.head_name.replace(new RegExp(`^head-`), '')
                        )}
                    </Link>
                </dd>
            </div>

            <div className={styles.dlItemInline}>
                <dt className={styles.dt}>Glasses:</dt>
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
                        <span className="lowercase">px</span>
                    </dd>
                </div>
            )}

            {noun.weight && (
                <div className={styles.dlItemInline}>
                    <dt className={styles.dt}>Brightness:</dt>
                    <dd className={styles.dd}>
                        {noun.weight}
                        <span className="lowercase">lm</span>
                    </dd>
                </div>
            )}
        </dl>
    )
}

export default NounPageTraits

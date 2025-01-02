'use client'

import Noun from '@/utils/dto/Noun'
import styles from '@/app/nouns/[id]/_styles/nounPage.module.css'
import { startCase } from 'lodash'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useHref from '@/utils/hooks/useHref'
import { useMemo } from 'react'
import DreamNoun, { isDreamNoun } from '@/utils/dto/DreamNoun'
import { nounTraitLayers } from '@/utils/dto/NounTraitLayer'
import useNormalisedNoun from '@/utils/hooks/useNormalisedNoun'

type Props = {
    noun: Noun | DreamNoun
}

const NounPageTraits: React.FC<Props> = ({ noun }) => {
    const { dreamsLink, lilsLink, nounsLink } = useHref()
    const pathname = usePathname()
    const normalisedNoun = useNormalisedNoun(noun)

    const baseHref = useMemo(() => {
        return isDreamNoun(noun)
            ? dreamsLink
            : pathname.includes('/lils')
            ? lilsLink
            : nounsLink
    }, [dreamsLink, lilsLink, nounsLink, noun, pathname])

    const traits = useMemo(() => {
        return nounTraitLayers.map((layer) => {
            const traitName = normalisedNoun[layer].name

            const traitSeedId = normalisedNoun[layer].seedId

            const query = isDreamNoun(noun)
                ? `${layer}_seed_id=${traitSeedId}`
                : `${layer}=${traitName || 'trait-not-found'}`

            return {
                href: `${baseHref}&${query}`,
                layer: layer,
                name: traitName || 'trait-not-found',
                seedId: traitSeedId,
            }
        })
    }, [baseHref, noun, normalisedNoun, nounTraitLayers])

    return (
        <dl className="space-y-1">
            {traits.map((trait) => (
                <div className={styles.dlItemInline}>
                    <dt className={styles.dt}>{startCase(trait.layer)}:</dt>
                    <dd className={styles.dd}>
                        <Link
                            href={trait.href}
                            className={styles.attributeLink}
                        >
                            {trait.layer === 'background'
                                ? trait.name.toLowerCase() === 'd5d7e1'
                                    ? 'cool'
                                    : 'warm'
                                : startCase(
                                      trait.name.replace(
                                          new RegExp(`^${trait.layer}-`),
                                          ''
                                      )
                                  )}
                        </Link>
                    </dd>
                </div>
            ))}

            {!isDreamNoun(noun) && noun.area && (
                <div className={styles.dlItemInline}>
                    <dt className={styles.dt}>Area:</dt>
                    <dd className={styles.dd}>
                        {noun.area}
                        <span className="lowercase">px</span>
                    </dd>
                </div>
            )}

            {!isDreamNoun(noun) && noun.weight && (
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

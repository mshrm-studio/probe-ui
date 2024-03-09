'use client'
import React, { useEffect } from 'react'
import Noun from '@/utils/dto/Noun'
import NounImage from '@/components/Noun/Image'
import { motion, useAnimation } from 'framer-motion'
import styles from '@/utils/styles/nounList.module.css'
import SpacesImage from '@/components/SpacesImage'

type Props = {
    fetching: boolean
    nouns: Noun[]
    selected: Noun | null
    updateSelected: (selected: Noun) => void
}

const NounList: React.FC<Props> = ({
    fetching,
    nouns,
    selected,
    updateSelected,
}) => {
    const controls = useAnimation()

    useEffect(() => {
        controls.start('visible')
    }, [nouns, controls])

    return (
        <div className={styles.listWrapper}>
            <motion.ul
                className={`grid gap-2 grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 xl:max-w-[1159px]`}
                initial="hidden"
                animate={controls}
                variants={ulVariants}
            >
                {nouns.map((noun) => (
                    <motion.li
                        variants={liVariants}
                        whileTap={{ scale: 0.95 }}
                        key={noun.token_id}
                        className={`rounded`}
                        onClick={() => updateSelected(noun)}
                    >
                        {noun.svg_url ? (
                            <SpacesImage
                                className="rounded"
                                src={noun.svg_url}
                            />
                        ) : (
                            <NounImage className="rounded" noun={noun} />
                        )}

                        {noun.color_histogram && (
                            <ul className="flex flex-wrap mt-2">
                                {Object.entries(noun.color_histogram).map(
                                    ([color, weight], index) => (
                                        <li
                                            key={`${color}-${index}`}
                                            style={{ backgroundColor: color }}
                                            className="h-4 w-4"
                                            title={`${color} (${weight})`}
                                        ></li>
                                    )
                                )}
                            </ul>
                        )}

                        {noun.area && (
                            <p className="text-xs mt-2">Area: {noun.area}</p>
                        )}

                        {noun.weight && (
                            <p className="text-xs mt-2">
                                Weight: {noun.weight}
                            </p>
                        )}
                    </motion.li>
                ))}
            </motion.ul>

            {fetching && (
                <div className={styles.listFetchingIndicator}>
                    <p className="font-bold text-[13px]">Probing...</p>
                </div>
            )}
        </div>
    )
}

const ulVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
}

const liVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            x: { stiffness: 1000, velocity: -100 },
            duration: 0.5,
        },
    },
}

export default NounList

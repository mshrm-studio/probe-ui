'use client'
import React, { useEffect, useState } from 'react'
import Noun from '@/utils/dto/Noun'
import NounImage from '@/components/Noun/Image'
import { motion, useAnimation } from 'framer-motion'

type Props = {
    nouns: Noun[]
    selected: Noun | null
    updateSelected: (selected: Noun) => void
}

const NounList: React.FC<Props> = ({ nouns, selected, updateSelected }) => {
    const controls = useAnimation()

    useEffect(() => {
        controls.start('visible')
    }, [nouns, controls])

    return (
        <motion.ul
            className={`grid gap-2 grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 xl:max-w-[1159px]`}
            initial="hidden"
            animate={controls}
            variants={ulVariants}
        >
            {nouns.map((noun) => (
                <motion.li
                    variants={liVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    key={noun.token_id}
                    className={`rounded`}
                    onClick={() => updateSelected(noun)}
                >
                    <NounImage className="rounded" noun={noun} />
                </motion.li>
            ))}
        </motion.ul>
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

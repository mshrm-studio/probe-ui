'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Noun from '@/utils/dto/Noun'
import NounImage from '@/components/Noun/Image'
import { motion, useAnimation } from 'framer-motion'
import styles from '@/utils/styles/nounList.module.css'
import Link from 'next/link'
import Project from '@/utils/dto/Project'
import { Londrina_Solid } from 'next/font/google'

const londrinaSolid = Londrina_Solid({
    subsets: ['latin'],
    weight: '900',
})

type Props = {
    project: Project
    fetching: boolean
    nouns: Noun[]
}

const NounList: React.FC<Props> = ({ project, fetching, nouns }) => {
    const controls = useAnimation()

    const linkPrefix = useMemo(() => {
        return project === 'LilNouns' ? `/lils` : `/nouns`
    }, [project])

    const [loadedImages, setLoadedImages] = useState(0)

    const nounsWithSvgUrl = useMemo(() => {
        return nouns.filter(
            (noun): noun is Noun & { svg_url: string } =>
                typeof noun.svg_url === 'string'
        )
    }, [nouns])

    useEffect(() => {
        setLoadedImages(0) // Reset the counter on nouns change

        nounsWithSvgUrl.forEach((noun) => {
            const img = new Image()

            img.src = noun.svg_url

            img.onload = () => {
                setLoadedImages((prevLoadedImages) => prevLoadedImages + 1)
            }
        })
    }, [nounsWithSvgUrl])

    useEffect(() => {
        if (loadedImages >= nounsWithSvgUrl.length) {
            controls.start('visible')
        }
    }, [controls, loadedImages, nounsWithSvgUrl])

    return (
        <div className={styles.listWrapper}>
            <motion.ul
                className={`grid gap-2 grid-cols-5 md:grid-cols-10 xl:grid-cols-18`}
                initial="hidden"
                animate={controls}
                variants={ulVariants}
            >
                {nounsWithSvgUrl.map((noun) => (
                    <motion.li
                        variants={liVariants}
                        whileTap={{ scale: 0.95 }}
                        key={noun.token_id}
                    >
                        <Link
                            href={`${linkPrefix}/${noun.token_id}`}
                            className="block relative group"
                        >
                            <NounImage noun={noun} />

                            <div
                                className={`opacity-0 group-hover:opacity-100 ${londrinaSolid.className} bg-black/50 absolute bottom-0 inset-x-0 py-1 px-2 text-center uppercase whitespace-nowrap text-white text-xs`}
                            >
                                Noun {noun.token_id}
                            </div>
                        </Link>
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
        transition: { staggerChildren: 0.01, delayChildren: 0.02 },
    },
}

const liVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            x: { stiffness: 1000, velocity: -100 },
            duration: 0.05,
        },
    },
}

export default NounList

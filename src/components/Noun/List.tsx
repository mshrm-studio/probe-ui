'use client'

import React, { useMemo } from 'react'
import Noun from '@/utils/dto/Noun'
import NounImage from '@/components/Noun/Image'
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
    console.log('noun list rendering')

    const linkPrefix = useMemo(() => {
        return project === 'LilNouns' ? `/lils` : `/nouns`
    }, [project])

    const nounsWithSvgUrl = useMemo(() => {
        return nouns.filter(
            (noun): noun is Noun & { svg_url: string } =>
                typeof noun.svg_url === 'string'
        )
    }, [nouns])

    return (
        <div className={styles.listWrapper}>
            <ul
                className={`grid gap-2 grid-cols-5 md:grid-cols-10 xl:grid-cols-18`}
            >
                {nounsWithSvgUrl.map((noun) => (
                    <li key={noun.token_id}>
                        <Link
                            href={`${linkPrefix}/${noun.token_id}`}
                            className={styles.nounLink}
                        >
                            <NounImage noun={noun} />

                            <label
                                className={`${londrinaSolid.className} ${styles.nounLinkLabel}`}
                            >
                                {project === 'LilNouns' ? 'Lil' : 'Noun'}{' '}
                                {noun.token_id}
                            </label>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default NounList

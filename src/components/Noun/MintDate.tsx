'use client'

import NounMintContext from '@/utils/contexts/NounMintContext'
import { DateTime } from 'luxon'
import { useContext } from 'react'

type Props = {
    className?: string
    mintedAt?: string
}

const NounMintDate: React.FC<Props> = ({ className, mintedAt }) => {
    const { blockTimestamp } = useContext(NounMintContext)

    const dateTimeFormat = 'MMM d, yyyy h:mm a'

    if (mintedAt) {
        return (
            <span className={className}>
                {DateTime.fromISO(mintedAt).toFormat(dateTimeFormat)}
            </span>
        )
    }

    if (blockTimestamp) {
        return (
            <span className={className}>
                {DateTime.fromSeconds(blockTimestamp, {
                    zone: 'utc',
                })
                    .toLocal()
                    .toFormat(dateTimeFormat)}
            </span>
        )
    }

    return null
}

export default NounMintDate

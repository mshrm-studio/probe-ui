'use client'

import React from 'react'
import Noun from '@/utils/dto/Noun'
import { DateTime } from 'luxon'

type Props = {
    className?: string
    mintedAt: string
}

const NounDateOfBirth: React.FC<Props> = ({ className = '', mintedAt }) => {
    return (
        <span className={className}>
            Born{' '}
            {DateTime.fromISO(mintedAt, {
                zone: 'utc',
            })
                .toLocal()
                .toFormat('MMMM d, yyyy h:mm a (z)')}
        </span>
    )
}

export default NounDateOfBirth

'use client'

import { DateTime } from 'luxon'

type Props = {
    mintedAt: string
}

const NounMintDate: React.FC<Props> = ({ mintedAt }) => {
    return (
        <>
            {DateTime.fromISO(mintedAt, {
                zone: 'utc',
            })
                .toLocal()
                .toFormat('MMM d, yyyy h:mm a')}
        </>
    )
}

export default NounMintDate

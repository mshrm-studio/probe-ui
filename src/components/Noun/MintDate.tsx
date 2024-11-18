import { DateTime } from 'luxon'

type Props = {
    className?: string
    mintedAt?: number | string
}

const NounMintDate: React.FC<Props> = ({ className, mintedAt }) => {
    const dateTimeFormat = 'MMM d, yyyy h:mm a'

    if (typeof mintedAt === 'string') {
        return (
            <span className={className}>
                {DateTime.fromISO(mintedAt).toFormat(dateTimeFormat)}
            </span>
        )
    }

    if (typeof mintedAt === 'number') {
        return (
            <span className={className}>
                {DateTime.fromSeconds(mintedAt, {
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

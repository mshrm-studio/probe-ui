import { DateTime as Luxon } from 'luxon'
import DateTime from '@/components/DateTime'

type Props = {
    className?: string
    mintedAt?: number | string
}

const NounMintDate: React.FC<Props> = ({ className, mintedAt }) => {
    const dateTimeFormat = 'MMM d, yyyy h:mm a'

    if (typeof mintedAt === 'string') {
        return (
            <DateTime
                className={className}
                format={dateTimeFormat}
                iso={mintedAt}
            />
        )
    }

    if (typeof mintedAt === 'number') {
        return (
            <span className={className}>
                {Luxon.fromSeconds(mintedAt, {
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

import { DateTime as Luxon } from 'luxon'

type Props = {
    className?: string
    format?: string
    iso: string
}

export default function DateTime({ className, format, iso }: Props) {
    return (
        <span className={className}>
            {Luxon.fromISO(iso).toFormat(format || 'MMM d, yyyy h:mm a')}
        </span>
    )
}

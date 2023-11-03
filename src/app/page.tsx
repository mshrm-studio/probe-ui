'use client'
import TextLink from '@/components/TextLink'
import useHref from '@/utils/services/useHref'

export default function Page() {
    const { lilsLink, nounsLink } = useHref()

    return (
        <div className="space-x-3">
            <TextLink href={lilsLink}>Lils</TextLink>
            <TextLink href={nounsLink}>Nouns</TextLink>
        </div>
    )
}

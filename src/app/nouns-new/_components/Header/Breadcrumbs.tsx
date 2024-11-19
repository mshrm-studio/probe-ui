import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs'
import useHref from '@/utils/hooks/useHref'

export default function NounsBreadcrumbs() {
    const { nounsLink } = useHref()

    return (
        <Breadcrumbs
            breadcrumbs={[
                { label: 'Probe', href: '/' },
                { label: 'Nouns', href: nounsLink },
            ]}
        />
    )
}

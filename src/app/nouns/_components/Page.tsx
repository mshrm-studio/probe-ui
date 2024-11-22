import Nouns from '@/app/nouns/_components/Nouns'
import Project from '@/utils/dto/Project'
import CatalogueHeader from '@/components/Header/Catalogue'
import useHref from '@/utils/hooks/useHref'

type Props = {
    project: Project
}

export default async function NounsPage({ project }: Props) {
    const { lilsLink, nounsLink } = useHref()

    return (
        <div className="p-4 space-y-4">
            <CatalogueHeader
                breadcrumbs={[
                    { label: 'Probe', href: '/' },
                    {
                        label: project === 'LilNouns' ? 'Lils' : 'Nouns',
                        href: project === 'LilNouns' ? lilsLink : nounsLink,
                    },
                ]}
            />

            <main>
                <Nouns />
            </main>
        </div>
    )
}

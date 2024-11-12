import NounTrait from '@/utils/dto/NounTrait'
import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'
import useApi from '@/utils/hooks/v2/useApi'
import NounTraitsProvider from '@/components/Provider/NounTraits'
import Project from '@/utils/dto/Project'
import { unstable_cache } from 'next/cache'

const getNounTraits = unstable_cache(
    async (project: Project, layer: NounTraitLayer) => {
        const api = useApi()

        const path =
            project === 'LilNouns' ? `/lil-noun-traits` : `/noun-traits`

        const params = `?layer=${layer}&per_page=300`

        const { data } = await api.get(path + params).then((res) => res.data)

        return data
    },
    ['noun-traits'],
    { revalidate: 86400, tags: ['noun-traits'] }
)

type Props = {
    children: React.ReactNode
    project: Project
}

async function NounTraits({ children, project }: Props) {
    const accessoryList: NounTrait[] = await getNounTraits(project, 'accessory')
    const backgroundList: NounTrait[] = await getNounTraits(
        project,
        'background'
    )
    const bodyList: NounTrait[] = await getNounTraits(project, 'body')
    const glassesList: NounTrait[] = await getNounTraits(project, 'glasses')
    const headList: NounTrait[] = await getNounTraits(project, 'head')

    const value = {
        accessoryList,
        backgroundList,
        bodyList,
        glassesList,
        headList,
    }

    return <NounTraitsProvider traits={value}>{children}</NounTraitsProvider>
}

export default NounTraits

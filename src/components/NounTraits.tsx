import { isNounTraitList } from '@/utils/dto/NounTrait'
import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'
import useApi from '@/utils/hooks/v2/useApi'
import NounTraitsProvider from '@/components/Provider/NounTraits'
import Project from '@/utils/dto/Project'

async function fetchTraits(project: Project, layer: NounTraitLayer) {
    const api = useApi()

    const path = project === 'LilNouns' ? `/lil-noun-traits` : `/noun-traits`

    const params = `?layer=${layer}&per_page=300`

    const { data } = await api.get(path + params).then((res) => res.data)

    if (!isNounTraitList(data)) throw new Error('Invalid data')

    return data
}

type Props = {
    children: React.ReactNode
    project: Project
}

async function NounTraits({ children, project }: Props) {
    const accessoryList = await fetchTraits(project, 'accessory')
    const backgroundList = await fetchTraits(project, 'background')
    const bodyList = await fetchTraits(project, 'body')
    const glassesList = await fetchTraits(project, 'glasses')
    const headList = await fetchTraits(project, 'head')

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

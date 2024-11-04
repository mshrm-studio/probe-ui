import NounTrait from '@/utils/dto/NounTrait'
import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'
import useApi from '@/utils/services/v2/useApi'
import NounTraitsProvider from '@/components/Provider/NounTraits'

async function getNounTraits(layer: NounTraitLayer) {
    const api = useApi()

    const path = `/noun-traits?layer=${layer}&per_page=300`

    const { data } = await api.get(path).then((res) => res.data)

    return data
}

async function NounTraits({ children }: { children: React.ReactNode }) {
    const accessoryList: NounTrait[] = await getNounTraits('accessory')
    const backgroundList: NounTrait[] = await getNounTraits('background')
    const bodyList: NounTrait[] = await getNounTraits('body')
    const glassesList: NounTrait[] = await getNounTraits('glasses')
    const headList: NounTrait[] = await getNounTraits('head')

    const value = {
        accessoryList,
        backgroundList,
        bodyList,
        glassesList,
        headList,
    }

    return (
        <NounTraitsProvider traits={value}>
            {children}
            {JSON.stringify(accessoryList)}
        </NounTraitsProvider>
    )
}

export default NounTraits

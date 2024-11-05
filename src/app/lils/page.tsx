import NounListPage from '@/components/NounListPage/NounListPage'
import NounTraits from '@/components/NounTraits'

export default async function Page() {
    return (
        <NounTraits project="LilNouns">
            <NounListPage project="LilNouns" />
        </NounTraits>
    )
}

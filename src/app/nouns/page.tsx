import NounListPage from '@/components/NounListPage/NounListPage'
import NounTraits from '@/components/NounTraits'

export default async function Page() {
    return (
        <NounTraits project="Nouns">
            <NounListPage project="Nouns" />
        </NounTraits>
    )
}

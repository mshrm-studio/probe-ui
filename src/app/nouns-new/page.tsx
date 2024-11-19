import NounListPage from '@/app/nouns-new/_components/Page'
import SearchParams from '@/utils/dto/SearchParams'

type Props = {
    searchParams: SearchParams
}

export default async function Page({ searchParams }: Props) {
    return <NounListPage project="Nouns" searchParams={searchParams} />
}

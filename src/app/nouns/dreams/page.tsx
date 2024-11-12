import NounImageFromSeed from '@/components/Noun/ImageFromSeed'
import StaticAlert from '@/components/StaticAlert'
import { isDreamNounList } from '@/utils/dto/DreamNoun'
import useApi from '@/utils/hooks/v2/useApi'

export default async function Page() {
    const api = useApi()

    const { data } = await api.get('/dream-nouns').then((res) => res.data)

    if (!isDreamNounList(data)) return <StaticAlert>Unknown Error</StaticAlert>

    return (
        <ul className="space-y-6">
            {data.map((noun) => (
                <li key={noun.id} className="space-y-2 text-xs">
                    <NounImageFromSeed dreamNoun={noun} />

                    <div>Dreamer: {noun.dreamer}</div>
                </li>
            ))}
        </ul>
    )
}

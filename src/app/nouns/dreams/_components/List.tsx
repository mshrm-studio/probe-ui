import DreamNoun from '@/utils/dto/DreamNoun'
import NounImageFromSeed from '@/components/Noun/ImageFromSeed'
import NounUnorderedList from '@/components/Noun/List/List'

export default function DreamList({ list }: { list: DreamNoun[] }) {
    if (list.length === 0) return <p>0 Dreams</p>

    return (
        <NounUnorderedList>
            {list.map((dream) => (
                <li key={dream.id}>
                    <NounImageFromSeed seed={dream} />
                </li>
            ))}
        </NounUnorderedList>
    )
}

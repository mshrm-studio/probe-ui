import DreamNoun from '@/utils/dto/DreamNoun'
import NounImageFromSeed from '@/components/Noun/ImageFromSeed'
import NounUnorderedList from '@/components/Noun/List/List'
import Link from 'next/link'

export default function DreamList({ list }: { list: DreamNoun[] }) {
    if (list.length === 0) return <p>0 Dreams</p>

    return (
        <NounUnorderedList>
            {list.map((dream) => (
                <li key={dream.id}>
                    <Link href={`/nouns/dreams/${dream.id}`}>
                        <NounImageFromSeed seed={dream} />
                    </Link>
                </li>
            ))}
        </NounUnorderedList>
    )
}

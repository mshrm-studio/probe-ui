import DreamNoun from '@/utils/dto/DreamNoun'
import NounImageFromSeed from '@/components/Noun/ImageFromSeed'
import styles from '@/app/nouns/dreams/_styles/list.module.css'

export default function DreamList({ list }: { list: DreamNoun[] }) {
    if (list.length === 0) return <p>0 Dreams</p>

    return (
        <ul className={styles.list}>
            {list.map((dream) => (
                <li key={dream.id}>
                    <NounImageFromSeed seed={dream} />
                </li>
            ))}
        </ul>
    )
}

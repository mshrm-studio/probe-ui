import DreamNoun, { isDreamNounWithCustomTrait } from '@/utils/dto/DreamNoun'
import NounImageFromSeed from '@/components/Noun/ImageFromSeed'
import NounUnorderedList from '@/components/Noun/List/List'
import Link from 'next/link'
import { NounBitMap } from '@/components/Noun/BitMap'

export default function DreamList({ list }: { list: DreamNoun[] }) {
    return (
        <NounUnorderedList>
            {list.map((dream) => (
                <li key={dream.id}>
                    <Link
                        href={`/nouns/dreams/${dream.id}`}
                        className="block h-full w-full"
                    >
                        {isDreamNounWithCustomTrait(dream) ? (
                            <NounBitMap
                                accessory={
                                    dream.custom_trait_layer === 'accessory'
                                        ? dream.custom_trait_image_url
                                        : dream.accessory_seed_id || 0
                                }
                                background={dream.background_seed_id || 0}
                                body={
                                    dream.custom_trait_layer === 'body'
                                        ? dream.custom_trait_image_url
                                        : dream.body_seed_id || 0
                                }
                                glasses={
                                    dream.custom_trait_layer === 'glasses'
                                        ? dream.custom_trait_image_url
                                        : dream.glasses_seed_id || 0
                                }
                                head={
                                    dream.custom_trait_layer === 'head'
                                        ? dream.custom_trait_image_url
                                        : dream.head_seed_id || 0
                                }
                            />
                        ) : (
                            <NounImageFromSeed seed={dream} />
                        )}
                    </Link>
                </li>
            ))}
        </NounUnorderedList>
    )
}

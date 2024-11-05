import DreamForm from '@/components/DreamPage/DreamForm'
import NounTraits from '@/components/NounTraits'

export default async function Page() {
    return (
        <NounTraits project="Nouns">
            <DreamForm />
        </NounTraits>
    )
}

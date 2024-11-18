import NounColorHistogram from '@/components/Noun/ColorHistogram'
import Noun from '@/utils/dto/Noun'
import styles from '@/app/nouns/[id]/styles/nounPage.module.css'

type Props = {
    noun: Noun
}

const NounPageColorHistogram: React.FC<Props> = ({ noun }) => {
    if (!noun.color_histogram) return null

    return (
        <section className="mb-6">
            <h3 className={styles.sectionTitle}>Colors</h3>

            <NounColorHistogram
                className={styles.colorList}
                bgColorHex={noun.background_name}
                histogram={noun.color_histogram}
            />
        </section>
    )
}

export default NounPageColorHistogram

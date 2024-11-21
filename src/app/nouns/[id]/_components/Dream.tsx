import DreamNoun from '@/utils/dto/DreamNoun'
import styles from '@/app/nouns/[id]/_styles/nounPage.module.css'
import EtherscanLink from '@/components/EtherscanLink'
import EthAddress from '@/components/EthAddress'
import DateTime from '@/components/DateTime'

export default function Dream({ noun }: { noun: DreamNoun }) {
    return (
        <dl className="space-y-1">
            <div className={styles.dlItemInline}>
                <dt className={styles.dt}>By:</dt>
                <dd className={styles.dd}>
                    <EtherscanLink
                        className="text-link"
                        address={noun.dreamer}
                        type="Address"
                    >
                        <EthAddress address={noun.dreamer} />
                    </EtherscanLink>
                </dd>
            </div>

            <div className={styles.dlItemInline}>
                <dt className={styles.dt}>On:</dt>
                <dd className={styles.dd}>
                    <DateTime iso={noun.created_at} />
                </dd>
            </div>
        </dl>
    )
}

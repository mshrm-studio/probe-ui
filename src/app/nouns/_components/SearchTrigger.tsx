import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import styles from '@/app/nouns/_styles/searchTrigger.module.css'

type Props = {
    setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
}

const NounListPageSearchTrigger: React.FC<Props> = ({ setShowSearch }) => {
    return (
        <button
            className={styles.button}
            type="button"
            onClick={() => setShowSearch((prev) => !prev)}
        >
            <MagnifyingGlassIcon className="h-4 w-4" />
        </button>
    )
}

export default NounListPageSearchTrigger

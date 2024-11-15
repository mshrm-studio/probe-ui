import styles from '@/utils/styles/header/island/island.module.css'
import HeaderIslandSearch from '@/components/Header/Island/Search'
import HeaderIslandAuth from '@/components/Header/Island/Auth'
import HeaderIslandProbe from '@/components/Header/Island/Probe'
import HeaderIslandDreamFilters from '@/components/Header/Island/DreamFilters'

export default function HeaderIsland() {
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <ul className={styles.list}>
                    <li className={styles.listItem}>
                        <HeaderIslandProbe />
                    </li>

                    <li className={styles.listItem}>
                        <HeaderIslandSearch />
                    </li>

                    <li className={styles.listItem}>
                        <HeaderIslandDreamFilters />
                    </li>

                    <li className={styles.listItem}>
                        <HeaderIslandAuth />
                    </li>
                </ul>
            </nav>
        </header>
    )
}

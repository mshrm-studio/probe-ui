import styles from '@/utils/styles/header/island/island.module.css'
import HeaderIslandSearch from '@/components/Header/Island/Search'
import HeaderIslandAuth from '@/components/Header/Island/Auth'
import HeaderIslandProbe from '@/components/Header/Island/Probe'
import HeaderIslandFilters from '@/components/Header/Island/Filters'

export default function HeaderIsland() {
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <ul className={styles.list}>
                    <HeaderIslandProbe className={styles.listItem} />

                    <HeaderIslandSearch className={styles.listItem} />

                    <HeaderIslandFilters className={styles.listItem} />

                    <HeaderIslandAuth className={styles.listItem} />
                </ul>
            </nav>
        </header>
    )
}

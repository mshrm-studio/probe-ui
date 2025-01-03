import Breadcrumb from '@/utils/dto/Breadcrumb'
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs'
import HeaderIsland from '@/components/Header/Island/Island'
import styles from '@/styles/header/catalogue.module.css'
import CopyToClipboard from '@/components/CopyToClipboard'

type Props = {
    breadcrumbs: Breadcrumb[]
}

export default function CatalogueHeader({ breadcrumbs }: Props) {
    return (
        <header className={styles.header}>
            <div className="hidden xl:block">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <HeaderIsland />

            <div className="hidden xl:flex xl:items-center xl:justify-end">
                <CopyToClipboard content="⌐◨-◨">⌐◨-◨</CopyToClipboard>
            </div>
        </header>
    )
}

import Breadcrumb from '@/utils/dto/Breadcrumb'
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs'
import HeaderIsland from '@/components/Header/Island/Island'
import SpacesImage from '@/components/SpacesImage'
import styles from '@/styles/header/catalogue.module.css'

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

            <div className="hidden xl:block">
                <SpacesImage
                    className="ml-auto mr-0"
                    src="header/noun-glasses.png"
                    alt="Noun Glasses"
                />
            </div>
        </header>
    )
}

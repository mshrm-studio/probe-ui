import Breadcrumb from '@/utils/dto/Breadcrumb'
import styles from '@/styles/breadcrumbs.module.css'
import Link from '@/components/Breadcrumbs/Link'

type Props = {
    breadcrumbs: Breadcrumb[]
}

export default function Breadcrumbs({ breadcrumbs }: Props) {
    return (
        <nav>
            <ul className={styles.list}>
                {breadcrumbs.map((breadcrumb, index) => (
                    <li key={index}>
                        <Link href={breadcrumb.href}>{breadcrumb.label}</Link>

                        {index !== breadcrumbs.length - 1 && (
                            <span className={styles.divider}>/</span>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    )
}

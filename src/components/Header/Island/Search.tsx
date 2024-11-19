'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import SearchSelect from '@/components/SearchSelect/SearchSelect'
import useNounTraitList from '@/utils/hooks/useNounTraitList'
import SelectValue from '@/utils/dto/SelectValue'
import styles from '@/styles/header/island/flyOut.module.css'
import useOutsideClick from '@/utils/hooks/useClickOutside'
import SpacesImage from '@/components/SpacesImage'

export default function HeaderIslandSearch({
    className,
}: {
    className: string
}) {
    const router = useRouter()

    const [showSearch, setShowSearch] = useState(false)

    const { traitListOptions } = useNounTraitList()

    const [selected, setSelected] = useState<SelectValue>('')

    useEffect(() => {
        if (selected) {
            router.push(`?search=${selected}`)
        }
    }, [selected])

    const searchRef = useRef<HTMLDivElement>(null)

    useOutsideClick(searchRef, () => setShowSearch(false))

    return (
        <li className={className}>
            <div ref={searchRef}>
                <button onClick={() => setShowSearch((value) => !value)}>
                    <SpacesImage src="header/search.svg" />
                </button>

                {showSearch && (
                    <div className={`${styles.flyOut} ${styles.search}`}>
                        <SearchSelect
                            boxShadowStyle="blurred"
                            label="Search"
                            options={traitListOptions}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </div>
                )}
            </div>
        </li>
    )
}

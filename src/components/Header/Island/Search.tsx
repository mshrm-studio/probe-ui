'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import SearchSelect from '@/components/SearchSelect/SearchSelect'
import useNounTraitList from '@/utils/hooks/useNounTraitList'
import SelectValue from '@/utils/dto/SelectValue'
import styles from '@/styles/header/island/flyOut.module.css'
import useOutsideClick from '@/utils/hooks/useClickOutside'
import SpacesImage from '@/components/SpacesImage'
import { startCase } from 'lodash'

export default function HeaderIslandSearch({
    className,
}: {
    className: string
}) {
    const router = useRouter()

    const [showSearch, setShowSearch] = useState(false)

    const { traitList } = useNounTraitList()

    const options = useMemo(() => {
        return traitList.map((trait) => ({
            ...trait,
            imgSrc: trait.svg_url,
            label:
                trait.layer === 'background'
                    ? trait.name.toLowerCase() === 'd5d7e1'
                        ? 'cool'
                        : 'warm'
                    : startCase(
                          trait.name.replace(new RegExp(`^${trait.layer}-`), '')
                      ),
            value: trait.name,
        }))
    }, [traitList])

    const [selected, setSelected] = useState<SelectValue>('')

    useEffect(() => {
        if (selected) {
            router.replace(`?search=${selected}`)
        }
    }, [selected])

    const searchRef = useRef<HTMLDivElement>(null)

    useOutsideClick(searchRef, () => setShowSearch(false))

    const pathname = usePathname()

    const searchablePaths = ['/nouns', 'lils']

    if (searchablePaths.includes(pathname) === false) return null

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
                            options={options}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </div>
                )}
            </div>
        </li>
    )
}

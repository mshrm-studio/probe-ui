import Sorters from '@/app/nouns/_components/Sorters'
import Header from '@/components/Header/Header'
import { useContext } from 'react'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import FiltersTrigger from '@/app/nouns/_components/FiltersTrigger'
import ProjectSwitcher from '@/app/nouns/_components/ProjectSwitcher'
import SearchTrigger from '@/app/nouns/_components/SearchTrigger'

type Props = {
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>
    setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
}

const NounListPageHeader: React.FC<Props> = ({
    setShowFilters,
    setShowSearch,
}) => {
    const { dimensions } = useContext(DimensionsContext)

    return (
        <Header>
            <div className="flex items-center justify-between">
                {dimensions.viewportWidth < 1280 ? (
                    <FiltersTrigger setShowFilters={setShowFilters} />
                ) : (
                    <Sorters />
                )}

                <SearchTrigger setShowSearch={setShowSearch} />

                <ProjectSwitcher />
            </div>
        </Header>
    )
}

export default NounListPageHeader

import Sorters from '@/components/NounListPage/Sorters'
import Header from '@/components/Header/Header'
import { useContext } from 'react'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import FiltersTrigger from '@/components/NounListPage/FiltersTrigger'
import ProjectSwitcher from '@/components/NounListPage/ProjectSwitcher'
import SearchTrigger from '@/components/NounListPage/SearchTrigger'

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

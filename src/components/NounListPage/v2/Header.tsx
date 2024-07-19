import Sorters from '@/components/NounListPage/v2/Sorters'
import Header from '@/components/Header/v2/Header'
import { useContext } from 'react'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import FiltersTrigger from '@/components/NounListPage/v2/FiltersTrigger'
import ProjectSwitcher from '@/components/NounListPage/v2/ProjectSwitcher'
import SearchTrigger from '@/components/NounListPage/v2/SearchTrigger'

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
            <div className="flex items-center justify-between space-x-6">
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

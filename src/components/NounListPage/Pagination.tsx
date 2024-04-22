'use client'

import React from 'react'
import ApiMeta from '@/utils/dto/ApiMeta'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid'

const NounListPagePagination: React.FC<{
    meta: ApiMeta
    setPage: React.Dispatch<React.SetStateAction<number>>
}> = ({ meta, setPage }) => {
    return (
        <nav className="flex justify-center items-center space-x-2 text-[13px]">
            {meta.current_page > 1 && (
                <div>
                    <button onClick={() => setPage(meta.current_page - 1)}>
                        <ArrowLeftIcon className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div>Page</div>

            {meta.current_page > 2 && (
                <div className="font-bold">
                    <button onClick={() => setPage(1)}>1</button>
                </div>
            )}

            {meta.current_page > 3 && <div>...</div>}

            {meta.current_page > 1 && (
                <div className="font-bold">
                    <button onClick={() => setPage(meta.current_page - 1)}>
                        {meta.current_page - 1}
                    </button>
                </div>
            )}

            <div className="underline font-bold">{meta.current_page}</div>

            {meta.current_page < meta.last_page - 1 && (
                <div className="font-bold">
                    <button onClick={() => setPage(meta.current_page + 1)}>
                        {meta.current_page + 1}
                    </button>
                </div>
            )}

            {meta.current_page < meta.last_page - 2 && <div>...</div>}

            {meta.current_page < meta.last_page && (
                <div className="font-bold">
                    <button onClick={() => setPage(meta.last_page)}>
                        {meta.last_page}
                    </button>
                </div>
            )}

            {meta.current_page < meta.last_page && (
                <div>
                    <button onClick={() => setPage(meta.current_page + 1)}>
                        <ArrowRightIcon className="h-4 w-4" />
                    </button>
                </div>
            )}
        </nav>
    )
}

export default NounListPagePagination

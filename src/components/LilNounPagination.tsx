'use client'
import React from 'react'
import ApiMeta from '@/utils/dto/ApiMeta'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import { useRouter, useSearchParams } from 'next/navigation'

type Props = {
    meta: ApiMeta
}

const LilNounPagination: React.FC<Props> = ({ meta }) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const changePage = (page: number) => {
        const newParams = new URLSearchParams(searchParams.toString())

        newParams.set('page', page.toString())

        router.push(`/?${newParams.toString()}`)
    }

    return (
        <nav className="flex justify-center items-center space-x-2 text-[13px]">
            {meta.current_page > 1 && (
                <div>
                    <button onClick={() => changePage(meta.current_page - 1)}>
                        <ArrowLeftIcon className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div>Page</div>

            {meta.current_page > 1 && (
                <div className="font-bold">
                    <button onClick={() => changePage(1)}>1</button>
                </div>
            )}

            {meta.current_page > 1 && <div>...</div>}

            <div className="underline font-bold">{meta.current_page}</div>

            {meta.current_page < meta.last_page - 1 && (
                <div className="font-bold">
                    <button onClick={() => changePage(meta.current_page + 1)}>
                        {meta.current_page + 1}
                    </button>
                </div>
            )}

            {meta.current_page < meta.last_page - 2 && (
                <div className="font-bold">
                    <button onClick={() => changePage(meta.current_page + 2)}>
                        {meta.current_page + 2}
                    </button>
                </div>
            )}

            {meta.current_page < meta.last_page - 4 && <div>...</div>}

            {meta.current_page < meta.last_page - 3 && (
                <div className="font-bold">
                    <button onClick={() => changePage(meta.last_page)}>
                        {meta.last_page}
                    </button>
                </div>
            )}

            {meta.current_page < meta.last_page && (
                <div>
                    <button onClick={() => changePage(meta.current_page + 1)}>
                        <ArrowRightIcon className="h-4 w-4" />
                    </button>
                </div>
            )}
        </nav>
    )
}

export default LilNounPagination

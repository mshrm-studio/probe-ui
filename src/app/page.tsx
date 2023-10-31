'use client'
import LilNounFilters from '@/components/LilNounFilters'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { debounce, startCase } from 'lodash'
import useLilNounList from '@/utils/services/useLilNounList'
import LilNounList from '@/components/LilNounList'
import LilNoun from '@/utils/dto/LilNoun'
import LilNounImage from '@/components/LilNounImage'

export default function Home() {
    const { error, fetching, fetchLilNounList, lilNounList, meta } =
        useLilNounList()

    const searchParams = useSearchParams()

    useEffect(() => {
        const debouncedFetch = debounce(() => {
            fetchLilNounList(searchParams)
        }, 500)

        debouncedFetch()

        return () => debouncedFetch.cancel()
    }, [searchParams])

    const [selected, setSelected] = useState<LilNoun | null>(null)

    const updateSelected = (newSelection: LilNoun) => {
        setSelected(
            selected?.token_id == newSelection?.token_id ? null : newSelection
        )
    }

    return (
        <main className="flex justify-center">
            <div className="space-y-3">
                <LilNounFilters meta={meta} />

                {error && <p>{error.data.message}</p>}

                {lilNounList && (
                    <div className="flex flex-column justify-center xl:flex-row-reverse">
                        {selected && (
                            <div className="space-y-5 xl:ml-6">
                                <div>
                                    <LilNounImage
                                        className="rounded max-h-[269px]"
                                        lilNoun={selected}
                                    />
                                </div>

                                <div className="uppercase space-y-3">
                                    <h3 className="text-[34px] font-bold">
                                        Lil {selected.token_id}
                                    </h3>

                                    <div className="text-[13px] space-y-2">
                                        <p>
                                            <dt className="inline">Body:</dt>{' '}
                                            <dd className="inline font-bold">
                                                {startCase(
                                                    selected.body_name.replace(
                                                        new RegExp(`^body-`),
                                                        ''
                                                    )
                                                )}
                                            </dd>
                                        </p>

                                        <p>
                                            <dt className="inline">
                                                Accessory:
                                            </dt>{' '}
                                            <dd className="inline font-bold">
                                                {startCase(
                                                    selected.accessory_name.replace(
                                                        new RegExp(
                                                            `^accessory-`
                                                        ),
                                                        ''
                                                    )
                                                )}
                                            </dd>
                                        </p>

                                        <p>
                                            <dt className="inline">Head:</dt>{' '}
                                            <dd className="inline font-bold">
                                                {startCase(
                                                    selected.head_name.replace(
                                                        new RegExp(`^head-`),
                                                        ''
                                                    )
                                                )}
                                            </dd>
                                        </p>

                                        <p>
                                            <dt className="inline">Glasses:</dt>{' '}
                                            <dd className="inline font-bold">
                                                {startCase(
                                                    selected.glasses_name.replace(
                                                        new RegExp(`^glasses-`),
                                                        ''
                                                    )
                                                )}
                                            </dd>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="self-auto">
                            <LilNounList
                                lilNouns={lilNounList}
                                selected={selected}
                                setSelected={updateSelected}
                            />
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}

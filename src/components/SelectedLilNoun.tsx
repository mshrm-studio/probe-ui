'use client'
import React from 'react'
import LilNoun from '@/utils/dto/LilNoun'
import LilNounImage from '@/components/LilNounImage'
import { startCase } from 'lodash'

type Props = {
    selected: LilNoun
    updateSelected: (selected: null) => void
}

const SelectedLilNoun: React.FC<Props> = ({ selected, updateSelected }) => {
    return (
        <div className="space-y-5 mb-6 mx-auto xl:mb-0 xl:ml-6">
            <div className="relative">
                <LilNounImage
                    className="rounded max-h-[269px]"
                    lilNoun={selected}
                />

                <button
                    className="absolute right-2 top-2"
                    onClick={() => updateSelected(null)}
                >
                    x
                </button>
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
                        <dt className="inline">Accessory:</dt>{' '}
                        <dd className="inline font-bold">
                            {startCase(
                                selected.accessory_name.replace(
                                    new RegExp(`^accessory-`),
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
    )
}

export default SelectedLilNoun

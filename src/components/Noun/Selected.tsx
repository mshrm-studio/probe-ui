'use client'
import React from 'react'
import Noun from '@/utils/dto/Noun'
import NounImage from '@/components/Noun/Image'
import { startCase } from 'lodash'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { DateTime } from 'luxon'
import TextLink from '@/components/TextLink'
import Project from '@/utils/dto/Project'
import { AnimatePresence } from 'framer-motion'
import Modal from '@/components/Modal'

type Props = {
    project: Project
    selected: Noun
    updateSelected: (selected: null) => void
}

const SelectedNoun: React.FC<Props> = ({
    project,
    selected,
    updateSelected,
}) => {
    const onClickOutside = () => {
        updateSelected(null)
    }

    return (
        <AnimatePresence>
            <Modal onClickOutside={onClickOutside}>
                <div className="max-w-[269px] relative">
                    <button
                        className="absolute right-2 top-2"
                        onClick={() => updateSelected(null)}
                    >
                        <XMarkIcon className="h-4 w-4" />
                    </button>

                    <div className="p-6 space-y-5">
                        <NounImage className="rounded-xl" noun={selected} />

                        <div className="space-y-5">
                            <div>
                                <h3 className="text-[34px] font-bold">
                                    {project === 'Nouns' ? 'Noun' : 'Lil'}{' '}
                                    {selected.token_id}
                                </h3>

                                <p className="uppercase text-[11px] text-[#6C6C6C] font-bold">
                                    Born{' '}
                                    {DateTime.fromISO(selected.minted_at, {
                                        zone: 'utc',
                                    })
                                        .toLocal()
                                        .toFormat('MMMM dd, yyyy h:mm a Z')}
                                </p>
                            </div>

                            <div className="uppercase text-[13px] text-[#6C6C6C] space-y-3">
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

                                {selected.area && (
                                    <p>
                                        <dt className="inline">Area:</dt>{' '}
                                        <dd className="inline font-bold">
                                            {selected.area}
                                        </dd>
                                    </p>
                                )}

                                {selected.weight && (
                                    <p>
                                        <dt className="inline">Weight:</dt>{' '}
                                        <dd className="inline font-bold">
                                            {selected.weight}
                                        </dd>
                                    </p>
                                )}

                                <p>
                                    <TextLink
                                        href={
                                            project === 'Nouns'
                                                ? `https://nouns.wtf/noun/${selected.token_id}`
                                                : `https://lilnouns.wtf/lilnoun/${selected.token_id}`
                                        }
                                    >
                                        View Activity
                                    </TextLink>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </AnimatePresence>
    )
}

export default SelectedNoun

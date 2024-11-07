import { useContext, useMemo } from 'react'
import NounTraitsContext from '@/utils/contexts/NounTraitsContext'
import { startCase } from 'lodash'
import NounTrait from '@/utils/dto/NounTrait'

const useNounTraitList = () => {
    const { accessoryList, backgroundList, bodyList, glassesList, headList } =
        useContext(NounTraitsContext)

    const traitList = useMemo(
        () => [
            ...accessoryList,
            ...backgroundList,
            ...bodyList,
            ...glassesList,
            ...headList,
        ],
        [accessoryList, backgroundList, bodyList, glassesList, headList]
    )

    const traitSelectOption = (trait: NounTrait) => ({
        ...trait,
        imgSrc: trait.svg_url,
        label:
            trait.layer === 'background'
                ? trait.name.toLowerCase() == 'd5d7e1'
                    ? 'cool'
                    : 'warm'
                : startCase(
                      trait.name.replace(new RegExp(`^${trait.layer}-`), '')
                  ),
        value: trait.name,
    })

    const traitSelectOptions = (traits: NounTrait[]) =>
        traits
            .map((trait) => traitSelectOption(trait))
            .sort((a, b) => a.label.localeCompare(b.label))

    const accessoryListOptions = useMemo(
        () => traitSelectOptions(accessoryList),
        [accessoryList]
    )

    const backgroundListOptions = useMemo(
        () => traitSelectOptions(backgroundList),
        [backgroundList]
    )

    const bodyListOptions = useMemo(
        () => traitSelectOptions(bodyList),
        [bodyList]
    )

    const glassesListOptions = useMemo(
        () => traitSelectOptions(glassesList),
        [glassesList]
    )

    const headListOptions = useMemo(
        () => traitSelectOptions(headList),
        [headList]
    )

    const traitListOptions = useMemo(
        () =>
            [
                ...accessoryListOptions,
                ...backgroundListOptions,
                ...bodyListOptions,
                ...glassesListOptions,
                ...headListOptions,
            ]
                .map((o) => ({
                    ...o,
                    label: `${o.label} (${startCase(o.layer)})`,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)),
        [
            accessoryListOptions,
            backgroundListOptions,
            bodyListOptions,
            glassesListOptions,
            headListOptions,
        ]
    )

    return {
        accessoryList,
        accessoryListOptions,
        backgroundList,
        backgroundListOptions,
        bodyList,
        bodyListOptions,
        glassesList,
        glassesListOptions,
        headList,
        headListOptions,
        traitList,
        traitListOptions,
    }
}

export default useNounTraitList

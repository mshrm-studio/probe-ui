import inputStyles from '@/styles/input/file.module.css'
import styles from '@/app/nouns/proposals/create/_styles/proposal.module.css'
import useNounTraitList from '@/utils/hooks/useNounTraitList'
import React, { useContext, useMemo, useState } from 'react'
import { NounTraitLayer, nounTraitLayers } from '@/utils/dto/NounTraitLayer'
import SelectTraitType from '@/components/Select/SelectTraitType'
import SelectNounTrait from '@/components/Select/NounTrait'
import DimensionsContext from '@/utils/contexts/DimensionsContext'
import NounSeed from '@/utils/dto/NounSeed'
import Button from '@/components/Button'

interface Props {
    seed: NounSeed
    traitFile: File | null
    traitLayer: NounTraitLayer
    setPropose: React.Dispatch<React.SetStateAction<boolean>>
    setSeed: React.Dispatch<React.SetStateAction<NounSeed>>
    setTraitFile: React.Dispatch<React.SetStateAction<File | null>>
    setTraitLayer: React.Dispatch<React.SetStateAction<NounTraitLayer>>
}

export default function TraitForm({
    seed,
    traitFile,
    traitLayer,
    setPropose,
    setSeed,
    setTraitFile,
    setTraitLayer,
}: Props) {
    const [showUploadForm, setShowUploadForm] = useState(false)
    const { dimensions } = useContext(DimensionsContext)

    const traitAnchorTo = useMemo(() => {
        if (dimensions.viewportWidth >= 640) return 'right'

        return 'bottom'
    }, [dimensions.viewportWidth])

    const handleTraitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file) {
            setTraitFile(file)
        }
    }

    const dream = (e: React.FormEvent) => {
        e.preventDefault()

        alert('TODO: NOT SETUP YET.')
        // TODO
    }

    const propose = (e: React.FormEvent) => {
        e.preventDefault()

        if (traitLayer && traitFile) {
            setPropose(true)
        } else {
            alert('Please select a trait and upload a file')
        }
    }

    if (showUploadForm)
        return (
            <form className={styles.form} onSubmit={propose}>
                <SelectTraitType
                    exclude={['background']}
                    selected={traitLayer}
                    setSelected={(value) =>
                        setTraitLayer(value as NounTraitLayer)
                    }
                />

                {traitLayer && (
                    <div>
                        <label
                            htmlFor="file-upload"
                            className={inputStyles.input}
                        >
                            <span>Add Trait</span>

                            <input
                                id="file-upload"
                                name="file-upload"
                                accept="image/png"
                                type="file"
                                className="sr-only"
                                onChange={handleTraitUpload}
                            />
                        </label>
                    </div>
                )}

                <Button nativeType="submit">Propose</Button>
            </form>
        )

    return (
        <form className={styles.form} onSubmit={dream}>
            {nounTraitLayers
                .filter((layer) => layer !== traitLayer)
                .map((layer) => (
                    <div key={layer}>
                        <SelectNounTrait
                            anchorTo={traitAnchorTo}
                            layer={layer}
                            required
                            selected={seed[layer]}
                            setSelected={(value) => {
                                setSeed((prev) => ({
                                    ...prev,
                                    [layer]: value,
                                }))
                            }}
                            valueKey="seed_id"
                        />
                    </div>
                ))}

            {traitFile === null && (
                <Button
                    color="purple"
                    nativeType="button"
                    onClick={() => setShowUploadForm(true)}
                >
                    Upload Trait
                </Button>
            )}

            <Button nativeType="submit">Dream</Button>
        </form>
    )
}

'use client'

import SelectNounTrait from '@/components/Select/NounTrait'
import { nounTraitLayers } from '@/utils/dto/NounTraitLayer'
import { FormEvent, useCallback, useMemo, useState } from 'react'
import Button from '@/components/Button'
import NounTrait from '@/utils/dto/NounTrait'
import styles from '@/app/nouns/dreams/create/_styles/create.module.css'
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react'
import useApi from '@/utils/hooks/v2/useApi'
import { isDreamNounResponse } from '@/utils/dto/DreamNoun'
import NounImageFromSeed from '@/components/Noun/ImageFromSeed'
import NounSeed from '@/utils/dto/NounSeed'
import useNounTraitList from '@/utils/hooks/useNounTraitList'

export default function DreamForm() {
    const { address, isConnected } = useWeb3ModalAccount()
    const { open } = useWeb3Modal()
    const api = useApi()

    const { accessoryList, backgroundList, bodyList, glassesList, headList } =
        useNounTraitList()

    const randomTrait = useCallback(
        (list: NounTrait[]) =>
            list[Math.floor(Math.random() * list.length)].seed_id,
        []
    )

    const [seed, setSeed] = useState<NounSeed>({
        accessory: 0,
        background: 0,
        body: 0,
        glasses: 0,
        head: 0,
    })

    // useEffect(() => {
    //     setSeed({
    //         accessory: randomTrait(accessoryList),
    //         background: randomTrait(backgroundList),
    //         body: randomTrait(bodyList),
    //         glasses: randomTrait(glassesList),
    //         head: randomTrait(headList),
    //     })
    // }, [])

    const backgroundColor = useMemo(() => {
        const bg = backgroundList.find((t) => t.seed_id == seed.background)

        return bg ? `#${bg.name}` : '#ffffff'
    }, [backgroundList, seed.background])

    const dream = async (e: FormEvent) => {
        e.preventDefault()

        if (!isConnected) {
            open()
            return
        }

        try {
            const { data } = await api.post('/dream-nouns', {
                dreamer: address,
                accessory_seed_id: seed.accessory,
                background_seed_id: seed.background,
                body_seed_id: seed.body,
                glasses_seed_id: seed.glasses,
                head_seed_id: seed.head,
            })

            if (!isDreamNounResponse(data)) {
                throw new Error('Dream created but unexpected response.')
            }

            alert('Dream created!')
        } catch (error) {
            alert(error)
        }
    }

    return (
        <div className={styles.pageContainer}>
            <div
                className={styles.image}
                style={{
                    backgroundColor: backgroundColor,
                }}
            >
                <NounImageFromSeed seed={seed} />
            </div>

            <div className={styles.formContainer}>
                <form className={styles.form} onSubmit={dream}>
                    {nounTraitLayers.map((layer) => (
                        <div key={layer}>
                            <SelectNounTrait
                                key={layer}
                                layer={layer}
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

                    <Button nativeType="submit">Dream</Button>
                </form>
            </div>
        </div>
    )
}

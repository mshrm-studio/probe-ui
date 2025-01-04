'use client'

import SelectNounTrait from '@/components/Select/NounTrait'
import { nounTraitLayers } from '@/utils/dto/NounTraitLayer'
import { FormEvent, useCallback, useMemo, useState } from 'react'
import Button from '@/components/Button'
import NounTrait from '@/utils/dto/NounTrait'
import styles from '@/app/nouns/dreams/create/_styles/dream.module.css'
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react'
import useApi from '@/utils/hooks/v2/useApi'
import { isDreamNounResponse } from '@/utils/dto/DreamNoun'
import NounImageFromSeed from '@/components/Noun/ImageFromSeed'
import NounSeed from '@/utils/dto/NounSeed'
import useNounTraitList from '@/utils/hooks/useNounTraitList'
import { useRouter } from 'next/navigation'
import useHref from '@/utils/hooks/useHref'
import { NounBitMap } from '@/components/Noun/BitMap'

export default function Dream() {
    const { address, isConnected } = useWeb3ModalAccount()
    const { open } = useWeb3Modal()
    const api = useApi()
    const router = useRouter()
    const { dreamsLink } = useHref()

    const { accessoryList, backgroundList, bodyList, glassesList, headList } =
        useNounTraitList()

    const [seed, setSeed] = useState<NounSeed>({
        accessory: 0,
        background: 0,
        body: 0,
        glasses: 0,
        head: 0,
    })

    const backgroundColor = useMemo(() => {
        const bg = backgroundList.find((t) => t.seed_id == seed.background)

        return bg ? `#${bg.name}` : '#ffffff'
    }, [backgroundList, seed.background])

    const randomTrait = useCallback(
        (list: NounTrait[]) =>
            list[Math.floor(Math.random() * list.length)].seed_id,
        []
    )

    const randomise = () => {
        setSeed({
            accessory: randomTrait(accessoryList),
            background: randomTrait(backgroundList),
            body: randomTrait(bodyList),
            glasses: randomTrait(glassesList),
            head: randomTrait(headList),
        })
    }

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

            const response = await fetch('/api/revalidate-path', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    path: '/nouns/dreams',
                }),
            })

            if (!response.ok) throw new Error('Failed to revalidate dreams.')

            alert(
                'Dream created. Please give it a few moments to appear in the gallery.'
            )

            router.push(dreamsLink)
        } catch (error: any) {
            console.error(error)
            alert(error?.response?.data?.message || error?.message || error)
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

                <div className={styles.randomiseBtnContainer}>
                    <Button color="white" onClick={randomise}>
                        Randomize
                    </Button>
                </div>
            </div>

            <div className={styles.formContainer}>
                <form className={styles.form} onSubmit={dream}>
                    {nounTraitLayers.map((layer) => (
                        <div key={layer}>
                            <SelectNounTrait
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

                    <Button nativeType="submit">Dream</Button>
                </form>
            </div>
        </div>
    )
}

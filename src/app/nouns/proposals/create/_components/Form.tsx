'use client'

import React, { useContext, useMemo, useState } from 'react'
import { BrowserProvider, Contract, parseEther } from 'ethers'
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from '@web3modal/ethers/react'
import DataProxyContractContext from '@/utils/contexts/DataProxyContractContext'
import useProposalContent from '@/utils/hooks/useProposalContent'
import useImageBitmap from '@/utils/hooks/useImageBitmap'
import useArtworkEncoding from '@/utils/hooks/useArtworkEncoding'
import { ImageData } from '@nouns/assets'
import Palette from '@/utils/dto/Palette'
import { encodeFunctionData, getAbiItem } from 'viem'
import { formatAbiItem } from 'viem/utils'
import { nounsDescriptorContractABI } from '@/utils/contracts/NounsDescriptorContractABI'
import { nounsTokenContractABI } from '@/utils/contracts/NounsTokenContractABI'
import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'
import styles from '@/app/nouns/proposals/create/_styles/proposal.module.css'
import inputStyles from '@/styles/input/input.module.css'
import Button from '@/components/Button'
import { useWeb3Modal } from '@web3modal/ethers/react'
import ArtworkContributionForm from '@/app/nouns/proposals/create/_components/ArtworkContributionForm'
import TraitForm from '@/app/nouns/proposals/create/_components/TraitForm'
import ArtworkContributionAgreement from '@/utils/dto/ArtworkContributionAgreement'
import NounSeed from '@/utils/dto/NounSeed'

interface Props {
    seed: NounSeed
    traitCanvas: HTMLCanvasElement | null
    traitFile: File | null
    traitLayer: NounTraitLayer
    setSeed: React.Dispatch<React.SetStateAction<NounSeed>>
    setTraitFile: React.Dispatch<React.SetStateAction<File | null>>
    setTraitLayer: React.Dispatch<React.SetStateAction<NounTraitLayer>>
}

const Form: React.FC<Props> = ({
    seed,
    traitCanvas,
    traitFile,
    traitLayer,
    setSeed,
    setTraitFile,
    setTraitLayer,
}) => {
    const { open } = useWeb3Modal()

    const { httpDataProxyContract } = useContext(DataProxyContractContext)
    const { walletProvider } = useWeb3ModalProvider()
    const { address } = useWeb3ModalAccount()
    const [propose, setPropose] = useState(false)
    const [ethRequested, setEthRequested] = useState(0)

    const functionName = useMemo(() => {
        if (traitLayer === 'head') return 'addHeads'
        if (traitLayer === 'accessory') return 'addAccessories'
        if (traitLayer === 'body') return 'addBodies'
        if (traitLayer === 'glasses') return 'addGlasses'
        return null
    }, [traitLayer])

    const traitFileNameWithoutExtension = useMemo(
        () => traitFile?.name.replace(/\.[^/.]+$/, ''),
        [traitFile]
    )
    const traitBitmap = useImageBitmap(traitCanvas, traitFile)
    const {
        compressAndEncodeTrait,
        getColorIndexes,
        getPaletteIndex,
        getTraitColors,
        verifyTrait,
    } = useArtworkEncoding()

    const [artworkContributionAgreement, setArtworkContributionAgreement] =
        useState<ArtworkContributionAgreement | null>(null)
    const { generate: generateProposalContent } = useProposalContent()

    const proposalContent = useMemo(() => {
        if (
            !address ||
            !artworkContributionAgreement ||
            !traitCanvas ||
            !traitFileNameWithoutExtension
        )
            return null

        return generateProposalContent({
            artContributionAgreement: artworkContributionAgreement,
            trait: {
                image: traitCanvas.toDataURL('image/png'),
                layer: traitLayer,
                name: traitFileNameWithoutExtension,
            },
        })
    }, [
        address,
        artworkContributionAgreement,
        generateProposalContent,
        traitCanvas,
        traitFileNameWithoutExtension,
        traitLayer,
    ])

    const traitColors = useMemo(() => {
        if (!traitBitmap) return null

        return getTraitColors(traitBitmap)
    }, [traitBitmap, getTraitColors])

    const paletteIndex = useMemo(() => {
        if (!traitColors) return null

        const paletteAsHexColors = ImageData.palette
            .filter((color) => color !== '')
            .map((color) => `#${color}`)

        const idx = getPaletteIndex(traitColors, [
            paletteAsHexColors as Palette,
        ])

        // this uses palettes call of descriptor contract that only contains 1 palette
        // so default to 0
        // TODO: all colors from image cannot be found in palette
        return idx ? idx : 0
    }, [ImageData.palette, traitColors, getPaletteIndex])

    const traitColorIndexes = useMemo(() => {
        if (!traitCanvas) return null

        const paletteAsHexColors = ImageData.palette
            .filter((color) => color !== '')
            .map((color) => `#${color}`)

        return getColorIndexes(traitCanvas, paletteAsHexColors as Palette)
    }, [ImageData.palette, traitCanvas])

    const compressedEncodedArtwork = useMemo(() => {
        if (
            !Array.isArray(traitColorIndexes) ||
            typeof paletteIndex !== 'number'
        )
            return null

        return compressAndEncodeTrait(traitColorIndexes, paletteIndex)
    }, [traitColorIndexes, paletteIndex])

    const calldatas = useMemo(() => {
        if (!compressedEncodedArtwork || !functionName) return null

        // ADD THIS WHEN REQUESTING A NOUN
        // encodeFunctionData({
        //     abi: nounsTokenContractABI,
        //     functionName: 'safeTransferFrom',
        //     args: [
        //         process.env.NEXT_PUBLIC_NOUNS_TOKEN_CONTRACT_ADDRESS,
        //         address,
        //         0, // TOKENID
        //     ],
        // })

        return [
            // 1) Encode the descriptor call (e.g. addHeads, addAccessories, etc.)
            encodeFunctionData({
                abi: nounsDescriptorContractABI,
                functionName,
                args: compressedEncodedArtwork,
            }).substring(10),
            // 2) when requesting ETH, leave empty,
            '',
            // 3) Empty for array harmony
            '',
        ].map((calldata) => `0x${calldata}` as `0x${string}`)
    }, [compressedEncodedArtwork, functionName])

    const signatures = useMemo(() => {
        if (!functionName || !nounsDescriptorContractABI) return null

        // BELOW REQUIRED IF REQUESTING A NOUN
        // safeTransferFrom(address,address,uint256)

        // return ['addHeads(bytes,uint80,uint16)', '', '']

        const item = getAbiItem({
            abi: nounsDescriptorContractABI,
            name: functionName,
        })

        if (!item) return null

        return [formatAbiItem(item), '', '']
    }, [functionName, nounsDescriptorContractABI])

    async function handleCreateProposalCandidate(event: React.FormEvent) {
        event.preventDefault()

        if (!traitColorIndexes || !compressedEncodedArtwork) return

        try {
            const okay = await verifyTrait(
                traitColorIndexes,
                compressedEncodedArtwork
            )
            console.log('Trait encoding verified:', okay)
        } catch (err) {
            console.error('Verification failed', err)
        }

        if (!address) {
            alert('No address found')
            return
        }

        if (!walletProvider) {
            alert('No wallet provider found')
            return
        }

        if (!httpDataProxyContract) {
            alert('dataProxyContract not found')
            return
        }

        try {
            const createCandidateCost =
                await httpDataProxyContract.createCandidateCost()
            // returns 10000000000000000n

            console.log('createCandidateCost:', createCandidateCost)

            const targets = [
                process.env.NEXT_PUBLIC_NOUNS_DESCRIPTOR_CONTRACT_ADDRESS,
                process.env.NEXT_PUBLIC_NOUNS_TOKEN_CONTRACT_ADDRESS,
                address,
            ]

            const values = ['0', parseEther(String(ethRequested)), '0']

            const description = proposalContent
            const slug = `my-test-proposal-${Date.now()}`
            const proposalIdToUpdate = 0

            const provider = new BrowserProvider(walletProvider)
            const signer = await provider.getSigner()
            const contractWithSigner = httpDataProxyContract.connect(
                signer
            ) as Contract

            console.log('targets:', targets)
            console.log('values:', values)
            console.log('signatures:', signatures)
            console.log('calldatas:', calldatas)
            console.log('description:', description)
            console.log('slug:', slug)
            console.log('proposalIdToUpdate:', proposalIdToUpdate)

            const gasEstimate =
                await contractWithSigner.createProposalCandidate.estimateGas(
                    targets,
                    values,
                    signatures,
                    calldatas,
                    description,
                    slug,
                    proposalIdToUpdate,
                    {
                        value: createCandidateCost,
                    }
                )

            const gasLimit = gasEstimate + BigInt(10000) // Padding to avoid out-of-gas
            console.log('gasLimit:', gasLimit)

            const tx = await contractWithSigner.createProposalCandidate(
                targets,
                values,
                signatures,
                calldatas,
                description,
                slug,
                proposalIdToUpdate,
                {
                    value: createCandidateCost,
                    gasLimit,
                }
            )

            const receipt = await tx.wait()
            console.log('Transaction Receipt:', receipt)

            alert('Proposal candidate created successfully!')
        } catch (error: any) {
            // Provide whichever error information is available
            console.error('error:', error)
            const message =
                error?.info?.error?.message || error?.message || 'Unknown Error'
            alert(`Error: ${message}`)
        }
    }

    if (!httpDataProxyContract)
        return (
            <div className={styles.formContainer}>
                <p>Contract not loaded.</p>
            </div>
        )

    return (
        <div className={styles.formContainer}>
            <div>
                {!propose && (
                    <TraitForm
                        seed={seed}
                        traitFile={traitFile}
                        traitLayer={traitLayer}
                        setPropose={setPropose}
                        setSeed={setSeed}
                        setTraitFile={setTraitFile}
                        setTraitLayer={setTraitLayer}
                    />
                )}

                {propose && traitFile && (
                    <div className="space-y-4">
                        <label className="block" htmlFor="ethRequested">
                            ETH Requested
                        </label>

                        <input
                            className={inputStyles.input}
                            id="ethRequested"
                            type="number"
                            placeholder="Specify ETH Amount"
                            value={ethRequested}
                            onChange={(e) =>
                                setEthRequested(Number(e.target.value))
                            }
                        />

                        <ArtworkContributionForm
                            agreement={artworkContributionAgreement}
                            setAgreement={setArtworkContributionAgreement}
                            traitCanvas={traitCanvas}
                            traitFileName={traitFileNameWithoutExtension}
                        />

                        <form
                            onSubmit={handleCreateProposalCandidate}
                            className={styles.form}
                        >
                            <Button
                                color="purple"
                                disabled={artworkContributionAgreement === null}
                                nativeType="submit"
                            >
                                Submit (0.1 ETH)
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Form

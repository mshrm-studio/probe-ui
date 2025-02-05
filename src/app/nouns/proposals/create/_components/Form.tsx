'use client'

import React, { useContext, useMemo, useState } from 'react'
import { BrowserProvider, Contract, parseEther } from 'ethers'
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from '@web3modal/ethers/react'
import CryptoWalletConnect from '@/components/CryptoWallet/Connect'
import DataProxyContractContext from '@/utils/contexts/DataProxyContractContext'
import useProposalContent from '@/utils/hooks/useProposalContent'
import inputStyles from '@/styles/input/file.module.css'
import useImageBitmap from '@/utils/hooks/useImageBitmap'
import useArtworkEncoding from '@/utils/hooks/useArtworkEncoding'
import { ImageData } from '@nouns/assets'
import Palette from '@/utils/dto/Palette'
import { encodeFunctionData, getAbiItem } from 'viem'
import { formatAbiItem } from 'viem/utils'
import { nounsDescriptorContractABI } from '@/utils/contracts/NounsDescriptorContractABI'
import { nounsTokenContractABI } from '@/utils/contracts/NounsTokenContractABI'
import Markdown from 'react-markdown'
import { NounTraitLayer } from '@/utils/dto/NounTraitLayer'
import styles from '@/app/nouns/proposals/create/_styles/proposal.module.css'
import Button from '@/components/Button'

interface Props {
    traitCanvas: HTMLCanvasElement | null
    traitFile: File | null
    traitLayer: NounTraitLayer
    setTraitFile: React.Dispatch<React.SetStateAction<File | null>>
    setTraitLayer: React.Dispatch<React.SetStateAction<NounTraitLayer>>
}

const Form: React.FC<Props> = ({
    traitCanvas,
    traitFile,
    traitLayer,
    setTraitFile,
    setTraitLayer,
}) => {
    const { httpDataProxyContract } = useContext(DataProxyContractContext)
    const { walletProvider } = useWeb3ModalProvider()
    const { address } = useWeb3ModalAccount()

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

    const artworkContributionAgreementMessage = useMemo(() => {
        return `I, the individual controlling Ethereum address ${address}, hereby waive all copyright and all related or neighboring rights, together with any associated claims or causes of action, to the extent permitted by law. I have read and understand the terms and intended legal effect of the Nouns Art Contribution Agreement, available at https://z5pvlzj323gcssdd3bua3hjqckxbcsydr4ksukoidh3l46fhet4q.arweave.net/z19V5TvWzClIY9hoDZ0wEq4RSwOPFSopyBn2vninJPk, and hereby voluntarily elect to apply it to this contribution. Contribution name: ${traitFileNameWithoutExtension}. Contribution specification: ${traitCanvas?.toDataURL(
            'image/png'
        )}.`
    }, [address, traitCanvas, traitFileNameWithoutExtension])
    const [
        artworkContributionAgreementSignature,
        setArtworkContributionAgreementSignature,
    ] = useState('')
    const { generate: generateProposalContent } = useProposalContent()

    const handleTraitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('e.target.files:', e.target.files)
        const file = e.target.files?.[0]

        if (file) {
            setTraitFile(file)
        }
    }

    async function handleArtworkContributionSigning(event: React.FormEvent) {
        event.preventDefault()

        if (!address) {
            alert('No address found')
            return
        }

        if (!walletProvider) {
            alert('No wallet provider found')
            return
        }

        const provider = new BrowserProvider(walletProvider)
        const signer = await provider.getSigner()

        const signature = await signer.signMessage(
            artworkContributionAgreementMessage
        )

        console.log('signature:', signature)

        setArtworkContributionAgreementSignature(signature)
    }

    const proposalContent = useMemo(() => {
        if (
            !address ||
            !artworkContributionAgreementSignature ||
            !traitCanvas ||
            !traitFileNameWithoutExtension
        )
            return null

        return generateProposalContent({
            artContributionAgreement: {
                message: artworkContributionAgreementMessage,
                signature: artworkContributionAgreementSignature,
                signer: address,
            },
            trait: {
                image: traitCanvas.toDataURL('image/png'),
                layer: traitLayer,
                name: traitFileNameWithoutExtension,
            },
        })
    }, [
        address,
        artworkContributionAgreementMessage,
        artworkContributionAgreementSignature,
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

            const values = ['0', parseEther('1'), '0']

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

    if (!address) return <CryptoWalletConnect>Connect</CryptoWalletConnect>

    if (!httpDataProxyContract) return <p>Contract not loaded.</p>

    return (
        <div className={styles.formContainer}>
            <div>
                {!traitFile && (
                    <form className={styles.form}>
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
                    </form>
                )}

                {traitFile && !artworkContributionAgreementSignature && (
                    <form
                        onSubmit={handleArtworkContributionSigning}
                        className={styles.form}
                    >
                        <Button nativeType="submit">
                            Sign Artwork Contribution Agreement
                        </Button>
                    </form>
                )}

                {artworkContributionAgreementSignature && (
                    <form
                        onSubmit={handleCreateProposalCandidate}
                        className={styles.form}
                    >
                        {/* <img src={traitCanvas?.toDataURL('image/png')} alt="" />

                        <div className="break-words font-mono normal-case">
                            <Markdown>{proposalContent}</Markdown>
                        </div> */}

                        <Button nativeType="submit">
                            Create Proposal Candidate
                        </Button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Form

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

type TraitFile = File | null
type TraitCanvas = HTMLCanvasElement | null

interface Props {}

const CreateProposalCandidateExample: React.FC<Props> = () => {
    const { httpDataProxyContract } = useContext(DataProxyContractContext)
    const { walletProvider } = useWeb3ModalProvider()
    const { address } = useWeb3ModalAccount()

    const [functionName, setFunctionName] = useState('addHeads')

    const [traitFile, setTraitFile] = useState<TraitFile>(null)
    const [traitCanvas, setTraitCanvas] = useState<TraitCanvas>(null)
    const traitBitmap = useImageBitmap(traitCanvas, traitFile)
    const {
        compressAndEncodeTrait,
        getColorIndexes,
        getPaletteIndex,
        getTraitColors,
    } = useArtworkEncoding()

    const artworkContributionAgreementMessage = useMemo(() => {
        return `
            I, ${address}, hereby waive all copyright and related or neighboring rights together with all associated claims and causes of action with respect to this work to the extent possible under the law.
            I have read and understand the terms and intended legal effect of the Nouns Art Contribution Agreement, available at https://z5pvlzj323gcssdd3bua3hjqckxbcsydr4ksukoidh3l46fhet4q.arweave.net/z19V5TvWzClIY9hoDZ0wEq4RSwOPFSopyBn2vninJPk, and hereby voluntarily elect to apply it to this contribution.
            Contribution name: test-name heads.
            Contribution specification: data:image/png;base64,iVBORw0KGgoAA....`
    }, [address])
    const [
        artworkContributionAgreementSignature,
        setArtworkContributionAgreementSignature,
    ] = useState('')
    const { generate: generateProposalContent } = useProposalContent()

    const handleTraitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        if (!address || !artworkContributionAgreementSignature) return null

        return generateProposalContent({
            artContributionAgreement: {
                message: artworkContributionAgreementMessage,
                signature: artworkContributionAgreementSignature,
                signer: address,
            },
            trait: {
                layer: 'head',
                name: 'Symbit',
            },
        })
    }, [
        address,
        artworkContributionAgreementMessage,
        artworkContributionAgreementSignature,
        generateProposalContent,
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
        if (!compressedEncodedArtwork) return null

        // NOT CORRECT BUT SOMETHING LIKE THIS TO REQUEST A NOUN
        // encodeFunctionData({
        //     abi: nounsTokenContractABI,
        //     functionName: 'safeTransferFrom',
        //     args: [
        //         process.env.NEXT_PUBLIC_NOUNS_TOKEN_CONTRACT_ADDRESS,
        //         address,
        //         BigInt(0), // tokenId
        //     ],
        // })

        return [
            // 1) Encode the descriptor call (e.g. addHeads, addAccessories, etc.)
            encodeFunctionData({
                abi: nounsDescriptorContractABI,
                functionName,
                args: compressedEncodedArtwork,
            }).substring(10),
            // 2) Empty for requesting ETH (no function call),
            '',
            // 3) Empty for array harmony
            '',
        ].map((calldata) => `0x${calldata}` as `0x${string}`)
    }, [compressedEncodedArtwork, functionName])

    // const createCandidateCost = useMemo(() => {
    //     return parseEther('0.1')
    // }, [])

    const signatures = useMemo(() => {
        if (!nounsDescriptorContractABI) return null

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

            // const createCandidateCost =
            //     await contractWithSigner.createCandidateCost()

            // console.log('createCandidateCost:', createCandidateCost)

            console.log('signatures:', signatures)
            console.log('targets:', targets)
            console.log('values:', values)
            console.log('calldatas:', calldatas)
            // console.log('description:', description)
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
                        value: parseEther('0.01'),
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
                    value: parseEther('0.01'),
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
        <div className="space-y-8">
            <div>
                <label htmlFor="file-upload" className={inputStyles.input}>
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

            <div>
                <canvas ref={setTraitCanvas} width={32} height={32} />
            </div>

            {!artworkContributionAgreementSignature ? (
                <form
                    onSubmit={handleArtworkContributionSigning}
                    className="space-y-6"
                >
                    <p>
                        I, {address}, hereby waive all copyright and related or
                        neighboring rights together with all associated claims
                        and causes of action with respect to this work to the
                        extent possible under the law. I have read and
                        understand the terms and intended legal effect of the
                        Nouns Art Contribution Agreement, available at
                        https://z5pvlzj323gcssdd3bua3hjqckxbcsydr4ksukoidh3l46fhet4q.arweave.net/z19V5TvWzClIY9hoDZ0wEq4RSwOPFSopyBn2vninJPk,
                        and hereby voluntarily elect to apply it to this
                        contribution. <br />
                        Contribution name: test-name heads. <br />
                        Contribution specification: EX
                        data:image/png;base64,iVBORw0KGgoAA....
                    </p>

                    <button type="submit">
                        Sign Artwork Contribution Agreement
                    </button>
                </form>
            ) : (
                <form
                    onSubmit={handleCreateProposalCandidate}
                    className="space-y-6"
                >
                    <p>
                        Artwork contribution agreement signature:{' '}
                        {artworkContributionAgreementSignature}
                    </p>

                    <p>Proposal content: {proposalContent}</p>

                    <p>
                        Trait colors:{' '}
                        {traitColors ? traitColors.join(', ') : 'NONE'}
                    </p>

                    <p>
                        ImageData.palette:{' '}
                        {ImageData.palette
                            ? ImageData.palette
                                  .filter((color) => color !== '')
                                  .map((color) => `#${color}`)
                                  .join(', ')
                            : 'NONE'}
                    </p>

                    <p>
                        ImageData.palette:{' '}
                        {ImageData.palette
                            ? ImageData.palette.join(', ')
                            : 'NONE'}
                    </p>

                    <p>Palette index: {paletteIndex}</p>

                    <p>Trait color indexes: {traitColorIndexes}</p>

                    <p>
                        Compressed encoded artwork:{' '}
                        {compressedEncodedArtwork
                            ? compressedEncodedArtwork[0]
                            : 'NONE'}
                    </p>

                    <p>
                        Call data: {calldatas ? calldatas.join(', ') : 'None'}
                    </p>

                    {/* <p>
                        Create candidate cost: {createCandidateCost.toString()}
                    </p> */}

                    <p>Signatures: {JSON.stringify(signatures)}</p>

                    <button type="submit">Create Proposal Candidate</button>
                </form>
            )}
        </div>
    )
}

export default CreateProposalCandidateExample

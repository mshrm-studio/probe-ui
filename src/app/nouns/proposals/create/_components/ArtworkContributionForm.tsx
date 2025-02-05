import styles from '@/app/nouns/proposals/create/_styles/proposal.module.css'
import Button from '@/components/Button'
import { useMemo } from 'react'
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from '@web3modal/ethers/react'
import { BrowserProvider } from 'ethers'
import ArtworkContributionAgreement from '@/utils/dto/ArtworkContributionAgreement'
import { useWeb3Modal } from '@web3modal/ethers/react'
import { CheckBadgeIcon } from '@heroicons/react/20/solid'

interface Props {
    agreement: ArtworkContributionAgreement | null
    setAgreement: React.Dispatch<
        React.SetStateAction<ArtworkContributionAgreement | null>
    >
    traitCanvas: HTMLCanvasElement | null
    traitFileName?: string | null
}

export default function ArtworkContributionForm({
    agreement,
    setAgreement,
    traitCanvas,
    traitFileName,
}: Props) {
    const { open } = useWeb3Modal()

    const { address } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    const artworkContributionAgreementMessage = useMemo(() => {
        if (!address || !traitCanvas || !traitFileName) return null

        return `I, the individual controlling Ethereum address ${address}, hereby waive all copyright and all related or neighboring rights, together with any associated claims or causes of action, to the extent permitted by law. I have read and understand the terms and intended legal effect of the Nouns Art Contribution Agreement, available at https://z5pvlzj323gcssdd3bua3hjqckxbcsydr4ksukoidh3l46fhet4q.arweave.net/z19V5TvWzClIY9hoDZ0wEq4RSwOPFSopyBn2vninJPk, and hereby voluntarily elect to apply it to this contribution. Contribution name: ${traitFileName}. Contribution specification: ${traitCanvas?.toDataURL(
            'image/png'
        )}.`
    }, [address, traitCanvas, traitFileName])

    async function handleArtworkContributionSigning(event: React.FormEvent) {
        event.preventDefault()

        if (!address) {
            open()
            return
        }

        if (!walletProvider) {
            alert('No wallet provider found')
            return
        }

        if (!artworkContributionAgreementMessage) {
            alert('No artwork contribution agreement message found')
            return
        }

        const provider = new BrowserProvider(walletProvider)
        const signer = await provider.getSigner()

        const signature = await signer.signMessage(
            artworkContributionAgreementMessage
        )

        setAgreement({
            message: artworkContributionAgreementMessage,
            signature: signature,
            signer: address,
        })
    }

    if (agreement === null)
        return (
            <form
                onSubmit={handleArtworkContributionSigning}
                className={styles.form}
            >
                <Button color="purple" nativeType="submit">
                    Sign CC0 Waiver
                </Button>
            </form>
        )

    return (
        <p className="flex items-center space-x-1">
            <CheckBadgeIcon className="h-4 w-4" />{' '}
            <span>Signed CC0 Waiver</span>
        </p>
    )
}

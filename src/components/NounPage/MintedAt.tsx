import MintDate from '@/components/Noun/MintDate'

type Props = {
    mintedAt: string
}

const NounPageMintedAt: React.FC<Props> = ({ mintedAt }) => {
    return (
        <span>
            Minted <MintDate mintedAt={mintedAt} />
        </span>
    )
}

export default NounPageMintedAt

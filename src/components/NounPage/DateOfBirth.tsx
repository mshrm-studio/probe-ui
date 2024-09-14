import MintDate from '@/components/Noun/MintDate'

type Props = {
    mintedAt: string
}

const NounPageDateOfBirth: React.FC<Props> = ({ mintedAt }) => {
    return (
        <span>
            Born <MintDate mintedAt={mintedAt} />
        </span>
    )
}

export default NounPageDateOfBirth

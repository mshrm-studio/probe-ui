type Props = {
    children: React.ReactNode
}

export default function StaticAlert({ children }: Props) {
    return <p className="text-red-500 font-bold">{children}</p>
}

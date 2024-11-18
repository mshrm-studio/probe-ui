export default function NounList({ children }: { children: React.ReactNode }) {
    return (
        <ul className="grid gap-2 grid-cols-5 md:grid-cols-10 xl:grid-cols-18">
            {children}
        </ul>
    )
}

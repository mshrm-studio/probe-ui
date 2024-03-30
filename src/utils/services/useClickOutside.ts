import { useEffect } from 'react'

function useOutsideClick(
    ref: React.RefObject<HTMLElement>,
    onClickOutside: () => void
) {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClickOutside()
            }
        }

        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [ref, onClickOutside])
}

export default useOutsideClick

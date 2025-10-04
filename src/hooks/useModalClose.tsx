import { useEffect } from 'react';

export function useModalClose(
    ref: React.RefObject<HTMLDivElement>,
    onClose: () => void,
) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;

            // Click inside modal
            if (ref.current && ref.current.contains(target)) return;

            // Click inside any element marked to ignore (dropdown portals)
            if ((target as Element).closest('[data-modal-ignore]')) return;

            onClose();
        };

        window.addEventListener('keydown', handleEsc);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, onClose]);
}

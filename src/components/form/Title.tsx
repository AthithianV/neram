import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

type PropType = {
    value?: string;
    onChange: (val: string) => void;
};

const Title = ({ value, onChange }: PropType) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleInput = () => {
        onChange(ref.current?.innerText || '');
    };

    useEffect(() => {
        if (ref.current && value !== ref.current.innerText) {
            ref.current.innerText = value || '';
        }
    }, [value]);

    return (
        <div
            ref={ref}
            contentEditable
            onInput={handleInput}
            className={cn(
                'outline-none word-wrap',
                'text-xl font-semibold text-black placeholder:text-gray-400',
                'max-w-full',
            )}
            data-placeholder="Untitled"
        />
    );
};

export default Title;

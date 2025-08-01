import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';

type PropType = {
    value?: string;
    onChange: (val: string) => void;
    placeholder?: string;
};

const Title = React.forwardRef<HTMLDivElement, PropType>(
    ({ value, onChange, placeholder }, ref) => {
        const localRef = useRef<HTMLDivElement>(null);

        const handleInput = () => {
            onChange(localRef.current?.innerText || '');
        };

        useEffect(() => {
            if (localRef.current && value !== localRef.current.innerText) {
                localRef.current.innerText = value || '';
            }
        }, [value]);

        useEffect(() => {
            if (!ref || !localRef.current) return;
            if (typeof ref === 'function') {
                ref(localRef.current);
            } else {
                ref.current = localRef.current;
            }
        }, [ref]);

        return (
            <div
                ref={localRef}
                contentEditable
                onInput={handleInput}
                className={cn(
                    'outline-none word-wrap',
                    'text-xl font-semibold text-black placeholder:text-gray-400',
                    'max-w-full',
                )}
                data-placeholder={placeholder}
            />
        );
    },
);

export default Title;

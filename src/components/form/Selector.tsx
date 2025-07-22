import { COLORS } from '@/constants/colors';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';

type Item = { title: string; color: string; value: string };

type PropType = {
    onChange: (color: string) => void;
    value?: string;
    items: Item[];
    fallbackText: string;
    placeholder: string;
};

const Selector = ({ onChange, value, items, fallbackText, placeholder }: PropType) => {
    const [selectedItem, setSelectedItem] = useState<Item>();

    useEffect(() => {
        let found = items.find((item) => item.value === value);
        setSelectedItem(found);
    }, [value]);

    return (
        <Select onValueChange={onChange} value={value}>
            <ScrollArea className="max-w-45">
                <SelectTrigger
                    className={cn(
                        '!h-8 rounded shadow-none border-none  hide-arrow',
                        'text-white w-full font-semibold',
                        '!p-0',
                        'cursor-pointer',
                    )}
                >
                    {selectedItem ? (
                        <Item color={selectedItem.color} title={selectedItem.title} />
                    ) : (
                        <Item
                            color={COLORS[0].value}
                            title={placeholder}
                            className={'opacity-70'}
                        />
                    )}
                </SelectTrigger>
                <ScrollBar orientation="horizontal" style={{ height: '8px' }} />
            </ScrollArea>
            <SelectContent className="max-h-[30vh]">
                {items.length === 0 ? (
                    <SelectItem key={null} value={'0'}>
                        {fallbackText}
                    </SelectItem>
                ) : (
                    items.map(({ title, color, value }) => (
                        <SelectItem key={value} value={value.toString()}>
                            <Item color={color} title={title} />
                        </SelectItem>
                    ))
                )}
            </SelectContent>
        </Select>
    );
};

const Item = ({
    color,
    title,
    className,
}: {
    color: string;
    title: string;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                'rounded px-2',
                'font-semibold text-white',
                'flex gap-2 items-center',
                className ?? '',
            )}
            style={{
                backgroundColor: color,
            }}
        >
            {title}
        </div>
    );
};

export default Selector;

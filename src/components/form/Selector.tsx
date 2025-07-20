import { COLORS } from '@/constants/colors';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';

type PropType = {
    onChange: (color: string) => void;
    value: string;
    items: { title: string; color: string; value: string }[];
    fallbackText: string;
    placeholder: string;
};

const Selector = ({ onChange, value, items, fallbackText, placeholder }: PropType) => {
    const selected = items.find((item) => item.value === value);

    console.log(items);
    return (
        <Select onValueChange={onChange} value={value}>
            <SelectTrigger
                className={cn(
                    'p-3 !h-8 rounded shadow-none border-none  hide-arrow',
                    'text-white w-full font-semibold',
                    'truncate',
                )}
                style={{
                    backgroundColor: selected?.color,
                }}
            >
                {selected ? (
                    <Item color={selected.color} title={selected.title} />
                ) : (
                    <Item color={COLORS[0].value} title={placeholder} className={'opacity-70'} />
                )}
                <ChevronDown className="text-white font" strokeWidth={3} />
            </SelectTrigger>
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
                'max-w-32 truncate',
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

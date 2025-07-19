import { COLORS } from '@/constants/colors';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type PropType = {
    onChange: (color: string) => void;
    value: string;
};

const ColorPicker = ({ onChange, value }: PropType) => {
    return (
        <Select onValueChange={onChange} value={value}>
            <SelectTrigger
                className={cn(
                    'p-2 !h-6 rounded shadow-none border-none  hide-arrow',
                    'text-white font-semibold',
                )}
                style={{
                    backgroundColor: value,
                }}
            >
                <SelectValue placeholder="Pick color" />
                <ChevronDown className="text-white font" strokeWidth={3} />
            </SelectTrigger>
            <SelectContent className="max-h-[30vh]">
                {COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                        <div
                            className="rounded px-2 font-semibold text-white flex gap-2 items-center"
                            style={{
                                backgroundColor: color.value,
                            }}
                        >
                            {color.name}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default ColorPicker;

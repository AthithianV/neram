import { COLORS } from '@/constants/colors';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type PropType = {
    onChange: (color: string) => void;
    value: string;
};

const ColorPicker = ({ onChange, value }: PropType) => {
    return (
        <Select onValueChange={onChange} defaultValue={value}>
            <SelectTrigger
                className={cn(
                    'p-2 !h-6 rounded shadow-none border-none',
                    'text-white font-semibold',
                )}
            >
                <SelectValue placeholder="Pick color" />
            </SelectTrigger>
            <SelectContent className="max-h-[30vh]">
                {COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                        <div
                            className="rounded px-2 font-semibold text-white"
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

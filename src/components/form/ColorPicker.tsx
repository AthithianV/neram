import { COLORS } from '@/constants/colors';
import Selector from './Selector';

type PropType = {
    onChange: (color: string) => void;
    value: string;
};

const ColorPicker = ({ onChange, value }: PropType) => {
    return (
        <Selector
            onChange={onChange}
            value={value}
            items={COLORS.map((color) => ({
                title: color.name,
                value: color.value,
                color: color.value,
            }))}
            placeholder="Select a Color"
            fallbackText="No Colors Available"
        />
    );
};

export default ColorPicker;

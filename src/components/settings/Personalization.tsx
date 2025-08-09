import ToggleTheme from '../theme/ToggleTheme';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';

const Personalization = () => {
    return (
        <Card>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-[120px_1fr] items-center gap-5">
                    <Label>Theme</Label>
                    <ToggleTheme />
                </div>
            </CardContent>
        </Card>
    );
};

export default Personalization;

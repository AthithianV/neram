import ToggleTheme from '../theme/ToggleTheme';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';

const General = () => {
    return (
        <Card>
            <CardContent>
                <div className="flex gap-5">
                    <Label>Theme</Label>
                    <ToggleTheme />
                </div>
            </CardContent>
        </Card>
    );
};

export default General;

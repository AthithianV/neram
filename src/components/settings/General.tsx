import ToggleTheme from '../theme/ToggleTheme';
import { Card, CardContent } from '../ui/card';

const General = () => {
    return (
        <div>
            <div>
                <Card>
                    <CardContent>
                        <ToggleTheme />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default General;

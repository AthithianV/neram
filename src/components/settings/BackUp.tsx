import { useLocalBackup } from '@/hooks/useBackup';
import { ArrowBigUpDash } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';

const BackUp = () => {
    const { mutateAsync: localBackUp } = useLocalBackup();

    return (
        <Card className="rounded-sm shadow-none border-none">
            <CardContent className="rounded-sm">
                <div className="flex gap-6">
                    <Label>Back Up your data Locally:</Label>
                    <Button onClick={() => localBackUp()}>
                        <ArrowBigUpDash /> BackUp
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default BackUp;

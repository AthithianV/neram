import { useLocalBackup } from '@/hooks/useBackup';
import { ArrowBigUpDash, FolderDownIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';

const BackUp = () => {
    const { mutateAsync: localBackUp } = useLocalBackup();

    return (
        <Card className="rounded-sm shadow-none border-none">
            <CardContent className="rounded-sm flex flex-col gap-4">
                <div className="flex gap-6">
                    <Label>Back Up your data Locally:</Label>
                    <Button onClick={() => localBackUp()} variant="outline">
                        <ArrowBigUpDash /> BackUp
                    </Button>
                </div>
                <div className="flex gap-6">
                    <Label>Import the data from file:</Label>
                    <Button onClick={() => localBackUp()} variant="outline">
                        <FolderDownIcon /> Restore
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default BackUp;

import { useLocalBackup, useRestoreData } from '@/hooks/useBackup';
import { ArrowBigUpDash, FolderDownIcon, RotateCcwIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';

const BackUp = () => {
    const { mutateAsync: localBackUp } = useLocalBackup();
    const { mutateAsync: restoreData } = useRestoreData();

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
                    <Button onClick={() => restoreData()} variant="outline">
                        <FolderDownIcon /> Restore
                    </Button>
                </div>
                <div className="flex gap-6">
                    <Label>Reset the data:</Label>
                    <Button variant="destructive">
                        <RotateCcwIcon /> Reset
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default BackUp;

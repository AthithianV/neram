import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useLocalBackup, useResetData, useRestoreData } from '@/hooks/useBackup';
import { ArrowBigUpDash, FolderDownIcon, RotateCcwIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';

const BackUp = () => {
    const { mutateAsync: localBackUp } = useLocalBackup();

    return (
        <Card className="rounded-sm shadow-none border-none">
            <CardContent className="rounded-sm flex flex-col gap-4">
                <Table className="w-fit">
                    <TableBody>
                        <TableRow className="border-none">
                            <TableCell>
                                <Label>Back Up your data Locally:</Label>
                            </TableCell>
                            <TableCell>
                                {' '}
                                <Button onClick={() => localBackUp()} variant="outline">
                                    <ArrowBigUpDash /> BackUp
                                </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow className="border-none">
                            <TableCell>
                                <Label>Import the data from file:</Label>
                            </TableCell>
                            <TableCell>
                                <RestoreConfirmation />
                            </TableCell>
                        </TableRow>
                        <TableRow className="border-none">
                            <TableCell>
                                <Label>Reset the data:</Label>
                            </TableCell>
                            <TableCell>
                                <ResetConfirmation />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

const ResetConfirmation = () => {
    const { mutateAsync: resetData } = useResetData();

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button variant={'destructive'}>
                    <RotateCcwIcon /> Reset
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        all your data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => resetData()}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const RestoreConfirmation = () => {
    const { mutateAsync: restoreData } = useRestoreData();

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button variant="outline">
                    <FolderDownIcon /> Restore
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        all your data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => restoreData()}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default BackUp;

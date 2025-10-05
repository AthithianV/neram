// src/components/toasts/UpdateToast.tsx
import { Button } from '@/components/ui/button';
import { ArrowBigUpDash } from 'lucide-react';
import { useUpdater } from '@/hooks/useUpdater';

const UpdateToast = ({ closeToast }: { closeToast?: () => void }) => {
    const { update, progress, status, installUpdate, restartApp } =
        useUpdater();

    if (status === 'available') {
        return (
            <div className="p-4 rounded bg-background border shadow-lg space-y-3 w-80">
                <div className="flex items-center gap-2">
                    <ArrowBigUpDash className="w-5 h-5 text-blue-500" />
                    <div className="flex-1">
                        <p className="font-semibold text-sm">
                            New Update Available
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Version {update?.version}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={closeToast}>
                        Later
                    </Button>
                    <Button
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => installUpdate()}
                    >
                        Update
                    </Button>
                </div>
            </div>
        );
    }

    if (status === 'downloading') {
        return (
            <div className="p-4 rounded bg-background border shadow-lg space-y-2 w-80">
                <p className="font-medium text-sm">Downloading update...</p>
                <div className="w-full h-2 bg-muted rounded">
                    <div
                        className="h-2 bg-blue-600 rounded"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-xs text-right text-muted-foreground">
                    {Math.round(progress)}%
                </p>
            </div>
        );
    }

    if (status === 'ready') {
        return (
            <div className="p-4 rounded bg-background border shadow-lg flex items-center justify-between w-80">
                <div className="flex items-center gap-2">
                    <ArrowBigUpDash className="w-5 h-5 text-green-500" />
                    <p className="font-semibold text-sm">Update Ready</p>
                </div>
                <Button
                    className="bg-green-600 text-white hover:bg-green-700"
                    onClick={() => restartApp()}
                >
                    Restart
                </Button>
            </div>
        );
    }

    return null;
};

export default UpdateToast;

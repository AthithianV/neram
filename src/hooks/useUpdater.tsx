import { Button } from '@/components/ui/button';
import { relaunch } from '@tauri-apps/plugin-process';
import { check, Update } from '@tauri-apps/plugin-updater';
import { ArrowBigUpDash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useUpdater() {
    const UPDATE_TOAST_ID = 'update-available';

    const [update, setUpdate] = useState<Update | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        async function run() {
            try {
                const result = await check();
                if (result) {
                    setUpdate(result);

                    toast.custom(
                        () => (
                            <div className="flex items-center gap-3 p-4 bg-white dark:bg-neutral-900 rounded shadow-lg w-100">
                                <ArrowBigUpDash className="w-6 h-6 text-blue-500 shrink-0" />
                                <div className="flex-1">
                                    <p className="font-medium">New Update Available</p>
                                    <p className="text-sm text-gray-500">
                                        {result.version ?? 'Unknown version'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        className="px-2 py-1 text-sm rounded bg-gray-500 dark:bg-gray-600"
                                        onClick={() => toast.dismiss(UPDATE_TOAST_ID)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="px-2 py-1 text-sm rounded bg-blue-600 hover:bg-blue-800 text-white"
                                        onClick={() => {
                                            toast.custom(
                                                () => (
                                                    <div className="flex flex-col gap-2 p-4 border bg-white dark:bg-neutral-900 rounded shadow-lg w-80">
                                                        <p className="font-medium">
                                                            Updating...
                                                        </p>
                                                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded">
                                                            <div
                                                                className="h-2 bg-blue-600 rounded"
                                                                style={{
                                                                    width: `${progress}%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <p className="text-xs text-gray-500 text-right">
                                                            {Math.round(progress)}%
                                                        </p>
                                                    </div>
                                                ),
                                                {
                                                    id: UPDATE_TOAST_ID,
                                                    duration: Infinity,
                                                    position: 'bottom-right',
                                                },
                                            );

                                            installUpdate();
                                        }}
                                    >
                                        Update
                                    </Button>
                                </div>
                            </div>
                        ),
                        {
                            id: UPDATE_TOAST_ID,
                            duration: Infinity,
                            position: 'bottom-right',
                        },
                    );
                }
            } catch (e) {
                console.log(e);
            }
        }
        run();
    }, []);

    async function installUpdate() {
        if (update) {
            let downloaded = 0;
            let contentLength = 0;

            await update.downloadAndInstall((event) => {
                switch (event.event) {
                    case 'Started':
                        contentLength = event.data.contentLength ?? 0;
                        break;
                    case 'Progress':
                        downloaded += event.data.chunkLength;
                        setProgress((downloaded / contentLength) * 100);
                        break;
                    case 'Finished':
                        setProgress(100);

                        // Replace progress toast with Restart Button
                        toast.custom(
                            () => (
                                <div className="flex items-center gap-3 p-4 bg-white dark:bg-neutral-900 rounded shadow-lg w-80">
                                    <ArrowBigUpDash className="w-6 h-6 text-green-500 shrink-0" />
                                    <div className="flex-1">
                                        <p className="font-medium">Update Ready</p>
                                        <p className="text-sm text-gray-500">
                                            Restart to apply changes
                                        </p>
                                    </div>
                                    <Button
                                        className="px-3 py-1 text-sm rounded bg-green-600 text-white"
                                        onClick={() => relaunch()}
                                    >
                                        Restart
                                    </Button>
                                </div>
                            ),
                            {
                                id: UPDATE_TOAST_ID,
                                duration: Infinity,
                                position: 'bottom-right',
                            },
                        );
                        break;
                }
            });
        }
    }

    return { update, progress, installUpdate };
}

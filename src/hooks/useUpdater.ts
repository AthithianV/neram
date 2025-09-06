import { relaunch } from '@tauri-apps/plugin-process';
import { check, Update } from '@tauri-apps/plugin-updater';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useUpdater() {
    const [update, setUpdate] = useState<Update | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        console.log(progress);
        console.log('Just Checking');

        async function run() {
            const result = await check();
            if (result) {
                toast.success('Update is Ready');
                setUpdate(result);
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
                        console.log(
                            `started downloading ${event.data.contentLength} bytes`,
                        );
                        break;
                    case 'Progress':
                        downloaded += event.data.chunkLength;
                        setProgress((downloaded / contentLength) * 100);
                        console.log(`downloaded ${downloaded} from ${contentLength}`);
                        break;
                    case 'Finished':
                        console.log('download finished');
                        break;
                }
            });

            await relaunch();
        }
    }

    return { update, installUpdate };
}

// src/hooks/useUpdater.ts
import { useEffect, useState, useCallback } from 'react';
import { check, Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

export function useUpdater() {
    const [update, setUpdate] = useState<Update | null>(null);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<
        'idle' | 'available' | 'downloading' | 'ready' | 'error'
    >('idle');
    const [error, setError] = useState<string | null>(null);

    const checkForUpdates = useCallback(async () => {
        try {
            const result = await check();
            if (result) {
                setUpdate(result);
                setStatus('available');
            }
        } catch (err) {
            console.error('Update check failed:', err);
            setError(String(err));
            setStatus('error');
        }
    }, []);

    const installUpdate = useCallback(async () => {
        if (!update) return;
        setStatus('downloading');

        let downloaded = 0;
        let contentLength = 0;

        console.log(progress);

        try {
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
                        setStatus('ready');
                        break;
                }
            });
        } catch (err) {
            console.error('Update failed:', err);
            setError(String(err));
            setStatus('error');
        }
    }, [update]);

    const restartApp = useCallback(() => {
        relaunch();
    }, []);

    useEffect(() => {
        checkForUpdates();
    }, [checkForUpdates]);

    return {
        update,
        progress,
        status,
        error,
        checkForUpdates,
        installUpdate,
        restartApp,
    };
}

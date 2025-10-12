import {
    isPermissionGranted,
    requestPermission,
    sendNotification,
} from '@tauri-apps/plugin-notification';

export const systemNotiFication = async (title: string, body: string) => {
    // Do you have permission to send a notification?
    let permissionGranted = await isPermissionGranted();

    // If not we need to request it
    if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
    }

    // Once permission has been granted we can send the notification
    if (permissionGranted) {
        sendNotification({ title, body });
    }
};

export const playSound = (filePath: string) => {
    try {
        const audio = new Audio(filePath);
        audio.volume = 0.6; // optional: adjust volume
        audio.play().catch((err) => {
            console.warn('Sound playback failed:', err);
        });
    } catch (e) {
        console.error('Error playing sound:', e);
    }
};

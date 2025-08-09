import { DatabaseBackup, Palette, TimerIcon } from 'lucide-react';
import React from 'react';

const BackUp = React.lazy(() => import('../components/settings/BackUp'));
const Timer = React.lazy(() => import('../components/settings/Timer'));
const Personalization = React.lazy(
    () => import('../components/settings/Personalization'),
);

export const SETTINGS_TAB = [
    {
        title: 'Timer',
        path: '/settings',
        element: Timer,
        icon: <TimerIcon className="h-4 w-4" />,
        index: true,
    },
    {
        title: 'Personalization',
        path: '/settings/personalization',
        element: Personalization,
        icon: <Palette className="h-4 w-4" />,
    },
    {
        title: 'Back Up',
        path: '/settings/back_up',
        element: BackUp,
        icon: <DatabaseBackup className="h-4 w-4" />,
    },
];

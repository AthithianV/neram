import { DatabaseBackup, Palette, ShipWheel, TimerIcon } from 'lucide-react';
import React from 'react';

const General = React.lazy(() => import('../components/settings/General'));
const BackUp = React.lazy(() => import('../components/settings/BackUp'));
const Timer = React.lazy(() => import('../components/settings/Timer'));
const Personalization = React.lazy(
    () => import('../components/settings/Personalization'),
);

export const SETTINGS_TAB = [
    {
        title: 'General',
        path: '/settings',
        element: General,
        icon: <ShipWheel className="h-4 w-4" />,
        index: true,
    },
    {
        title: 'Back Up',
        path: '/settings/back_up',
        element: BackUp,
        icon: <DatabaseBackup className="h-4 w-4" />,
    },
    {
        title: 'Timer',
        path: '/settings/timer',
        element: Timer,
        icon: <TimerIcon className="h-4 w-4" />,
    },
    {
        title: 'Personalization',
        path: '/settings/personalization',
        element: Personalization,
        icon: <Palette className="h-4 w-4" />,
    },
];

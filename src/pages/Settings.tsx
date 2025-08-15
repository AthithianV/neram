import PageAnimation from '@/components/layouts/PageAnimation';
import { SETTINGS_TAB } from '@/constants/settings';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Settings = () => {
    const location = useLocation();

    useEffect(() => {
        console.log(location.pathname);
    }, [location.pathname]);
    return (
        <PageAnimation>
            <div className="p-2">
                <div className="flex border-b-2 gap-4 mb-2">
                    {SETTINGS_TAB.map((tab) => (
                        <Link
                            to={tab.path}
                            key={tab.title}
                            className={cn(
                                location.pathname.endsWith(tab.path)
                                    ? 'text-theme border-b-2 border-theme font-bold'
                                    : 'text-gary-400',
                                'py-2 px-2 flex gap-2 text-sm items-center mb-[-2px]',
                            )}
                        >
                            {tab.icon}
                            {tab.title}
                        </Link>
                    ))}
                </div>
                <Outlet />
            </div>
        </PageAnimation>
    );
};

export default Settings;

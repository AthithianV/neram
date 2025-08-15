import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'Dark' | 'Light' | 'System';

type ThemeProviderProps = {
    children: React.ReactNode;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: 'System',
    setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>('Dark');
    const { data: settings } = useSettings();
    const { mutateAsync: updateSettings } = useUpdateSettings();

    useEffect(() => {
        if (settings) setTheme(settings.theme);
    }, [settings]);

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');

        if (theme === 'System') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';

            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(theme === 'Dark' ? 'dark' : 'light');
    }, [theme]);

    const value = {
        theme,
        setTheme: async (theme: Theme) => {
            await updateSettings({ settingsToUpdate: { theme } });
            setTheme(theme);
        },
    };

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider');

    return context;
};

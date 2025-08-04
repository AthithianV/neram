import { useTheme } from '@/components/theme/ThemeProvider'; // adjust if path differs
import { formatDuration } from '@/lib/time';
import React from 'react';

type CircularProgressProps = {
    size?: number;
    strokeWidth?: number;
    totalDuration: number;
    currentDuration: number;
    showText?: boolean;
};

const CircularProgress: React.FC<CircularProgressProps> = ({
    size = 150,
    strokeWidth = 10,
    totalDuration,
    currentDuration,
    showText = true,
}) => {
    const { theme } = useTheme();

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(currentDuration / totalDuration, 1);
    const strokeDashoffset = circumference * (1 - progress);

    // Determine effective theme (handle 'system')
    const isDark =
        theme === 'dark' ||
        (theme === 'system' &&
            window.matchMedia?.('(prefers-color-scheme: dark)').matches);

    const bgStroke = isDark ? '#333' : '#e6e6e6';
    const textColor = isDark ? '#fff' : '#333';

    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={bgStroke}
                fill="transparent"
                strokeWidth={strokeWidth}
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#ff6347"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
            />
            {showText && (
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={textColor}
                    fontSize="18"
                    transform={`rotate(90, ${size / 2}, ${size / 2})`}
                >
                    {formatDuration(totalDuration - currentDuration)}
                </text>
            )}
        </svg>
    );
};

export default CircularProgress;

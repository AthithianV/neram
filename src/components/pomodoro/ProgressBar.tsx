import { formatDuration } from '@/lib/time';
import React from 'react';

type CircularProgressProps = {
    size?: number; // Diameter of the circle
    strokeWidth?: number;
    totalDuration: number; // e.g., 1500 for 25 minutes in seconds
    currentDuration: number; // elapsed or remaining time
    showText?: boolean; // optionally show % inside
};

const CircularProgress: React.FC<CircularProgressProps> = ({
    size = 150,
    strokeWidth = 10,
    totalDuration,
    currentDuration,
    showText = true,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const progress = Math.min(currentDuration / totalDuration, 1);
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#e6e6e6"
                fill="transparent"
                strokeWidth={strokeWidth}
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#ff6347" // tomato color for Pomodoro
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
                    fill="#333"
                    fontSize="18"
                    transform="rotate(90, 75, 75)" // rotate back text
                >
                    {formatDuration(totalDuration - currentDuration)}
                </text>
            )}
        </svg>
    );
};

export default CircularProgress;

import dayjs from 'dayjs';

export const formatTime = (time: number) => {
    return `${Math.floor(time / 3600)
        .toString()
        .padStart(2, '0')}:${Math.floor((time % 3600) / 60)
        .toString()
        .padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`;
};

export const secondsToTime = (seconds: number) => {
    return `${Math.floor(seconds / 3600)
        .toString()
        .padStart(2, '0')}:${Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
};

export const timeToSeconds = (
    time: string
): { isValid: boolean; duration: number } => {
    const [hours, minutes, seconds] = time.split(':');
    if (!hours || !minutes || !seconds) {
        return { isValid: false, duration: 0 };
    }

    const hh = Number(hours);
    const mm = Number(minutes);
    const ss = Number(seconds);

    if (isNaN(hh) || isNaN(mm) || isNaN(ss)) {
        return { isValid: false, duration: 0 };
    }
    if (mm > 59 || ss > 59 || mm < 0 || ss < 0) {
        return { isValid: false, duration: 0 };
    }
    return {
        isValid: true,
        duration: hh * 3600 + mm * 60 + ss,
    };
};

export const setTime = (time: Date, date: Date) => {
    const date_with_tz = dayjs(date)
        .set('hour', dayjs(time).hour())
        .set('minute', dayjs(time).minute())
        .set('second', dayjs(time).second());

    return date_with_tz.toDate();
};

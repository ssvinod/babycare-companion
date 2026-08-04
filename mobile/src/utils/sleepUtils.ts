export function getSleepColor() {
    return '#6366F1';
}

export function getSleepIcon() {
    return '😴';
}

export function formatDuration(minutes: number) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hrs === 0) {
        return `${mins} min`;
    }

    return `${hrs}h ${mins}m`;
}

export function formatDateTime(value: string) {
    return new Date(value).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

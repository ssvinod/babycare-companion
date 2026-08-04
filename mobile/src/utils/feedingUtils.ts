export function getFeedingColor(type: string) {
    switch (type.trim().toLowerCase()) {
        case 'breastfeeding':
            return '#F59E0B';

        case 'formula':
            return '#3B82F6';

        case 'solids':
            return '#10B981';

        case 'water':
            return '#06B6D4';

        default:
            return '#6B7280';
    }
}

export function getFeedingIcon(type: string) {
    switch (type.trim().toLowerCase()) {
        case 'breastfeeding':
            return '🤱';

        case 'formula':
            return '🍼';

        case 'solids':
            return '🥣';

        case 'water':
            return '💧';

        default:
            return '🍼';
    }
}

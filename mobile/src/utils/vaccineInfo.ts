export interface VaccineInfo {
    title: string;
    diseases: string[];
}
const vaccineInfo: Record<string, VaccineInfo> = {
    'BCG + OPV-0 + Hepatitis B': {
        title: 'Birth Dose',
        diseases: ['Tuberculosis', 'Polio', 'Hepatitis B'],
    },
    '6 Weeks': {
        title: '6 Weeks',
        diseases: [
            'Diphtheria',
            'Pertussis',
            'Tetanus',
            'Hib',
            'Hepatitis B',
            'Polio',
            'Rotavirus',
            'Pneumococcal Disease',
        ],
    },
    '10 Weeks': {
        title: '10 Weeks',
        diseases: [
            'Diphtheria',
            'Pertussis',
            'Tetanus',
            'Hib',
            'Polio',
            'Rotavirus',
            'Pneumococcal Disease',
        ],
    },
    '14 Weeks': {
        title: '14 Weeks',
        diseases: [
            'Diphtheria',
            'Pertussis',
            'Tetanus',
            'Hib',
            'Polio',
            'Rotavirus',
            'Pneumococcal Disease',
        ],
    },
    '6 Months': {
        title: '6 Months',
        diseases: ['Hepatitis B', 'Influenza'],
    },
    '9 Months': {
        title: '9 Months',
        diseases: ['Measles', 'Rubella', 'Japanese Encephalitis'],
    },
    '12 Months': {
        title: '12 Months',
        diseases: ['Hepatitis A'],
    },
    '15 Months': {
        title: '15 Months',
        diseases: ['MMR Booster', 'Varicella', 'Pneumococcal Booster'],
    },
    '18 Months': {
        title: '18 Months',
        diseases: ['DPT Booster', 'Polio Booster', 'Hib Booster'],
    },
    '5 Years': {
        title: '5 Years',
        diseases: ['DPT Booster', 'MMR Booster'],
    },
    '10 Years': {
        title: '10 Years',
        diseases: ['Td', 'HPV (Girls)'],
    },
    '16 Years': {
        title: '16 Years',
        diseases: ['Td Booster'],
    },
};
export default vaccineInfo;

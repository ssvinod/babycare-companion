export interface VaccineInfo {
    title: string;
    vaccines: string[];
    diseases: string[];
    note?: string;
}
const vaccineInfo: Record<string, VaccineInfo> = {
    'BCG + OPV-0 + Hepatitis B': {
        title: 'Birth',
        vaccines: ['BCG', 'OPV-0', 'Hepatitis B (Birth Dose)'],
        diseases: ['Tuberculosis', 'Polio', 'Hepatitis B'],
    },
    '6 Weeks': {
        title: '6 Weeks',
        vaccines: ['OPV-1', 'Pentavalent-1', 'Rotavirus-1', 'fIPV-1', 'PCV-1'],
        diseases: [
            'Polio',
            'Diphtheria',
            'Pertussis',
            'Tetanus',
            'Hepatitis B',
            'Hib disease',
            'Rotavirus',
            'Pneumococcal disease',
        ],
    },
    '10 Weeks': {
        title: '10 Weeks',
        vaccines: ['OPV-2', 'Pentavalent-2', 'Rotavirus-2'],
        diseases: [
            'Polio',
            'Diphtheria',
            'Pertussis',
            'Tetanus',
            'Hepatitis B',
            'Hib disease',
            'Rotavirus',
        ],
    },
    '14 Weeks': {
        title: '14 Weeks',
        vaccines: ['OPV-3', 'Pentavalent-3', 'Rotavirus-3', 'fIPV-2', 'PCV-2'],
        diseases: [
            'Polio',
            'Diphtheria',
            'Pertussis',
            'Tetanus',
            'Hepatitis B',
            'Hib disease',
            'Rotavirus',
            'Pneumococcal disease',
        ],
    },
    /*
     * The milestones below already exist in Niva's
     * current schedule. Some represent additional
     * pediatric/private schedule vaccines rather than
     * India's universal NIS milestones.
     */
    '6 Months': {
        title: '6 Months',
        vaccines: ['Hepatitis B', 'Influenza'],
        diseases: ['Hepatitis B', 'Influenza'],
        note: 'Additional schedule — confirm timing with pediatrician.',
    },
    '9 Months': {
        title: '9–12 Months',
        vaccines: ['MR-1', 'PCV Booster', 'fIPV-3', 'JE-1*'],
        diseases: [
            'Measles',
            'Rubella',
            'Pneumococcal disease',
            'Polio',
            'Japanese encephalitis*',
        ],
        note: '* JE applies in endemic areas.',
    },
    '12 Months': {
        title: '12 Months',
        vaccines: ['Hepatitis A'],
        diseases: ['Hepatitis A'],
        note: 'Additional schedule — confirm with pediatrician.',
    },
    '15 Months': {
        title: '15 Months',
        vaccines: ['MMR', 'Varicella', 'PCV Booster'],
        diseases: ['Measles', 'Mumps', 'Rubella', 'Chickenpox', 'Pneumococcal disease'],
        note: 'Additional schedule — confirm with pediatrician.',
    },
    '18 Months': {
        title: '16–24 Months',
        vaccines: ['DPT Booster-1', 'OPV Booster', 'MR-2', 'JE-2*'],
        diseases: [
            'Diphtheria',
            'Pertussis',
            'Tetanus',
            'Polio',
            'Measles',
            'Rubella',
            'Japanese encephalitis*',
        ],
        note: '* JE applies in endemic areas.',
    },
    '5 Years': {
        title: '5–6 Years',
        vaccines: ['DPT Booster-2'],
        diseases: ['Diphtheria', 'Pertussis', 'Tetanus'],
    },
    '10 Years': {
        title: '10 Years',
        vaccines: ['Td'],
        diseases: ['Tetanus', 'Diphtheria'],
    },
    '16 Years': {
        title: '16 Years',
        vaccines: ['Td'],
        diseases: ['Tetanus', 'Diphtheria'],
    },
};
export default vaccineInfo;

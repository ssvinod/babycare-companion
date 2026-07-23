export function loadVaccinationHistory() {
    return [];
}

export function loadGrowthHistory() {
    return [];
}

export function loadAppointmentHistory() {
    return [];
}

export function loadHistory() {
    return {
        vaccinations: loadVaccinationHistory(),
        growth: loadGrowthHistory(),
        appointments: loadAppointmentHistory()
    };
}
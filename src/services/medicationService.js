import { MedicationRepository } from "../repositories/medicationRepository.js";
import { Medication } from "../models/medication.js";
import { validateMedication } from "../validation/medicationValidator.js";
const repo = new MedicationRepository();
export function addMedication(data) {
    const medication =
        data instanceof Medication
            ? data
            : new Medication(data);
    return repo.save(medication);
}
export function getMedications(childId) {
    return repo.findByChild(childId);
}
export function getActiveMedications(childId) {
    const today = new Date();
    return repo
        .findByChild(childId)
        .filter(
            medication =>
                medication.completed === false &&
                (
                    medication.endDate === null ||
                    new Date(medication.endDate) >= today
                )
        );
}
export function completeMedication(id, childId) {
    const medications =
        repo.findByChild(childId);
    const medication =
        medications.find(
            m => m.id === id
        );
    if (!medication)
        return null;
    medication.completed = true;
    medication.completedDate =
        new Date();
    return repo.save(medication);
}
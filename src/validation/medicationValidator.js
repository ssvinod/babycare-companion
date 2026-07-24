import {
    requireField,
    requireDate
}
from "./validator.js";
export function validateMedication(medication) {
    requireField(
        medication.childId,
        "childId"
    );
    requireField(
        medication.name,
        "name"
    );
    requireDate(
        medication.startDate,
        "startDate"
    );
    requireDate(
        medication.endDate,
        "endDate"
    );
    if (
        new Date(medication.endDate) <
        new Date(medication.startDate)
    ) {
        throw new Error(
            "endDate before startDate"
        );
    }
}
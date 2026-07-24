import { ValidationError } from "../errors/validationError.js";
export function requireField(value, name) {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        throw new ValidationError(
            `${name} is required`
        );
    }
}
export function requirePositive(value, name) {
    if (
        value < 0
    ) {
        throw new ValidationError(
            `${name} must be positive`
        );
    }
}
export function requireDate(value, name) {
    const d = new Date(value);
    if (
        Number.isNaN(d.getTime())
    ) {
        throw new ValidationError(
            `${name} is invalid`
        );
    }
}
export function validateFeeding(record) {
    const errors = [];
    if (!record.childId)
        errors.push("Child ID is required");
    if (!record.type)
        errors.push("Feeding type is required");
    if (!record.date)
        errors.push("Date is required");
    if (
        record.quantity != null &&
        record.quantity < 0
    )
        errors.push("Quantity cannot be negative");
    if (
        record.duration &&
        Number(record.duration) < 0
    )
        errors.push("Duration cannot be negative");
    return {
        valid: errors.length === 0,
        errors
    };
}
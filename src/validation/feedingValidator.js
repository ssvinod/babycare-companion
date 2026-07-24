import {
    requireField,
    requirePositive,
    requireDate
}
from "./validator.js";
export function validateFeeding(feed) {
    requireField(
        feed.childId,
        "childId"
    );
    requireField(
        feed.type,
        "type"
    );
    requireDate(
        feed.date,
        "date"
    );
    if (
        feed.quantity !== ""
    ) {
        requirePositive(
            feed.quantity,
            "quantity"
        );
    }
}
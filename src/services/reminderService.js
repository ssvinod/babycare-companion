/**
 * Reminder Service
 *
 * Generates reminder dates for planned events.
 */

import { addOffset } from "../utils/dateUtils.js";

export function generateReminders(dueDate) {

    return [
        {
            type: "before",
            days: 7,
            date: addOffset(dueDate, { days: -7 })
        },
        {
            type: "before",
            days: 3,
            date: addOffset(dueDate, { days: -3 })
        },
        {
            type: "due",
            days: 0,
            date: dueDate
        }
    ];

}
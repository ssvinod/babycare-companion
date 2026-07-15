import { generateReminders } from "../src/services/reminderService.js";

const dueDate = new Date("2026-08-03");

const reminders = generateReminders(dueDate);

console.log(reminders);
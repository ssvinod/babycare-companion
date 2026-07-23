import { createApplicationContext }
from "../src/services/applicationContext.js";

import { toAppleReminders }
from "../src/platforms/apple/appleReminderAdapter.js";

const context =
    createApplicationContext();

console.table(
    toAppleReminders(
        context.reminders
    ).slice(0,5)
);
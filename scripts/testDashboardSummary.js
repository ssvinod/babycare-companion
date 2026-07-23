import {
    createApplicationContext
}
from "../src/services/applicationContext.js";

console.table(
    createApplicationContext()
        .dashboard
);
import { shortDate } from "../src/utils/dateFormatter.js";
import { JsonDatabaseProvider } from "../src/database/jsonDatabaseProvider.js";

const db =
    new JsonDatabaseProvider();
db.initialize();
db.save(
    "sample",
    [
        {
            id: 1,
            name: "BabyCare"
        }
    ]
);
console.table(
    db.load("sample")
);
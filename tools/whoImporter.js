import fs from "fs";
import path from "path";

import { readWorkbook } from "./readWhoWorkbook.js";

const RAW_DIR = "./datasets/who/raw";
const OUT_DIR = "./datasets/who/generated";

fs.mkdirSync(
    OUT_DIR,
    { recursive: true }
);

const files = fs.readdirSync(RAW_DIR);

console.log(`Found ${files.length} WHO workbook(s).\n`);

for (const file of files) {

    const input = path.join(RAW_DIR, file);

    const output = path.join(
        OUT_DIR,
        file.replace(".xlsx", ".json")
    );

    const rows = readWorkbook(input);

    fs.writeFileSync(
        output,
        JSON.stringify(rows, null, 4)
    );

    console.log(
        `✓ ${file} -> ${rows.length} rows`
    );
}

console.log("\nWHO dataset import complete.");
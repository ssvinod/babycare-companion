import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const REPORT = "./output/regression-report.txt";

const tests = fs

    .readdirSync("./scripts")
    .filter(file =>
        file.startsWith("test") &&
        file.endsWith(".js")
    )
    .sort();

const currentFile = path.basename(
    import.meta.url
        .replace("file://", "")

);

const filteredTests = tests.filter(
    file => file !== currentFile
);

const start = Date.now();

let passed = 0;
let failed = 0;

const report = [];

console.log("\n========================================");
console.log(" BabyCare Companion Regression Test");
console.log("========================================\n");

report.push("========================================");
report.push("BabyCare Companion Regression Test");
report.push("========================================");
report.push("");

for (const test of filteredTests) {

    process.stdout.write(
        `${test.padEnd(32, ".")}`
    );

    try {

        execSync(
            `node scripts/${test}`,
            { stdio: "pipe" }
        );

        console.log("PASS");

        report.push(`${test} : PASS`);

        passed++;

    }

    catch (error) {

        console.log("FAIL");

        report.push(`${test} : FAIL`);
        report.push(error.stderr?.toString() ?? error.message);
        report.push("");

        failed++;

    }

}

const seconds = (
    (Date.now() - start) / 1000
).toFixed(2);

console.log("\n----------------------------------------");
console.log(`Total Tests : ${filteredTests.length}`);
console.log(`Passed      : ${passed}`);
console.log(`Failed      : ${failed}`);
console.log(`Time        : ${seconds} sec`);
console.log(`Status      : ${failed === 0 ? "PASSED" : "FAILED"}`);
console.log("----------------------------------------\n");

report.push("");
report.push("----------------------------------------");
report.push(`Total Tests : ${tests.length}`);
report.push(`Passed      : ${passed}`);
report.push(`Failed      : ${failed}`);
report.push(`Time        : ${seconds} sec`);
report.push(`Status      : ${failed === 0 ? "PASSED" : "FAILED"}`);

fs.writeFileSync(
    REPORT,
    report.join("\n")
);

console.log(`Report saved to ${REPORT}`);

process.exit(failed);
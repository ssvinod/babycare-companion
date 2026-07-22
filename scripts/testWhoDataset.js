import fs from "fs";

const data = JSON.parse(
    fs.readFileSync(
        "./datasets/who/generated/wfa-girls-zscore-expanded-tables.json"
    )
);

console.log(data[0]);

console.log(data[data.length - 1]);
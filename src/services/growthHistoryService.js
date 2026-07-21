import fs from "fs";
import { GrowthRecord } from "../models/GrowthRecord.js";

const FILE = "./data/growth.json";

export function loadGrowthHistory() {
    if (!fs.existsSync(FILE))
        return [];
    const data = JSON.parse(
        fs.readFileSync(FILE)
    );
    return data.map(item => new GrowthRecord(item));
}

export function saveGrowthHistory(history) {
    fs.writeFileSync(
        FILE,
        JSON.stringify(history, null, 4)
    );
}
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Child } from "../models/child.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROFILE =
    path.resolve(__dirname, "../../data/profile.json");

export function loadProfile(profilePath) {

    const file = profilePath ?? PROFILE;

    const raw = fs.readFileSync(file, "utf8");

    let json = JSON.parse(raw);

    if (Array.isArray(json))
        json = json[0];

    return new Child(json);
}

export function saveProfile(
    child,
    profilePath
) {

    console.log("\n=============================");
    console.log("saveProfile() CALLED");
    console.trace();
    console.log("=============================\n");

    const file = profilePath ?? PROFILE;

    fs.writeFileSync(
        file,
        JSON.stringify(child, null, 4)
    );
}
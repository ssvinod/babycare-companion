import fs from "fs";

import { Child } from "../models/child.js";

export function loadProfile(path = "./data/profile.json") {

    const json = JSON.parse(
        fs.readFileSync(path, "utf8")
    );

    return new Child(json);
}

export function saveProfile(child, path = "./data/profile.json") {

    fs.writeFileSync(
        path,
        JSON.stringify(child, null, 4)
    );
}
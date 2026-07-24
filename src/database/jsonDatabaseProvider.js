import fs from "fs";
import { DatabaseProvider } from "./databaseProvider.js";

export class JsonDatabaseProvider extends DatabaseProvider {
    constructor(basePath = "./data") {
        super();
        this.basePath = basePath;
    }
    initialize() {
        if (!fs.existsSync(this.basePath)) {
            fs.mkdirSync(this.basePath);
        }
    }
    save(collection, data) {
        fs.writeFileSync(
            `${this.basePath}/${collection}.json`,
            JSON.stringify(data, null, 4)
        );
    }
    load(collection) {
        const file =
            `${this.basePath}/${collection}.json`;
        if (!fs.existsSync(file))
            return [];
        return JSON.parse(
            fs.readFileSync(file)
        );
    }
    remove(collection, id) {
        const items = this.load(collection);
        const filtered =
            items.filter(
                item => item.id !== id
            );
        this.save(collection, filtered);
    }
}
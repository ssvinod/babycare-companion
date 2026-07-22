import fs from "fs";

export class WhoDatasetEngine {

    constructor(file) {

        this.rows = JSON.parse(
            fs.readFileSync(file)
        );

    }

    findByDay(day) {

        return this.rows.find(
            row => Number(row.Day) === Number(day)
        );

    }

}
export class WhoGrowthEngine {

    constructor(dataset) {
        this.dataset = dataset;
    }

    findByAge(ageDays) {

        return this.dataset.find(
            row => Number(row.Day) === Number(ageDays)
        );

    }

}
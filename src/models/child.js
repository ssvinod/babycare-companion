export class Child {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.birthDate = new Date(data.birthDate);
        this.gender = data.gender;
        this.bloodGroup = data.bloodGroup ?? "";
        this.notes = data.notes ?? "";
    }

    getAgeInDays() {
        return this.getAgeOnDate(new Date());
    }

    getAgeOnDate(date) {
        return Math.floor(
            (date - this.birthDate) /
            (1000 * 60 * 60 * 24)
        );
    }
}
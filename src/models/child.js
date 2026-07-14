export class Child {
  constructor(data) {
    this.name = data.name;
    this.birthDate = new Date(data.birthDate);
    this.gender = data.gender;
    this.bloodGroup = data.bloodGroup ?? "";
    this.notes = data.notes ?? "";
  }

  getAgeInDays() {
    const now = new Date();
    return Math.floor(
      (now - this.birthDate) /
      (1000 * 60 * 60 * 24)
    );
  }
}